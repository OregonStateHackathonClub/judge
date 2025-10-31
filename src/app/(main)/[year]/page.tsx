import { ArrowLeft, SearchX } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SubmissionsClient from "./components/submission_client";

export default async function Page(props: {
	params: Promise<{ year: string }>;
}) {
	const params = await props.params;
	const yearParam = params.year;

	let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
	try {
		session = await auth.api.getSession({
			headers: await headers(),
		});
	} catch (e) {
		console.error("Session retrieval failed", e);
		session = null;
	}

	let userTeamId: string | null = null;
	let teamSubmission: { id: string } | null = null;
	if (session?.user) {
		const teamMembership = await prisma.team.findFirst({
			where: {
				hackathonId: yearParam,
				team_member: {
					some: {
						id: session.user.id,
					},
				},
			},
			select: {
				id: true,
				submission: {
					select: { id: true },
				},
			},
		});
		if (teamMembership) {
			userTeamId = teamMembership.id;
			if (teamMembership.submission) {
				teamSubmission = teamMembership.submission;
			}
		}
	}

	const hackathon = await prisma.hackathon.findFirst({
		where: { id: yearParam },
		include: {
			tracks: true,
			submission: {
				// where: {
				// 	status: {
				// 		not: "draft", // Only include submissions where status is NOT "DRAFT"
				// 	},
				// },
				include: {
					submission_track: {
						include: {
							track: true,
						},
					},
				},
				// orderBy: {
				// 	score: {
				// 			totalScore: 'desc'
				// 	},
				// },
			},
		},
	});

	// Use a guard clause for the "not found" case
	if (!hackathon) {
		return (
			<div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-neutral-900 p-4 text-center">
				<div className="max-w-md">
					<SearchX
						className="mx-auto h-16 w-16 text-neutral-600"
						aria-hidden="true"
					/>
					<h1 className="mt-6 font-bold text-3xl text-white tracking-tight">
						Hackathon Not Found
					</h1>
					<p className="mt-3 text-base text-neutral-400">
						Sorry, we could not find any hackathon data for the year{" "}
						<strong>{yearParam}</strong>. It might not exist or may be archived.
					</p>
					<Link
						href="/"
						className="mt-8 inline-flex items-center rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 font-medium text-neutral-200 text-sm transition hover:border-orange-500/50 hover:text-orange-400"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Return Home
					</Link>
				</div>
			</div>
		);
	}

	// Pass the fetched data to the client component for rendering
	return (
		<SubmissionsClient
			hackathon={hackathon}
			tracks={hackathon.tracks}
			year={yearParam}
			userTeamId={userTeamId}
			teamSubmission={teamSubmission}
		/>
	);
}
