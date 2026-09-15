import { redirectToPreviewURL } from "@prismicio/next"
import { NextRequest } from "next/server"

import { linkResolver } from "@/lib/linkResolver"
import { createClient } from "@/prismicio"

export async function GET(request: NextRequest) {
	const client = createClient()

	return await redirectToPreviewURL({ client, request, linkResolver })
}
