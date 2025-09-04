import { prisma } from "@/lib/prisma";
import SubmissionsClient from "./components/submission_client";

export default async function Page({ params }: { params: { year: string } }) {
  const hackathon = await prisma.hackathons.findFirst({
    where: { id: params.year },
    include: {
      submissions: {
        include: {
          trackLinks: {
            include: {
              track: true,
            },
          },
        },
        orderBy: {
          score: "desc",
        },
      },
      // Fetch the hackathon's associated tracks in the same query 🚀
      tracks: true,
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
    <SubmissionsClient
      hackathon={hackathon}
      tracks={hackathon.tracks} // Pass the included tracks to the client
      year={params.year}
    />
  );
}