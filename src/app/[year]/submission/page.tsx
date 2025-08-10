"use client";

import React  from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  //CardAction,
  CardContent,
  CardDescription,
  //CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { sendData } from "./action"
import { updateData } from "./action"

const MAX_STEPS = 4

type SubmissionFormValues = {
    projectTitle: string;
    projectDescription: string;
    githubLink: string;
    youtubeLink: string;
    uploadPhotos: string;
    status: string;
}

interface PageProps {
  params: Promise<{ year: string }>;
}

export default function Page ({ params }: PageProps ) {
  console.log("year: %d", params )
  const [ formStep, setFormStep ] = React.useState(0)
  const [ submissionId, setSubmissionId] = React.useState<string | null>(null)
  const { 
    watch, 
    register,
    handleSubmit,
    formState: { errors, isValid }, reset
  } = useForm<SubmissionFormValues>({ mode: "all" })

  const saveDraft = async(values: SubmissionFormValues) => {
    if (submissionId) {
      const result = await updateData(submissionId, values)
      if (!result.success) {
        window.alert(result.error || "Error saving draft")
      } else {
        nextStepForm()
      }
    } else { 
      const result = await sendData(values)
      if (result.success && result.submission) {
        setSubmissionId(result.submission.id)
        nextStepForm();
      } else {
        window.alert(result.error || "Error saving draft")
      }
    }
  }
  // function to move onto the next step of th eform
  const nextStepForm = () => {
    setFormStep(cur => cur + 1)
  }

  // function to move to the step before of the form
  const backStepForm = () => {
    setFormStep(cur => cur - 1)
  }

  // function to render buttons for next and back step of form, alongside a finsh button for the end
  // Finish button currently does nothing()->
  //      Should direct user back to lannding page

  // My thoughts on the database:
  // to be able to auto save, after every step the information should be saved to the db
  // though if the last step is not reached, the post should no be visisble to the public
  // a new param might be needed to be added to the submissions to verify taht its complete
  // if then complete it will be displayed in the landing page and everwhere else, this would come
  // through the user making it all the way to the end of the submission process, else, the currently
  // provided info shoul be saved but not authorised to be published
  // then the edit submission should use this same form just that the info is already filled out
  // if the user makes changes it should only be showcased publicly if user makes it to the end,
  // the new data could prbably be stored locally and the updated once the user finishes as f it was a new submission, altering their old one

  const renderButton = () => {
    if(formStep === 3) {
      // This is the finish button and the onclick command should probably direct the user back to the landing page
      return (  
        <Button
          type="button"
          onClick={() => {
            setFormStep(0)
            reset()
            setSubmissionId(null)
          }}
        >
            Finish
        </Button>
      )
    } else if( formStep === 2 ){
      return (
        <>
          {/* Back step button */}
          <Button
            type="button"
            onClick={backStepForm}
          >
            back
          </Button>
          <Button
            type="button"
            disabled={!isValid}
            // NEED TO FIX SO THAT IT DOES NOT SUBMIT A DUPLICATE FORM
            onClick={handleSubmit(submitForm)}
          >
            Submit Project
          </Button>
        </>
      )
    } else if ( formStep > 0) {
      return (
        <>
          {/* Back step button */}
          <Button
            type="button"
            onClick={backStepForm}
          >
            back
          </Button>
          {/* Next Step button */}
          <Button
            disabled={!isValid}
            type="button"
            onClick={nextStepForm}
          >
            Next
          </Button>
          <Button
            type="button"
            disabled={!isValid}
            onClick={handleSubmit(saveDraft)}
          >Save</Button>
        </>
      )
    } else {
      return (
        <>
          {/* Next Step button */}
          <Button
            disabled={!isValid}
            type="button"
            onClick={nextStepForm}
          >
            Next
          </Button>
          <Button
            type="button"
            disabled={!isValid} 
            onClick={handleSubmit(saveDraft)}
          >Save</Button>  
        </>
      )
    }
  }
  // submission
  const submitForm = async (values : SubmissionFormValues): Promise<void> => {
    if (submissionId) {
      const result = await updateData(submissionId, {...values, status: "submitted"});
      if (result.success) {
        nextStepForm()
      } else {
        window.alert(result.error || "Error saving submission")
      }
    } else {
      const result = await sendData({ ...values, status: "submitted"})
      if (result.success && result.submission) {
        setSubmissionId(result.submission.id);
        nextStepForm();
      } else {
        window.alert(result.error || "Error saving submission")
      }
    }
    // if (!submissionId) {
    //   window.alert("No draft found to submit. Save the draft first")
    //   return
    // }
    // const result = await updateData(submissionId, {...values, status: "submitted"});

    //   if (result.success) {
    //     nextStepForm();
    //   } else {
    //     window.alert(result.error || "Error saving submission")
    //   }
  }

  return (
    <>
    <div className="flex justify-between items-start w-full">
    <form>
      <div><p>Step {formStep + 1} of {MAX_STEPS}</p></div>
      {/* Title and Description of project */}
      {formStep === 0 && (
        <section>
          <div className="flex gap-4 mb-4 mt-4 ml-4">
            <label htmlFor="projectTitle">Project Title:</label>
            <input
              type="text"
              id="projectTitle"
              className="border border-black px-2 py-1 rounded w-[665px] ml-[50px]"
              {...register("projectTitle",{
                required: "Please enter a Title for your project",
                maxLength: {
                  value: 100,
                  message: "Title must be under 100 characters"
                },
                pattern: {
                  value: /^[a-zA-Z0-9 ]+$/,
                  message: "Only letters and numbers allowed"
                }
              })}
            />
          </div>
          {errors.projectTitle && (
            <p className="text-red-500 text-sm">{String(errors.projectTitle.message)}</p>
          )}
          <div className="flex gap-4 mb-4 mt-4 ml-4">
            <label htmlFor="projectDescription">Project Description:</label>
            <textarea
              id="projectDescription"
              className="border border-black px-2 py-1 rounded w-[665px] h-[222px]"
              {...register("projectDescription", {
                required: "Please enter a Description for your project",
                maxLength: {
                  value: 5000,
                  message: "Description must be under 5000 characters"
                },
              })}
            />
          </div>
          {errors.projectDescription && (
            <p className="text-red-500 text-sm">{String(errors.projectDescription.message)}</p>
          )}
        </section>
      )}

      {/* Project media */}
      {formStep === 1 && (
        <section>
          <div className="flex gap-4 mb-4 mt-4 ml-4">
            <label htmlFor="githubLink">GitHub Link:</label>
            <input
              type="text"
              id="githubLink"
              className="border border-black px-2 py-1 rounded w-[665px] ml-[50px]"
              {...register("githubLink",{
                required: "Please enter a link to the Github repo"
              })}
            />
          </div>
          {errors.githubLink && (
            <p className="text-red-500 text-sm">{String(errors.githubLink.message)}</p>
          )}
          <div className="flex gap-4 mb-4 mt-4 ml-4">
            <label htmlFor="youtubeLink">Youtube Link:</label>
            <input
              type="text"
              id="youtubeLink"
              className="border border-black px-2 py-1 rounded w-[665px] ml-[50px]"
              {...register("youtubeLink",{
                required: "Please enter a link to the YouTube video demo"
              })}
            />
          </div>
          {errors.youtubeLink && (
            <p className="text-red-500 text-sm">{String(errors.youtubeLink.message)}</p>
          )}
          <div className="flex gap-4 mb-4 mt-4 ml-4">
            <label htmlFor="uploadPhotos">Upload Photos:</label>
            <input
              type="text"
              id="uploadPhotos"
              className="border border-black px-2 py-1 rounded w-[665px] ml-[50px]"
              {...register("uploadPhotos",{
                required: "Please upload images of the project"
              })}
            />
          </div>
          {errors.uploadPhotos && (
            <p className="text-red-500 text-sm">{String(errors.uploadPhotos.message)}</p>
          )}
      </section>
      )}

      {/* Review of submissions */}
      {formStep === 2 && (
        <section>
          <div className="flex gap-4 mb-4 mt-4 ml-4">
            Review Submission
          </div>
          <div className="ml-4">
            <p><strong>Title:</strong> {watch("projectTitle")}</p>
            <p><strong>Description:</strong> {watch("projectDescription")}</p>
            <p><strong>GitHub:</strong> {watch("githubLink")}</p>
            <p><strong>YouTube:</strong> {watch("youtubeLink")}</p>
            {/* <p><strong>Photos:</strong> {watch("uploadPhotos")}</p> */}
          </div>
      </section>
      )}
      {/* Final Step, let user know they Finished */}
      {formStep === 3 && (
        <section>
          <div className="flex gap-4 mb-4 mt-4 ml-4">
            Congratulations your submission has been saved!
          </div>
      </section>
      )}
      {renderButton()}
    </form>
      <Card className="top-4 right-4 w-[350px] h-[300px] shadow-lg z-50">
        <CardHeader>
          <CardTitle className="overflow-hidden text-ellipsis whitespace-normal line-clamp-1">
            {watch("projectTitle") || "Preview Title"}
          </CardTitle>
          <CardDescription className="overflow-hidden text-ellipsis whitespace-normal line-clamp-3">
            {watch("projectDescription") || "Preview description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
             <img
                src={
                    watch("uploadPhotos") || "data:image/png;base64,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"
                }
                alt="Project preview"
                className="w-full h-[150px] object-cover rounded-md"
              />
        </CardContent>
      </Card>
    </div>
    </>
  )
}