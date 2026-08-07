import { PrismicPreview } from "@prismicio/next"

type LayoutProps = {
	children: React.ReactNode
	params: Promise<{
		repository: string
	}>
}

export default async function HostedPreviewLayout(props: LayoutProps) {
	const { repository } = await props.params

	return (
		<>
			{props.children}
			<PrismicPreview
				repositoryName={repository}
				updatePreviewURL={`/api/preview/${repository}`}
			/>
		</>
	)
}
