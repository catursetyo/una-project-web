import type { Metadata } from "next";
import { getAdminCollection } from "@/src/lib/adminApi";
import { AdminTestimonialsClient } from "@/src/components/admin/testimonials/AdminTestimonialsClient";
import type { ApiTestimonial } from "@/src/types/testimonial";

export const metadata: Metadata = {
  title: "Manajemen Testimoni | UNA Project Admin",
};

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminCollection<ApiTestimonial>("testimonials");
  return <AdminTestimonialsClient initialTestimonials={testimonials} />;
}
