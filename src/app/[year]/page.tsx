import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Suspense } from "react";



const prisma = new PrismaClient();

export default async function Page({ params }: { params: { year: string } }) {
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

  const tracks = await prisma.tracks.findMany({
    where: { hackathonId: hackathon.id },
  });

  return (
    <div>
      {/* Header */}
      <div className="h-20 bg-orange-400 flex items-center justify-center">
        <h1 className="text-white font-bold text-5xl">
          {"BeaverHacks " + params.year}
        </h1>
      </div>

      {/* Dropdown */}
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

      {/* Submission Cards */}
      <div className="flex flex-wrap justify-between p-4">
        {hackathon.submissions.map((submission) => (
          <div className="w-full sm:w-1/2 md:w-1/3 p-2" key={submission.id}>
            <Card className="h-full flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{submission.name}</CardTitle>
                <CardDescription>{submission.bio}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between gap-4">
                  {/* Left side - text */}
                  <div className="flex-1">
                    <p>Score: {submission.score}</p>
                    <p>Comments: {submission.comments}</p>
                  </div>
                  {/* Right side - image cutout */}
                    {/* {submission.images && ( */}
                    <div className="h-32 flex items-center justify-center">
                      <img
                      src={submission.images || "/beaver.png"}                      
                      alt={`${submission.name} image`}
                      className="w-32 h-32 object-cover rounded-md border border-gray-400 shadow-md"
                      />
                    </div>
                    {/* )} */}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-4">
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
