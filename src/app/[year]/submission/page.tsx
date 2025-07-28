"use client";

import React  from "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { sendData } from "./action"

const MAX_STEPS = 4

type SubmissionFormValues = {
    projectTitle: string;
    projectDescription: string;
    githubLink: string;
    youtubeLink: string;
    uploadPhotos: string;
}

export default function Page ({ params }: { params: { year: string } }) {
  const [ formStep, setFormStep ] = React.useState(0)
  const { 
    watch, 
    register,
    handleSubmit,
    formState: { errors, isValid } 
  } = useForm<SubmissionFormValues>({ mode: "all" })

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
          onClick={() => {setFormStep(0)}}
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
        </>
      )
    }
  }
  // submission
  const submitForm = async (values : SubmissionFormValues): Promise<void> => {
      const result = await sendData(values)

      if (result.success) {
        nextStepForm();
      } else {
        window.alert(result.error || "Error saving submission")
      }
  }

  return (
    <>
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
                pattern: {
                  value: /^[a-zA-Z0-9 ]+$/,
                  message: "Only letters and numbers allowed"
                }
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
            <p><strong>Photos:</strong> {watch("uploadPhotos")}</p>
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
      <pre>
        {JSON.stringify(watch(), null, 2)}
      </pre>
    </form>
    </>
  )
}