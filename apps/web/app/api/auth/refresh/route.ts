import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/lib/api.server";

export async function POST(req: NextRequest) {
  const res = await apiServer.post(
    "/auth/refresh",
    {},
    {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
      withCredentials: true,
    }
  );

  return NextResponse.json({
    accessToken: res.data.accessToken,
    user: res.data.user,
  });
}
