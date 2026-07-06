import type { Metadata } from "next";
import { getAdminCollection } from "@/src/lib/adminApi";
import { AdminWhatsAppTemplatesClient } from "@/src/components/admin/whatsapp-templates/AdminWhatsAppTemplatesClient";
import type { ApiWhatsAppTemplate } from "@/src/types/whatsappTemplate";

export const metadata: Metadata = {
  title: "Manajemen Template WhatsApp | UNA Project Admin",
};

export default async function AdminWhatsAppTemplatesPage() {
  const templates = await getAdminCollection<ApiWhatsAppTemplate>("whatsapp-templates");
  return <AdminWhatsAppTemplatesClient initialTemplates={templates} />;
}
