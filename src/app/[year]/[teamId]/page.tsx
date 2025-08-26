import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import React, { Suspense } from "react";

  
export default async function Page({params}: { params: Promise<{ year: string, teamId: string }> }) {

  const prisma = new PrismaClient({})

  async function GetTeamData() {
    const { year, teamId } = await params;
    const team = await prisma.teams.findUnique({
      where: {teamId:teamId},
      include: {
        users: {
          include: {
            judgeProfile: {
              include: {
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

    })
    return team;
  }

  // TODO: Team Not Found Page
  async function TeamData() {
    const data = await GetTeamData();
    if (data == null) {
      return (
        <div>
          Team Does Not Exist
        </div>
      )
    }
  
    return(
      <>
        <div className="text-4xl pt-5">
          {data?.name}
        </div>
        { data?.lookingForTeammates &&
          <div className="pt-5">
            Looking for teammates &#10004;
          </div>
        }
        { data?.description &&
          <>
            <div className="text-2xl pt-5">
              Description:
            </div>
            <div className="pt-1">
              {data?.description}
            </div>
          </>
        }
        
        <div className="text-2xl pt-5">
          Members:
        </div>
        <div className="pt-1">
          {data?.users.map(ut => (
            <div key={ut.judgeProfileId}>{ut.judgeProfile.user.name}</div>
          ))}
        </div>
        { data?.contact &&
          <>
            <div className="text-2xl pt-5">
              Contact:
            </div>
            <div className="pt-1">
              {data?.contact}
            </div>
          </>
        }
      </>
    )
  }

  return (
    <div className="w-[60%] mx-auto">

      <Suspense fallback={"Loading..."} >
        <TeamData />
      </Suspense>

    </div>
  );
}
  