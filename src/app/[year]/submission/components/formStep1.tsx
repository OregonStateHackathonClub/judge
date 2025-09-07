import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../schema";

type FormType = UseFormReturn<z.infer<typeof formSchema>>

export default function StepOne({ form }: { form: FormType}) {
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
        <div className="mt-6">
          <FormField
            control={form.control}
            name="photos"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Upload Images</FormLabel>
                <FormControl>
                  {}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white hover:file:bg-indigo-700"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file) {
                        const url = URL.createObjectURL(file)
                        if (typeof field.value === "string" && field.value.startsWith("blob:")) {
                          try { URL.revokeObjectURL(field.value); } catch {}
                        }
                        field.onChange(url);
                      } else {
                        field.onChange("")
                      }
                    }}
                  />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

          
        </div>
        <Separator className="mt-10" />
      </div>
    )
}