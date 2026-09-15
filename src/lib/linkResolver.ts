import { type LinkResolverFunction } from "@prismicio/client"

import { localePath } from "@/lib/locales"

/**
 * Resolves a Prismic document to its site-relative URL. `@/prismicio`'s
 * client is already configured with `routes` (see `prismic.config.json`),
 * so this is mostly a fallback for `homepage`, and is what
 * `redirectToPreviewURL` (in `src/app/api/preview/route.ts`) uses to land
 * an editor on the correct locale-prefixed URL when previewing a
 * translation of the `homepage` Single-type.
 */
export const linkResolver: LinkResolverFunction = (doc) => {
	if (doc.type === "homepage") {
		return localePath(doc.lang)
	}

	return null
}
