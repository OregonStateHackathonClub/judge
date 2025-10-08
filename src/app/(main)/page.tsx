import { getCurrentHackathonId } from "@/lib/queries";
import { redirect } from "next/navigation";

export default async function RootPage() {
  // Find the most recent hackathon by ordering by ID in descending order
  // and taking the first one. This ensures you always get the latest.
  const currentHackathonId = await getCurrentHackathonId()

  // If a hackathon is found in the database, redirect to its page.
  if (currentHackathonId) {
    redirect(`/${currentHackathonId}`);
  }

  // This content is shown ONLY if no hackathons are found in the database.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-center text-neutral-400">
      <h1 className="text-2xl font-bold text-white">No Hackathon Found</h1>
      <p className="mt-2">Please check back later.</p>
    </div>
  );
}