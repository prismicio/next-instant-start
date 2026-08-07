import {
	createClient as baseCreateClient,
	type ClientConfig,
} from "@prismicio/client"
import { enableAutoPreviews } from "@prismicio/next"
import prismicConfig from "../prismic.config.json"

type PrismicConfig = typeof prismicConfig &
	Pick<ClientConfig, "documentAPIEndpoint">

/**
 * The project's Prismic repository name.
 */
export const repositoryName = prismicConfig.repositoryName

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 * @param tenantRepositoryName - Optional Instant Start tenant repository name.
 */
export const createClient = (
	config: ClientConfig = {},
	tenantRepositoryName?: string,
) => {
	const typedPrismicConfig = prismicConfig as PrismicConfig
	const selectedRepositoryName = tenantRepositoryName ?? repositoryName
	const isHostedPreview = tenantRepositoryName !== undefined

	const routes =
		isHostedPreview ?
			typedPrismicConfig.routes.map((route) =>
				route.type === "homepage" ?
					{
						...route,
						path: `/hosted-preview/${tenantRepositoryName}`,
					}
				:	route,
			)
		:	typedPrismicConfig.routes

	const staticConfig: ClientConfig = { routes }
	if (
		typedPrismicConfig.documentAPIEndpoint &&
		selectedRepositoryName === repositoryName &&
		!isHostedPreview
	) {
		staticConfig.documentAPIEndpoint = typedPrismicConfig.documentAPIEndpoint
	}

	const client = baseCreateClient(selectedRepositoryName, {
		...staticConfig,
		fetchOptions:
			isHostedPreview ? { cache: "no-store" }
			: process.env.NODE_ENV === "production" ?
				{ next: { tags: ["prismic"] }, cache: "force-cache" }
			:	{ next: { revalidate: 5 } },
		...config,
	})

	enableAutoPreviews({ client })

	return client
}
