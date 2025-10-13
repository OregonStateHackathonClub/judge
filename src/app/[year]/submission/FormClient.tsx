"use client";
import { use, useMemo, useState } from "react";
import * as z from "zod";
import { formSchema } from "./schema";
import { serverAction } from "./server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { Form } from "@/components/ui/form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiStepViewer } from "./components/multiStepViewer";
import { toast } from "sonner";
import Image from "next/image";

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
        <Card className="flex flex-col justify-between transition-shadow overflow-hidden shadow-lg sticky top-4 !pt-0">
          <div className="relative w-full aspect-[4/3] overflow-hidden border-b h-56">
            <Image
              src={form.watch("photos")?.[0] || "/beaver.png"}
              alt={`${form.watch("name")} image`}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader className="w-full h-full">
            <CardTitle>{form.watch("name") || "Title Preview"}</CardTitle>
            <CardDescription className="overflow-hidden text-ellipsis whitespace-normal line-clamp-3">
              {form.watch("description") || "Description Preview"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
