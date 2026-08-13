#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PATCH_FILE="${SCRIPT_DIR}/instant-preview.patch"

cd "${ROOT}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
	echo "Must run from a git repository." >&2
	exit 1
fi

while IFS= read -r file; do
	if [[ -n "${file}" ]]; then
		git add -N "${file}"
	fi
done < <(git ls-files --others --exclude-standard src/)

if [[ -z "$(git diff HEAD -- src/)" ]]; then
	echo "No changes under src/ to capture." >&2
	exit 1
fi

git diff HEAD -- src/ >"${PATCH_FILE}"

git reset HEAD src/ >/dev/null 2>&1 || true
git checkout HEAD -- src/
git clean -fd src/ >/dev/null 2>&1 || true

echo "Wrote ${PATCH_FILE}"
echo "Restored src/ to the clean starter tree."
