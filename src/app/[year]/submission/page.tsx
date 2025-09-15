"use client";
import * as z from "zod";
import { formSchema } from "./schema";
import { serverAction } from "./server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import {
  Form,
} from "@/components/ui/form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MultiStepViewer } from "./components/multiStepViewer";

export default function DraftForm() {
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
          <div className="relative w-full aspect-[4/3] overflow-hidden border-b">
            <img
              src={form.watch("photos") || "/beaver.png"}
              alt={`${form.watch("name")} image`}
              className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
            />
          </div>
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