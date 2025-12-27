import { cookies } from "next/headers";

export async function getAccessToken() {
  return (await cookies()).get("accessToken")?.value;
}

export function isAuthenticated() {
  return !!getAccessToken();
}
