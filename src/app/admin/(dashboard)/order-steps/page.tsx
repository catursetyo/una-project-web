import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";
import { AdminOrderStepsClient } from "@/src/components/admin/order-steps/AdminOrderStepsClient";
import type { ApiOrderStep } from "@/src/types/orderStep";

export const metadata: Metadata = {
  title: "Manajemen Alur Pemesanan | UNA Project Admin",
};

export default async function AdminOrderStepsPage() {
  const token = await getVerifiedAdminToken();
  if (!token) {
    redirect("/admin/login");
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  let steps: ApiOrderStep[] = [];

  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/admin/order-steps`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          steps = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiOrderStep[];
        }
      }
    } catch (err) {
      console.error("[AdminOrderStepsPage] Failed to fetch order steps from API:", err);
    }
  }

  return <AdminOrderStepsClient initialSteps={steps} />;
}
