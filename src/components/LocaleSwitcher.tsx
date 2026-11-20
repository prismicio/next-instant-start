import Link from "next/link"

import { locales, localePath } from "@/lib/locales"

interface LocaleSwitcherProps {
	/** The locale code currently being viewed. */
	activeLocale: string
	/**
	 * Prefixed onto every locale's path. Used by the multi-tenant instant
	 * preview deployment, where the homepage lives under `/[tenant]`
	 * instead of at the site root.
	 */
	basePath?: string
}

/**
 * Links to every configured locale's homepage. This does not check which
 * locales the `homepage` document actually has translations for — it
 * always lists every locale in `src/lib/locales.ts`. See the PR description
 * for why that check was left out.
 */
export function LocaleSwitcher(props: LocaleSwitcherProps) {
	const { activeLocale, basePath = "" } = props

	return (
		<nav aria-label="Language" className="flex justify-end gap-3 py-4">
			<ul className="flex gap-3 text-sm">
				{locales.map((locale) => (
					<li key={locale.code}>
						{locale.code === activeLocale ?
							<span aria-current="true" className="font-semibold">
								{locale.label}
							</span>
						:	<Link
								href={`${basePath}${localePath(locale.code)}`}
								className="underline-offset-4 hover:underline"
							>
								{locale.label}
							</Link>
						}
					</li>
				))}
			</ul>
		</nav>
	)
}
