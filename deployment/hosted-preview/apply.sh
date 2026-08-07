#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
OVERLAY_DIR="$(cd "$(dirname "$0")" && pwd)"
PATCHED_SRC="${OVERLAY_DIR}/patched-src/src"
PATCH_FILE="$(mktemp)"

cd "${ROOT}"

cleanup() {
	rm -f "${PATCH_FILE}"
}
trap cleanup EXIT

restore_src_from_git() {
	git checkout HEAD -- src/
	git clean -fd src/ >/dev/null 2>&1 || true
}

copy_overlay_files() {
	while IFS= read -r -d '' source_file; do
		relative_path="${source_file#"${PATCHED_SRC}/"}"
		target_file="src/${relative_path}"

		mkdir -p "$(dirname "${target_file}")"
		cp "${source_file}" "${target_file}"
	done < <(find "${PATCHED_SRC}" -type f -print0 | sort -z)
}

stage_new_overlay_files() {
	while IFS= read -r -d '' source_file; do
		relative_path="${source_file#"${PATCHED_SRC}/"}"
		target_file="src/${relative_path}"

		if ! git ls-files --error-unmatch "${target_file}" >/dev/null 2>&1; then
			git add -N "${target_file}"
		fi
	done < <(find "${PATCHED_SRC}" -type f -print0 | sort -z)
}

if [[ ! -d "${PATCHED_SRC}" ]]; then
	echo "Hosted preview patched source not found at ${PATCHED_SRC}" >&2
	exit 1
fi

if [[ -z "$(find "${PATCHED_SRC}" -type f -print -quit)" ]]; then
	echo "No overlay files found under ${PATCHED_SRC}" >&2
	exit 1
fi

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
	copy_overlay_files
	stage_new_overlay_files
	git diff HEAD -- src/ >"${PATCH_FILE}"
	git reset HEAD src/ >/dev/null 2>&1 || true
	restore_src_from_git

	if [[ ! -s "${PATCH_FILE}" ]]; then
		echo "No hosted preview changes to apply." >&2
		exit 0
	fi

	if ! git apply --check "${PATCH_FILE}" 2>/dev/null; then
		echo "Hosted preview overlay conflicts with the current starter src/." >&2
		echo "Update deployment/hosted-preview/patched-src/ to incorporate the latest starter changes." >&2
		exit 1
	fi

	if ! git apply "${PATCH_FILE}"; then
		echo "Failed to apply hosted preview overlay." >&2
		restore_src_from_git
		exit 1
	fi
else
	copy_overlay_files
fi

COMMIT_SHA="$(git rev-parse HEAD 2>/dev/null || echo unknown)"
echo "Applied hosted preview overlay from patched-src (commit=${COMMIT_SHA})"
