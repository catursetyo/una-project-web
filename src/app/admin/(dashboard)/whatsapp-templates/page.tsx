import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";
import { AdminWhatsAppTemplatesClient } from "@/src/components/admin/whatsapp-templates/AdminWhatsAppTemplatesClient";
import type { ApiWhatsAppTemplate } from "@/src/types/whatsappTemplate";

export const metadata: Metadata = {
  title: "Manajemen Template WhatsApp | UNA Project Admin",
};

export default async function AdminWhatsAppTemplatesPage() {
  const token = await getVerifiedAdminToken();
  if (!token) {
    redirect("/admin/login");
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  let templates: ApiWhatsAppTemplate[] = [];

  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/admin/whatsapp-templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          templates = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiWhatsAppTemplate[];
        }
      }
    } catch (err) {
      console.error("[AdminWhatsAppTemplatesPage] Failed to fetch whatsapp templates from API:", err);
    }
  }

  return <AdminWhatsAppTemplatesClient initialTemplates={templates} />;
}
