import "@/app/globals.css"
import { repositoryName } from "@/prismicio"
import { PrismicPreview } from "@prismicio/next"
import { Inter } from "next/font/google"
import { notFound } from "next/navigation"

import { resolveLocaleFromSegments } from "@/lib/locales"

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter-family",
})

/**
 * This is a root layout (it defines `<html>` and `<body>`), not a nested
 * one, even though it is not `src/app/layout.tsx`. The `homepage` route and
 * `src/app/slice-simulator` each need their own root layout because only
 * `homepage` is locale-aware and `<html lang>` can only be set from a
 * layout that has the locale in its own route params — see Next.js's
 * "Multiple root layouts" docs. This is also why the locale is re-resolved
 * here (in the layout) rather than trusting `page.tsx`: an unsupported
 * `lang` segment should 404 before `<html>` is even rendered.
 */
export default async function LocaleLayout(
	props: LayoutProps<"/[[...lang]]">,
) {
	const { children } = props
	const { lang } = await props.params

	const locale = resolveLocaleFromSegments(lang)
	if (!locale) notFound()

	return (
		<html lang={locale.code} className={inter.variable}>
			<body className="font-sans bg-white text-[#0d0d0d] antialiased selection:bg-black selection:text-white">
				<main className="min-h-screen">{children}</main>
				<PrismicPreview repositoryName={repositoryName} />
			</body>
		</html>
	)
}
