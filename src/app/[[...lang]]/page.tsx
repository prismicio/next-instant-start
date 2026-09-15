import { type Metadata } from "next"

import { NotFoundError } from "@prismicio/client"
import { SliceZone } from "@prismicio/react"
import { notFound } from "next/navigation"

import { Footer } from "@/components/Footer"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { localeSegments, locales, resolveLocaleFromSegments } from "@/lib/locales"
import { createClient } from "@/prismicio"
import { components } from "@/slices"

/**
 * Fetches the `homepage` singleton for a given locale, treating a locale
 * that has not been translated yet as a 404 rather than a build-time crash.
 * `generateStaticParams` declares a static path for every configured
 * locale (see `src/lib/locales.ts`), but a locale can be added there before
 * its `homepage` document has actually been translated in Prismic; without
 * this, that untranslated locale would fail the entire static export.
 */
async function getHomepage(client: ReturnType<typeof createClient>, lang: string) {
	try {
		return await client.getSingle("homepage", { lang })
	} catch (error) {
		if (error instanceof NotFoundError) notFound()
		throw error
	}
}

export default async function Home(props: PageProps<"/[[...lang]]">) {
	const { lang } = await props.params

	const locale = resolveLocaleFromSegments(lang)
	if (!locale) notFound()

	const client = createClient()
	const page = await getHomepage(client, locale.code)

	return (
		<>
			<LocaleSwitcher activeLocale={locale.code} />
			<SliceZone slices={page.data.slices} components={components} />
			<Footer data={page.data} />
		</>
	)
}

export async function generateMetadata(
	props: PageProps<"/[[...lang]]">,
): Promise<Metadata> {
	const { lang } = await props.params

	const locale = resolveLocaleFromSegments(lang)
	if (!locale) notFound()

	const client = createClient()
	const page = await getHomepage(client, locale.code)

	return {
		title: page.data.meta_title,
		description: page.data.meta_description,
	}
}

/**
 * Statically generates the homepage for every configured locale: the
 * default locale at `/`, and every other locale at `/<code>` (e.g.
 * `/nl-nl`). See `src/lib/locales.ts` to add more.
 */
export function generateStaticParams() {
	return locales.map((locale) => ({ lang: localeSegments(locale.code) }))
}
