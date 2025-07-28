"use server"

import { prisma } from "./prisma"
import { randomUUID } from "crypto"

// Declare a post function to handle post requests 
export async function sendData(data: {
    projectTitle: string;
    projectDescription: string;
    githubLink: string;
    youtubeLink: string
    uploadPhotos: string;
}) {    
    // Read JSON data from the submission form
    try {
        const submission = await prisma.submissions.create({
            data : {
                id: randomUUID(),
                name: data.projectTitle,
                bio: data.projectDescription,
                githubURL: data.githubLink,
                ytVideo: data.youtubeLink,
                images: data.uploadPhotos,
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
        return {success: false, error: "Server error"}
    }
}