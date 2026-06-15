import type { Product } from "@/src/types/product";

export const products: Product[] = [
  {
    slug: "jws-led-tv-32-inch",
    name: "JWS LED TV 32 Inch",
    category: "Jam Waktu Sholat",
    shortDescription:
      "Aplikasi jadwal sholat berbasis Android TV atau Google TV untuk masjid dan mushola.",
    description:
      "JWS LED TV 32 Inch menampilkan jam, kalender, jadwal sholat, poster dakwah, video, dan informasi masjid melalui Android TV atau Google TV.",
    dimensions: '32"',
    features: [
      "Android TV atau Google TV 32 inch",
      "Lisensi aplikasi bergaransi",
      "Menampilkan jam, kalender, jadwal sholat, poster dakwah, dan video",
      "Cocok untuk mushola kantor atau masjid dengan jaringan internet",
      "Setting menggunakan smartphone",
      "Bonus desain poster dakwah dan video dakwah",
      "Harga termasuk instalasi dan garansi lisensi aplikasi",
    ],
    priceStartFrom: 3700000,
    variants: [
      {
        name: "Langsung instal tanpa STB",
        price: 3700000,
        description:
          "Aplikasi jam sholat langsung dipasang di Google TV. Instalasi lebih sederhana dan harga lebih hemat.",
      },
      {
        name: "Dengan STB",
        price: 4100000,
        description:
          "Aplikasi dipasang di STB sehingga TV dapat dimatikan saat tidak digunakan, sementara aplikasi tetap berjalan.",
      },
    ],
    isFeatured: true,
  },
  {
    slug: "lisensi-key-activation-jws-android-tv",
    name: "Lisensi Key Activation JWS Android TV",
    category: "Lisensi Aplikasi",
    shortDescription:
      "Lisensi aplikasi jam waktu sholat digital untuk Android TV atau Google TV yang sudah dimiliki customer.",
    description:
      "Lisensi ini cocok jika Anda sudah memiliki Android TV atau Google TV dan ingin menggunakannya sebagai display jadwal waktu sholat digital.",
    features: [
      "Lisensi bergaransi dan berlaku seumur hidup",
      "Dapat dipasang di berbagai ukuran LED TV mulai 24 inch hingga 48 inch",
      "Resolusi HD",
      "Dipandu cara setting hingga mahir",
      "Bonus poster dakwah",
      "Bonus video dakwah",
    ],
    priceStartFrom: 1300000,
    variants: [
      {
        name: "Lisensi Key Activation",
        price: 1300000,
      },
    ],
  },
  {
    slug: "jws-rgb-2-panel-frame-figura-100x50",
    name: "JWS RGB 2 Panel Frame Figura 100x50 cm",
    category: "Jam Waktu Sholat",
    shortDescription:
      "JWS full color dengan frame figura, poster masjid, dan setting via smartphone.",
    description:
      "Produk JWS RGB 2 panel dengan frame figura dan poster masjid, cocok untuk masjid atau mushola yang membutuhkan tampilan jadwal sholat berwarna.",
    dimensions: "100 x 50 cm",
    features: [
      "Frame figura ketebalan 4 cm",
      "Terdapat poster masjid",
      "2 panel P5 RGB full color",
      "Setting menggunakan smartphone Android",
      "Akurasi tinggi dengan sistem GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 1600000,
    variants: [
      {
        name: "Versi biasa",
        price: 1600000,
      },
      {
        name: "Versi auto murotal",
        price: 1900000,
      },
    ],
    isFeatured: true,
  },
  {
    slug: "jws-2-panel-rgb-frame-aluminium",
    name: "JWS 2 Panel RGB Frame Aluminium",
    category: "Jam Waktu Sholat",
    shortDescription:
      "JWS RGB ukuran ringkas dengan frame aluminium hollow dan akurasi GPS.",
    description:
      "JWS 2 panel RGB frame aluminium cocok untuk kebutuhan display jadwal sholat berwarna dengan ukuran lebih ringkas.",
    dimensions: "70 x 20 cm",
    features: [
      "Frame aluminium hollow 2 x 1 inch",
      "2 panel P5 RGB full color",
      "Setting menggunakan smartphone Android",
      "Akurasi tinggi menggunakan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 1200000,
    variants: [
      {
        name: "Versi biasa",
        price: 1200000,
      },
      {
        name: "Versi auto murotal",
        price: 1500000,
      },
    ],
  },
  {
    slug: "jws-1-warna-2-panel-frame-figura",
    name: "JWS 1 Warna 2 Panel Frame Figura",
    category: "Jam Waktu Sholat",
    shortDescription:
      "JWS single color dengan frame figura dan poster masjid.",
    description:
      "Produk JWS 1 warna 2 panel menggunakan panel P10 single color, frame figura, dan poster masjid untuk tampilan yang rapi.",
    dimensions: "100 x 50 cm",
    features: [
      "Frame figura ketebalan 4 cm",
      "Terdapat poster masjid",
      "2 panel P10 single color",
      "Setting menggunakan smartphone",
      "Akurasi tinggi dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 1400000,
    variants: [
      {
        name: "Versi biasa",
        price: 1400000,
      },
      {
        name: "Versi auto murotal",
        price: 1700000,
      },
    ],
  },
  {
    slug: "jws-p10-3-panel-satu-warna-frame-aluminium",
    name: "JWS P10 3 Panel Satu Warna Frame Aluminium",
    category: "Jam Waktu Sholat",
    shortDescription:
      "JWS single color 3 panel P10 dengan frame aluminium hollow.",
    description:
      "JWS P10 3 panel satu warna menggunakan frame aluminium hollow dan cocok untuk tampilan jadwal sholat sederhana.",
    dimensions: "100 x 20 cm",
    features: [
      "Frame aluminium hollow 2 x 1 inch",
      "3 panel P10 single color",
      "Setting menggunakan smartphone",
      "Akurasi tinggi dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 1200000,
    variants: [
      {
        name: "Versi biasa",
        price: 1200000,
      },
      {
        name: "Versi auto murotal",
        price: 1500000,
      },
    ],
  },
  {
    slug: "jam-digital-2-panel",
    name: "Jam Digital 2 Panel",
    category: "Jam Digital",
    shortDescription:
      "Jam digital 2 panel P10 single color tanpa jadwal sholat.",
    description:
      "Jam Digital 2 Panel menampilkan jam dan tanggal saja, cocok untuk kebutuhan display waktu sederhana tanpa jadwal sholat.",
    dimensions: "70 x 20 cm",
    features: [
      "2 panel P10 single color",
      "Frame aluminium hollow 2 x 1 inch",
      "Menampilkan jam dan tanggal",
      "Setting menggunakan smartphone",
      "Lebih akurat dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 700000,
    variants: [
      {
        name: "Jam digital 2 panel",
        price: 700000,
      },
    ],
  },
  {
    slug: "jws-p10-rgb-3-panel-frame-aluminium",
    name: "JWS P10 RGB 3 Panel Frame Aluminium",
    category: "Jam Waktu Sholat",
    shortDescription:
      "JWS RGB 3 panel untuk jam, tanggal, jadwal sholat, dan running text.",
    description:
      "JWS P10 RGB 3 Panel Frame Aluminium menampilkan jam, tanggal, jadwal sholat, dan teks berjalan dengan panel RGB.",
    dimensions: "100 x 20 cm",
    features: [
      "3 panel P10 1/8S RGB atau 3 panel P5 RGB",
      "Frame aluminium hollow 2 x 1 inch",
      "Menampilkan jam, tanggal, jadwal sholat, dan teks berjalan",
      "Setting menggunakan smartphone",
      "Lebih akurat dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 1500000,
    variants: [
      {
        name: "Versi biasa",
        price: 1500000,
      },
      {
        name: "Versi auto murotal",
        price: 1800000,
      },
    ],
    isFeatured: true,
  },
  {
    slug: "jws-rgb-5-panel-frame-aluminium",
    name: "JWS RGB 5 Panel Frame Aluminium",
    category: "Jam Waktu Sholat",
    shortDescription:
      "JWS RGB 5 panel dengan frame aluminium untuk display lebih panjang.",
    description:
      "JWS RGB 5 Panel Frame Aluminium cocok untuk masjid yang membutuhkan area teks berjalan lebih panjang.",
    dimensions: "165 x 20 cm",
    features: [
      "5 panel P10 1/8S RGB atau 3 panel P5 RGB",
      "Frame aluminium hollow 2 x 1 inch",
      "Menampilkan jam, tanggal, jadwal sholat, dan teks berjalan",
      "Setting menggunakan smartphone",
      "Lebih akurat dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 1900000,
    variants: [
      {
        name: "JWS RGB 5 panel",
        price: 1900000,
      },
    ],
  },
  {
    slug: "jws-rgb-10-panel-2-baris",
    name: "JWS RGB 10 Panel 2 Baris",
    category: "Jam Waktu Sholat",
    shortDescription:
      "JWS RGB 10 panel dua baris untuk tampilan informasi lebih besar.",
    description:
      "JWS RGB 10 Panel 2 Baris menyediakan area display lebih besar untuk jam, tanggal, jadwal sholat, dan teks berjalan.",
    dimensions: "165 x 35 cm",
    features: [
      "10 panel P10 1/8S RGB atau 3 panel P5 RGB",
      "Frame aluminium hollow 2 x 1 inch",
      "Menampilkan jam, tanggal, jadwal sholat, dan teks berjalan",
      "Setting menggunakan smartphone",
      "Lebih akurat dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 3100000,
    variants: [
      {
        name: "JWS RGB 10 panel 2 baris",
        price: 3100000,
      },
    ],
  },
  {
    slug: "jws-seven-segment-1-05-tanpa-running-text",
    name: 'JWS Seven Segment 1" & 0,5" Tanpa Running Text',
    category: "Seven Segment",
    shortDescription:
      "JWS seven segment dengan ukuran jam 1 inch dan jadwal sholat 0,5 inch tanpa running text.",
    description:
      "JWS Seven Segment 1 inch dan 0,5 inch tanpa running text cocok untuk masjid atau mushola yang membutuhkan tampilan jadwal sholat klasik.",
    dimensions: "80 x 40 cm",
    features: [
      "Frame figura ketebalan 4 cm",
      "Ukuran jam 1 inch",
      "Ukuran kalender dan jadwal sholat 0,5 inch",
      "Poster masjid dilengkapi lampu belakang",
      "Kaca akrilik lebih ringan dan aman",
      "Setting menggunakan smartphone",
      "Lebih akurat dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 2200000,
    variants: [
      {
        name: "Tanpa running text",
        price: 2200000,
      },
    ],
  },
  {
    slug: "jws-seven-segment-1-08-running-text",
    name: 'JWS Seven Segment 1" & 0,8" Dilengkapi Running Text',
    category: "Seven Segment",
    shortDescription:
      "JWS seven segment dengan running text 2 panel P4.75 single color.",
    description:
      "JWS Seven Segment 1 inch dan 0,8 inch dilengkapi running text, poster masjid, dan akurasi GPS.",
    dimensions: "100 x 50 cm",
    features: [
      "Frame figura ketebalan 4 cm",
      "Ukuran jam 1 inch",
      "Ukuran kalender dan jadwal sholat 0,8 inch",
      "Running text 2 panel P4.75 single color",
      "Poster masjid dilengkapi lampu belakang",
      "Kaca akrilik lebih ringan dan lebih kuat",
      "Setting menggunakan smartphone",
      "Akurasi tinggi dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 2600000,
    variants: [
      {
        name: "Versi biasa",
        price: 2600000,
      },
      {
        name: "Versi auto murotal",
        price: 2900000,
      },
    ],
  },
  {
    slug: "jws-seven-segment-25-1-tanpa-running-text",
    name: 'JWS Seven Segment 2,5" & 1" Tanpa Running Text',
    category: "Seven Segment",
    shortDescription:
      "JWS seven segment ukuran besar tanpa running text dengan poster masjid.",
    description:
      "JWS Seven Segment 2,5 inch dan 1 inch tanpa running text dibuat untuk visibilitas lebih tinggi dengan frame figura.",
    dimensions: "120 x 60 cm",
    features: [
      "Frame figura ketebalan 4 cm",
      "Ukuran jam 2,5 inch",
      "Ukuran kalender dan jadwal sholat 1 inch",
      "Poster masjid dilengkapi lampu belakang",
      "Kaca akrilik lebih ringan dan aman",
      "Setting menggunakan smartphone",
      "Lebih akurat dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 3000000,
    variants: [
      {
        name: "Versi biasa",
        price: 3000000,
      },
      {
        name: "Versi auto murotal",
        price: 3300000,
      },
    ],
  },
  {
    slug: "jws-seven-segment-jumbo-25-1-running-text",
    name: 'JWS Seven Segment Jumbo 2,5" & 1" Dilengkapi Running Text',
    category: "Seven Segment",
    shortDescription:
      "JWS seven segment jumbo dengan running text dan kaca akrilik anti pecah.",
    description:
      "JWS Seven Segment Jumbo dilengkapi running text 2 panel P4.75 single color, poster masjid, dan akurasi GPS.",
    dimensions: "120 x 60 cm",
    features: [
      "Frame figura ketebalan 4 cm lapis",
      "Ukuran jam 2,5 inch",
      "Ukuran kalender dan jadwal sholat 1 inch",
      "Running text 2 panel P4.75 single color",
      "Terdapat poster masjid",
      "Kaca akrilik anti pecah",
      "Setting menggunakan smartphone",
      "Akurasi tinggi dengan GPS",
      "Harga termasuk instalasi",
    ],
    priceStartFrom: 3400000,
    variants: [
      {
        name: "Versi biasa",
        price: 3400000,
      },
      {
        name: "Versi auto murotal",
        price: 3700000,
      },
    ],
    isFeatured: true,
  },
];
