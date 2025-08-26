"use client";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

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

import React, { useEffect, useState } from "react"
import { updateTeam } from "@/app/actions";
import { Prisma } from "@prisma/client";

const formSchema = z.object({
    teamName: z.string().min(4, {message: "Username must be at least 4 characters.",}),
    lft: z.boolean().optional(),
    contact: z.string().min(0).optional(),
    description: z.string().min(0).optional(),
  })

export default function TeamPageClient({ team }: { team : any }) {
    const [editing, setEditing,] = useState(false);
    const [currTeam, setCurrTeam] = useState(team);
    

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        teamName: "",
      },
    })

    useEffect(() => {
        if (currTeam) {
          form.reset({
            teamName: currTeam.name,
            contact: currTeam.contact,
            description: currTeam.description,
          });
        }
      }, [team, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        let data = {
            name: values.teamName,
            lookingForTeammates: values.lft,
            description: values.description,
            contact: values.contact,
        }

        let updatedTeam = await updateTeam(currTeam.teamId, data)
        if (!updatedTeam) {
            // Cope with your failures
            console.error("Failed to update team")
            return false
        }
        setCurrTeam(updatedTeam)
        setEditing(false);
    }

  if (!currTeam) {
    return <div>Team Does Not Exist</div>;
  }

  return (
    <div className="w-[60%] mx-auto">
      {!editing ? (
        <div className="flex">
          <div>
            <div className="text-4xl pt-5">{currTeam.name}</div>
            {currTeam.lookingForTeammates && (
              <div className="pt-5 pl-10">Looking for teammates &#10004;</div>
            )}
            {currTeam.description && (
              <>
                <div className="text-2xl pt-5">Description:</div>
                <div className="pt-1 pl-10">{currTeam.description}</div>
              </>
            )}
            <div className="text-2xl pt-5">Members:</div>
            <div className="pt-1 pl-10">
              {currTeam.users.map((ut: any) => (
                <div key={ut.judgeProfileId}>{ut.judgeProfile.user.name}</div>
              ))}
            </div>
            {currTeam.contact && (
              <>
                <div className="text-2xl pt-5">Contact:</div>
                <div className="pt-1 pl-10">{currTeam.contact}</div>
              </>
            )}
          </div>

          <div className="ml-auto mt-10">
            <Button
              className="w-20 h-15 bg-gray-200 hover:bg-gray-300 text-black text-2xl rounded-2xl"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10">
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
                            // updateLFT(Boolean(checked));
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
                    name="contact"
                    render={({ field }) => (
                    <FormItem className="pl-10">
                        <FormLabel>Contact</FormLabel>
                        <FormControl>
                        <Input placeholder="Email: benny@beaverhacks.com" {...field} value={field.value ?? ""} />
                        </FormControl>
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem className="pl-10">
                        <FormLabel>Brief Project Description</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Prospective teammates should know..." {...field} value={field.value ?? ""} />
                        </FormControl>
                    </FormItem>
                    )}
                />

                <Button type="submit" className="bg-green-500 hover:bg-green-600 rounded-4xl">
                    Update Team
                </Button>
                <Button
                    onClick={() => {
                        setEditing(false);
                        form.reset({
                            teamName: team.name,
                            contact: team.contact,
                            description: team.description,
                        });
                    }}
                    className="ml-4 bg-gray-200 hover:bg-gray-300 text-black rounded-4xl"
                >
                    Cancel
                </Button>
                </form>
            </Form>
        </div>
      )}
    </div>
  );
}
