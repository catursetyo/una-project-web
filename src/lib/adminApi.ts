import "server-only";

import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";

export async function getAdminCollection<T>(path: string): Promise<T[]> {
  const [token, apiUrl] = await Promise.all([
    getVerifiedAdminToken(),
    normalizeApiUrl(process.env.API_URL),
  ]);

  if (!token || !apiUrl) return [];

  try {
    const response = await fetch(`${apiUrl}/admin/${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return [];

    const payload = await response.json();
    const data = payload.success ? payload.data : [];
    return (Array.isArray(data) ? data : data?.items) ?? [];
  } catch {
    return [];
  }
}
