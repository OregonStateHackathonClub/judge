import { PrismaClient } from "@prisma/client";
import SubmissionsClient from "./components/submission_client";

const prisma = new PrismaClient();

export default async function Page({ params }: { params: { year: string } }) {
  const hackathon = await prisma.hackathons.findFirst({
    where: { year: params.year },
    include: {
      submissions: {
        include: {
          trackLinks: {
            include: {
              track: true
            }
          }
        },
        orderBy: {
          score: 'desc'
        }
      },
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
    <SubmissionsClient 
      hackathon={hackathon} 
      tracks={tracks} 
      year={params.year} 
    />
  );
}