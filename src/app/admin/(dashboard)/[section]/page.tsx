import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminCollectionPage } from "@/src/components/admin/AdminCollectionPage";
import { adminSections, getAdminSection } from "@/src/data/admin";

type AdminSectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

export function generateStaticParams() {
  return adminSections.map((section) => ({ section: section.slug }));
}

export async function generateMetadata({
  params,
}: AdminSectionPageProps): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getAdminSection(slug);

  return {
    title: section?.label ?? "Modul Tidak Ditemukan",
  };
}

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  const { section: slug } = await params;
  const section = getAdminSection(slug);

  if (!section) {
    notFound();
  }

  return <AdminCollectionPage section={section} />;
}
