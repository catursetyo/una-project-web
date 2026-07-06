import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";
import { AdminTestimonialsClient } from "@/src/components/admin/testimonials/AdminTestimonialsClient";
import type { ApiTestimonial } from "@/src/types/testimonial";

export const metadata: Metadata = {
  title: "Manajemen Testimoni | UNA Project Admin",
};

export default async function AdminTestimonialsPage() {
  const token = await getVerifiedAdminToken();
  if (!token) {
    redirect("/admin/login");
  }

  const apiUrl = normalizeApiUrl(process.env.API_URL);
  let testimonials: ApiTestimonial[] = [];

  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/admin/testimonials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          testimonials = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiTestimonial[];
        }
      }
    } catch (err) {
      console.error("[AdminTestimonialsPage] Failed to fetch testimonials from API:", err);
    }
  }

  return <AdminTestimonialsClient initialTestimonials={testimonials} />;
}
