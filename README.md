# UNA Project Web

Remake modern website dan katalog digital UNA Project untuk produk jam waktu sholat digital, running text LED, JWS RGB, Android TV, dan layanan instalasi. 

Proyek ini berevolusi dari landing page statis menjadi **Full-Stack Decoupled Web Application** (Next.js Frontend di Vercel + Golang REST API Backend di Google Cloud Run + PostgreSQL di Supabase) yang dilengkapi dengan Admin Dashboard untuk manajemen konten UMKM.

## Menjalankan Proyek (Frontend)

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

## Struktur Proyek

```txt
docs/                  Dokumentasi produk, arsitektur backend, dan design system
src/app/               Route dan layout Next.js (termasuk /admin untuk dashboard)
src/components/layout/ Komponen layout global
src/components/products/ Komponen domain katalog produk
src/components/sections/  Section landing page
src/components/tutorials/ Komponen domain tutorial
src/components/ui/        Komponen UI yang dipakai ulang
src/data/              Data statis awal / fallback data
src/lib/               Helper umum (WhatsApp link builder, API fetcher)
src/types/             TypeScript types (Product, Tutorial, Testimonial, dll.)
```

## Dokumentasi Modular

Panduan lengkap mengenai produk, desain visual, arsitektur backend, dan deployment dapat dibaca pada folder `/docs`:

- [Product Brief](docs/PRODUCT.md) — Tujuan bisnis dan persona pengguna
- [Visual Design System](docs/DESIGN.md) — Panduan desain visual dan UI Admin Dashboard
- [Backend Architecture](docs/BACKEND_ARCHITECTURE.md) — Filosofi dan diagram arsitektur terpisah (Next.js + Golang)
- [Database Schema & ERD](docs/DATABASE_SCHEMA.md) — Skema PostgreSQL, ERD, dan SQL DDL
- [REST API Specification](docs/API_SPECIFICATION.md) — Spesifikasi endpoint publik dan terproteksi (/admin)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) — Panduan deploy gratis (Supabase, Cloud Run, Vercel)

Gunakan npm; proyek ini menyimpan dependency lock di `package-lock.json`.
