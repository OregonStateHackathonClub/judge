"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { useState, useEffect } from "react";

const prisma = new PrismaClient();

export default async function Page({ params }: { params: { year: string } }) {
  const hackathon = await prisma.hackathons.findFirst({
    where: { year: params.year },
    include: {
      submissions: {
        include: {
          trackLinks: {
            include: {
              track: true
            }
          }
        },
        orderBy: {
          score: 'desc' // Sort by highest score first
        }
      },
    },
  });

  if (!hackathon) {
    return (
      <div className="text-center mt-20 text-red-600 text-2xl">
        No hackathon found for year {params.year}.
      </div>
    );
  }

  const tracks = await prisma.tracks.findMany({
    where: { hackathonId: hackathon.id },
  });

  return <SubmissionsPage hackathon={hackathon} tracks={tracks} year={params.year} />;
}

function SubmissionsPage({ hackathon, tracks, year }: { hackathon: any, tracks: any[], year: string }) {
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [filteredSubmissions, setFilteredSubmissions] = useState(hackathon.submissions);

  useEffect(() => {
    if (selectedTrack === "all") {
      setFilteredSubmissions(hackathon.submissions);
    } else {
      const filtered = hackathon.submissions.filter((submission: any) =>
        submission.trackLinks.some((link: any) => link.trackId === selectedTrack)
      );
      setFilteredSubmissions(filtered);
    }
  }, [selectedTrack, hackathon.submissions]);

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrack(e.target.value);
  };

  return (
    <div>
      {/* Header */}
      <div className="h-20 bg-orange-400 flex items-center justify-center">
        <h1 className="text-white font-bold text-5xl">
          {"BeaverHacks " + year}
        </h1>
      </div>
      
      {/* Dropdown */}
      <div className="flex justify-end p-4">
        <select 
          className="border border-gray-300 rounded-md p-2"
          value={selectedTrack}
          onChange={handleTrackChange}
        >
          <option value="all">All Tracks</option>
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Submission Cards */}
      <div className="flex flex-wrap justify-between p-4">
        {filteredSubmissions.map((submission: any) => (
          <div className="w-full sm:w-1/2 md:w-1/3 p-2" key={submission.id}>
            <Card className="h-full flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{submission.name}</CardTitle>
                <CardDescription>{submission.bio}</CardDescription>
                {/* Display track names */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {submission.trackLinks.map((link: any) => (
                    <span 
                      key={link.trackId}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {link.track.name}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between gap-4">
                  {/* Left side - text */}
                  <div className="flex-1">
                    <p>Score: {submission.score}</p>
                    <p>Comments: {submission.comments}</p>
                  </div>
                  {/* Right side - image cutout */}
                  <div className="h-32 flex items-center justify-center">
                    <img
                      src={submission.images || "/beaver.png"}                      
                      alt={`${submission.name} image`}
                      className="w-32 h-32 object-cover rounded-md border border-gray-400 shadow-md"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-4">
                {submission.githubURL && (
                  <Link
                    href={submission.githubURL}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub →
                  </Link>
                )}
                {submission.ytVideo && (
                  <Link
                    href={submission.ytVideo}
                    className="text-red-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube →
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredSubmissions.length === 0 && (
        <div className="text-center mt-10 text-gray-600">
          No submissions found for the selected track.
        </div>
      )}
    </div>
  );
}