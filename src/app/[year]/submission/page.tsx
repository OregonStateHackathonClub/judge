"use client";
import * as z from "zod";
import { formSchema } from "./schema";
import { serverAction } from "./server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import React  from "react";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { useMultiStepForm } from "./useForm";
import { JSX } from "react/jsx-runtime";

export function DraftForm() {
  const [ submissionId, setSubmissionId] = React.useState<string | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      mainDescription: "",
      github: "",
      youtube: "",
      photos: "",
    },
  });
  const doSthAction = useAction(serverAction, {
    onSuccess: (result) => {
      // TODO: show success message
      // Only reset on final submit, not every step
      if (result?.data?.submission?.id) {
        setSubmissionId(result.data.submission.id);
      }
    },
    onError: () => {
      // TODO: show error message
      alert("Error updating database: " + error.message)
    },
  });

  function handleSubmit() {
    form.handleSubmit((values) => doSthAction.execute({...values, submissionId }));
  }
  const isPending = doSthAction.status === "executing";
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => doSthAction.execute({...values, submissionId }))}
          className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"
        >
          <MultiStepViewer 
          form={form}
          doSthAction={doSthAction}
          submissionId={submissionId}
          setSubmissionId={setSubmissionId} 
          />
          <div className="flex justify-end items-center w-full pt-3"></div>
        </form>
      </Form>
    </div>
  );
}
//------------------------------
/**
 * Used to render a multi-step form in preview mode
 */
export function MultiStepViewer({ 
  form, 
  doSthAction, 
  submissionId,
  setSubmissionId
}: { form: any, doSthAction: any, submissionId: string | null, setSubmissionId: (id: string) => void}) {
  const stepFormElements: {
    [key: number]: JSX.Element;
  } = {
    // Step 1
    1: (
      <div>
        {" "}
        <h1 className="text-3xl font-bold">Project Title & Mini-Description</h1>
        <div className="py-3 w-full">
          <Separator />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your project's title"
                  type={"text"}
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="m-4" />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a short description"
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-3 w-full">
          <Separator />
        </div>
      </div>
    ),
    // Step 2
    2: (
      <div>
        {" "}
        <h1 className="text-3xl font-bold">Main Description</h1>
        <div className="py-3 w-full">
          <Separator />
        </div>
        <FormField
          control={form.control}
          name="mainDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Description*</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter your project description"
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-3 w-full">
          <Separator />
        </div>
      </div>
    ),
    // Step 3
    3: (
      <div>
        <h1 className="text-3xl font-bold">Project Info</h1>
        <div className="py-3 w-full">
          <Separator />
        </div>
        <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>GitHub*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your GitHub link..."
                  type={"url"}
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="m-4" />
        <FormField
          control={form.control}
          name="youtube"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>YouTube</FormLabel>
              <FormControl>
                <Input
                  placeholder="Provide your video URL"
                  type={"url"}
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="m-4" />
        <FormField
          control={form.control}
          name="photos"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Photo Gallery*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Upload your photos"
                  type={"url"}
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-3 w-full">
          <Separator />
        </div>
      </div>
    ),
    4: (
      <div>
        <h1 className="text-3xl font-bold">Project Review</h1>
        <p className="text-base">
          Please review the information below to ensure everything is correct:
        </p>
        <h3 className="text-xl font-bold">Title: </h3>
        <h3 className="text-xl font-bold">Main Description:</h3>
        <h3 className="text-xl font-bold">GitHub: </h3>
        <h3 className="text-xl font-bold">YouTube:</h3>
      </div>
    ),
  };

  const steps = Object.keys(stepFormElements).map(Number);
  const { currentStep, isLastStep, goToNext, goToPrevious } = useMultiStepForm({
    initialSteps: steps,
    onStepValidation: async() => {
      const fieldsToValidate =
      currentStep === 1
        ? ["name", "description"]
        : currentStep === 2
        ? ["mainDescription"]
        : currentStep === 3
        ? ["github", "youtube", "photos"]
        : [];

    const isValid = await form.trigger(fieldsToValidate);
    return isValid;

    },
  });
  const current = stepFormElements[currentStep];
  const {
    formState: { isSubmitting },
  } = form;
  return (
    <div className="flex flex-col gap-2 pt-3">
      <div className="flex flex-col items-center justify-start gap-1">
        <span>
          Step {currentStep} of {steps.length}
        </span>
        <Progress value={(currentStep / steps.length) * 100} />
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="flex flex-col gap-2"
        >
          {current}
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between gap-3 w-full pt-3">
        <Button size="sm" variant="ghost" onClick={goToPrevious} type="button">
          Previous
        </Button>
        {!isLastStep && (
          <Button
            size="sm"
            type="button"
            variant="secondary"
            onClick={async () => {
              // List the field names for the current step
              const fieldsToValidate =
                currentStep === 1
                  ? ["name", "description"]
                  : currentStep === 2
                  ? ["mainDescription"]
                  : currentStep === 3
                  ? ["github", "youtube", "photos"]
                  : [];

              const valid = await form.trigger(fieldsToValidate);
              if (valid) {
                const result = await serverAction({ ...form.getValues(), submissionId });
                console.log("Submission result: ", result);

                if (result.data?.success) {
                  if (result.data.submission?.submission?.id) {
                    setSubmissionId(result.data.submission.submission.id);
                  }
                  goToNext();
                } else {
                  // Handle server, validation, or custom errors from the action
                  const errorMessage = result.serverError || JSON.stringify(result.validationErrors) || result.data?.error || "An unknown error occurred.";
                  console.error("Submission failed:", errorMessage);
                  alert(`There was an error saving your progress: ${errorMessage}`);
                }
              }
              // If not valid, errors will show automatically via <FormMessage />
            }}
          >
            Next
          </Button>
        )}

        {isLastStep && (
          <Button 
          size="sm" 
          type="button"
          disabled={isSubmitting}
          onClick={async () => {
            const valid = await form.trigger()
            if (valid) {
              const result = await serverAction({
                ...form.getValues(),
                submissionId,
                status: "submitted",
              })
              if (result.data?.success) {
                alert("Project submitted successfully.")
              } else {
                const errorMessage = result.serverError || JSON.stringify(result.validationErrors) || result.data?.error || "An unknown error occurred.";
                console.error("Submission failed:", errorMessage);
                alert(`There was an error submitting your project: ${errorMessage}`);
              }
            }
          }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default DraftForm;
