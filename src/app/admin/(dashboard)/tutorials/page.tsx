import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";
import { AdminTutorialsClient } from "@/src/components/admin/tutorials/AdminTutorialsClient";
import type { ApiTutorial } from "@/src/types/tutorial";

export const metadata: Metadata = {
  title: "Manajemen Tutorial | UNA Project Admin",
};

export default async function AdminTutorialsPage() {
  const token = await getVerifiedAdminToken();
  if (!token) {
    redirect("/admin/login");
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  let tutorials: ApiTutorial[] = [];

  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/admin/tutorials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          tutorials = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiTutorial[];
        }
      }
    } catch (err) {
      console.error("[AdminTutorialsPage] Failed to fetch tutorials from API:", err);
    }
  }

  return <AdminTutorialsClient initialTutorials={tutorials} />;
}
