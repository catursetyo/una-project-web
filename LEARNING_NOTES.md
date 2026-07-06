# Learning Notes

## 1. Kondisi Arsitektur Saat Ini

Project menggunakan monorepo sederhana:

```text
src/                 frontend Next.js di root repository
backend/             lokasi Golang API ketika mulai dibuat
docs/                kontrak produk, API, database, deployment, dan security
```

Frontend tetap di root agar project Vercel yang sudah berjalan tidak perlu dipindahkan. Folder `backend/` belum dibuat karena backend Golang memang belum diimplementasikan; dokumentasi tidak boleh dianggap sebagai backend yang sudah aktif.

Domain production:

```text
https://unaproject.my.id          website publik
https://admin.unaproject.my.id    dashboard admin
```

Kedua domain memakai project Next.js/Vercel yang sama. Subdomain hanya memisahkan pengalaman dan cookie; subdomain bukan sistem autentikasi.

## 2. Dokumentasi AI Agent dan Security

File baru [`docs/WEB_SECURITY.md`](docs/WEB_SECURITY.md) menjadi aturan wajib sebelum agent mengubah auth, admin, API, database, upload, secret, atau deployment.

Panduan tersebut menjelaskan:

- trust boundary browser, Next.js, Golang, dan PostgreSQL;
- penyimpanan secret dan environment variable;
- session cookie host-only;
- authentication dan authorization berlapis;
- CSRF, CORS, XSS, SSRF, SQL injection, dan upload security;
- response headers, cache, dependency, logging, serta incident response;
- checklist keamanan sebelum handoff.

Dokumen berikut diselaraskan dengan monorepo dan dua subdomain:

- `AGENTS.md` — mewajibkan pembacaan security guide dan menjelaskan struktur monorepo.
- `docs/README.md` — menambahkan routing dokumen security.
- `docs/PRODUCT.md` dan `docs/DESIGN.md` — menetapkan host dashboard.
- `docs/BACKEND_ARCHITECTURE.md` — menjelaskan boundary folder dan cookie host-only.
- `docs/API_SPECIFICATION.md` — menetapkan BFF Next.js serta response login dan `/auth/me`.
- `docs/DEPLOYMENT_GUIDE.md` — memperbarui environment, domain, dan smoke test.
- `README.md` — memperbarui gambaran struktur project.

## 3. Routing Subdomain Admin

`next.config.ts` sekarang memiliki redirect berbasis host:

```text
admin.unaproject.my.id/
  -> /admin
```

Redirect dipilih daripada rewrite agar URL browser berubah ke route nyata `/admin` dan tidak menimbulkan perbedaan pathname ketika hydration.

Environment yang dipakai:

```env
ADMIN_HOST=admin.unaproject.my.id
PUBLIC_SITE_URL=https://unaproject.my.id
API_URL=https://<cloud-run-service>/v1
```

Pada local development:

```env
ADMIN_HOST=admin.localhost
PUBLIC_SITE_URL=http://localhost:3000
API_URL=http://localhost:8080/v1
```

Link “Lihat situs” dan logo pada login memakai `PUBLIC_SITE_URL`. Link relatif `/` tidak digunakan karena pada subdomain admin URL tersebut kembali diarahkan ke dashboard.

## 4. Security Headers dan Cache

`next.config.ts` menambahkan baseline header:

- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy` untuk kamera, mikrofon, dan geolocation;
- `Cross-Origin-Opener-Policy: same-origin`;
- HSTS satu tahun;
- `Cache-Control: private, no-store` untuk seluruh `/admin/*`.

CSP belum ditambahkan. CSP yang benar harus dibuat setelah seluruh origin script, analytics, image, font, dan API final diketahui; CSP tebakan sering merusak aplikasi tanpa memberi perlindungan yang konsisten.

## 5. Alur Login Admin

Login sekarang memakai Server Action di `src/app/admin/actions.ts`:

```text
Form login
  -> login(FormData) pada server Next.js
  -> POST API_URL/auth/login
  -> parser memastikan data.token valid
  -> token disimpan sebagai cookie HttpOnly
  -> redirect ke /admin
```

Cookie `una_admin_session` memiliki:

- `httpOnly: true`, sehingga JavaScript browser tidak dapat membacanya;
- `secure: true` ketika production;
- `sameSite: lax` untuk menurunkan risiko CSRF;
- `path: /`;
- tanpa atribut `domain`, sehingga cookie host-only;
- masa hidup delapan jam, tidak lebih panjang dari target token backend.

Form membatasi panjang email/password dan menampilkan error generik. Error tidak membedakan email tidak terdaftar dengan password salah agar tidak memudahkan account enumeration.

Jika `API_URL` belum tersedia, form login dinonaktifkan dan dashboard tetap tertutup. Ini adalah perilaku fail-closed.

## 6. Session Verification dan Route Guard

`src/lib/adminSession.ts` bertindak sebagai Data Access Layer kecil:

1. Membaca cookie dengan API `cookies()` Next.js yang asynchronous.
2. Mengirim Bearer token ke `GET API_URL/auth/me`.
3. Memberi timeout lima detik dan `cache: no-store`.
4. Mengembalikan DTO minimal `id`, `name`, dan `email`.
5. Mengembalikan `null` untuk token kosong, API error, timeout, atau payload invalid.

Layout dashboard memanggil `verifyAdminSession()` sebelum merender `AdminShell`. Session invalid diarahkan ke `/admin/login`.

Pengecekan layout bukan authorization final. Nantinya setiap Server Action CRUD tetap harus memanggil `verifyAdminSession()`, dan Golang API tetap wajib memverifikasi JWT serta role admin.

## 7. Perubahan UI Dashboard

- Tautan “Buka pratinjau dashboard” yang melewati login dihapus.
- Tombol login aktif hanya ketika `API_URL` tersedia.
- Error login memakai `role="alert"` dan terhubung ke input melalui `aria-describedby`.
- Header dashboard menampilkan nama/initial admin dari `/auth/me`.
- Sidebar menampilkan email session dan tombol logout.
- Logout menghapus cookie melalui Server Action lalu kembali ke login.
- Status integrasi tidak lagi menampilkan URL API ke UI.
- Tombol CRUD masih dinonaktifkan karena endpoint dan persistence belum tersedia; UI tidak memalsukan keberhasilan mutation.

## 8. Parser Boundary dan Test

`src/lib/adminAuth.mjs` hanya menerima bentuk response yang terdokumentasi:

- login harus memiliki `data.token` string;
- `/auth/me` harus memiliki `data.id` dan `data.email` string;
- hanya `id`, `email`, dan `name` yang diteruskan ke UI;
- field sensitif atau tambahan dari API tidak ikut dikembalikan.

`src/lib/adminAuth.test.mjs` menguji payload valid, payload rusak, token kosong, DTO aman, dan normalisasi URL API. Script test sekarang menjalankan seluruh `src/lib/*.test.mjs`.

## 9. Perlindungan Credential

`.gitignore` sebelumnya sudah mengabaikan seluruh `.env*`, database dump, dan `*.pem`. Pattern berikut ditambahkan untuk credential yang belum tercakup:

```text
*.key
*.p12
*.pfx
credentials*.json
service-account*.json
gcloud-service-key*.json
```

Nilai credential asli tidak dibuat atau dimasukkan ke repository.

## 10. Batasan yang Masih Ada

- Database Supabase dan credential lokal tetap harus disiapkan oleh developer.
- Login baru dapat bekerja setelah migration dijalankan dan akun admin dibuat.
- Data dashboard masih berasal dari file lokal.
- Create, update, delete, upload media, rate limiting, dan audit log belum diimplementasikan.
- CSP ditunda sampai daftar origin production final.

Urutan lanjutan yang aman:

1. Jalankan migration dan buat admin pada Supabase development.
2. Verifikasi login lokal dari `admin.localhost:3000`.
3. Deploy API dan atur `API_URL` server-only pada Vercel.
4. Verifikasi login dan cookie pada `admin.unaproject.my.id`.
5. Hubungkan endpoint list admin.
6. Implementasikan mutation satu resource terlebih dahulu, dimulai dari produk.
7. Tambahkan upload setelah storage dan validasi file ditentukan.

## 11. Cara Verifikasi

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Smoke test yang perlu diperiksa:

- `/admin` tanpa session mengarah ke `/admin/login`;
- login disabled ketika `API_URL` kosong;
- credential salah menghasilkan pesan generik;
- session valid menampilkan profil admin;
- logout menghapus cookie;
- response `/admin/*` memakai `Cache-Control: private, no-store`;
- root `admin.unaproject.my.id` mengarah ke `/admin`;
- halaman publik tetap berjalan di `unaproject.my.id`.

Hasil verifikasi perubahan ini:

- `npm test`: 2 test lulus;
- `npm run lint`: lulus;
- `npx tsc --noEmit`: lulus;
- `npm run build`: lulus, seluruh route admin menjadi dynamic;
- smoke test HTTP: public `200`, root admin host `307 -> /admin`, admin tanpa session `307 -> /admin/login`, login `200` dan `no-store`.

## 12. Backend Authentication Golang

Backend sekarang berada di `backend/` dan sengaja memakai library minimum:

- `net/http` untuk routing dan server;
- `pgxpool` untuk PostgreSQL;
- `bcrypt` untuk password hash;
- `golang-jwt/jwt` untuk JWT HS256;
- `x/term` hanya untuk input password CLI tanpa echo.

Endpoint yang tersedia:

```text
GET  /healthz
POST /v1/auth/login
GET  /v1/auth/me
```

### Login Flow

1. Body dibatasi 16 KiB dan decoder menolak field JSON yang tidak dikenal.
2. Email dinormalisasi dan password dibatasi maksimal 72 byte sesuai batas bcrypt.
3. Email yang tidak ditemukan tetap menjalankan bcrypt terhadap dummy hash agar timing tidak langsung membocorkan keberadaan akun.
4. Limiter global per instance membatasi 10 percobaan per menit.
5. Login valid menghasilkan JWT dengan subject admin ID, role `admin`, issuer, audience, issued-at, dan expiry.
6. Error credential selalu memakai pesan generik.

### Session Verification

`GET /v1/auth/me` memverifikasi signature, algoritma HS256, issuer, audience, expiry, role, dan subject. Setelah token valid, admin dibaca ulang dari PostgreSQL. Karena itu, menghapus admin dari database juga menghentikan akses token lama.

Response hanya mengirim DTO aman:

```json
{
  "id": "admin-uuid",
  "email": "admin@unaproject.my.id",
  "name": "UNA Admin"
}
```

Password hash tidak pernah masuk response.

### Database dan CLI

`backend/migrations/001_init.sql` berisi baseline seluruh tabel agar migration dan kontrak schema tidak pecah menjadi dua sumber berbeda.

Admin dibuat atau dirotasi melalui CLI:

```bash
cd backend
go run ./cmd/create-admin -email admin@unaproject.my.id -name "UNA Admin"
```

Password diminta dua kali melalui terminal tanpa echo, wajib 12–72 byte, lalu disimpan sebagai bcrypt hash. Password tidak masuk argument, shell history, atau log.

### Operasional

- `backend/compose.yaml` menyediakan PostgreSQL 17 lokal, bind hanya ke `127.0.0.1`, dan menjalankan migration saat volume pertama dibuat.
- Pool PostgreSQL dibatasi lima koneksi per instance.
- HTTP server memiliki read-header, read, write, idle, dan graceful-shutdown timeout.
- Health check menguji koneksi database dengan timeout dua detik.
- Auth response memakai `Cache-Control: no-store` dan `X-Content-Type-Options: nosniff`.
- Dockerfile memakai multi-stage build dan runtime distroless non-root.
- `.env.example` boleh di-commit, sedangkan `.env` tetap diabaikan.

### Test Backend

Unit test mengunci:

- issuance dan verification JWT;
- penolakan secret lemah dan token kedaluwarsa;
- reset login limiter;
- flow HTTP login → JWT → `/auth/me`;
- DTO `/auth/me` tidak membocorkan `password_hash`.

## 13. Auth Middleware (requireAdmin)

Sebelumnya JWT verification ditulis inline di handler `me()`. Sekarang di-extract menjadi middleware `requireAdmin` yang bisa dipakai semua endpoint admin.

Alur:

```text
Request masuk
  → recover (panic handler)
    → securityHeaders (Cache-Control, nosniff)
      → mux routing
        → requireAdmin (JWT verify → admin_id di context)
          → handler (baca adminID(r) dari context)
```

Yang dipelajari:

- **Context value pattern**: middleware menulis data ke `context.WithValue`, handler membaca dengan `r.Context().Value()`. Ini cara idiomatic Go untuk meneruskan data antar middleware tanpa global state.
- **Typed context key**: Go memakai tipe privat `contextKey` sebagai key agar package lain tidak bisa menimpa atau membaca secara tidak sengaja.
- **Middleware chaining**: `s.requireAdmin(s.me)` mengembalikan `http.HandlerFunc` baru. Handler asli hanya dipanggil kalau JWT valid.
- **YAGNI CORS**: karena arsitektur BFF (browser tidak pernah memanggil Go API langsung), CORS tidak diperlukan.

## 14. Products CRUD Backend

Resource CRUD pertama yang menjadi template untuk resource lainnya. Endpoint:

```text
GET    /v1/products                   publik — produk aktif + filter
GET    /v1/products/{slug}            publik — detail + varian
GET    /v1/admin/products             admin  — semua produk + paginasi
GET    /v1/admin/products/{id}        admin  — detail + varian
POST   /v1/admin/products             admin  — buat produk + varian
PUT    /v1/admin/products/{id}        admin  — update produk + replace varian
DELETE /v1/admin/products/{id}        admin  — hapus (cascade ke varian)
```

### Arsitektur Store Layer

File `backend/internal/store/products.go` berisi query PostgreSQL. Semua SQL ditulis langsung (tanpa ORM) agar query terlihat eksplisit dan bisa dioptimasi.

Pola penting:

- **Transaction untuk parent+child**: `CreateProduct` dan `UpdateProduct` memakai `pool.Begin()` untuk memastikan produk dan variannya disimpan dalam satu transaksi atomik. Kalau insert varian gagal, produk juga tidak tersimpan.
- **Replace-all strategy untuk varian**: saat update, semua varian lama dihapus lalu diganti dengan varian baru. Ini lebih sederhana daripada diff individual (bandingkan mana yang berubah/dihapus/ditambah). Untuk jumlah varian kecil (<10), ini optimal.
- **Unique violation detection**: `isUniqueViolation` memeriksa PostgreSQL error code `23505` untuk menangkap slug duplikat dan mengembalikan `ErrSlugConflict`.
- **Constant columns**: `productCols` mendefinisikan kolom SELECT sekali, dipakai di semua query. Ini menghindari perbedaan urutan kolom antara query dan `Scan()`.

### Arsitektur Handler Layer

File `backend/internal/api/products.go` berisi HTTP handler, validasi, dan konversi tipe.

Pola penting:

- **Separation of types**: `productJSON` dan `variantJSON` untuk response, `productInput` dan `variantInput` untuk request. Store types (`store.Product`) tidak pernah langsung di-marshal ke JSON.
- **Validation before store**: handler memvalidasi input sebelum memanggil store. Error validasi dikembalikan sebagai field-level error (misal `{"slug": "required"}`) dengan status 422.
- **Slug format check**: slug harus lowercase alphanumeric + hyphen, tidak boleh diawali/diakhiri hyphen. Ini mencegah URL yang aneh.
- **Re-fetch after mutation**: setelah create/update, produk di-fetch ulang dari database untuk mendapatkan field yang di-generate (id, timestamps). Ini menambah 2 query tapi menjamin response akurat.
- **Path values**: Go 1.22+ ServeMux mendukung `{slug}` dan `{id}` dalam pattern route. Handler membaca dengan `r.PathValue("slug")`.

### Interface Pattern

`Store` interface di `server.go` mendefinisikan semua method yang dibutuhkan server. `Postgres` struct di `store/` mengimplementasikannya. Di test, `fakeStore` mengimplementasikan interface yang sama dengan stub methods.

```text
Store interface (server.go)
  ├── Postgres struct (store/postgres.go + store/products.go) — implementasi nyata
  └── fakeStore (server_test.go) — implementasi test
```

Ini memungkinkan unit test handler tanpa database.

### Validasi

```bash
cd backend
go vet ./...   # static analysis — clean
go test ./...  # api ✅, auth ✅
go build ./cmd/api ./cmd/create-admin  # build — clean
```

## 15. Products Admin UI (Next.js App Router + Server Actions + BFF Pattern)

Pada tahap ini (Step 3), kita menghubungkan halaman **Manajemen Produk (`/admin/products`)** di frontend Next.js agar berhenti menggunakan data lokal sementara dan mulai berkomunikasi real-time dengan Golang REST API yang dibuat pada Step 2.

### Arsitektur Rute & Route Overriding

Sebelumnya, seluruh sub-halaman admin di-handle oleh satu rute dinamis: `src/app/admin/(dashboard)/[section]/page.tsx` yang membaca array lokal `adminSections`. 

Untuk menghubungkan produk ke API, kita membuat folder spesifik:
```text
src/app/admin/(dashboard)/products/page.tsx
```
Dalam hukum routing **Next.js App Router**, rute statis yang spesifik (`/products`) akan selalu **memprioritaskan dan menimpa** rute dinamis (`/[section]`). Ini memungkinkan kita memigrasikan modul admin satu per satu (secara bertahap / *incremental migration*) tanpa merusak modul lain yang masih statis (seperti Testimoni atau Tutorial).

### Pengambilan Data di Server Component (`page.tsx`)

Halaman `AdminProductsPage` adalah sebuah **React Server Component (RSC)**:
1. Memanggil helper `getVerifiedAdminToken()` yang mengecek validitas sesi admin di cookie `una_admin_session` via endpoint Go `GET /v1/auth/me`.
2. Jika tidak valid atau belum login, server langsung melempar redirect ke `/admin/login` sebelum HTML dirender.
3. Jika valid, RSC melakukan fetch ke `GET http://localhost:8080/v1/admin/products` dengan menyertakan header `Authorization: Bearer <token>`.
4. Hasil JSON langsung di-passing sebagai props `initialProducts` ke komponen client (`AdminProductsClient`).

**Keunggulan:** Browser pengguna tidak pernah melakukan request initial fetch ke port 8080. HTML yang sampai di browser sudah berisi data produk siap pakai (SEO & Perceived Performance sangat cepat).

### Pola Server Actions & Defense in Depth (`actions.ts`)

Untuk operasi mutasi (Create, Update, Delete), kita menggunakan **Next.js Server Actions** (`"use server"`):
- `createProductAction(data)` -> `POST /v1/admin/products`
- `updateProductAction(id, data)` -> `PUT /v1/admin/products/{id}`
- `deleteProductAction(id)` -> `DELETE /v1/admin/products/{id}`

**Prinsip Keamanan (Defense in Depth):**
Walaupun tombol mutasi hanya ada di halaman admin yang sudah dilindungi, setiap Server Action tetap **wajib memverifikasi ulang sesi admin** di baris pertamanya (`await getVerifiedAdminToken()`). Ini mencegah serangan di mana pihak luar mencoba memanggil Server Action langsung via HTTP POST tanpa melalui UI browser.

**Cache Revalidation (`revalidatePath`):**
Setelah Go API berhasil mengubah data di database PostgreSQL, Server Action memanggil:
```ts
revalidatePath("/admin/products");
revalidatePath("/admin");
revalidatePath("/");
```
Ini menyuruh Next.js untuk menghapus cache halaman-halaman tersebut, sehingga saat user kembali melihat tabel produk atau katalog depan, datanya sudah 100% terbaru tanpa perlu refresh browser manual.

### Interaktivitas Client Component (`AdminProductsClient.tsx`)

Komponen UI dibangun dengan pola *Progressive Enhancement* menggunakan vanilla React hooks (tanpa library form eksternal yang berat, sesuai prinsip *Ponytail Mode* / YAGNI):
- **Pencarian & Filter Real-time:** Menggunakan `useMemo` untuk memfilter array produk berdasarkan nama, slug, dan kategori secara instan di memori browser.
- **Form Varian Dinamis:** Menggunakan state array `formVariants` di mana admin bisa menambah (`+ Tambah Varian`) atau menghapus baris varian harga sebelum disubmit.
- **Daftar Fitur Newline:** Untuk memudahkan UMKM, input fitur dibuat berupa `textarea` di mana setiap baris baru (Enter) akan dipisah menjadi array string oleh kode: `formFeaturesText.split("\n").map(s => s.trim())`.
- **Desain Premium UNA Project:** Menggunakan token dari `globals.css` seperti `gold-cta`, `motion-button`, dan font digital LED (`font-led` / VT323) untuk preview ikon produk, serta badge status hijau/merah dengan animasi *pulse* berkesan hidup.


