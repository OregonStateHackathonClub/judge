import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/schema";

type FormType = UseFormReturn<z.infer<typeof formSchema>>

export default function StepThree({ form }: { form: UseFormReturn<FormType>}) {
    return (
        <div>
        <h1 className="text-3xl font-bold">Project Info</h1>
        <div className="py-3 w-full">
            <Separator />
        </div>
        <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
            <FormItem className="w-full">
                <FormLabel>GitHub*</FormLabel>
                <FormControl>
                <Input
                    placeholder="Enter your GitHub link..."
                    type={"url"}
                    value={field.value}
                    onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                    }}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="m-4" />
        <FormField
            control={form.control}
            name="youtube"
            render={({ field }) => (
            <FormItem className="w-full">
                <FormLabel>YouTube</FormLabel>
                <FormControl>
                <Input
                    placeholder="Provide your video URL"
                    type={"url"}
                    value={field.value}
                    onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                    }}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="m-4" />
        <FormField
            control={form.control}
            name="photos"
            render={({ field }) => (
            <FormItem className="w-full">
                <FormLabel>Photo Gallery*</FormLabel>
                <FormControl>
                <Input
                    placeholder="Upload your photos"
                    type={"url"}
                    value={field.value}
                    onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                    }}
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