---
name: "UNA Project"
description: "Website katalog untuk jam waktu sholat digital, running text LED, dan display custom."
colors:
  background: "#f8f9fa"
  foreground: "#1b1b20"
  primary: "#7000ff"
  secondary: "#e1007e"
  tertiary: "#2b0066"
  surface: "#ffffff"
  border: "#e4e4e7"
  muted-text: "#52525b"
  soft-text: "#71717a"
typography:
  display:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "clamp(3rem, 7vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "normal"
  headline:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 900
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section-y: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  card-product:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: UNA Project

## 1. Overview

**Creative North Star: "Meja Katalog Teknis"**

Sistem visual UNA Project harus terasa seperti meja katalog teknis yang rapi: produk ditata jelas, spesifikasi mudah dipindai, dan jalur konsultasi terlihat tanpa harus mencari. Desainnya brand-focused karena website ini membangun kepercayaan pertama sebelum customer menghubungi WhatsApp.

Identitas saat ini memakai permukaan terang, teks gelap, dan aksen ungu-magenta yang kuat. Warna utama boleh tegas, tetapi konten harus tetap service-first: produk, harga mulai, fitur, tutorial, dan alur pemesanan lebih penting daripada dekorasi.

Sistem ini menolak pola dari PRODUCT.md: "Struktur Google Sites lama dengan blok teks panjang", "Halaman katalog generik", "Pola commerce yang terlalu kompleks", serta "Tropes landing page dekoratif" yang tidak membantu customer memilih produk.

**Key Characteristics:**

- Katalog terang dengan kontras kuat dan CTA WhatsApp yang jelas.
- Hirarki tipografi tebal untuk nama produk, harga, dan tindakan.
- Layout card-based untuk produk, tetapi tidak boleh berubah menjadi grid kartu identik tanpa konteks.
- Motion ringan untuk membantu orientasi, bukan untuk menyembunyikan konten.
- Copy praktis, teknis, dan langsung ke kebutuhan pemasangan nyata.

## 2. Colors

Palet saat ini adalah neutral terang dengan aksen elektrik ungu-magenta. Gunakan warna sebagai penanda tindakan dan kategori, bukan sebagai dekorasi acak.

### Primary

- **Ungu Aktivasi** (#7000ff): warna utama untuk CTA, chip aktif, bullet produk, harga, dan state hover penting.

### Secondary

- **Magenta Sinyal** (#e1007e): aksen pendukung untuk momen brand yang lebih ekspresif. Gunakan hemat; jangan jadikan setiap section punya glow magenta.

### Tertiary

- **Ungu Dalam** (#2b0066): warna hover CTA dan selection text. Pakai untuk state aktif yang butuh kedalaman lebih dari primary.

### Neutral

- **Latar Katalog** (#f8f9fa): latar halaman dan permukaan section yang ringan.
- **Tinta Utama** (#1b1b20): warna body text utama di atas latar terang.
- **Permukaan Putih** (#ffffff): kartu, navbar, footer, dan panel konten.
- **Garis Zinc** (#e4e4e7): border netral untuk card, nav rail, dan pemisah.
- **Teks Penjelas** (#52525b): paragraf dan deskripsi panjang.
- **Teks Lembut** (#71717a): metadata, label harga kecil, dan catatan sekunder.

### Named Rules

**The Action Color Rule.** Primary dipakai untuk tindakan dan fakta penting; jika semua elemen ungu, tidak ada yang terasa penting.

**The Plain Surface Rule.** Mayoritas halaman tetap terang dan tenang agar detail produk, harga, dan CTA lebih mudah dipindai.

## 3. Typography

**Display Font:** Geist dengan fallback Arial, Helvetica, sans-serif  
**Body Font:** Geist dengan fallback Arial, Helvetica, sans-serif  
**Label/Mono Font:** Geist Mono hanya untuk potongan teknis seperti kode atau highlight setting.

**Character:** Tipografi UNA Project tebal, bersih, dan teknis. Berat font tinggi memberi rasa yakin, sementara body text tetap biasa agar halaman tidak terasa berteriak.

### Hierarchy

- **Display** (900, clamp(3rem, 7vw, 4.5rem), 0.95): hero title dan brand name utama.
- **Headline** (900, clamp(2.25rem, 5vw, 3rem), 1.1): judul halaman dan section penting.
- **Title** (900, 1.25rem-1.5rem, 1.25): nama produk, card title, dan judul step.
- **Body** (400-600, 1rem, 1.6): deskripsi produk, tutorial, dan penjelasan alur. Batasi panjang paragraf sekitar 65-75ch.
- **Label** (800-900, 0.75rem-0.875rem, tracking 0.08em-0.16em): chip kategori, CTA, dan label pendek.

### Named Rules

**The Practical Label Rule.** Label uppercase hanya boleh memberi orientasi singkat seperti kategori atau status. Jangan menambah tiny section eyebrow berulang sebagai dekorasi otomatis.

**The No Crammed Display Rule.** Display text tidak boleh lebih rapat dari letter-spacing normal sampai -0.03em; keterbacaan lebih penting daripada efek poster.

## 4. Elevation

Sistem sekarang memakai border halus, permukaan putih, dan shadow berwarna primary untuk memberi rasa interaktif. Arah berikutnya harus lebih disiplin: depth dipakai untuk state dan pemisahan konten, bukan untuk membuat setiap card mengambang.

### Shadow Vocabulary

- **Surface Low** (`box-shadow: 0 1px 2px rgb(112 0 255 / 5%)`): nav container, feature card ringan, dan badge kecil.
- **Accent Button** (`box-shadow: 0 10px 15px rgb(112 0 255 / 20%)`): CTA utama dan chip aktif.
- **Ambient Card Glow** (`box-shadow: 0 25px 50px rgb(112 0 255 / 5%)`): pola yang sudah ada pada beberapa card besar; gunakan sebagai batas atas sementara, bukan default baru.

### Named Rules

**The Shadow Diet Rule.** Jangan menggabungkan border dekoratif dengan shadow blur besar pada card baru. Pilih border yang jelas atau shadow ketat, kecuali saat hover state benar-benar membutuhkan depth.

## 5. Components

### Buttons

- **Shape:** rounded teknis yang nyaman (12px).
- **Primary:** background primary, teks putih, padding 14px 20px, font-weight 900, tracking 0.08em.
- **Hover / Focus:** primary boleh bergeser ke tertiary; fokus harus tetap terlihat dengan ring kontras.
- **Secondary / Outline:** border primary 2px, teks primary, hover berubah menjadi primary dengan teks putih.

### Chips

- **Style:** pill untuk kategori dan filter. Chip aktif memakai primary solid; chip nonaktif memakai surface putih dengan border primary transparan.
- **State:** `aria-pressed` dipakai pada filter katalog agar state interaktif terbaca secara aksesibel.

### Cards / Containers

- **Corner Style:** product card memakai 16px; feature card dan media placeholder memakai 12px.
- **Background:** surface putih untuk card utama; background netral untuk inner panel.
- **Shadow Strategy:** pakai Surface Low atau Accent Button. Ambient Card Glow hanya untuk card besar yang memang butuh emphasis.
- **Border:** gunakan zinc border atau primary tint ringan. Jangan gunakan side-stripe border.
- **Internal Padding:** 20px di mobile, 24px-32px di layar lebih besar.

### Inputs / Fields

Belum ada input form utama dalam MVP. Jika nanti ditambahkan, field harus tetap sederhana: surface putih, border zinc, radius 12px, focus ring primary yang jelas, dan label deskriptif.

### Navigation

Navbar sticky memakai surface putih transparan, border bawah zinc, dan link pill yang punya underline motion kecil saat hover. Mobile navigation saat ini horizontal-scroll; jaga label tetap pendek agar tidak menumpuk.

### Media Placeholders

Placeholder produk dan tutorial memakai grid panel halus untuk memberi konteks display LED sebelum aset asli tersedia. Saat foto produk asli tersedia, placeholder harus diganti dengan gambar lokal yang punya alt text deskriptif.

## 6. Do's and Don'ts

### Do:

- **Do** buat keputusan produk mudah dipahami: nama, kategori, fitur, harga mulai, dan CTA harus terlihat dalam satu scan.
- **Do** gunakan #7000ff untuk tindakan utama, harga, bullet, dan chip aktif.
- **Do** pertahankan body text gelap di atas latar terang agar kontras tetap kuat.
- **Do** gunakan komponen data-driven untuk katalog; tampilan card menerima data dari parent, bukan hardcoded langsung di UI.
- **Do** hormati reduced motion; konten tidak boleh kosong kalau animasi tidak berjalan.

### Don't:

- **Don't** ulangi "Struktur Google Sites lama dengan blok teks panjang, hirarki lemah, navigasi kurang jelas, dan panduan transaksi yang tidak rapi."
- **Don't** membuat "Halaman katalog generik yang membuat semua produk terasa sama dan tidak membantu pengunjung menentukan langkah berikutnya."
- **Don't** menambah "Pola commerce yang terlalu kompleks sebelum MVP membutuhkannya, seperti cart, login, payment gateway, dashboard, atau CMS."
- **Don't** memakai "Tropes landing page dekoratif" seperti tiny section eyebrow yang berulang, gradient text, glass effect berlebihan, atau metrik ala SaaS yang kabur.
- **Don't** sembunyikan fakta penting produk di balik teks kontras rendah, gambar tanpa alt text, atau CTA yang tidak deskriptif.
