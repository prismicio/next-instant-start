#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "${ROOT}"

if [[ -f src/lib/repository.ts ]]; then
	echo "src/lib/repository.ts must not exist in the public starter." >&2
	exit 1
fi

if [[ -d src/app/instant-preview ]]; then
	echo "src/app/instant-preview must not exist in the public starter." >&2
	exit 1
fi

if rg -q 'instant-preview/\[repository\]|previewTokenMatchesRepository|isValidRepositoryLabel' src/; then
	echo "Instant preview runtime detected under src/." >&2
	exit 1
fi

echo "Starter source tree is clean."
