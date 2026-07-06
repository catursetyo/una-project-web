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

export const adminModules = [
  {
    href: "/admin/products",
    label: "Produk",
    description:
      "Kelola katalog, harga mulai, varian, spesifikasi, dan status produk.",
  },
  {
    href: "/admin/testimonials",
    label: "Testimoni",
    description:
      "Atur dokumentasi pemasangan, gambar, keterangan, dan urutan tampil.",
  },
  {
    href: "/admin/tutorials",
    label: "Tutorial",
    description:
      "Kelola panduan penggunaan, video, dan langkah-langkah pengoperasian.",
  },
  {
    href: "/admin/order-steps",
    label: "Alur Pemesanan",
    description:
      "Ubah tujuh langkah transaksi yang hanya tampil pada halaman /order.",
  },
  {
    href: "/admin/whatsapp-templates",
    label: "Template WhatsApp",
    description:
      "Atur pola pesan CTA dengan placeholder seperti {product_name}.",
  },
] as const;
