import Image from "next/image";
import Link from "next/link";
import LoginLogoutButton from "./loginLogoutButton";
import { getCurrentHackathonId } from "@/lib/queries";
import { Suspense } from "react";

export const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-8 h-20 bg-gray-100">
      <Suspense fallback={<HackathonHomepageButton />}>
        <HackathonHomepageButtonWrapper />
      </Suspense>
      <LoginLogoutButton />
    </div>
  );
};

const HackathonHomepageButtonWrapper = async () => {
  const currentHackathonId = await getCurrentHackathonId();

  return <HackathonHomepageButton link={currentHackathonId} />;
};

const HackathonHomepageButton = ({ link = "/" }: { link?: string }) => (
  <Link
    href={{ pathname: link }}
    className="flex gap-5 items-center p-5 hover:bg-gray-200"
  >
    <div className="w-10 h-10 relative">
      <Image src="/beaver.png" alt="beaver" fill />
    </div>
    <h1>BeaverHacks Official Judging Platform</h1>
  </Link>
);
