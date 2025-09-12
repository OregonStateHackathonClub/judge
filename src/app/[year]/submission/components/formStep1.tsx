import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import * as z from "zod";
import { formSchema } from "../schema";

type FormType = UseFormReturn<z.infer<typeof formSchema>>

export default function StepOne({ form }: { form: FormType}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string>("")

  const ALLOWED = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
  ] as const
  type AllowedMime = typeof ALLOWED[number]
    const MAX_BYTES = 5 * 1024 * 1024 // 5MB
    const isImage = (url: string) => /\.(png|jpg|jpeg|webp)$/i.test(url)
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
                <FormLabel>Upload Image or PDF</FormLabel>
                <FormControl>
                  {}
                  <div>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,application/pdf"
                      className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white hover:file:bg-indigo-700"
                      disabled={isUploading}
                      onChange={async (e) => {
                        setError("")
                        const file = e.target.files?.[0] || null
                        if (!file) { field.onChange(""); return }

                        // Client-side guards
                        if (!ALLOWED.includes(file.type as AllowedMime)) {
                          setError("Unsupported file type. Use PNG, JPG, WEBP, or PDF.")
                          if (inputRef.current) inputRef.current.value = ""
                          return
                        }
                        if (file.size > MAX_BYTES) {
                          setError("File too large. Max 5MB.")
                          if (inputRef.current) inputRef.current.value = ""
                          return
                        }

                        setIsUploading(true)
                        try {
                          const fd = new FormData()
                          fd.append("file", file)
                          const res = await fetch("/api/upload", { method: "POST", body: fd })
                          if (!res.ok) {
                            const data = await res.json().catch(() => ({}))
                            throw new Error(data?.error || "Upload failed")
                          }
                          const data = (await res.json()) as { url: string }
                          field.onChange(data.url)
                        } catch (err) {
                          const msg = err instanceof Error ? err.message : "Upload failed"
                          setError(msg)
                          field.onChange("")
                        } finally {
                          setIsUploading(false)
                          if (inputRef.current) inputRef.current.value = ""
                        }
                      }}
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                    {field.value && !error && (
                      <div className="mt-3 flex items-center gap-3">
                        {isImage(field.value) ? (
                          <Image
                            src={field.value}
                            alt="Selected upload preview"
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded object-cover"
                          />
                        ) : (
                          <a
                            href={field.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 underline"
                          >
                            View file
                          </a>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={isUploading}
                          onClick={async () => {
                            setError("")
                            const url = field.value as string
                            try {
                              // attempt server delete if this is a vercel blob URL
                              const isBlob = /vercel-storage\.com\//.test(url)
                              if (isBlob) {
                                await fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: "DELETE" })
                                // ignore non-200s to avoid UX friction
                              }
                            } catch {}
                            field.onChange("")
                            if (inputRef.current) inputRef.current.value = ""
                          }}
                        >
                          Remove
                        </Button>
                        {isUploading && <span className="text-xs text-zinc-500">Working…</span>}
                      </div>
                    )}
                  </div>
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