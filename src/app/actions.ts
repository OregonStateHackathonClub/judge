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