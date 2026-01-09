import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/api/auth"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
