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
        <div>
            {" "}
            <h1 className="text-3xl font-bold">Main Description</h1>
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
                <div className="markdown-preview border-2 m-1 p-2 rounded">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                </div>
            )}
            
            <div className="py-3 w-full">
                <Separator />
            </div>
        </div>
    )
}