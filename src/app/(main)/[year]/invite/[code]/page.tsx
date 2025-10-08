import { PrismaClient } from "@prisma/client";
import InvitePageClient from "./inviteCodeClient";
import { getTeamIdFromInvite } from "@/app/actions";
import { toast } from "sonner";

export default async function Page({ params }: { params: Promise<{ year: string; code: string }> }) {
  const prisma = new PrismaClient();

  const {year, code} = await params

  const teamId = await getTeamIdFromInvite(code)

  if (!teamId) {
    // Cope with your failures
    toast.error("Failed to get id from invite code")
    return <div>Invite Failed</div>
  }

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
    return <InvitePageClient year={year} code={code}/>
  }
}
