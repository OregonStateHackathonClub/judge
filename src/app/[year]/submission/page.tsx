"use client";
import * as z from "zod";
import { formSchema } from "./schema";
import { serverAction } from "./server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import {
  Form,
  // FormControl,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { useMultiStepForm } from "./components/useForm";
import { JSX } from "react/jsx-runtime";

import StepOne from "./components/formStep1";
import StepTwo from "./components/formStep2";
import StepThree from "./components/formStep3";
import StepFour from "./components/formStep4";


export function DraftForm() {
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
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
      // Only reset on final submit, not every step\
      const submissionId = result?.data?.submission?.submission?.id
      if (submissionId) {
        setSubmissionId(submissionId);
      }
    },
    onError: (error) => {
      // TODO: show error message
      alert("Error updating database: " + JSON.stringify(error))
    },
  });

  // function handleSubmit() {
  //   form.handleSubmit((values) => doSthAction.execute({ ...values, submissionId }));
  // }

  // const isPending = doSthAction.status === "executing";
  return (
    <div className="flex flex-col lg:flex-row md:my-6 grow justify-center px-4 lg:px-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => doSthAction.execute({ ...values, submissionId }))}
          className="flex flex-col lg:mr-14 w-full rounded-md max-w-3xl gap-2 grow"
        >
          <MultiStepViewer
            form={form}
            submissionId={submissionId}
            setSubmissionId={setSubmissionId}
          />
        </form>
      </Form>
      <div className="min-w-76">
        <Card className="flex flex-col justify-between transition-shadow overflow-hidden shadow-lg sticky top-4">
          <img
            src={form.watch("photos") || "/beaver.png"}
            alt={`${form.watch("name")} image`}
            className="h-48 w-full object-cover border-b"
          />
          <CardHeader className="w-full h-full">
            <CardTitle>{form.watch("name") || "Title Preview"}</CardTitle>
            {/* Display track names FIX THIS FOR PREVIEW */}
            {/* <div className="flex flex-wrap gap-1 mt-1 mb-4">
              {submission.trackLinks.map((link: any) => (
                <Badge
                  variant="secondary"
                  key={link.trackId}
                  className="bg-blue-100 text-blue-500"
                >
                  {link.track.name}
                </Badge>
              ))}
            </div> */}
            <CardDescription className="overflow-hidden text-ellipsis whitespace-normal line-clamp-3">
              {form.watch("description") || "Description Preview"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

type FormType = UseFormReturn<z.infer<typeof formSchema>>

export function MultiStepViewer({
  form,
  submissionId,
  setSubmissionId
}: { form: FormType, submissionId: string | null, setSubmissionId: (id: string) => void }) {
  const stepFormElements: {
    [key: number]: JSX.Element;
  } = {
    // Step 1
    1: <StepOne form={form} />,
    // Step 2
    2: <StepTwo form={form} />,
    // Step 3
    3: <StepThree form={form} />,
    // Step 4
    4: <StepFour form={form} />,
  };

  function fieldsToValidate(currentStep): ("name" | "submissionId" | "description" | "mainDescription" | "github" | "youtube" | "photos" | "status")[]{ 
    return currentStep === 1
      ? ["name", "description"]
      : currentStep === 2
        ? ["mainDescription"]
        : currentStep === 3
          ? ["github", "youtube", "photos"]
          : [];
  }
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const steps = Object.keys(stepFormElements).map(Number);
  const { currentStep, isLastStep, goToNext, goToPrevious } = useMultiStepForm({

    initialSteps: steps,
    onStepValidation: async (currentStep) => {
      const isValid = await form.trigger(fieldsToValidate(currentStep));
      return isValid;
    },

  });
  const current = stepFormElements[currentStep];
  const {
    formState: { isSubmitting },
  } = form;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-center justify-start mb-4">
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
      <div className="flex items-center gap-3 w-full pt-3">
        {currentStep !== 1 &&
          <Button 
            size="sm" 
            variant="outline" 
            type="button"
            onClick={async () => {
              // List the field names for the current stepS
              const valid = await form.trigger(fieldsToValidate(currentStep));

              if (valid) {
                goToPrevious();
                const result = await serverAction({ ...form.getValues(), submissionId });
                console.log("Submission result: ", result);

                if (result.data?.success) {
                  if (result.data.submission?.submission?.id) {
                    setSubmissionId(result.data.submission.submission.id);
                    setLastSaved(new Date());
                  }
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
            Previous
          </Button>}
          <div className="font-thin opacity-65 ml-auto">
            Last Saved: {lastSaved ? lastSaved.toLocaleString() : '—'}
          </div>
        {!isLastStep && (
          <Button
            size="sm"
            type="button"
            className="ml-auto"
            onClick={async () => {
              // List the field names for the current stepS
              const valid = await form.trigger(fieldsToValidate(currentStep));

              if (valid) {
                goToNext();
                const result = await serverAction({ ...form.getValues(), submissionId });
                console.log("Submission result: ", result);

                if (result.data?.success) {
                  if (result.data.submission?.submission?.id) {
                    setSubmissionId(result.data.submission.submission.id);
                    setLastSaved(new Date());
                  }

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
            className="ml-auto"
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
