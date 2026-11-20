import { type LinkResolverFunction } from "@prismicio/client"

import { localePath } from "@/lib/locales"

/**
 * Builds a Prismic link resolver that resolves a document to its
 * site-relative URL. `@/prismicio`'s client is already configured with
 * `routes` (see `prismic.config.json`), so this is mostly a fallback for
 * `homepage`, and is what `redirectToPreviewURL` (in
 * `src/app/api/preview/route.ts`) uses to land an editor on the correct
 * locale-prefixed URL when previewing a translation of the `homepage`
 * Single-type.
 *
 * @param basePath - Prefixed onto the resolved path. Used by the
 *   multi-tenant instant preview deployment, where the homepage lives
 *   under `/[tenant]` instead of at the site root.
 */
export function createLinkResolver(basePath = ""): LinkResolverFunction {
	return (doc) => {
		if (doc.type === "homepage") {
			return `${basePath}${localePath(doc.lang)}`
		}

		return null
	}
}

export const linkResolver = createLinkResolver()
