import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/schema";

type FormType = UseFormReturn<z.infer<typeof formSchema>>

export default function StepOne({ form }: { form: UseFormReturn<FormType>}) {
    return (
      <div>
        <h1 className="text-xl font-bold text-zinc-800">Project Title & Mini-Description</h1>
        <Separator className="mt-1 mb-6" />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your project's title"
                  type={"text"}
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
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a short description"
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
        <Separator className="mt-10" />
      </div>
    )
}