import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import FormClient, { type InitialFormData } from "./FormClient";
import Loading from "./loading";

async function getInitialData(searchParams: {
	teamId?: string | null;
	edit?: string | null;
}): Promise<InitialFormData> {
	const teamId = searchParams?.teamId ?? null;
	const editId = searchParams?.edit ?? null;

	if (editId) {
		const submission = await prisma.submissions.findUnique({
			where: { id: editId },
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
		if (submission) {
			return {
				submissionId: submission.id,
				teamId,
				name: submission.name || "",
				description: submission.miniDescription || "",
				mainDescription: submission.bio || "",
				github: submission.githubURL || "",
				youtube: submission.ytVideo || "",
				photos: submission.images || [],
				status: submission.status || "draft",
			};
		}
	}

	return {
		submissionId: null,
		teamId,
		name: "",
		description: "",
		mainDescription: "",
		github: "",
		youtube: "",
		photos: [],
		status: "draft",
	};
}

export default function DraftForm(props: {
	searchParams: Promise<{ teamId?: string; edit?: string }>;
}) {
	const initialDataPromise: Promise<InitialFormData> = props.searchParams.then(
		(sp) => getInitialData(sp),
	);
	return (
		<Suspense fallback={<Loading />}>
			<FormClient initialData={initialDataPromise} />
		</Suspense>
	);
}
