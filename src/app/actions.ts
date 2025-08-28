'use server'

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({})


// app/api/protected/route.ts
import { auth } from "@/lib/auth"; // your Better Auth instance
import { headers } from "next/headers";

// export async function GET(req: Request) {
//   // This will read the cookie or bearer token automatically,
//   // verify the JWT, and return the user/session.
//   const session = await auth.api.getSession({ req });

//   if (!session) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   // The userId is right here
//   const userId = session.user.id;

//   return Response.json({ userId });
// }


// TODO: everything here needs a bit more security

export async function createUser(userData: Prisma.JudgeProfileCreateInput) {
    try {
        const newUser = await prisma.judgeProfile.create({
            data: userData,
        })

        return newUser
    } catch (error) {
        console.error(error)
    }
}

export async function createTeam(teamData: Prisma.TeamsCreateInput) {
    try {
        const newTeam = await prisma.teams.create({
            data: teamData,
        })

        return newTeam
    } catch (error) {
        console.error(error)
        return false
    }
}

export async function updateTeam(teamId: string, teamData: Prisma.TeamsUpdateInput) {
    try {

        let updatedTeam = prisma.teams.update({
            data: teamData,
            where: { teamId: teamId, },
            include: { users: { include: { judgeProfile: { include: { user: true } } } } },
        })

        return updatedTeam
    } catch (error) {
        console.error(error)
        return false
    }
}

export async function createUserToTeams(connectionData: Prisma.UsersToTeamsCreateInput) {
    
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    // The userId is right here
    const userId = session.user.id;


    // return Response.json({ userId });
    
    try {
        const newTeam = await prisma.usersToTeams.create({
            data: connectionData,
        })

        return newTeam
    } catch (error) {
        console.error(error)
        return false
    }
}

export async function removeUserToTeams(judgeProfileId: string, teamId: string) {
    try {
      const deleted = await prisma.usersToTeams.delete({
        where: {
          teamId_judgeProfileId: {
            judgeProfileId,
            teamId
          }
        },
      });
  
      return deleted;
    } catch (error) {
      console.error(error);
      return false;
    }
}

export async function getInviteCode(teamId: string): Promise<string> {
    let code = await prisma.invites.findFirst({
        where: {
            teamId: teamId
        }
    })

    if (!code) {
        code = await prisma.invites.create({
            data: {
                teamId: teamId
            }
        })
    }

    return code?.code
}

export async function getTeamIdFromCode(code: string): Promise<string> {
    const team = await prisma.teams.findFirst({
        where: {
            invites: {
                some: {
                    code: code
                }
            }
        }
    })

    if (team) {
        return team.teamId
    }
    
    return ""
}

export async function getHackathon(id: string) {
    return await prisma.hackathons.findUnique({where:{id: id}})
}