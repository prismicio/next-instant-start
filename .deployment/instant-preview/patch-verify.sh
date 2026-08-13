#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "${ROOT}"

instant_preview_paths=(
	"src/prismicio.tenant.ts"
	"src/app/[tenant]"
	"src/app/StarterPrismicPreview.tsx"
)

for path in "${instant_preview_paths[@]}"; do
	if [[ -e "${path}" ]]; then
		echo "${path} must not exist in the public starter." >&2
		exit 1
	fi
done

echo "Starter source tree is clean."
