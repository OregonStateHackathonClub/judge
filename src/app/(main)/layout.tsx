import { Navbar } from "@/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh flex flex-col">
      <Navbar />
      <div className="flex grow flex-col">{children}</div>
    </main>
  );
}
