# UNA Project Web

Remake modern website UNA Project untuk katalog jam waktu sholat digital,
running text LED, JWS RGB, Android TV, dan layanan instalasi.

## Menjalankan Proyek

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Perintah

```bash
npm run dev    # development server
npm run lint   # pemeriksaan ESLint
npm run build  # production build
npm run start  # menjalankan production build
```

## Struktur

```txt
docs/                  Dokumentasi produk dan design system
src/app/               Route dan layout Next.js
src/components/layout/ Komponen layout global
src/components/products/ Komponen domain katalog produk
src/components/sections/  Section landing page
src/components/tutorials/ Komponen domain tutorial
src/components/ui/        Komponen UI yang dipakai ulang
src/data/              Data statis produk, tutorial, dan landing page
src/lib/               Helper umum
src/types/             TypeScript types
```

Dokumentasi utama:

- [Product brief](docs/PRODUCT.md)
- [Visual design system](docs/DESIGN.md)

Gunakan npm; proyek ini menyimpan dependency lock di `package-lock.json`.
