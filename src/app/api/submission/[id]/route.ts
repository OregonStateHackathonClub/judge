import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
	_req: Request,
	context: { params: Promise<{ id: string }> },
) {
	const params = await context.params;
	const { id } = params;
	try {
		const submission = await prisma.submissions.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				miniDescription: true,
				bio: true,
				githubURL: true,
				ytVideo: true,
				images: true,
				status: true,
			},
		});
		if (!submission) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}
		return NextResponse.json({ submission });
	} catch (e) {
		console.error("Fetch submission error", e);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
