import { type Metadata } from "next"

import { SliceZone } from "@prismicio/react"
import { notFound } from "next/navigation"

import { Footer } from "@/components/Footer"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { localeSegments, locales, resolveLocaleFromSegments } from "@/lib/locales"
import { createClient } from "@/prismicio"
import { components } from "@/slices"

export default async function Home(props: PageProps<"/[[...lang]]">) {
	const { lang } = await props.params

	const locale = resolveLocaleFromSegments(lang)
	if (!locale) notFound()

	const client = createClient()
	const page = await client.getSingle("homepage", { lang: locale.code })

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
	const page = await client.getSingle("homepage", { lang: locale.code })

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
