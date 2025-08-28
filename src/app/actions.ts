'use server'

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({})

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

//TODO: Encoding and Decoding
export async function getCodeFromTeamId(teamId: string): Promise<string> {
    return teamId
}

export async function getTeamIdFromCode(code: string): Promise<string> {
    return code
}

export async function getHackathon(year: string) {
    return await prisma.hackathons.findFirst({where:{year: year}})
}