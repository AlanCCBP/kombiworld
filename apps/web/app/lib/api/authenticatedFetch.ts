import { sessionStore } from "@/lib/auth/sessionStore";

const USERS_API = process.env.NEXT_PUBLIC_USERS_API!;

export async function authenticatedFetch(input: RequestInfo, init: RequestInit = {}) {
  let res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...init.headers,
      ...(sessionStore.accessToken ? { Authorization: `Bearer ${sessionStore.accessToken}` } : {}),
    },
  });

  if (res.status !== 401) return res;

  // 🔄 Try refresh
  const refresh = await fetch(`${USERS_API}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refresh.ok) {
    sessionStore.clear();
    throw new Error("Session expired");
  }

  const { accessToken } = await refresh.json();
  sessionStore.setAccessToken(accessToken);

  // 🔁 Retry original request
  return fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...init.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
