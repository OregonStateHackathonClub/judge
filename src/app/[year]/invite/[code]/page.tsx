import { PrismaClient } from "@prisma/client";
import InvitePageClient from "./inviteCodeClient";
import { getTeamIdFromCode } from "@/app/actions";

export default async function Page({ params }: { params: {year: string, code: string } }) {
  const prisma = new PrismaClient();

  const {year, code} = await params

  const teamId = await getTeamIdFromCode(code)

  const team = await prisma.teams.findUnique({
    where: { teamId: teamId },
    include: {
        users: {
            include: {
                judgeProfile: {
                    include: {
                        user: true,
                    },
                },
            },
        },
    },
  });

  if (!team) {
    return <div>Team Does Not Exist</div>
  } else if (team.users.length >= 4) {
    return <div>Team Is Full.</div>
  } else {
    return <InvitePageClient year={year} team={team}/>
  }
}
