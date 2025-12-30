import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/lib/api.server";

export async function POST(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie") ?? "";

    await apiServer.post(
      "/auth/logout",
      {},
      {
        headers: { cookie },
        withCredentials: true,
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.warn("Logout failed:", err.response?.status || err.message);

    return NextResponse.json({ ok: false, message: "Logout failed" }, { status: 500 });
  }
}
