# Kontrak Desain untuk AI Agent

Dokumen ini adalah sumber kebenaran visual UNA Project. Pertahankan identitas produk digital Islami dan perangkat LED; jangan mengubahnya menjadi SaaS generik atau toko online massal.

## Prinsip

- Presisi, amanah, teknis, modern, dan mudah didekati.
- Hierarki kuat, ruang antarbagian ringkas, serta copy mudah dipindai.
- Utamakan produk, harga mulai, dan konsultasi; dekorasi hanya mendukung.
- Mobile-first, semantic HTML, fokus keyboard terlihat, dan kontras terbaca.
- Gunakan Tailwind dan token yang sudah ada; hindari inline style besar.

## Token Utama

Gunakan token di `src/app/globals.css`, bukan membuat warna acak.

| Peran | Nilai |
| --- | --- |
| Deep green | `#0A211D` |
| Dark emerald | `#0F3A32` |
| Brand green | `#155A4C` |
| Gold CTA | `#E2B64D` |
| Gold light | `#F0C875` |
| Main text | `#111A10` |
| Muted text | `#5D685C` |
| Workspace soft | `#F2F6F5` / `#FAFAF5` |
| LED orange | `#FF5C33` |
| WhatsApp | `#1FAE5C` |

Aturan warna:

- CTA memakai warna solid, bukan gradient.
- Gold hanya untuk CTA dan aksen penting.
- Merah hanya untuk aksi destruktif atau error.
- Area gelap memakai teks putih dengan opacity yang tetap terbaca.

## Tipografi

- Heading/brand: Outfit melalui `font-heading`.
- Body/UI: Plus Jakarta Sans melalui `font-body` atau font default.
- Simulasi LED: VT323 melalui `font-led`.

Gunakan heading berurutan dan hindari body text lebih kecil dari `text-sm` untuk konten utama.

## Layout

- Container publik: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`.
- Section umum: `py-12 sm:py-14 lg:py-16`.
- Strip ringkas: `py-6 sm:py-7`.
- Product grid: 1 kolom mobile, 2 tablet, 3 desktop.
- Stats: 2 kolom mobile, 4 desktop.
- Jangan memakai fixed page width atau absolute positioning untuk layout utama.

## Kontrak Halaman Publik

### Navbar

- Dark green, sticky, logo, navigasi inti, dan CTA WhatsApp solid gold.
- Mobile menu harus dapat dibuka dengan keyboard dan memiliki `aria-expanded`.

### Hero

Hero hanya berisi:

1. Judul `UNA Project`.
2. Subtitle singkat.
3. Jam digital dan running text.
4. Tanda panah menuju stats di bagian bawah viewport hero.

Jangan menambahkan CTA, trust badges, spesifikasi, atau jadwal sholat ke hero tanpa instruksi baru.

Simulasi JWS memakai frame metalik, layar gelap, dot matrix, `font-led`, waktu besar, dan marquee CSS. Jam harus responsif dan tidak overflow pada mobile.

### Stats

Tampilkan:

- `15+` tipe produk;
- `100+` masjid dan mushola;
- `GPS` akurasi lokasi;
- `Rp. 0` biaya setting.

Angka dan komponen hero dianimasikan setiap masuk kembali ke viewport. Gunakan CSS, `IntersectionObserver`, dan `requestAnimationFrame` yang sudah ada; jangan menambah animation library.

### Why Section

- Label: `Kenapa UNA Project?` tanpa border dekoratif.
- Copy di kiri dan empat feature card di kanan pada desktop.
- Card putih, border halus, ikon dark green/gold.

### Katalog Produk

- Background lembut dan grid responsif.
- Card berisi preview LED, kategori, nama, deskripsi singkat, harga mulai, varian opsional, dan link detail.
- Sumber konten adalah `src/data/products.ts`, bukan JSX berulang.
- CTA katalog lengkap menuju `/product`.

### Alur Pemesanan

Tiga langkah: konsultasi, pilih tipe/ukuran, instalasi/aktivasi. Jangan menambahkan paragraf pembuka yang sudah dihapus user.

### Testimoni

Heading hanya `Testimoni`. Selama media asli belum tersedia, gunakan placeholder gambar dengan judul dan keterangan singkat; jangan mengarang identitas atau kutipan customer.

### Final CTA dan Footer

- Final CTA dark green dengan tombol WhatsApp solid gold dan katalog outline.
- Footer near-black green, empat kelompok informasi, tanpa social placeholder palsu.
- Jangan menampilkan teks portfolio remake pada footer.

### Floating WhatsApp

- Fixed kanan bawah, ukuran sentuh minimal 44px, `aria-label` deskriptif.
- Jangan menutupi CTA atau navigasi mobile.

## Kontrak Dashboard Admin

- Dashboard production diakses melalui `admin.unaproject.my.id`; link kembali ke website harus menuju `https://unaproject.my.id`.
- Sidebar/topbar: deep green; workspace: cream/soft; surface: putih dengan border halus.
- Table memakai HTML `<table>` dan horizontal scroll pada mobile.
- Status memakai badge `Aktif`, `Draft`, dan `Unggulan`.
- Primary save/create: solid gold. Secondary: solid deep green.
- Delete: merah, wajib konfirmasi sebelum request.
- Input memiliki label, placeholder yang berguna, error message, dan focus ring.
- Template WhatsApp menampilkan preview hasil placeholder seperti `{product_name}`.
- Jangan tampilkan aksi sebagai berhasil sebelum API mengonfirmasi.

## Motion

Motion yang diizinkan:

- hover/focus transition singkat;
- marquee LED;
- entrance hero;
- counting stats;
- scroll cue.

Semua motion harus menghormati `prefers-reduced-motion`. Hindari animasi layout berat, parallax, dan library baru.

## Accessibility

- Gunakan `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<a>`, dan `<button>` sesuai fungsi.
- Icon-only action wajib memiliki accessible name.
- Gambar konten memiliki alt; dekorasi memakai alt kosong.
- Target sentuh minimal 44px.
- Jangan memakai clickable `<div>`.
- Jangan menyampaikan status hanya melalui warna.

## Checklist Agent

Sebelum selesai:

- Bandingkan desktop dan mobile.
- Pastikan tidak ada horizontal overflow.
- Periksa fokus keyboard dan reduced motion.
- Pastikan link WhatsApp memakai helper yang sudah ada.
- Jalankan `npm run lint` dan `npm run build`.
