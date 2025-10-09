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
import { toast } from "sonner";
import { totalImages } from "../schema";

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
              <FormLabel>Upload Image:</FormLabel>
              <FormControl>
                {}
                <div>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white hover:file:bg-indigo-700"
                    disabled={isUploading}
                    onChange={async (e) => {
                      setError("");
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) {
                        return;
                      }

                      // Client-side guards
                      for (const file of files) {
                        if (!ALLOWED.includes(file.type as AllowedMime)) {
                          setError(
                            "Unsupported file type. Use PNG, JPG, WEBP, or PDF."
                          );
                          if (inputRef.current) inputRef.current.value = "";
                          return;
                        }
                        if (file.size > MAX_BYTES) {
                          setError("File too large. Max 5MB.");
                          if (inputRef.current) inputRef.current.value = "";
                          return;
                        }
                      }

                      const current = Array.isArray(field.value)
                        ? field.value
                        : field.value
                        ? [field.value]
                        : [];
                      const remaining = totalImages - current.length;
                      if (remaining <= 0) {
                        toast(
                          "You already have ${totalImages} photos. Remove one to add more."
                        );
                        if (inputRef.current) inputRef.current.value = "";
                        return;
                      }
                      let toUpload = files;
                      if (files.length > remaining) {
                        toUpload = files.slice(0, remaining);
                      }

                      setIsUploading(true);
                      try {
                        const fd = new FormData();
                        for (const file of toUpload) {
                          fd.append("file", file);
                        }
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: fd,
                        });
                        if (!res.ok) {
                          const data = await res.json().catch(() => ({}));
                          throw new Error(data?.error || "Upload failed");
                        }
                        const data = (await res.json()) as {
                          url?: string;
                          urls?: string[];
                        };
                        const uploaded: string[] =
                          data.urls ?? (data.url ? [data.url] : []);
                        field.onChange([...current, ...uploaded]);
                      } catch (err) {
                        const msg =
                          err instanceof Error ? err.message : "Upload failed";
                        setError(msg);
                        // keep existing images on error
                      } finally {
                        setIsUploading(false);
                        if (inputRef.current) inputRef.current.value = "";
                      }
                    }}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                  {Array.isArray(field.value) &&
                    field.value.length > 0 &&
                    !error && (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {field.value.map((url: string) => (
                          <div key={url} className="flex items-center gap-2">
                            {isImage(url) ? (
                              <Image
                                src={url}
                                alt="Selected upload preview"
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded object-cover"
                              />
                            ) : (
                              <a
                                href={url}
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
                                setError("");
                                try {
                                  const isBlob = /vercel-storage\.com\//.test(
                                    url
                                  );
                                  if (isBlob) {
                                    await fetch(
                                      `/api/upload?url=${encodeURIComponent(
                                        url
                                      )}`,
                                      { method: "DELETE" }
                                    );
                                  }
                                } catch {}
                                const next = (field.value as string[]).filter(
                                  (u) => u !== url
                                );
                                field.onChange(next);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        {isUploading && (
                          <span className="text-xs text-zinc-400">
                            Working…
                          </span>
                        )}
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