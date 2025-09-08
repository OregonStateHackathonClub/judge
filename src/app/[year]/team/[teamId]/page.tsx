import TeamPageClient from "./TeamPageClient";
import { isTeamMember } from "@/app/actions";

export default async function Page({ params }: { params: Promise<{ year: string; teamId: string }> }) {
  const {year, teamId} = await params

  const teamMember = await isTeamMember(teamId)
  return <TeamPageClient year={year} teamId={teamId} isTeamMember={teamMember} />;
}