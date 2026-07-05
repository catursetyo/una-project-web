import { orderSteps, testimonials } from "@/src/data/landing";
import { products } from "@/src/data/products";
import { tutorials } from "@/src/data/tutorials";
import { formatPrice } from "@/src/lib/formatPrice";
import type { AdminSection, AdminSectionSlug } from "@/src/types/admin";

const whatsappTemplates = [
  {
    id: "konsultasi-jws",
    name: "konsultasi_jws",
    category: "Konsultasi",
    message:
      "Assalamualaikum UNA Project, saya tertarik dengan {product_name}. Mohon info harga dan pemasangannya.",
  },
  {
    id: "minta-katalog",
    name: "minta_katalog",
    category: "Katalog",
    message:
      "Assalamualaikum UNA Project, saya ingin meminta katalog lengkap dan daftar harga terbaru.",
  },
];

export const adminNavigationItems: {
  href: string;
  label: string;
  shortLabel: string;
}[] = [
  { href: "/admin", label: "Ringkasan", shortLabel: "RI" },
  { href: "/admin/products", label: "Produk", shortLabel: "PR" },
  { href: "/admin/testimonials", label: "Testimoni", shortLabel: "TE" },
  { href: "/admin/tutorials", label: "Tutorial", shortLabel: "TU" },
  { href: "/admin/order-steps", label: "Alur Pemesanan", shortLabel: "AP" },
  {
    href: "/admin/whatsapp-templates",
    label: "Template WhatsApp",
    shortLabel: "WA",
  },
];

export const adminSections: AdminSection[] = [
  {
    slug: "products",
    label: "Produk",
    title: "Manajemen Produk",
    description:
      "Kelola katalog, harga mulai, varian, spesifikasi, dan status produk.",
    actionLabel: "Tambah Produk",
    columns: ["Nama produk", "Kategori", "Harga mulai", "Varian"],
    rows: products.map((product) => ({
      id: product.slug,
      cells: [
        product.name,
        product.category,
        formatPrice(product.priceStartFrom),
        `${product.variants?.length ?? 0} varian`,
      ],
      status: "Aktif",
      featured: product.isFeatured,
    })),
  },
  {
    slug: "testimonials",
    label: "Testimoni",
    title: "Manajemen Testimoni",
    description:
      "Atur dokumentasi pemasangan, keterangan singkat, dan urutan tampil.",
    actionLabel: "Tambah Testimoni",
    columns: ["Judul", "Keterangan", "Media"],
    rows: testimonials.map((testimonial) => ({
      id: testimonial.title.toLowerCase().replaceAll(" ", "-"),
      cells: [testimonial.title, testimonial.description, "Placeholder gambar"],
      status: "Aktif",
    })),
  },
  {
    slug: "tutorials",
    label: "Tutorial",
    title: "Manajemen Tutorial",
    description:
      "Kelola panduan penggunaan, video, dan langkah-langkah pengoperasian.",
    actionLabel: "Tambah Tutorial",
    columns: ["Judul", "Kategori", "Jumlah langkah"],
    rows: tutorials.map((tutorial) => ({
      id: tutorial.slug,
      cells: [tutorial.title, tutorial.category, `${tutorial.steps.length} langkah`],
      status: "Aktif",
    })),
  },
  {
    slug: "order-steps",
    label: "Alur Pemesanan",
    title: "Manajemen Alur Pemesanan",
    description:
      "Ubah judul, deskripsi, dan urutan langkah transaksi di website.",
    actionLabel: "Simpan Urutan",
    columns: ["Nomor", "Judul", "Keterangan"],
    rows: orderSteps.map((step) => ({
      id: step.number,
      cells: [step.number, step.title, step.description],
      status: "Aktif",
    })),
    canDelete: false,
  },
  {
    slug: "whatsapp-templates",
    label: "Template WhatsApp",
    title: "Manajemen Template WhatsApp",
    description:
      "Atur pola pesan CTA dengan placeholder seperti {product_name}.",
    actionLabel: "Tambah Template",
    columns: ["Nama template", "Kategori", "Pola pesan"],
    rows: whatsappTemplates.map((template) => ({
      id: template.id,
      cells: [template.name, template.category, template.message],
      status: "Aktif",
    })),
  },
];

export const dashboardStats = [
  { label: "Produk", value: products.length, href: "/admin/products" },
  {
    label: "Testimoni",
    value: testimonials.length,
    href: "/admin/testimonials",
  },
  { label: "Tutorial", value: tutorials.length, href: "/admin/tutorials" },
  {
    label: "Template chat",
    value: whatsappTemplates.length,
    href: "/admin/whatsapp-templates",
  },
];

export function getAdminSection(slug: string) {
  return adminSections.find(
    (section): section is AdminSection & { slug: AdminSectionSlug } =>
      section.slug === slug,
  );
}
