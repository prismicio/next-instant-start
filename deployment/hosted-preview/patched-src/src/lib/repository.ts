export const INSTANT_START_REPOSITORY_LABEL_PATTERN = /^[a-z0-9]{8}$/

export function isValidRepositoryLabel(label: string): boolean {
	return INSTANT_START_REPOSITORY_LABEL_PATTERN.test(label)
}

export function extractRepositoryFromPreviewToken(
	previewToken: string,
): string | undefined {
	try {
		const url = new URL(decodeURIComponent(previewToken))
		const hostname = url.hostname
		const dotIndex = hostname.indexOf(".")
		if (dotIndex <= 0) {
			return undefined
		}

		return hostname.slice(0, dotIndex)
	} catch {
		return undefined
	}
}

export function previewTokenMatchesRepository(
	previewToken: string,
	repositoryName: string,
): boolean {
	return (
		extractRepositoryFromPreviewToken(previewToken) === repositoryName
	)
}
