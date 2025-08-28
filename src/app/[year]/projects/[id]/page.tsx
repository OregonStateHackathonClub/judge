import { Prisma } from "@prisma/client";
import Link from "next/link";
import {
  ArrowLeft,
  Github,
  Youtube,
  Star,
  MessageCircle,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// If using NextAuth:
// import { getServerSession } from "next-auth";

// Use shared Prisma instance from /lib/prisma

export default async function ProjectPage({
  params,
}: {
  params: { year: string; id: string };
}) {
  const submission = await Prisma.submissions.findUnique({
    where: { id: params.id },
    include: {
      hackathon: true,
      trackLinks: { include: { track: true } },
      Team: {
        include: {
          users: {
            include: {
              user: true,
              judgeProfile: true,
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

  // ===== AUTH HOOK PLACE =====
  // const session = await getServerSession(authOptions);
  // const currentUserId = session?.user?.id;
  // const teamUserIds = submission.Team?.[0]?.users.map((u: any) => u.userId) || [];
  // const isJudge = submission.Team?.[0]?.users.some((u: any) => u.judgeProfile) || false;
  // const canViewScores = teamUserIds.includes(currentUserId) || isJudge;
  const canViewScores = true; // remove this line once hooked into NextAuth

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* ===== HEADER ===== */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
          <Link
            href={`/${params.year}`}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 hover:border-orange-500/50 hover:text-orange-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {params.year} Projects
          </Link>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Project Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {submission.name}
          </h1>

          {/* Track badges */}
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

          {/* Score + Team */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm sm:text-base text-neutral-300">
            {canViewScores && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="font-semibold">
                  Score: {submission.score ?? 0}
                </span>
              </div>
            )}
            {submission.Team?.[0] && (
              <div className="inline-flex items-center gap-2 text-neutral-400">
                <Users className="h-4 w-4" />
                Team: {submission.Team[0].name}
              </div>
            )}
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT column */}
          <div className="space-y-6">
            {/* About */}
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

            {/* Judge Feedback */}
            {canViewScores && (
              <Card className="rounded-2xl border border-neutral-800 bg-neutral-900/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <MessageCircle className="h-5 w-5" />
                    Judge Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-neutral-300">
                    {submission.comments || "No feedback available."}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Team Members */}
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
                        key={member.userId}
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
          </div>

          {/* RIGHT column */}
          <div className="space-y-6">
            {/* Image */}
            <Card className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60">
              <CardContent className="p-0">
                <img
                  src={submission.images?.[0] || "/beaver.png"}
                  alt={`${submission.name} showcase`}
                  className="h-64 w-full object-cover"
                />
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="rounded-2xl border border-neutral-800 bg-neutral-900/60">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Project Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {submission.githubURL && (
                  <Link
                    href={submission.githubURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800"
                  >
                    <Github className="h-4 w-4" />
                    View Source Code
                  </Link>
                )}

                {submission.ytVideo && (
                  <Link
                    href={submission.ytVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-red-800 bg-red-600/80 px-3 py-2 text-sm text-white hover:bg-red-600"
                  >
                    <Youtube className="h-4 w-4" />
                    Watch Demo Video
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Scoring Details (restricted) */}
            {canViewScores && (
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

                    {submission.rubric &&
                      typeof submission.rubric === "object" && (
                        <div className="mt-4 border-t border-neutral-800 pt-3">
                          <p className="mb-2 text-xs text-neutral-400">
                            Detailed Rubric:
                          </p>
                          <pre className="max-h-64 overflow-auto rounded-lg bg-neutral-950 p-3 text-xs text-neutral-300">
                            {JSON.stringify(submission.rubric, null, 2)}
                          </pre>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
