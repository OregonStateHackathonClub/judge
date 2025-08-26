import { Suspense } from "react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

// TODO: Add filter: add team description
async function Teams() {
  const data = await GetTeams();

  return(
    <ul className="pb-2.5">
      {
        data.map( (team, index) => (
          <Link key={team.teamId} href={`${team.teamId}`}>
            <li className="pl-10 pt-2.5 pb-2.5 hover:bg-gray-100">{team.name}</li>
          </Link>
      ))}
    </ul>
  )
}

async function GetTeams() {
  const prisma = new PrismaClient({})
  const teams = await prisma.teams.findMany({where:{lookingForTeammates:true}})
  return teams;
}

export default function Home() {
  return (
    <div className="w-[60%] mx-auto">
      <div className="text-4xl pt-5">
        Find a Team
      </div>

      <div className="pl-10">
        <div className="text-xl pt-10">
          Browse groups searching for teammates:
        </div>

        <Suspense fallback={"Loading..."} >
          <Teams />
        </Suspense>

      </div>
    </div>
  );
}