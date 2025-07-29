import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Page({ params }: { params: { year: string } }) {
  // Fetch the hackathon and its submissions using the year
  const hackathon = await prisma.hackathons.findFirst({
    where: { year: params.year },
    include: {
      submissions: true,
    },
  });

  if (!hackathon) {
    return (
      <div className="text-center mt-20 text-red-600 text-2xl">
        No hackathon found for year {params.year}.
      </div>
    );
  }

  // Fetch the tracks for the hackathon
  const tracks = await prisma.tracks.findMany({
    where: { hackathonId: hackathon.id },
  });

  return (
    <div>
      {/* Hero Header */}
      <div className="h-20 bg-orange-400 flex items-center justify-center">
        <h1 className="text-white font-bold text-5xl">
          {"BeaverHacks " + params.year}
        </h1>
      </div>

      {/* Dropdown Menu */}
      <div className="flex justify-end p-4">
        <select className="border border-gray-300 rounded-md p-2">
          <option value="all">All Tracks</option>
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions List */}
      <div className="flex flex-wrap justify-between p-15">
        {hackathon.submissions.map((submission) => (
          <div className="w-full sm:w-1/2 md:w-1/3 p-2" key={submission.id}>
            <Card>
              <CardHeader>
                <CardTitle>{submission.name}</CardTitle>
                <CardDescription>{submission.bio}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Score: {submission.score}</p>
                <p>Comments: {submission.comments}</p>
              </CardContent>
              <CardFooter className="flex gap-4">
                {submission.githubURL && (
                  <Link
                    href={submission.githubURL}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub →
                  </Link>
                )}
                {submission.ytVideo && (
                  <Link
                    href={submission.ytVideo}
                    className="text-red-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube →
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
