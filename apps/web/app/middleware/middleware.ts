import { NextRequest, NextResponse } from "next/server";
import { config } from "./middleware.config";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = config.matcher.some((route) => pathname.startsWith(route));

  if (!isProtected) return NextResponse.next();

  const hasRefresh = req.cookies.get("refresh_token");

  if (!hasRefresh) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
