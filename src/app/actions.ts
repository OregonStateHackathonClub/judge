'use server'

import { Role, Prisma, PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth"; // your Better Auth instance
import { headers } from "next/headers";

const prisma = new PrismaClient({})

export async function isSuperAdmin() : Promise<boolean> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return false
    }

    const judgeProfile = await prisma.judgeProfile.findUnique({
        where: {
            userId: session.user.id
        }
    })

    if (!judgeProfile) return false

    return judgeProfile.superAdmin
}

export async function isAdmin(hackathonId: string) : Promise<boolean> {

    if (await isSuperAdmin()) return true

    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return false
    }

    const judgeProfile = await prisma.hackathonsRole.findFirst({
        where: {
            judgeProfileId: session.user.id,
            hackathonId: hackathonId
        }
    })

    if (!judgeProfile) return false

    return judgeProfile.role === Role.ADMIN
}

export async function isJudge(hackathonId: string) : Promise<boolean> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return false
    }

    const judgeProfile = await prisma.hackathonsRole.findFirst({
        where: {
            judgeProfileId: session.user.id,
            hackathonId: hackathonId
        }
    })

    if (!judgeProfile) return false

    return judgeProfile.role === Role.JUDGE
}

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

export async function userSearch(search : string) {
    const users = await prisma.user.findMany({
        where: {
            OR: [
            {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                id: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            ],
        },
        select: {
            name: true,
            id: true
        }
    });

      if (!users) {
        return null
      }

      return users
}

// Returns true if successful. Otherwise, return false
// Return false if user is not a member of the given team
export async function removeUserToTeams(judgeProfileId: string, teamId: string) : Promise<boolean> {
    try {

        if (!await isTeamMember(teamId)) {
            return false
        }

        await prisma.usersToTeams.delete({
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

export async function removeUser(judgeProfileId: string) : Promise<boolean> {
    // Require superadmin
    return false
}

export async function addPermissions(judgeProfileId: string, permissionLevel: string, hackathonId: string = "") : Promise<boolean> {
    switch (permissionLevel) {
        case "judge":
            // requires admin and hackathonId input
            if (await isAdmin(hackathonId) && hackathonId != "") {
                const res = await prisma.hackathonsRole.create({
                    data: {
                        hackathonId: hackathonId,
                        judgeProfileId: judgeProfileId,
                        role: Role.JUDGE,
                    },
                })

                if (!res) {
                    return false
                }
            } else {
                return false
            }
            break
        case "admin":
            // requires superadmin and hackathonId input
            if (await isSuperAdmin() && hackathonId != "") {
                const res = await prisma.hackathonsRole.create({
                    data: {
                        hackathonId: hackathonId,
                        judgeProfileId: judgeProfileId,
                        role: Role.ADMIN,
                    },
                })

                if (!res) {
                    return false
                }
            } else {
                return false
            }
            break
        case "superadmin":
            if (await isSuperAdmin()) {
                const res = await prisma.judgeProfile.update({
                    data: {
                        superAdmin: true,
                    },
                    where: {
                        userId: judgeProfileId
                    }
                })

                if (!res) {
                    return false
                }
            }
            break
        default:
            return false
    }

    return true
}

export async function removePermissions(judgeProfileId: string, permissionLevel: string, hackathonId: string = "") : Promise<boolean> {
    switch (permissionLevel) {
        case "judge":
            // requires admin and hackathonId input
            if (await isAdmin(hackathonId) && hackathonId != "") {
                const res = await prisma.hackathonsRole.deleteMany({
                    where: {
                        hackathonId: hackathonId,
                        judgeProfileId: judgeProfileId,
                        role: Role.JUDGE,
                    },
                })

                if (!res) {
                    return false
                }
            } else {
                return false
            }
            break
        case "admin":
            // requires superadmin and hackathonId input
            if (await isSuperAdmin() && hackathonId != "") {
                const res = await prisma.hackathonsRole.deleteMany({
                    where: {
                        hackathonId: hackathonId,
                        judgeProfileId: judgeProfileId,
                        role: Role.ADMIN,
                    },
                })

                if (!res) {
                    return false
                }
            } else {
                return false
            }
            break
        case "superadmin":
            if (await isSuperAdmin()) {
                const res = await prisma.judgeProfile.update({
                    data: {
                        superAdmin: false,
                    },
                    where: {
                        userId: judgeProfileId
                    }
                })

                if (!res) {
                    return false
                }
            }
            break
        default:
            return false
    }

    return true
}