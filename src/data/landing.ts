export type IconName =
  | "gps"
  | "phone"
  | "shield"
  | "install"
  | "audio"
  | "panel"
  | "warranty";

export const heroTrustItems: { icon: IconName; label: string }[] = [
  { icon: "gps", label: "Akurasi GPS" },
  { icon: "phone", label: "Setting via HP" },
  { icon: "shield", label: "Garansi resmi" },
  { icon: "install", label: "Termasuk instalasi" },
];

export const stats = [
  { value: "15+", label: "Tipe produk tersedia" },
  { value: "100+", label: "Masjid & mushola terlayani" },
  { value: "GPS", label: "Akurasi otomatis lokasi" },
  { value: "0", label: "Biaya setting tambahan" },
];

export const trustBadges: { icon: IconName; label: string }[] = [
  { icon: "gps", label: "Jadwal sholat akurasi GPS" },
  { icon: "phone", label: "Atur langsung dari HP" },
  { icon: "audio", label: "Fitur auto-murotal" },
  { icon: "warranty", label: "Garansi resmi produk" },
  { icon: "install", label: "Harga termasuk instalasi" },
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

export const murotalBenefits = [
  "Aktif otomatis mengikuti jadwal sholat lokasi",
  "Tersedia untuk banyak tipe panel RGB dan figura",
  "Selisih harga mulai dari varian auto-murotal",
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

export const testimonials = [
  {
    quote:
      "Sejak pasang JWS, jadwal sholat selalu terlihat jelas dan jamaah lebih mudah mengikuti waktu iqomah.",
    name: "Ust. Hadi",
    role: "Takmir Masjid Al-Ikhlas",
    initials: "UH",
  },
  {
    quote:
      "Settingnya gampang dari HP. Fitur auto-murotal juga membantu suasana mushola lebih siap menjelang azan.",
    name: "Pak Joko",
    role: "Pengurus Mushola Babussalam",
    initials: "PJ",
  },
  {
    quote:
      "Pemasangan rapi, komunikasinya jelas, dan rekomendasi tipe produknya pas dengan anggaran masjid.",
    name: "Bu Sari",
    role: "Bendahara Masjid Nurul Iman",
    initials: "BS",
  },
];
