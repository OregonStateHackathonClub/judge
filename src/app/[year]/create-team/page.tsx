'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import { zodResolver } from "@hookform/resolvers/zod"
import { set, z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"

import { createTeam, getHackathon } from "@/app/actions"
import { Prisma, PrismaClient } from "@prisma/client";
import { useRouter } from "next/navigation"
import React from "react"

const prisma = new PrismaClient({})



const formSchema = z.object({
  teamName: z.string().min(4, {message: "Username must be at least 4 characters.",}),
  lft: z.boolean().optional(),
  email: z.string().optional(),
  description: z.string().optional(),
})

// do not do this in production- always add a fallback with suspense or a loading.tsx when using an async component
export default function Home({params}:{
  params: Promise<{ year: string }>;
}) {

  const year = React.use(params).year

  const router = useRouter()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
    },
  })
  

  // TODO: hackathon must be unique. must get the id somehow
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    let hackathon = await getHackathon(year)
    if (hackathon == null) {
      // Cope with failure
      return false
    }

    let data = {
      name: values.teamName,
      lookingForTeammates: values.lft,
      description: values.description,
      contact: values.email,
      hackathon: {
        connect: { id: hackathon.id } //TEMP
      }
    }
    let team = await createTeam(data)
    if (!team) {
      // Cope with failure
    } else {
      router.push(`/${year}/${team.teamId}`)
    }
    
  }

  function updateLFT(lft: boolean) {
    let components = document.getElementsByClassName("lft-component")
    for (let i = 0; i < components.length; i++) {
      if (lft) {
        components[i].classList.remove("hidden");
      }
      else {
        components[i].classList.add("hidden");
      }
    }
  }

  return (
    <div className="w-[60%] mx-auto">
      <div className="text-4xl pt-5 pb-10">
        Team Creation
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input placeholder="Amazing Team Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your team's public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lft"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 mb-5">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      updateLFT(Boolean(checked));
                    }}
                  />
                </FormControl>
                <FormLabel>
                  Looking for additional team members
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="pl-10 lft-component hidden">
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Email: benny@beaverhacks.com" {...field} value={field.value || ""} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="pl-10 lft-component hidden">
                <FormLabel>Brief Project Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Prospective teammates should know..." {...field} value={field.value || ""} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-green-500 hover:bg-green-600 rounded-4xl">Create Team</Button>
        </form>
      </Form>
    </div>
  );
}