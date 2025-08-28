import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, Github, Youtube, Star, MessageCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

const prisma = new PrismaClient();

export default async function ProjectPage({ 
  params 
}: { 
  params: { year: string; id: string } 
}) {
  const submission = await prisma.submissions.findUnique({
    where: { id: params.id },
    include: {
      hackathon: true,
      trackLinks: {
        include: {
          track: true
        }
      },
      Team: {
  include: {
    users: {
      include: {
        judgeProfile: {
          include: {
            user: true
          }
        }
      }
    }
  }
}

    },
  });

  if (!submission) {
    return (
      <div className="text-center mt-20 text-red-600 text-2xl">
        Project not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-orange-400 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${params.year}`}
            className="text-white hover:text-orange-100 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to BeaverHacks {params.year}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {submission.name}
          </h1>
          
          {/* Track badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {submission.trackLinks.map((link: any) => (
              <Badge key={link.trackId} variant="secondary" className="bg-blue-100 text-blue-800">
                {link.track.name}
              </Badge>
            ))}
          </div>

          {/* Score and basic info */}
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" size={20} />
              <span className="font-semibold">Score: {submission.score}</span>
            </div>
            {submission.Team?.[0] && (
              <div className="text-gray-600">
                Team: {submission.Team[0].name}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Project Details */}
          <div className="space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {submission.bio}
                </p>
              </CardContent>
            </Card>

            {/* Comments/Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  Judge Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {submission.comments || "No feedback available."}
                </p>
              </CardContent>
            </Card>

            {/* Team Members */}
            {submission.Team?.[0]?.users && submission.Team[0].users.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submission.Team[0].users.map((userTeam: any) => (
                      <div key={userTeam.userId} className="flex items-center gap-3">
                        {userTeam.user.image && (
                          <img 
                            src={userTeam.user.image} 
                            alt={userTeam.user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium">{userTeam.user.name}</p>
                          <p className="text-sm text-gray-600">{userTeam.user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Media and Links */}
          <div className="space-y-6">
            {/* Project Image */}
            <Card>
              <CardContent className="p-0">
                <img
                src={submission.images[0] || "/beaver.png"}
                  alt={`${submission.name} showcase`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {submission.githubURL && (
                  <Link
                    href={submission.githubURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Github size={20} />
                    <span>View Source Code</span>
                  </Link>
                )}
                
                {submission.ytVideo && (
                  <Link
                    href={submission.ytVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Youtube size={20} />
                    <span>Watch Demo Video</span>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Rubric/Scoring Details */}
            <Card>
              <CardHeader>
                <CardTitle>Scoring Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Overall Score:</span>
                    <span className="font-semibold">{submission.score}/100</span>
                  </div>
                  {/* You can expand this to show rubric breakdown if stored in JSON */}
                  {submission.rubric && typeof submission.rubric === 'object' && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-2">Detailed Rubric:</p>
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(submission.rubric, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}