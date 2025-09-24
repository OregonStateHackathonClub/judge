"use client";
import * as z from "zod";
import { formSchema } from "./schema";
import { serverAction } from "./server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
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
import { toast } from 'sonner'
import Image from "next/image"

type FormValues = z.infer<typeof formSchema>;

export default function DraftForm() {
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const searchParams = useSearchParams();
  const teamIdFromQuery = searchParams.get("teamId");
  const editId = searchParams.get("edit");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    mode: "onBlur",
    defaultValues: {
      teamId: teamIdFromQuery || undefined,
      name: "",
      description: "",
      mainDescription: "",
      github: "",
      youtube: "",
      photos: [],
  status: "draft"
    },
  });

  // If navigating into edit mode with existing team linkage present later
  useEffect(() => {
    if (teamIdFromQuery && !form.getValues("teamId")) {
      form.setValue("teamId", teamIdFromQuery);
    }
  }, [teamIdFromQuery, form]);

  // Prefill when editing existing submission
  useEffect(() => {
    const doFetch = async () => {
      if (!editId) return;
      try {
        const res = await fetch(`/api/submission/${editId}`);
        if (!res.ok) return;
        const { submission } = await res.json();

        form.reset({
          submissionId: submission.id,
          teamId: form.getValues("teamId"),
          name: submission.name || "",
          description: submission.miniDescription || "",
          mainDescription: submission.bio || "",
          github: submission.githubURL || "",
          youtube: submission.ytVideo || "",
          photos: submission.images || [],
          status: "draft"
        });
        setSubmissionId(submission.id);
      } catch (e) {
        console.error("Prefill failed", e);
      }
    };
    doFetch();
  }, [editId, form]);

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
      toast("Error updating database: " + JSON.stringify(error))
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
        <Card className="flex flex-col justify-between transition-shadow overflow-hidden shadow-lg sticky top-4 !pt-0">
          <div className="relative w-full aspect-[4/3] overflow-hidden border-b h-56">
            <Image
              src={(form.watch("photos")?.[0]) || "/beaver.png"}
              alt={`${form.watch("name")} image`}
              fill
              className="object-cover"
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