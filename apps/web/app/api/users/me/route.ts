import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/lib/api.server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null });
  }

  try {
    const res = await apiServer.get("/users/me", {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-company-id": req.headers.get("x-company-id") ?? "",
      },
    });

    return NextResponse.json(res.data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return NextResponse.json({ user: null });
    }

    console.error("users/me error:", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
