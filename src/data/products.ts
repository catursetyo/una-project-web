import type { Product } from "@/src/types/product";

export const products: Product[] = [
  {
    slug: "jws-led-tv-32-inch",
    name: "JWS LED TV 32 Inch",
    category: "Jam Waktu Sholat",
    shortDescription:
      "Sistem informasi masjid berbasis Android TV untuk jadwal sholat, poster dakwah, dan video.",
    description:
      "JWS LED TV 32 Inch cocok untuk masjid atau mushola yang ingin menampilkan jadwal sholat dengan tampilan modern berbasis layar TV.",
    dimensions: '32"',
    features: [
      "Android TV atau Google TV terintegrasi",
      "Setting praktis via smartphone",
      "Tampilan jadwal sholat modern",
    ],
    priceStartFrom: 3700000,
    isFeatured: true,
  },
  {
    slug: "jws-p10-rgb-3-panel",
    name: "JWS P10 RGB 3 Panel",
    category: "Running Text LED",
    shortDescription:
      "Panel LED full color untuk jadwal sholat dan informasi berjalan.",
    description:
      "JWS P10 RGB 3 Panel memakai LED full color dengan frame aluminium hollow untuk tampilan informasi masjid yang jelas dan menarik.",
    dimensions: "100 x 20 cm",
    features: [
      "Panel LED full color",
      "Frame aluminium hollow",
      "Cocok untuk masjid, mushola, dan instansi",
    ],
    priceStartFrom: 1500000,
    isFeatured: true,
  },
  {
    slug: "jws-seven-segment-jumbo-25",
    name: 'JWS Seven Segment Jumbo 2,5"',
    category: "Jam Waktu Sholat",
    shortDescription:
      "Layar seven segment besar dengan tambahan panel running text P4.75.",
    description:
      "JWS Seven Segment Jumbo dibuat untuk kebutuhan visibilitas tinggi, cocok untuk ruangan luas dengan jarak pandang jauh.",
    dimensions: "120 x 60 cm",
    features: [
      "Angka seven segment besar",
      "Panel running text P4.75",
      "Kaca akrilik anti pecah",
    ],
    priceStartFrom: 3400000,
    isFeatured: true,
  },
];
