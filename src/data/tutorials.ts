import type { Tutorial } from "@/src/types/tutorial";

export const tutorials: Tutorial[] = [
  {
    slug: "setting-jam-waktu-sholat",
    title: "Cara Setting Jam Waktu Sholat",
    category: "Jam Waktu Sholat",
    shortDescription:
      "Langkah dasar untuk menghubungkan perangkat dan membuka menu setting jam waktu sholat digital.",
    videoUrl: "https://youtu.be/Z7R_cdpNdpQ?si=RjrdDJPy3dKollhf",
    steps: [
      {
        title: "Hidupkan WiFi",
        description:
          "Pastikan WiFi di smartphone atau komputer sudah menyala.",
      },
      {
        title: "Hubungkan ke WiFi JWS",
        description:
          "Cari dan hubungkan perangkat ke jaringan WiFi jam waktu sholat.",
      },
      {
        title: "Masukkan Password",
        description: "Gunakan password standar perangkat.",
        highlight: "unaproject28",
      },
      {
        title: "Akses Menu Setting",
        description:
          "Buka browser dan masuk ke menu pengaturan jam waktu sholat.",
      },
      {
        title: "Atur Parameter",
        description:
          "Sesuaikan parameter seperti kota, zona waktu, iqomah, dan pengaturan lain sesuai kebutuhan.",
      },
    ],
  },
  {
    slug: "setting-running-text-jws",
    title: "Cara Setting Running Text JWS",
    category: "Running Text LED",
    shortDescription:
      "Panduan dasar untuk menghubungkan running text dan mengatur teks yang akan ditampilkan.",
    videoUrl: "https://youtu.be/muEazVfsELg?si=4kfd_nNxw4vKHiMs",
    steps: [
      {
        title: "Download Aplikasi",
        description: "Download aplikasi LedART melalui Google Play Store.",
      },
      {
        title: "Hubungkan WiFi",
        description:
          "Hubungkan perangkat ke WiFi running text. Biasanya diawali dengan nama jaringan HD_W02.",
      },
      {
        title: "Masukkan Password",
        description: "Gunakan password running text.",
        highlight: "unaproject28",
      },
      {
        title: "Konfigurasi Text",
        description:
          "Setelah terhubung, mulai atur teks yang akan ditampilkan pada panel running text.",
      },
    ],
  },
];
