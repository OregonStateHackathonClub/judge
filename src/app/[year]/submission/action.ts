"use server"

import { prisma } from "./prisma"
import { randomUUID } from "crypto"

export async function updateData(
    submissionId: string,
    data: {
    projectTitle: string;
    miniDescription: string;
    projectDescription: string;
    githubLink: string;
    youtubeLink: string
    uploadPhotos: string;
    status: string;
}) {
    try {
        const updateSubmission = await prisma.submissions.update({
            where: { id: submissionId },
            data: {
                name: data.projectTitle,
                miniDescription: data.miniDescription,
                bio: data.projectDescription,
                githubURL: data.githubLink,
                ytVideo: data.youtubeLink,
                images: data.uploadPhotos || "",
                status: data.status
            } 
        })
        return { success: true, submission: updateSubmission}
    } catch (error) {
        console.error("Update error", error)
        const message = error instanceof Error ? error.message : "Unknown error";
        return {success: false, error: `Update failed: ${message}` }
    }
}

// Declare a post function to handle post requests 
export async function sendData(data: {
    projectTitle: string;
    miniDescription: string;
    projectDescription: string;
    githubLink: string;
    youtubeLink: string
    uploadPhotos: string;
    status: string
}) {    
    // Read JSON data from the submission form
    try {
        const submission = await prisma.submissions.create({
            data : {
                id: randomUUID(),
                status: data.status,
                name: data.projectTitle,
                miniDescription: data.miniDescription,
                bio: data.projectDescription,
                githubURL: data.githubLink,
                ytVideo: data.youtubeLink,
                images: data.uploadPhotos || "",
                comments: "",
                rubric: {},
                score: 0,
                hackathonId: "234"
            },
        })
        console.log("Created submission", submission)
        // Return if the submission is successful
        return { success: true, submission}
    } catch (error) {
        // Catch an error if anything goes wrong
        console.error("Submission error", error)
        const message = error instanceof Error ? error.message : "Unknown error";
        return {success: false, error: `Submission failed: ${message}` }
    }
}