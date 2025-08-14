"use server";
import { actionClient } from "./safeAction";
import { formSchema } from "./schema";
import { sendData, updateData } from './action'

export const serverAction = actionClient.inputSchema(formSchema).action(async ({
  parsedInput
}) => {
  try {
    const mapData = {
    projectTitle: parsedInput.name,
    projectDescription: parsedInput.mainDescription,
    githubLink: parsedInput.github,
    youtubeLink: parsedInput.youtube,
    uploadPhotos: parsedInput.photos,
    status: "submitted"
  }
  let submission;
  if (parsedInput.submissionId) {
    submission = await updateData(parsedInput.submissionId, mapData)
  } else {
    submission = await sendData(mapData);
  }
  return { success: true, submission}
} catch (error) {
  return { success: false, error: error.message}
}
  
});

