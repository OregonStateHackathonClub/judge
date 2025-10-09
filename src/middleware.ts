import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const config = {
  matcher: ["/console/:path*", "/create-team", "/invite"],
  runtime: "nodejs",
};

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }
  return NextResponse.next();
}
