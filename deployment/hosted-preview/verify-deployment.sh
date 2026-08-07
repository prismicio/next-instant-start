#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "${ROOT}"

if [[ -f src/lib/repository.ts ]]; then
	echo "src/lib/repository.ts must not exist in the public starter." >&2
	exit 1
fi

if [[ -d src/app/hosted-preview ]]; then
	echo "src/app/hosted-preview must not exist in the public starter." >&2
	exit 1
fi

if rg -q 'hosted-preview/\[repository\]|previewTokenMatchesRepository|isValidRepositoryLabel' src/; then
	echo "Hosted preview runtime detected under src/." >&2
	exit 1
fi

echo "Starter source tree is clean."
