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

  return (
    <div>
      {/* Hero Header */}
      <div className="h-20 bg-orange-400 flex items-center justify-center">
        <h1 className="text-white font-bold text-5xl">{"BeaverHacks " + params.year}</h1>
      </div>

      {/* Submissions List */}
      <div className="flex flex-col gap-4 p-6">
        {hackathon?.submissions?.map((submission) => (
          <Card key={submission.id}>
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
        ))}
      </div>
    </div>
  );
}
