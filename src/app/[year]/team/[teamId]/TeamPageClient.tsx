'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { getInviteCode, getTeamInfo, resetInviteCode, removeUserToTeams, updateTeam } from "@/app/actions"

const formSchema = z.object({
  teamName: z.string().min(4),
  lft: z.boolean().optional(),
  contact: z.string().optional(),
  description: z.string().optional(),
})

type TeamInfo = {
  teamId: string;
  name: string;
  description: string | null;
  contact: string | null;
  lookingForTeammates: boolean;
  users: TeamUser[];
};

type TeamUser = {
  judgeProfileId: string;
  judgeProfile: {
    user: {
      name: string;
    };
  } | null;
};

export default function TeamPageClient({ teamId, year, isTeamMember }: { teamId: string, year: string, isTeamMember: boolean }) {
  const [editing, setEditing] = useState(false)
  const [team, setTeam] = useState<TeamInfo | null>(null)
  const [inviteCode, setInviteCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { teamName: "" },
  })

  useEffect(() => {
    const fetchTeam = async () => {
      const updatedTeam = await getTeamInfo(teamId)
      if (!updatedTeam) {
        // Cope with your failures
        console.error("Failed to find team")
        return false
      }
      setTeam(updatedTeam)
      form.reset({
        teamName: updatedTeam.name,
        contact: updatedTeam.contact ?? "",
        description: updatedTeam.description ?? "",
        lft: updatedTeam.lookingForTeammates,
      })
    }
    const fetchInvite = async () => {
      const code = await getInviteCode(teamId)
      if (code) setInviteCode(code)
    }
    fetchTeam()
    fetchInvite()
  }, [teamId, form])

  const getLink = () => `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${year}/invite/${inviteCode}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(getLink())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await updateTeam(teamId, values)
    if (res) {
      const updatedTeam = await getTeamInfo(teamId)
      setTeam(updatedTeam)
      setEditing(false)
    }
  }

  const removeUser = async (judgeProfileId: string) => {
    await removeUserToTeams(judgeProfileId, teamId)
    setTeam((prevTeam) => {
      if (!prevTeam) return prevTeam
      return {
        ...prevTeam,
        users: prevTeam.users.filter((u) => u.judgeProfileId !== judgeProfileId)
      }
    })
  }

  if (!team) return <div className="text-center py-10">Loading Team...</div>

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      {/* Team Header */}
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          {team.lookingForTeammates && <span className="text-green-600 font-medium mt-1 inline-block">Looking for teammates ✔</span>}
        </div>
        {isTeamMember && !editing && (
          <Button variant="outline" className="rounded-xl" onClick={() => setEditing(true)}>Edit</Button>
        )}
      </div>

      {/* Team Description */}
      {team.description && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{team.description}</p>
        </div>
      )}

      {/* Members */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Members</h2>
        <ul className="space-y-2">
          {team.users.map((u: TeamUser) => (
            <li key={u.judgeProfileId} className="flex items-center justify-between">
              <span>{u.judgeProfile?.user.name}</span>
              {isTeamMember && (
                <Image
                  src="/trashcan-red.png"
                  alt="Remove user"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={() => removeUser(u.judgeProfileId)}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Invite Link */}
        {team.users.length < 4 && isTeamMember && (
          <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
              <Button variant="outline" className="mt-4 rounded-xl w-full">
                + Add Teammates
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 relative">
              <button
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
                onClick={async () => {
                  const success = await resetInviteCode(inviteCode); // make sure inviteCode is available
                  if (success) {
                    const fetchInvite = async () => {
                      const code = await getInviteCode(teamId)
                      if (code) setInviteCode(code)
                    }
                    fetchInvite();
                  }
                  else alert("Failed to remove invite.");
                }}
              >
                <span className="text-2xl">&#10227;</span>
              </button>
          
              <p className="text-sm mb-2">Send this invite link to friends:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={getLink()}
                  readOnly
                  className="flex-1 px-2 py-1 border rounded"
                />
                <Button size="sm" onClick={copyLink}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Contact Info */}
      {team.contact && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>{team.contact}</p>
        </div>
      )}

      {/* Edit Form */}
      {editing && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Team Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lft"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <FormLabel>Looking for teammates</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Brief description..." />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button type="submit" className="bg-green-500 hover:bg-green-600 rounded-xl">Update Team</Button>
                <Button type="button" className="bg-gray-200 hover:bg-gray-300 rounded-xl" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}
