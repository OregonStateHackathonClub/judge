"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Github,
  Youtube,
  ChevronDown,
  Filter,
  Star,
  Tag,
} from "lucide-react";

interface SubmissionsClientProps {
  hackathon: any;
  tracks: any[];
  year: string;
}

export default function SubmissionsClient({
  hackathon,
  tracks,
  year,
}: SubmissionsClientProps) {
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [filteredSubmissions, setFilteredSubmissions] = useState(
    hackathon.submissions
  );
  const router = useRouter();

  useEffect(() => {
    if (selectedTrack === "all") {
      setFilteredSubmissions(hackathon.submissions);
    } else {
      const filtered = hackathon.submissions.filter((submission: any) =>
        submission.trackLinks?.some(
          (link: any) => String(link.trackId) === String(selectedTrack)
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

  // Optional sponsors array support (string[] of image URLs or names).
  const sponsorLogos: string[] =
    (hackathon?.sponsorLogos as string[]) ||
    []; // you can populate this later in your data layer

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* ====== HERO / TITLE BANNER ====== */}
      <div
        className="relative isolate overflow-hidden"
        style={{
          // you can set hackathon.bannerImage later to customize per year
          backgroundImage:
            `linear-gradient(to bottom, rgba(10,10,10,.65), rgba(10,10,10,.95)), url(${hackathon?.bannerImage || "/hero-dark-texture.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col items-center text-center gap-4">
            <span className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs tracking-wide text-neutral-300">
              Oregon State University
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
              BeaverHacks {year}
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-neutral-300">
              Explore projects, filter by track, and discover this year’s builds.
            </p>

            {/* Quick actions / filter */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="relative">
                <select
                  className="peer appearance-none rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-2 pr-10 text-sm text-neutral-200 outline-none transition focus:border-orange-500/70"
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
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/70 px-3 py-2 text-xs text-neutral-300">
                <Filter className="h-4 w-4" />
                Filter by track
              </div>
            </div>
          </div>

          {/* Sponsors (per year) */}
          <div className="mt-12">
            <div className="mx-auto max-w-5xl">
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-6">
                <p className="mb-4 text-center text-sm tracking-wide text-neutral-400">
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
                          <img
                            src={src}
                            alt="Sponsor"
                            className="max-h-10 object-contain"
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
                    <code className="rounded bg-neutral-800 px-1 py-0.5">logos from database</code>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== CONTENT ====== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Submissions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {filteredSubmissions.map((submission: any) => {
            const img =
              (Array.isArray(submission.images) && submission.images[0]) ||
              submission.images ||
              "/@/public/beaver.png";

            return (
              <Card
                key={submission.id}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/50 transition hover:border-neutral-700 hover:bg-neutral-900"
                onClick={() => handleProjectClick(submission.id)}
              >
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={img}
                    alt={`${submission.name} cover`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
                </div>

                {/* Body */}
                <CardHeader className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base font-semibold text-white leading-snug line-clamp-2">
                      {submission.name}
                    </CardTitle>
                    <div className="inline-flex items-center gap-1 rounded-full bg-neutral-800/60 px-2 py-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-xs text-neutral-300">
                        {submission.score ?? 0}
                      </span>
                    </div>
                  </div>
                  {submission.bio && (
                    <CardDescription className="mt-1 text-sm text-neutral-400 line-clamp-2">
                      {submission.bio}
                    </CardDescription>
                  )}

                  {/* Track badges */}
                  {submission.trackLinks?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {submission.trackLinks.map((link: any) => (
                        <span
                          key={link.trackId}
                          className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-300"
                          onClick={(e) => e.stopPropagation()}
                          title={link.track?.name}
                        >
                          <Tag className="h-3 w-3" />
                          {link.track?.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="px-4 pb-2 pt-0">
                  <div className="text-xs text-neutral-400 line-clamp-2">
                    {submission.comments
                      ? submission.comments
                      : "No judge comments yet."}
                  </div>
                </CardContent>

                <CardFooter className="px-4 pb-4 pt-2">
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {submission.githubURL && (
                        <Link
                          href={submission.githubURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800"
                          onClick={(e) => e.stopPropagation()}
                          title="View source"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </Link>
                      )}

                      {submission.ytVideo && (
                        <Link
                          href={submission.ytVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800"
                          onClick={(e) => e.stopPropagation()}
                          title="Watch demo"
                        >
                          <Youtube className="h-4 w-4" />
                          YouTube
                        </Link>
                      )}
                    </div>

                    <button
                      className="ml-auto inline-flex items-center rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-200 transition hover:border-orange-500/50 hover:bg-neutral-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(submission.id);
                      }}
                    >
                      Open →
                    </button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* No results */}
        {filteredSubmissions.length === 0 && (
          <div className="text-center py-24 text-neutral-400">
            No submissions found for the selected track.
          </div>
        )}

        {/* Footer note / patterns hook */}
        <div className="mt-12 text-center text-xs text-neutral-500">
          Interested in becoming a sponsor? Contact us at sponsor@beaverhacks.org
        </div>
      </div>
    </div>
  );
}
