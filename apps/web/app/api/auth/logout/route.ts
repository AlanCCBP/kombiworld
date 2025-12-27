import { NextResponse } from "next/server";
import { api } from "@/lib/api";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await api.post("/auth/logout", body);

  const response = NextResponse.json(res.data);

  response.cookies.set("accessToken", res.data.accessToken, {
    httpOnly: true,
    path: "/",
  });

  response.cookies.set("refreshToken", res.data.refreshToken, {
    httpOnly: true,
    path: "/",
  });

  return response;
}
