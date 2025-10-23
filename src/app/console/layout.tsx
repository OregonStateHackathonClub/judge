import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth.api.getSession({ headers: await headers() });

  if (!user) {
    unauthorized();
  }

  return (
    <div className="bg-zinc-900 flex grow min-h-dvh text-zinc-50">
      {children}
    </div>
  );
}
