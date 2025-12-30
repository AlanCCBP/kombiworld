import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/lib/api.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookie = req.headers.get("cookie") ?? "";

    const res = await apiServer.post("/auth/register", body, {
      headers: { cookie },
      withCredentials: true,
    });

    return NextResponse.json({
      accessToken: res.data.accessToken,
      user: res.data.user,
    });
  } catch (err: any) {
    console.warn("Register failed:", err.response?.status || err.message);

    return NextResponse.json(
      { message: "Registration failed" },
      { status: err.response?.status || 500 }
    );
  }
}
