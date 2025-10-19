"use client";
import { use, useMemo, useState } from "react";
import * as z from "zod";
import { formSchema } from "./schema";
import { serverAction } from "./server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { Form } from "@/components/ui/form";
import { MultiStepViewer } from "./components/multiStepViewer";
import { toast } from "sonner";
import SubmissionCard from "@/components/submissionCard"

type FormValues = z.infer<typeof formSchema>;

export type InitialFormData = {
  submissionId?: string | null;
  teamId?: string | null;
  name: string;
  description: string;
  mainDescription?: string;
  github?: string;
  youtube?: string;
  photos: string[];
  status?: string;
};

export default function FormClient({ initialData }: { initialData: Promise<InitialFormData> }) {
  // Unwrap server-fetched data using React's use() hook with Suspense
  const data = use(initialData);

  const [submissionId, setSubmissionId] = useState<string | null>(data.submissionId ?? null);

  const defaultValues: FormValues = useMemo(
    () => ({
      submissionId: data.submissionId ?? undefined,
      teamId: data.teamId ?? undefined,
      name: data.name || "",
      description: data.description || "",
      mainDescription: data.mainDescription || "",
      github: data.github || "",
      youtube: data.youtube || "",
      photos: Array.isArray(data.photos) ? data.photos : [],
      status: data.status || "draft",
    }),
    [data]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    mode: "onBlur",
    defaultValues,
  });

  const doSthAction = useAction(serverAction, {
    onSuccess: (result) => {
      const id = result?.data?.submission?.submission?.id;
      if (id) setSubmissionId(id);
    },
    onError: (error) => {
      toast("Error updating database: " + JSON.stringify(error));
    },
  });

  return (
    <div className="flex flex-col lg:flex-row md:my-6 grow justify-center px-4 lg:px-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => doSthAction.execute({ ...values, submissionId }))}
          className="flex flex-col lg:mr-14 w-full rounded-md max-w-3xl gap-2 grow"
        >
          <MultiStepViewer form={form} submissionId={submissionId} setSubmissionId={setSubmissionId} />
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
          onClick={() => null}
        />
      </div>
    </div>
  );
}
