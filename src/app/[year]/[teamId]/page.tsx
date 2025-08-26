import { PrismaClient } from "@prisma/client";
import TeamPageClient from "./TeamPageClient";

export default async function Page({ params }: { params: { year: string; teamId: string } }) {
  const prisma = new PrismaClient();

  const {year, teamId} = await params

  const team = await prisma.teams.findUnique({
    where: { teamId: teamId },
    include: {
      users: {
        include: {
          judgeProfile: {
            include: {
              user: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });

  return <TeamPageClient team={team} />;
}
