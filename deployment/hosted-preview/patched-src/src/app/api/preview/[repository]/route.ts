import { redirectToPreviewURL } from "@prismicio/next"
import { NextRequest, NextResponse } from "next/server"

import {
	isValidRepositoryLabel,
	previewTokenMatchesRepository,
} from "@/lib/repository"
import { createClient } from "@/prismicio"

type RouteParams = {
	params: Promise<{
		repository: string
	}>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	const { repository } = await params

	if (!isValidRepositoryLabel(repository)) {
		return new NextResponse("Repository not found", { status: 404 })
	}

	const previewToken = request.nextUrl.searchParams.get("token")
	if (
		previewToken &&
		!previewTokenMatchesRepository(previewToken, repository)
	) {
		return new NextResponse("Preview token does not match repository", {
			status: 403,
		})
	}

	const client = createClient({}, repository)

	return await redirectToPreviewURL({ client, request })
}
