import { NextResponse } from "next/server"
import { prisma } from "../prisma"

// Declare a post function to handle post requests 
export async function POST(request: Request) {
    // Declare data to expect a request JSON
    const data = await request.json();
    console.log("Received data", data)
    
    // Read JSON data from the submission form
    try {
        const submission = await prisma.submissions.create({
            data : {
                id: "1",
                name: data.projectTitle,
                bio: data.projectDescription,
                githubURL: data.githubLink,
                ytVideo: data.youtubeLink,
                images: data.uploadPhotos,
                comments: "",
                rubric: {},
                score: 0,
                hackathonId: "123"
            },
        })
        console.log("Created submission", submission)
        // Return if the submission is successful
        return NextResponse.json(submission, {status: 201})

    } catch (error) {
        // Catch an error if anything goes wrong
        console.error("Submission error", error)
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500})
    }
}