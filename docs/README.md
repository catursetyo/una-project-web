# Panduan Development untuk AI Agent

Dokumen ini adalah pintu masuk AI agent sebelum mengubah UNA Project. Aturan umum tetap berada di [`../AGENTS.md`](../AGENTS.md); folder `docs/` menjelaskan keputusan produk dan kontrak teknis.

## Urutan Sumber Kebenaran

Gunakan urutan berikut ketika ada perbedaan informasi:

1. Instruksi user pada task aktif.
2. [`../AGENTS.md`](../AGENTS.md).
3. Dokumen domain di folder ini.
4. Implementasi dan konfigurasi aktual di repository.

Jika dokumen dan implementasi berbeda, jangan menebak. Jelaskan perbedaannya, lalu buat perubahan terkecil yang memenuhi task.

## Peta Dokumen

| Task | Wajib dibaca |
| --- | --- |
| UI, copy, responsive, animation | [`PRODUCT.md`](PRODUCT.md), [`DESIGN.md`](DESIGN.md) |
| Next.js route, layout, metadata, Image, Link | Panduan lokal `node_modules/next/dist/docs/` |
| Fetch data atau integrasi admin | [`API_SPECIFICATION.md`](API_SPECIFICATION.md), [`BACKEND_ARCHITECTURE.md`](BACKEND_ARCHITECTURE.md) |
| Model data atau perubahan persistence | [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md), [`API_SPECIFICATION.md`](API_SPECIFICATION.md) |
| Environment atau deployment | [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) |

## Workflow Wajib

1. Jalankan `git status --short`; perubahan yang sudah ada adalah milik user.
2. Baca file yang akan disentuh beserta caller, data source, dan type terkait.
3. Untuk API Next.js, baca dokumentasi versi yang terpasang sebelum coding.
4. Nyatakan asumsi hanya jika tidak dapat ditemukan dari repository.
5. Implementasikan perubahan terkecil pada sumber masalah.
6. Jangan menambahkan dependency, backend, database, atau layanan baru tanpa kebutuhan task.
7. Validasi sesuai risiko; untuk perubahan frontend minimal jalankan `npm run lint` dan `npm run build`.
8. Laporkan file, alur data, hasil validasi, dan batasan yang masih nyata.

## Batas Tanggung Jawab Repository

Repository ini berisi frontend Next.js. Target arsitektur menyebut backend Golang dan PostgreSQL sebagai sistem terpisah; keberadaan keduanya tidak boleh diasumsikan.

- Gunakan data lokal selama API belum tersedia.
- Jangan membuat CRUD seolah berhasil bila persistence belum terhubung.
- Jangan menyimpan JWT di `localStorage`; integrasi auth harus memakai cookie `httpOnly`, `Secure`, dan `SameSite` yang sesuai.
- Jangan menaruh `DATABASE_URL`, `JWT_SECRET`, atau credential lain pada variabel `NEXT_PUBLIC_*`.
- Perubahan deployment atau data produksi membutuhkan izin eksplisit user.

## Definition of Done

- Scope user terpenuhi tanpa perubahan tak terkait.
- UI responsif, semantik, keyboard-friendly, dan menghormati reduced motion.
- Kontrak TypeScript, REST API, dan database tetap selaras.
- Tidak ada secret, credential, atau data pribadi yang masuk commit/output.
- Lint dan build lolos, atau blocker eksternal dilaporkan dengan jelas.

## Format Handoff Agent

Gunakan ringkasan singkat:

```md
Hasil: perubahan utama.
File: file yang diubah.
Validasi: command dan hasil.
Batasan: hal yang belum dapat aktif beserta alasannya.
```
