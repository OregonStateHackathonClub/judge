"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Filter } from "lucide-react";
import SubmissionCard from "@/components/submissionCard";
import Image from "next/image";
import Link from "next/link";

// Define specific types for your data to replace 'any'
interface Track {
  id: string;
  name: string;
}

interface Submission {
  id: string;
  name: string;
  images?: string[];
  miniDescription?: string;
  githubURL?: string | null;
  ytVideo?: string | null;
  trackLinks?: { track: { id: string; name: string } }[];
}

interface Hackathon {
  submissions: Submission[];
  bannerImage?: string;
  sponsorLogos?: string[];
}

// Use the new types in your component's props
interface SubmissionsClientProps {
  hackathon: Hackathon;
  tracks: Track[];
  year: string;
  userHasTeam?: boolean;
}

export default function SubmissionsClient({
  hackathon,
  tracks,
  year,
  userHasTeam = false,
}: SubmissionsClientProps) {
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    hackathon.submissions
  );
  const router = useRouter();

  useEffect(() => {
    if (selectedTrack === "all") {
      setFilteredSubmissions(hackathon.submissions);
    } else {
      const filtered = hackathon.submissions.filter((submission: Submission) =>
        submission.trackLinks?.some(
          (link) => String(link.track.id) === String(selectedTrack)
        )
      );
      setFilteredSubmissions(filtered);
    }
  }, [selectedTrack, hackathon.submissions]);

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrack(e.target.value);
  };

  const handleProjectClick = (submissionId: string) => {
    router.push(`/${year}/projects/${submissionId}`);
  };

  const sponsorLogos: string[] = hackathon?.sponsorLogos || [];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* ====== HERO / TITLE BANNER ====== */}
      <div
        className="relative isolate overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,.65), rgba(10,10,10,.95)), url(${
            hackathon?.bannerImage || "/hero-dark-texture.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col items-center text-center gap-4">
            <span className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-s tracking-wide text-neutral-300">
              Oregon State University
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
              BeaverHacks {year}
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-neutral-300">
              Explore projects, filter by track, and discover this year’s
              builds.
            </p>
          </div>

          {/* Sponsors (per year) */}
          <div className="mt-12">
            <div className="mx-auto max-w-5xl">
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-6">
                <p className="mb-4 text-center text-s tracking-wide text-neutral-400">
                  Sponsors
                </p>
                {sponsorLogos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-center">
                    {sponsorLogos.map((src, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center opacity-80 hover:opacity-100 transition"
                      >
                        {src.endsWith(".png") ||
                        src.endsWith(".svg") ||
                        src.endsWith(".jpg") ? (
                          <Image
                            src={src}
                            alt="Sponsor"
                            width={120}
                            height={40}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-sm text-neutral-300">
                            {src}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-xs text-neutral-500">
                    Add sponsor logos later by populating{" "}
                    <code className="rounded bg-neutral-800 px-1 py-0.5">
                      logos from database
                    </code>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== CONTENT ====== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Quick actions / filter */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center rounded-2xl border border-neutral-800 bg-neutral-900/70 text-sm text-neutral-300 transition-all focus-within:border-orange-500/70">
            <div className="inline-flex items-center gap-2 px-4 py-2">
              <Filter className="h-4 w-4" />
              <span>Filter by track:</span>
            </div>
            <div className="w-px self-stretch bg-neutral-800"></div>
            <div className="relative">
              <select
                className="appearance-none bg-transparent py-2 pl-4 pr-10 outline-none hover:cursor-pointer"
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
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>

          {/* Conditional Team Buttons */}
          {userHasTeam ? (
            <Link
              href={`/${year}/team`}
              className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
            >
              Go to Your Team
            </Link>
          ) : (
            <>
              <Link
                href={`/${year}/create-team`}
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                Create a Team
              </Link>
              <Link
                href={`/${year}/find-team`}
                className="rounded-xl border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-sm text-neutral-200 transition hover:border-neutral-600"
              >
                Find a Team
              </Link>
            </>
          )}
        </div>

        {/* Submissions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {filteredSubmissions.map((submission: Submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onClick={() => handleProjectClick(submission.id)}
            />
          ))}
        </div>

        {/* No results */}
        {filteredSubmissions.length === 0 && (
          <div className="text-center py-24 text-neutral-400">
            No submissions found for the selected track.
          </div>
        )}

        {/* Footer note / patterns hook */}
        <div className="mt-12 text-center text-xs text-neutral-500">
          Interested in becoming a sponsor? Contact us at
          sponsor@beaverhacks.org
        </div>
      </div>
    </div>
  );
}