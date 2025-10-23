import { Button } from "@/components/ui/button";
import { getCurrentHackathonId } from "@/lib/queries";
import Link from "next/link";
import { Suspense } from "react";

export default function Unauthorized() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-neutral-950 text-white">
      <p>You must be a judge, admin, or superadmin to access this interface</p>
      <p>If you're a judge/admin, talk to your organizers to obtain access</p>
      <p>
        If you're configuring this application, ensure that you whitelist an
        account as a superadmin. See the setup guide for more info
      </p>
      <Button>
        <Suspense fallback={<Link href="/">Back to home</Link>}>
          <HomeButton />
        </Suspense>
      </Button>
    </div>
  );
}

async function HomeButton() {
  const hackathonId = await getCurrentHackathonId();

  return <Link href={`/${hackathonId}`}>Back to home</Link>;
}
