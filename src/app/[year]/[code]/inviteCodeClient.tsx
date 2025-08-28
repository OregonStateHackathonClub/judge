'use client'

import React, { useEffect, useState } from "react"
import { createUserToTeams } from "@/app/actions";
import { Prisma } from "@prisma/client";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation"

type TeamWithUsers = Prisma.TeamsGetPayload<{
  include: {
    users: {
      include: {
        judgeProfile: {
          include: {
            user: true
          };
        };
      };
    };
  };
}>;

export default function InvitePageClient({ team, year }: { team : TeamWithUsers, year: string }) {

    const [failed, setFailed] = useState(false)

    async function addToTeam() {
        const result = await createUserToTeams({team: {connect: {teamId: team.teamId}}, judgeProfile: {connect: {userId: session?.user.id}}})
        if (!result) {
            setFailed(true)
            return
        }
        
        router.push(`/${year}/team/${team.teamId}`);
      }

    const router = useRouter()

    const {
        data: session, isPending,
    } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
        router.push("/log-in");
        }

        if (session) {
            addToTeam()
        }

    }, [isPending, session, router]);

    if (!session) {
        return <div>Loading...</div>;
    } else if (failed) {
        return <div>Failed to add you to the team.</div>
    } else {
        return <div>Joining Team...</div>
    }
}
