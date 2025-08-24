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
//import Link from "next/link";

type FormType = UseFormReturn<z.infer<typeof formSchema>>

// const components: Components = {
//     a: (props) => {
//         const href = props.href;
//         const allowedURLS = ["localhost:3000", "OUR URL (vercel should autofill into some env var)"];
//         if (!href) return;
//         if (href.startsWith("#")) {
//             return <a {...props} />;
//         }
//         const u = URL.parse(href);

//         if (
//             u &&
//             allowedURLS.includes(u.host) &&
//             ["http:", "https:"].includes(u.protocol)
//         ) {
         

//             return <Link href={u.pathname} {...props} />;
//         }

//         return <a target="_blank" {...props} />;
//     },
//     img: (props) => {
//         const src = props.src;
//         if (!src) return;
//         const u = URL.parse(src);
//         const allowedURLS = ["localhost:3000", "OUR URL (vercel should autofill into some env var)", "i.imgur.com"];

//         if (
//             u &&
//             allowedURLS.includes(u.host) &&
//             ["http:", "https:"].includes(u.protocol)
//         ) {
//             return (
//                 <a href={src} target="_blank">
//                     <img {...props} className="rounded-xl !my-2" />
//                 </a>
//             );
//         }
//     },
// };

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