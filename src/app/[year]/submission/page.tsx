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
import { MultiStepViewer } from "./components/multiStepViewer";
import { toast } from 'sonner'
import SubmissionCard from "@/components/submissionCard";

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
        <SubmissionCard
          submission={{
            id: "preview",
            name: form.watch("name") || "Title Preview",
            images: (form.watch("photos")) || "/beaver.png",
            miniDescription: form.watch("description") || "Description Preview",
            githubURL: form.watch("github") || null,
            ytVideo: form.watch("youtube") || null,
            trackLinks: []
          }}
          index={0}
          showOpenButton={false}
        />
      </div>
    </div>
  );
}