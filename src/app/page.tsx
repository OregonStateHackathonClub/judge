// src/app/page.tsx

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function RootPage(props: { searchParams?: Promise<Record<string,string | string[]>> }) {
  const searchParams = (await props.searchParams) || {};
  const skipDraft = searchParams["skipDraft"] === "1";
  // Find the most recent hackathon by ordering by ID in descending order
  // and taking the first one. This ensures you always get the latest.
  const currentHackathon = await prisma.hackathons.findFirst({
    orderBy: {
      id: "desc",
    },
    select: {
      id: true, // We only need the ID for the redirect
    },
  });

  // Try to get user session to see if a draft exists
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    session = null;
  }

  if (currentHackathon) {
    // If signed in, check for team with draft submission
  if (session?.user && !skipDraft) {
      // const teamWithDraft = await prisma.teams.findFirst({
      //   where: {
      //     hackathonId: currentHackathon.id,
      //     users: {
      //       some: { judgeProfileId: session.user.id },
      //     },
      //     submission: {
      //       status: "draft",
      //     },
      //   },
      //   select: {
      //     submission: { select: { id: true } },
      //   },
      // });
      // if (teamWithDraft?.submission) {
      //   redirect(`/${currentHackathon.id}/submission?edit=${teamWithDraft.submission.id}`);
      // }
    }
    // Otherwise go to the hackathon page
    redirect(`/${currentHackathon.id}`);
  }

  // This content is shown ONLY if no hackathons are found in the database.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-center text-neutral-400">
      <h1 className="text-2xl font-bold text-white">No Hackathon Found</h1>
      <p className="mt-2">Please check back later.</p>
    </div>
  );
}