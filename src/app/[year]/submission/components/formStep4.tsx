import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/schema";

type FormType = UseFormReturn<z.infer<typeof formSchema>>

export default function StepFour({ form }: { form: UseFormReturn<FormType>}) {
    return (
        <div>
        <h1 className="text-3xl font-bold">Project Review</h1>
        <p className="text-base">
            Please review the information below to ensure everything is correct:
        </p>
        <div className="mt-4 space-y-2">
            <h3 className="text-xl font-bold">Title: </h3>
            <p>{form.getValues().name}</p>
            <h3 className="text-xl font-bold">Mini-Description:</h3>
            <p>{form.getValues().description}</p>
            <h3 className="text-xl font-bold">Main Description:</h3>
            <p>{form.getValues().mainDescription}</p>
            <h3 className="text-xl font-bold">GitHub: </h3>
            <p>{form.getValues().github}</p>
            <h3 className="text-xl font-bold">YouTube:</h3>
            <p>{form.getValues().youtube}</p>
        </div>
        </div>
    )
}