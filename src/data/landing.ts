export type IconName =
  | "gps"
  | "phone"
  | "audio"
  | "panel";

export const stats: { value: string; accent?: string; label: string }[] = [
  { value: "15", accent: "+", label: "Tipe produk tersedia" },
  { value: "100", accent: "+", label: "Masjid & mushola terlayani" },
  { value: "GPS", label: "Akurasi otomatis lokasi" },
  { value: "Rp. ", accent: "0", label: "Biaya setting tambahan" },
];

export const whyFeatures: {
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "gps",
    title: "Akurasi GPS otomatis",
    description:
      "Jadwal sholat menyesuaikan lokasi tanpa hitung manual dan tanpa update tahunan.",
  },
  {
    icon: "phone",
    title: "Setting dari smartphone",
    description:
      "Atur jam, iqomah, dan teks berjalan langsung dari HP melalui koneksi perangkat.",
  },
  {
    icon: "audio",
    title: "Pilihan auto-murotal",
    description:
      "Murotal otomatis menjelang azan untuk membantu mengingatkan jamaah.",
  },
  {
    icon: "panel",
    title: "Panel siap dipasang",
    description:
      "Pilihan frame figura, aluminium, RGB, single color, sampai Android TV.",
  },
];

export const orderSteps = [
  {
    number: "01",
    title: "Konsultasi via WhatsApp",
    description:
      "Ceritakan kebutuhan tempat, ukuran ruang, anggaran, dan fitur yang diinginkan.",
  },
  {
    number: "02",
    title: "Pilih tipe & ukuran",
    description:
      "UNA Project bantu rekomendasikan tipe JWS yang sesuai lengkap dengan estimasi harga.",
  },
  {
    number: "03",
    title: "Instalasi & aktivasi",
    description:
      "Produk dipasang, GPS disetel, dan pengguna dipandu sampai paham pengoperasian dasar.",
  },
];

type TestimonialPlaceholder = {
  title: string;
  description: string;
  imageAlt: string;
};

export const testimonials: TestimonialPlaceholder[] = [
  {
    title: "Pemasangan JWS Digital",
    description: "Dokumentasi produk setelah terpasang dan aktif di lokasi.",
    imageAlt: "Placeholder foto pemasangan JWS Digital",
  },
  {
    title: "Panel Running Text",
    description: "Dokumentasi tampilan running text sesuai kebutuhan pelanggan.",
    imageAlt: "Placeholder foto panel running text",
  },
  {
    title: "Pengaturan Perangkat",
    description: "Dokumentasi proses aktivasi dan pengaturan perangkat.",
    imageAlt: "Placeholder foto pengaturan perangkat JWS",
  },
];
