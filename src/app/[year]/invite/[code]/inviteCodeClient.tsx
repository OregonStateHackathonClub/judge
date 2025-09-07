'use client'

import React, { useEffect, useState } from "react"
import { joinTeam } from "@/app/actions";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation"

export default function InvitePageClient({ code, year }: { code : string, year: string }) {

    const [failed, setFailed] = useState(false)

    async function addToTeam() {
        const teamId = await joinTeam(code)
        if (!teamId) {
            console.error("Could not join team")
            setFailed(true)
            return
        }

        await router.push(`/${year}/team/${teamId}`);
      }

    const router = useRouter()

    const {
        data: session, isPending,
    } = authClient.useSession();

    useEffect(() => {
        if (!isPending && session) {
            addToTeam();
          } else if (!isPending && !session) {
            router.push("/log-in");
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
