import Link from "next/link";


export default function Home() {
  

  return (
    <div>
      <div>hey everyone. This is the home page</div>
      <div className="bg-red-500 h-10 w-10">

      </div>
      <h1 className="text-2xl font-bold">Test title</h1>
      <Link href="/2026/submission">go to submission maker</Link>
    </div>
  );
}