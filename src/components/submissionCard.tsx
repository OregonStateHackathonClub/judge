"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tag } from "lucide-react";
import { ProjectLinks } from "@/components/projectLinks";

// Define a type for the data this card needs
type Submission = {
  id: string;
  name: string;
  images?: string[];
  miniDescription?: string;
  githubURL?: string | null;
  ytVideo?: string | null;
  trackLinks?: { track: { name: string } }[];
};

interface SubmissionCardProps {
  submission: Submission;
  onClick: () => void;
}

export default function SubmissionCard({
  submission,
  onClick,
}: SubmissionCardProps) {
  const img = submission.images?.[0] || "/beaver.png";

  return (
    <Card
      // Enhanced styling for the card container
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-neutral-800 bg-neutral-900/60 backdrop-blur transition hover:border-orange-500/50 hover:bg-neutral-900 hover:shadow-lg hover:shadow-orange-500/10 supports-[backdrop-filter]:bg-neutral-900/50"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-t-2xl bg-neutral-900">
        <img
          src={img}
          alt={`${submission.name} cover`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Content Section (Header) */}
      <CardHeader className="flex-grow px-4 py-3">
        <CardTitle className="text-xl font-bold leading-snug text-white line-clamp-2">
          {submission.name}
        </CardTitle>

        {/* Track Badges */}
        {submission.trackLinks && submission.trackLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {submission.trackLinks.map((link: { track: { name: string } }, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-300"
              >
                <Tag className="h-3 w-3" />
                {link.track?.name}
              </span>
            ))}
          </div>
        )}

        {/* Short Description */}
        {submission.miniDescription && (
          <CardDescription className="mt-1 text-sm text-neutral-400 line-clamp-3">
            {submission.miniDescription}
          </CardDescription>
        )}
      </CardHeader>

      {/* Footer Section */}
      <CardFooter className="mt-auto px-4 pb-4 pt-2">
        <div className="flex w-full items-center justify-between gap-3">
          <ProjectLinks
            githubURL={submission.githubURL ?? null}
            ytVideo={submission.ytVideo ?? null}
          />
          <button
            className="ml-auto inline-flex items-center rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-200 transition hover:border-orange-500/50 hover:bg-neutral-800 hover:cursor-pointer"
            // Stop propagation to prevent the card's onClick from firing twice
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Open →
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}