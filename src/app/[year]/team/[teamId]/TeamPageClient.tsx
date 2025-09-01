'use client'

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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import React, { useEffect, useState } from "react"
import { getInviteCode, getTeamInfo, isTeamMember, removeUserToTeams, updateTeam } from "@/app/actions";
import { Prisma } from "@prisma/client";
import { authClient } from "@/lib/authClient";
import Image from "next/image"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    teamName: z.string().min(4, {message: "Username must be at least 4 characters.",}),
    lft: z.boolean().optional(),
    contact: z.string().min(0).optional(),
    description: z.string().min(0).optional(),
  })

type TeamWithUsers = Prisma.TeamsGetPayload<{
  select: {
    teamId: true,
    name: true,
    description: true,
    contact: true,
    lookingForTeammates: true,
    users: {
      select: {
        judgeProfile: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    },
  },
}>;

export default function TeamPageClient({ teamId, year, isTeamMember }: { teamId : string, year : string, isTeamMember: boolean }) {
    const [editing, setEditing,] = useState(false);
    const [team, setTeam] = useState<TeamWithUsers | null>(null);
    const [copied, setCopied] = useState(false)
    const [inviteCode, setInviteCode] = useState<string>("")

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        teamName: "",
      },
    })

    useEffect(() => {
      const fetchTeam = async () => {
        if (!team) {
          const updatedTeam = await getTeamInfo(teamId)
          setTeam(updatedTeam)

        } else {
          form.reset({
            teamName: team.name,
            contact: team.contact ?? undefined,
            description: team.description ?? undefined,
          });
        }
      }
      fetchTeam()

      const fetchLink = async () => {
        const code = await getInviteCode(teamId)
        if (code) {
          setInviteCode(code)
        }
      }
      fetchLink()

      }, [team, form]);

    function getLink() : string {
      return `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${year}/invite/${inviteCode}`
    }

    const copyLink = async () => {
      await navigator.clipboard.writeText(getLink())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        let data = {
            name: values.teamName,
            lookingForTeammates: values.lft,
            description: values.description,
            contact: values.contact,
        }

        const res = await updateTeam(teamId, data)
        if (!res) {
            // Cope with your failures
            console.error("Failed to update team")
            return false
        }

        const updatedTeam = await getTeamInfo(teamId)
        if (!updatedTeam) {
          // Cope with your failures
          console.error("Failed to find team")
          return false
      }

        setTeam(updatedTeam)
        setEditing(false);
    }

    async function removeUser(judgeProfileId: string) {
      await removeUserToTeams(judgeProfileId, teamId)
      
      setTeam(null)
      // setTeam(prev => ({
      //   ...prev,
      //   users: prev.users.filter(u => u.judgeProfileId !== judgeProfileId),
      // }))

    }

  if (!team) {
    return <div>Searching for Team...</div>;
  }

  return (
    <div className="w-[60%] mx-auto">
      {!editing ? (
        <div className="flex">
          <div>
            <div className="text-4xl pt-5">{team.name}</div>
            {team.lookingForTeammates && (
              <div className="pt-5 pl-10">Looking for teammates &#10004;</div>
            )}
            {team.description && (
              <>
                <div className="text-2xl pt-5">Description:</div>
                <div className="pt-1 pl-10">{team.description}</div>
              </>
            )}
            <div className="text-2xl pt-5">Members:</div>
            <div className="pt-1 pl-10">
              {team.users.map((ut: any) => (
                <div key={ut.judgeProfileId} className="flex items-center gap-2 pb-2">
                  {ut.judgeProfile.user.name}
                  <Image
                    src="/trashcan-red.png" 
                    alt="Remove user" 
                    width={50} 
                    height={50} 
                    className="cursor-pointer w-3 h-3 object-contain"
                    onClick={async () => {removeUser(ut.judgeProfileId)}}
                  />
                </div>
              ))}
              {team.users.length < 4 && isTeamMember && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="rounded-4xl mt-1">+ Add Teammates</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="">
                      <p className="mb-2 text-sm font-medium">
                        Send this invite link to friends:
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={getLink()}
                          readOnly
                          className="flex-1 px-2 py-1 text-sm border rounded"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={copyLink}
                        >
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            {team.contact && (
              <>
                <div className="text-2xl pt-5">Contact:</div>
                <div className="pt-1 pl-10">{team.contact}</div>
              </>
            )}
          </div>

          { isTeamMember &&
            <div className="ml-auto mt-10">
              <Button
                className="w-20 h-15 bg-gray-200 hover:bg-gray-300 text-black text-2xl rounded-2xl"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            </div>
          }
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
                            onCheckedChange={(checked : boolean | "indeterminate") => {
                            field.onChange(checked);
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
                            contact: team.contact ?? undefined,
                            description: team.description ?? undefined,
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
