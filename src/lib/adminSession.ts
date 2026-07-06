import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { normalizeApiUrl, parseAdminProfile } from "@/src/lib/adminAuth.mjs";

export const ADMIN_SESSION_COOKIE = "una_admin_session";

export type AdminProfile = {
  id: string;
  email: string;
  name: string;
};

export const verifyAdminSession = cache(async (): Promise<AdminProfile | null> => {
  const apiUrl = normalizeApiUrl(process.env.API_URL);
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!apiUrl || !token) {
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      return null;
    }

    return parseAdminProfile(await response.json());
  } catch {
    return null;
  }
});

export const getVerifiedAdminToken = cache(async (): Promise<string | null> => {
  const admin = await verifyAdminSession();
  if (!admin) {
    return null;
  }
  return (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? null;
});
