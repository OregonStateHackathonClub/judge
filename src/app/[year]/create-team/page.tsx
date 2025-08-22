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

import { createTeam } from "@/app/actions"
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({})



const formSchema = z.object({
  teamName: z.string().min(4, {message: "Username must be at least 4 characters.",}),
  lft: z.boolean().optional(),
  email: z.string().optional(),
  description: z.string().optional(),
})

export default function Home() {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
    },
  })
  
  // TODO: submit
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    let data = {
      teamId: values.teamName, //TEMP
      name: values.teamName,
      lookingForTeammates: values.lft,
      description: values.description,
      hackathon: {
        connect: { id: "234" } //TEMP
      }
    }
    createTeam(data)
    
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
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="benny@beaverhacks.com" {...field} />
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
                  <Textarea placeholder="Prospective teammates should know..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-green-500 hover:bg-green-600 rounded-4xl">Accept Team</Button>
        </form>
      </Form>
    </div>
  );
}