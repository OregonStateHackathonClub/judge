import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react"
import * as z from "zod";
import { formSchema } from "../schema";
import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'
import { Button } from "@/components/ui/button";


type FormType = UseFormReturn<z.infer<typeof formSchema>>

export default function StepTwo({ form }: { form: FormType}) {
    const [ showPreview, setShowPreview ] = useState(false)
    const description = form.watch("mainDescription")
    return (
    <div className="text-zinc-800 dark:text-zinc-100">
            {" "}
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Main Description</h1>
            <div className="py-3 w-full">
                <Separator />
            </div>
            <Button className="mb-1" type="button" onClick={() => setShowPreview((prev) => !prev)}>
                {showPreview ? "Edit Markdown" : "Preview Markdown"}
            </Button>
            {!showPreview ? (
                <FormField
                control={form.control}
                name="mainDescription"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className=" ml-1">Main Description*</FormLabel>
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
            ) : (
                <div className="border-2 m-1 p-2 rounded bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                </div>
            )}
            
            <div className="py-3 w-full">   
                <Separator />
            </div>
        </div>
    )
}