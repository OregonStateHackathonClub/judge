import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/schema";

type FormType = UseFormReturn<z.infer<typeof formSchema>>

export default function StepTwo({ form }: { form: UseFormReturn<FormType>}) {
    return (
        <div>
        {" "}
        <h1 className="text-3xl font-bold">Main Description</h1>
        <div className="py-3 w-full">
            <Separator />
        </div>
        <FormField
            control={form.control}
            name="mainDescription"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Main Description*</FormLabel>
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
        <div className="py-3 w-full">
            <Separator />
        </div>
        </div>
    )
}