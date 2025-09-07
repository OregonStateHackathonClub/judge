'use server'

import { Prisma, PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth"; // your Better Auth instance
import { headers } from "next/headers";

const prisma = new PrismaClient({})

// Return true if user is logged in and a part of the given team. Otherwise, returns false
export async function isTeamMember(teamId : string) : Promise<boolean> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return false
    }

    const team = await prisma.teams.findUnique({
        where: {
            teamId: teamId
        },
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
    })

    if (!team) {
        return false
    }

    return team.users.some(
        (ut) => ut.judgeProfile.userId === session.user.id
    );

}

// Return true if successful. Otherwise, return false
export async function createJudgeProfile() : Promise<boolean> {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session) {
            return false
        }

        await prisma.judgeProfile.create({
            data: {userId: session.user.id},
        })

        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

// Return teamId if successful. false if unsucessful
export async function createTeam(teamData: Prisma.TeamsCreateInput, addSelf : boolean = false) : Promise<string | false> {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session) {
            return false
        }

        const userId = session.user.id

        const existingTeam = await prisma.teams.findFirst({
            where: {
                users: {
                    some: {
                        judgeProfile: {
                            userId: userId
                        }
                    },
                }
            }
        })

        if (existingTeam) {
            console.log("User is already in team:", existingTeam.name)
            return false
        }

        const newTeam = await prisma.teams.create({
            data: teamData,
        })

        if (addSelf) {
            if (userId == null) {
                return false
            }

            await prisma.usersToTeams.create({
                data: {
                    judgeProfileId: userId,
                    teamId: newTeam.teamId
                },
            })
        }

        return newTeam.teamId
    } catch (error) {
        console.error(error)
        return false
    }
}

// Return true if successful. Otherwise, return false
// Return false if user is not a member of the given team
export async function updateTeam(teamId: string, teamData: Prisma.TeamsUpdateInput) : Promise<boolean> {
    try {
        if (!await isTeamMember(teamId)) {
            return false
        }

        await prisma.teams.update({
            data: teamData,
            where: { teamId: teamId, },
            include: { users: { include: { judgeProfile: { include: { user: true } } } } },
        })

        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

// Return teamId if successful. Otherwise, return false
// Return false if user is not logged in
export async function joinTeam(inviteCode : string) : Promise<string | false> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return false
    }

    const team = await prisma.teams.findFirst({
        where: {
            invites: {
                some: {
                    code: inviteCode
                }
            }
        },
        include: {
            users: true
        }
    })

    if (!team) {
        return false
    }
    if (team.users.length >= 4) {
        return false
    }
    try {
        const connection = await prisma.usersToTeams.create({
            data: {
                team: {
                    connect: {
                        teamId: team.teamId
                    }
                },
                judgeProfile: {
                    connect: {
                        userId: session.user.id
                    }
                }
            },
        })
    
        if (connection) {
            return team.teamId
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
}

// Return partial team object if successful. Otherwise, return null
export async function getTeamInfo(teamId : string) {
    const team = await prisma.teams.findUnique({
        where: { teamId },
        select: {
          teamId: true,
          name: true,
          description: true,
          contact: true,
          lookingForTeammates: true,
          users: {
            select: {
              judgeProfileId: true,
              judgeProfile: {
                select: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!team) {
        return null
      }

      return team
}

// Returns true if successful. Otherwise, return false
// Return false if user is not a member of the given team
export async function removeUserToTeams(judgeProfileId: string, teamId: string) : Promise<boolean> {
    try {

        if (!await isTeamMember(teamId)) {
            return false
        }

        const deleted = await prisma.usersToTeams.delete({
            where: {
            teamId_judgeProfileId: {
                judgeProfileId,
                teamId
            }
            },
        });

        return true
    } catch (error) {
      console.error(error);
      return false
    }
}

// Return invite code if successful. Otherwise, return false
// Return false if user is not a member of the given team
export async function getInviteCode(teamId: string) : Promise<string | false> {
    if (!await isTeamMember(teamId)) {
        return false
    }


    let invite = await prisma.invites.findFirst({
        where: {
            teamId: teamId
        }
    })

    if (!invite) {
        invite = await prisma.invites.create({
            data: {
                teamId: teamId
            }
        })
    }
    return invite.code
}

// Return teamId if successful. Otherwise, return false
export async function getTeamIdFromInvite(inviteCode: string): Promise<string | false> {
    const team = await prisma.teams.findFirst({
        where: {
            invites: {
                some: {
                    code: inviteCode
                }
            }
        }
    })

    if (team) {
        return team.teamId
    }
    
    return false
}

export async function resetInviteCode(inviteCode: string): Promise<boolean> {
    const teamId = await getTeamIdFromInvite(inviteCode);
    
    if (!teamId) return false
    if (!await isTeamMember(teamId)) return false

    try {
        await prisma.invites.delete({
            where: {
                code: inviteCode
            }
        })
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}