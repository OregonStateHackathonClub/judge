"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SubmissionsClientProps {
  hackathon: any;
  tracks: any[];
  year: string;
}

export default function SubmissionsClient({ hackathon, tracks, year }: SubmissionsClientProps) {
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [filteredSubmissions, setFilteredSubmissions] = useState(hackathon.submissions);
  const router = useRouter();

  useEffect(() => {
    if (selectedTrack === "all") {
      setFilteredSubmissions(hackathon.submissions);
    } else {
      const filtered = hackathon.submissions.filter((submission: any) => {
        return submission.trackLinks.some((link: any) => 
          String(link.trackId) === String(selectedTrack)
        );
      });
      setFilteredSubmissions(filtered);
    }
  }, [selectedTrack, hackathon.submissions]);

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrack(e.target.value);
  };

  const handleProjectClick = (submissionId: string) => {
    router.push(`/${year}/projects/${submissionId}`);
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
            <Card 
              className="h-full flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProjectClick(submission.id)}
            >
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
                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking links
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
                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking links
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