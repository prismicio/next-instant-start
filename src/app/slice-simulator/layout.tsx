import "@/app/globals.css"
import { repositoryName } from "@/prismicio"
import { PrismicPreview } from "@prismicio/next"
import { Inter } from "next/font/google"

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter-family",
})

/**
 * A separate root layout (see `src/app/[[...lang]]/layout.tsx` for why).
 * The slice simulator is a Slice Machine dev tool, not a locale-aware
 * content page, so its `<html lang>` doesn't need to vary.
 */
export default function SliceSimulatorLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className={inter.variable}>
			<body className="font-sans bg-white text-[#0d0d0d] antialiased selection:bg-black selection:text-white">
				<main className="min-h-screen">{children}</main>
				<PrismicPreview repositoryName={repositoryName} />
			</body>
		</html>
	)
}
