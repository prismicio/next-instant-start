/**
 * Locale configuration for the site.
 *
 * The `homepage` Single-type is served in multiple locales:
 * - The default locale is served with no path prefix (e.g. `/`).
 * - Every other locale is served under its own path prefix (e.g. `/nl-nl`).
 *
 * To add a new locale:
 * 1. Add it to the `locales` array below.
 * 2. Add a matching scoped entry to `routes` in `prismic.config.json`
 *    (`{ "type": "homepage", "lang": "<code>", "path": "/<code>" }`).
 * 3. Make sure the locale exists in the connected Prismic repository and
 *    that the `homepage` document has been translated into it.
 */

export interface Locale {
	/** The Prismic locale code, e.g. "en-us", "nl-nl". */
	code: string
	/** A human-readable label used in the locale switcher. */
	label: string
}

/**
 * The repository's master/default locale. Served with no path prefix.
 */
export const defaultLocale: Locale = { code: "en-us", label: "English" }

/**
 * Additional locales the site is translated into. Each is served under a
 * `/<code>` path prefix. Add new locales here.
 */
export const additionalLocales: Locale[] = [
	{ code: "nl-nl", label: "Nederlands" },
	{ code: "fr-fr", label: "Français" },
]

/**
 * All supported locales, default first.
 */
export const locales: Locale[] = [defaultLocale, ...additionalLocales]

/**
 * Looks up a supported locale by its code.
 */
export function getLocale(code: string | undefined): Locale | undefined {
	return locales.find((locale) => locale.code === code)
}

/**
 * Builds the site-relative path for a given locale and (optional) sub-path.
 * The default locale is never prefixed; every other locale is prefixed with
 * its code, matching the `routes` declared in `prismic.config.json`.
 */
export function localePath(code: string, path = "/"): string {
	const normalizedPath = path === "/" ? "" : path
	return code === defaultLocale.code ?
			path
		:	`/${code}${normalizedPath}`
}

/**
 * The `[[...lang]]` catch-all segment value (as produced by Next.js) for a
 * given locale, for use with `generateStaticParams`.
 */
export function localeSegments(code: string): string[] {
	return code === defaultLocale.code ? [] : [code]
}

/**
 * Resolves the requested locale from a `[[...lang]]` catch-all segment.
 * Returns `undefined` if the segment does not match a supported,
 * non-default locale (an unknown code, or the default locale requested
 * explicitly with a prefix, both of which should 404).
 */
export function resolveLocaleFromSegments(
	lang: string[] | undefined,
): Locale | undefined {
	if (!lang || lang.length === 0) return defaultLocale
	if (lang.length > 1) return undefined

	const locale = getLocale(lang[0])
	if (!locale || locale.code === defaultLocale.code) return undefined

	return locale
}
