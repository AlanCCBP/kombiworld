import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/lib/api.server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await apiServer.post("/auth/login", body);

  const response = NextResponse.json({
    user: res.data.user,
  });

  response.cookies.set("refreshToken", res.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  response.cookies.set("accessToken", res.data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return response;
}
