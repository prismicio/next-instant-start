import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { SliceZone } from "@prismicio/react"

import { Footer } from "@/components/Footer"
import { isValidRepositoryLabel } from "@/lib/repository"
import { createClient } from "@/prismicio"
import { components } from "@/slices"

import type { HomepageDocument } from "../../../../prismicio-types"

export const dynamic = "force-dynamic"

type PageProps = {
	params: Promise<{
		repository: string
	}>
}

export default async function HostedPreviewPage(props: PageProps) {
	const { repository } = await props.params

	if (!isValidRepositoryLabel(repository)) {
		notFound()
	}

	const client = createClient({}, repository)
	const page = await client.getSingle<HomepageDocument>("homepage")

	return (
		<>
			<SliceZone slices={page.data.slices} components={components} />
			<Footer data={page.data} />
		</>
	)
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const { repository } = await props.params

	if (!isValidRepositoryLabel(repository)) {
		return {}
	}

	const client = createClient({}, repository)
	const page = await client.getSingle<HomepageDocument>("homepage")

	return {
		title: page.data.meta_title,
		description: page.data.meta_description,
	}
}
