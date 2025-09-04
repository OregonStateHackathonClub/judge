import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { ProjectLinks } from "@/components/projectLinks"; // Import the new component

// This is an async Server Component (no "use client")
export default async function ProjectPage(props: {
  params: { year: string; id: string };
}) {
  const { params } = props;

  const submission = await prisma.submissions.findUnique({
    where: { id: params.id },
    include: {
      trackLinks: { include: { track: true } },
      Team: {
        include: {
          users: {
            include: {
              // user: true,
            },
          },
        },
      },
    },
  });

  if (!submission) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-red-500">
        Project not found.
      </div>
    );
  }

  const canViewScores = true; // Placeholder for auth logic

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
          <Link
            href={`/${params.year}`}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 transition hover:border-orange-500/50 hover:text-orange-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {params.year} Projects
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {submission.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {submission.trackLinks.map((link: any) => (
              <Badge
                key={link.trackId}
                className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              >
                {link.track.name}
              </Badge>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            {submission.Team?.[0] && (
              <div className="inline-flex items-center gap-2 text-neutral-400">
                <Users className="h-4 w-4" />
                Team: {submission.Team[0].name}
              </div>
            )}
            {/* Use the new Client Component for interactive links */}
            <ProjectLinks
              githubURL={submission.githubURL}
              ytVideo={submission.ytVideo}
            />
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <img
            src={submission.images?.[0] || "/beaver.png"}
            alt={`${submission.name} showcase`}
            className="aspect-video w-full object-cover"
          />
        </div>

        <div className="space-y-8">
          <Card className="rounded-2xl border border-neutral-800 bg-neutral-900/60">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                About This Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-neutral-300">
                {submission.bio || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            {submission.Team?.[0]?.users?.length > 0 && (
              <Card className="rounded-2xl border border-neutral-800 bg-neutral-900/60">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {submission.Team[0].users.map((member: any) => (
                      <li
                        key={member.userId} // Key prop fix
                        className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2"
                      >
                        {member.user?.image && (
                          <img
                            src={member.user.image}
                            alt={member.user.name || "Team member"}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">
                            {member.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {member.user?.email}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* {canViewScores && (
              <Card className="rounded-2xl border border-neutral-800 bg-neutral-900/60">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Scoring Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-neutral-300">
                    <div className="flex justify-between">
                      <span>Overall Score</span>
                      <span className="font-semibold text-white">
                        {submission.score ?? 0}/100
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>
        </div>
      </main>
    </div>
  );
}