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

## 16. Remaining Resources Backend - Part 1: Testimonials CRUD (Golang REST API)

Pada tahap awal **Step 4** ini, kita mulai mengimplementasikan *backend resources* yang tersisa secara bertahap (satu per satu sesuai pola yang sama), dimulai dari modul **Testimoni (`testimonials`)**.

### Pola Arsitektur Konsisten (Store -> Interface -> Handler)

Kita mempertahankan arsitektur bersih yang sama dengan modul produk:
1. **Store Layer (`internal/store/testimonials.go`)**: Mendefinisikan struct `Testimonial` dan mengeksekusi query raw SQL menggunakan `pgxpool`. Terdapat 6 method utama:
   - `ListPublicTestimonials`: Mengambil testimoni aktif (`WHERE is_active = true`) diurutkan berdasarkan `order_index ASC, created_at DESC`.
   - `ListAdminTestimonials`: Mengambil seluruh testimoni (aktif maupun nonaktif) untuk dasbor admin.
   - `GetTestimonialByID`, `CreateTestimonial`, `UpdateTestimonial`, dan `DeleteTestimonial`.
2. **Interface Contract (`internal/api/server.go`)**: Mendaftarkan keenam method tersebut ke dalam interface `Store`, dan mendaftarkan rute HTTP di `Handler()`:
   - `GET /v1/testimonials` (Publik)
   - `GET /v1/admin/testimonials` & CRUD lainnya (Dilindungi oleh middleware `requireAdmin` / JWT Auth).
3. **HTTP Handlers (`internal/api/testimonials.go`)**: Menangani konversi JSON DTO, pembacaan path parameter (`r.PathValue("id")`), dan validasi input.

### Perbedaan dengan Products CRUD (Single-Table Resource)

Berbeda dengan produk yang memiliki struktur *parent-child* (`products` dan `product_variants`) yang mewajibkan penggunaan database transaction (`tx.Begin(ctx)`), tabel `testimonials` adalah entitas tunggal (*single-table resource*). 
Oleh karena itu, operasi insert, update, dan delete dapat langsung dieksekusi menggunakan `p.pool.QueryRow` atau `p.pool.Exec` tanpa perlu membuka transaksi atomik eksplisit. Ini menjaga kode tetap ringkas dan performan sesuai prinsip *Ponytail Mode* (YAGNI).

### Keseragaman Format Error Validasi (`map[string]any`)

Dalam fungsi `validateTestimonialInput`, kita mengembalikan tipe data `map[string]any` untuk menampung daftar error (misal: judul kosong atau rating di luar angka 1-5).
Alasannya adalah agar respons JSON error yang dihasilkan konsisten dengan standar kontrak UNA Project:
```json
{
  "success": false,
  "error_code": "ERR_VALIDATION",
  "message": "Validation failed",
  "errors": {
    "title": "required",
    "rating": "must be between 1 and 5"
  }
}
```
Konsistensi ini membuat frontend Next.js nantinya bisa menggunakan satu hook atau komponen error handling yang sama untuk seluruh form admin.

## 17. Remaining Resources Backend - Part 2: Tutorials & Steps CRUD (Parent-Child Transaction)

Pada tahap lanjutan **Step 4** ini, kita mengimplementasikan modul **Tutorials (`tutorials` + `tutorial_steps`)** di server Golang REST API.

### Relasi Parent-Child dalam Transaksi Atomik

Berbeda dengan Testimoni yang merupakan *single-table resource*, modul **Tutorials** memiliki relasi satu-ke-banyak (*one-to-many*) dengan tabel `tutorial_steps`. Setiap tutorial dapat memiliki beberapa langkah panduan (step 1, step 2, dst).
Oleh karena itu, kita kembali menerapkan pola **database transaction (`tx.Begin(ctx)`)** seperti pada pembuatan produk dan varian harganya:
1. Memulai transaksi database (`tx`).
2. Meng-insert baris ke tabel `tutorials` dan mendapatkan UUID baru (`RETURNING id::text`).
3. Meng-loop array `steps` dan meng-insert setiap langkah ke tabel `tutorial_steps` dengan mengaitkan `tutorial_id` ke UUID tersebut.
4. Melakukan `tx.Commit(ctx)`. Jika salah satu langkah gagal disimpan, seluruh tutorial akan di-rollback sehingga database tidak pernah menyimpan data yang setengah jadi (*orphaned records*).

### Strategi "Replace All Steps" pada Update (`UpdateTutorial`)

Sesuai prinsip *Ponytail Mode* (YAGNI), ketika admin memperbarui tutorial beserta daftar langkah-langkahnya, kita tidak menulis algoritma rumit untuk mencari langkah mana yang diedit, ditambah, atau dihapus satu per satu (*array diffing*). 
Sebagai gantinya, di dalam transaksi atomik, kita mengeksekusi:
```sql
DELETE FROM tutorial_steps WHERE tutorial_id = $1;
```
Lalu langsung meng-insert ulang seluruh daftar langkah yang dikirim dari form admin (`insertTutorialSteps`). Strategi ini 100% aman karena berjalan di dalam transaksi atomik (jika insert baru gagal, penghapusan lama otomatis dibatalkan oleh database) dan membuat kode jauh lebih bersih, ringkas, serta bebas bug!

### Pemanfaatan `ON DELETE CASCADE` pada Database

Pada method `DeleteTutorial(ctx, id)`, kita cukup mengeksekusi satu perintah SQL sederhana:
```sql
DELETE FROM tutorials WHERE id::uuid = $1;
```
Kita tidak perlu menulis perintah untuk menghapus baris di tabel `tutorial_steps` secara manual. Mengapa? Karena pada saat kita merancang skema PostgreSQL (`001_init.sql`), foreign key `tutorial_id` sudah dideklarasikan dengan klausul:
```sql
tutorial_id UUID NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE
```
Klausul `ON DELETE CASCADE` memerintahkan PostgreSQL untuk otomatis menyapu bersih seluruh baris anak di tabel `tutorial_steps` begitu baris induknya di tabel `tutorials` dihapus!

## 18. Remaining Resources Backend - Part 3: Order Steps Bulk Update (Golang REST API)

Pada tahap ketiga **Step 4** ini, kita mengimplementasikan modul **Order Steps (`order_steps`)** di server Golang REST API.

### Mengapa Bulk Update (`PUT /v1/admin/order-steps`) Bukannya CRUD Satu Per Satu?

Langkah pemesanan adalah alur kerja singkat (biasanya terdiri dari 3–4 langkah seperti *"01 Konsultasi via WhatsApp"*, *"02 Pilih Tipe & Ukuran"*, *"03 Instalasi & Aktivasi"*) yang ditampilkan di halaman depan website. 
Saat admin ingin mengubah alur transaksi ini, hampir selalu mereka mengubah urutan, memperbaiki teks, atau menambah/menghapus beberapa langkah sekaligus dalam satu layar antarmuka. 
Membuat endpoint CRUD satu per satu (POST satu langkah, PUT satu langkah, DELETE satu langkah) sangat tidak efisien untuk *user experience* admin dan rentan membuat nomor urutan pemesanan terputus atau tidak konsisten di tengah proses editing.

### Strategi "Replace All in One Transaction" (`ReplaceAllOrderSteps`)

Sesuai filosofi *Ponytail Mode* (YAGNI / solusi paling simpel dan efektif), ketika admin menekan tombol *"Simpan Alur Pemesanan"*, frontend akan mengirimkan seluruh array langkah baru dalam satu request JSON ke `PUT /v1/admin/order-steps`.
Di layer database (`internal/store/order_steps.go`), kita mengeksekusi operasi tersebut di dalam satu transaksi atomik (`tx.Begin(ctx)`):
1. Membuka database transaction (`tx`).
2. Menghapus seluruh baris lama di tabel `order_steps`:
   ```sql
   DELETE FROM order_steps;
   ```
3. Meng-loop array `steps` yang dikirim admin dan meng-insert kembali setiap langkah secara berurutan.
4. Melakukan `tx.Commit(ctx)`. Jika terjadi kesalahan jaringan atau validasi saat menyimpan langkah ke-2, database akan otomatis melakukan *rollback*, sehingga alur pemesanan lama tetap utuh tanpa kerusakan!

### Fallback Pintar untuk Penyelarasan Nomor (`step_number`)

Untuk memudahkan admin UMKM yang mungkin lupa mengisi format nomor langkah (seperti angka `"01"` atau `"02"`), kode store kita dilengkapi dengan logika fallback pintar menggunakan fungsi standar Go `fmt.Sprintf`:
```go
stepNum := s.StepNumber
if stepNum == "" {
    stepNum = fmt.Sprintf("%02d", i+1)
}
```
Jika `step_number` kosong, sistem otomatis membuatkan nomor urut berformat 2 digit sesuai posisinya di dalam array! Ini menjaga tampilan kartu langkah di landing page tetap rapi dan konsisten secara visual.

## 19. Remaining Resources Backend - Part 4: WhatsApp Chat Templates CRUD & Dynamic Messaging

Pada tahap akhir **Step 4** ini, kita mengimplementasikan modul **WhatsApp Templates (`whatsapp_templates`)** di server Golang REST API, yang juga menandai selesainya seluruh arsitektur backend utama UNA Project!

### Peran Dynamic Messaging (`message_pattern`) dalam Bisnis UMKM

Website UNA Project memiliki banyak titik konversi WhatsApp (di tombol hero, kartu katalog produk, tombol floating di pojok kanan bawah, hingga halaman detail). 
Agar admin tidak perlu menulis ulang teks pesan di setiap kode frontend, kita menyediakan fitur manajemen template pesan WhatsApp. Admin dapat menyimpan pola pesan dinamis seperti:
```text
Halo UNA Project, saya tertarik dengan produk {product_name}. Bisa minta spesifikasi lengkap dan estimasi harganya?
```
Nantinya, kode frontend cukup mengambil pola pesan ini dari API, mengganti *placeholder* `{product_name}` dengan nama produk yang sedang di-klik user, dan menghasilkan tautan `https://wa.me/628...` yang dinamis dan profesional!

### Penegakan Aturan "Single Default per Category" di Dalam Transaksi

Bagaimana jika admin menetapkan suatu template sebagai default (`is_default = true`) untuk kategori `"produk"`? Agar tidak ada lebih dari satu template yang berstatus default di kategori yang sama, pada method `CreateWhatsAppTemplate` dan `UpdateWhatsAppTemplate` di store layer, kita membuka transaksi atomik (`tx.Begin(ctx)`) dan menjalankan perintah:
```sql
UPDATE whatsapp_templates SET is_default = false WHERE category = $1;
```
Sebelum kita meng-insert atau meng-update template baru! Dengan cara ini, database secara otomatis mereset status default pada template lama di kategori tersebut, sehingga selalu terjamin hanya ada maksimal 1 template default yang aktif per kategori.

### Tonggak Penting: Seluruh Backend API Step 4 Selesai! 🎉

Dengan selesainya modul WhatsApp Templates ini, server Golang REST API kita kini telah siap melayani 5 modul utama (Products, Testimonials, Tutorials, Order Steps, dan WhatsApp Templates) dengan arsitektur yang sangat bersih, konsisten, performan, dan aman (dilindungi oleh JWT Auth & bcrypt).
Seluruh kode backend telah diverifikasi dengan kompilasi (`go build`), static analysis (`go vet`), serta unit testing (`go test ./...`), menghasilkan sistem yang robust dan siap dihubungkan ke UI Dasbor Admin Next.js pada **Step 5**!

## 20. Step 5 - Part 1: Migrasi UI Dasbor Testimoni (`/admin/testimonials`) ke Golang Backend

Memasuki **Step 5**, kita mulai menghubungkan halaman-halaman Dasbor Admin Next.js yang tersisa ke server Golang REST API yang telah kita bangun, dimulai dari modul **Testimoni (`/admin/testimonials`)**.

### Penerapan Pola Arsitektur BFF (Backend-for-Frontend) pada Testimoni

Sesuai pola referensi dari Dasbor Produk, halaman `/admin/testimonials` kini menggunakan kombinasi **React Server Component (`page.tsx`)** dan **Server Actions (`actions.ts`)**:
- **RSC Page (`page.tsx`)**: Mengambil token JWT secara aman dari *httpOnly cookie* (`getVerifiedAdminToken()`), lalu melakukan `fetch` ke endpoint `${apiUrl}/admin/testimonials` di sisi server sebelum halaman di-render ke browser.
- **Server Actions (`actions.ts`)**: Menangani operasi Create, Update, dan Delete dari form client. Browser tidak pernah memanggil server Go secara langsung; Next.js bertindak sebagai proksi yang menyisipkan token Authorization dan memetakan kode status HTTP (422 untuk validasi form, 404 jika tidak ditemukan) ke format respons JSON standar yang mudah dipahami komponen React.

### Resiliensi Parsing JSON Respons (`Defensive Parsing`)

Pada `page.tsx`, kita menulis logika parsing data sebagai berikut:
```ts
if (json.success && json.data) {
  testimonials = (Array.isArray(json.data) ? json.data : json.data.items || []) as ApiTestimonial[];
}
```
Teknik ini disebut **Defensive Parsing**. Mengapa ini penting dalam arsitektur mikroservice atau modular? Karena sebagian endpoint API mengembalikan array langsung (`data: [...]`), sementara sebagian lain mengembalikan objek berpaginasi (`data: { items: [...], total: ... }`). Dengan satu baris kode sederhana ini, UI kita menjadi sangat tangguh (*resilient*) dan kebal terhadap perbedaan struktur balasan dari server backend!

### Peningkatan UX dengan Star Rating & Status Pulse Badge

Pada komponen client (`AdminTestimonialsClient.tsx`), kita menerapkan prinsip desain premium UNA Project (*visual excellence*):
1. **Konversi Angka ke Ikon Bintang**: Angka rating (1–5) dari database tidak ditampilkan mentah sebagai teks, melainkan di-transformasi menjadi jejeran bintang emas (`★`) menggunakan `Array.from({ length: item.rating })`.
2. **Badge Status Hidup**: Badge status "Aktif" dilengkapi dengan indikator titik hijau beranimasi *pulse* (`animate-pulse`). Ini memberikan micro-animation halus yang membuat dasbor terasa hidup, profesional, dan menyenangkan untuk digunakan oleh admin UMKM!

## 21. Step 5 - Part 2: Migrasi UI Dasbor Tutorial (`/admin/tutorials`) & Dynamic Step Form Editor

Melanjutkan migrasi UI dasbor, kita menghubungkan modul **Tutorial (`/admin/tutorials`)** ke server Golang REST API. Modul ini memiliki keunikan karena struktur datanya bersifat *Parent-Child*, di mana satu tutorial memiliki banyak langkah pengoperasian (`steps`).

### Dynamic Form Array untuk Parent-Child Resource (Tutorial & Steps)

Bagaimana kita mengelola form di mana admin bisa menambah, mengedit, atau menghapus langkah tutorial secara dinamis tanpa merefresh halaman?
Pada komponen client (`AdminTutorialsClient.tsx`), kita memanfaatkan React state array:
```ts
const [formSteps, setFormSteps] = useState<ApiTutorialStep[]>([]);
```
- **Menambah Langkah**: Saat tombol `+ Tambah Langkah` ditekan, kita menyisipkan objek langkah baru ke akhir array:
  `setFormSteps(prev => [...prev, { step_number: prev.length + 1, title: "", description: "" }])`
- **Menghapus Langkah**: Kita menggunakan `filter` untuk membuang langkah berdasarkan indeksnya.
- **Mengubah Isi Langkah**: Fungsi `handleStepChange` memperbarui properti khusus pada indeks yang diubah dengan teknik *immutable array copy* (`[...prev]`).

### Sinkronisasi Data Transaksional Frontend-Backend

Saat admin menekan tombol **"Simpan Tutorial"**, seluruh payload yang berisi informasi utama tutorial beserta array `steps` dikirim dalam satu HTTP request JSON ke Server Action (`createTutorialAction` / `updateTutorialAction`).
Di sisi Golang backend (`internal/store/tutorials.go`), kita sudah mengimplementasikan transaksi atomik PostgreSQL (`tx.Begin(ctx)` -> Hapus langkah lama -> Insert langkah baru -> `tx.Commit`). Kombinasi ini menghasilkan arsitektur yang sangat responsif dan interaktif di browser, namun tetap dijamin 100% konsisten dan atomik di level database!

### Penyederhanaan Kategori dengan Datalist HTML5 Native

Fitur native HTML5 ini memberikan pengalaman *combobox / autocomplete* yang sangat ringan, mulus, dan dapat diakses dengan baik tanpa perlu menginstal library UI tambahan (*zero dependencies*, sesuai filosofi *Ponytail mode* minimalis)!

## 22. Step 5 - Part 3: Migrasi UI Dasbor Langkah Pemesanan (`/admin/order-steps`) & Bulk Reordering

Pada tahap ketiga Step 5 ini, kita mengintegrasikan Dasbor **Langkah Pemesanan (`/admin/order-steps`)** dengan endpoint Golang REST API (`PUT /v1/admin/order-steps`).

### Pola Bulk Update / Simpan Urutan Simultan di Frontend

Berbeda dengan dasbor lain yang menggunakan pola Create/Edit per item, urutan langkah pemesanan di landing page memiliki ketergantungan posisi (menggeser langkah 1 ke bawah otomatis mengubah posisi langkah 2 ke atas).
Oleh karena itu, di komponen client (`AdminOrderStepsClient.tsx`), kita menerapkan desain **Bulk Reordering**:
- Admin dapat menekan tombol `⬆️ Naik` atau `⬇️ Turun` pada setiap kartu langkah. Fungsi `handleMoveUp` dan `handleMoveDown` akan menukar posisi elemen dalam array `steps` sekaligus menghitung ulang nilai `order_index` (1, 2, 3, dst).
- Saat tombol **"Simpan Seluruh Urutan & Perubahan"** ditekan, seluruh array dikirim serentak ke `replaceAllOrderStepsAction`. Di backend Go, transaksi atomik menghapus seluruh langkah lama dan menyisipkan urutan baru yang telah disempurnakan tanpa risiko duplikasi atau urutan terputus!

### Fleksibilitas Nomor Tampil (`step_number`) vs Urutan Fisik (`order_index`)

Kita memisahkan antara `step_number` (string) dan `order_index` (integer):
- `order_index`: Dipakai oleh database untuk mengurutkan baris saat query (`ORDER BY order_index ASC`).
- `step_number`: Teks visual yang ditampilkan di kartu landing page (seperti `"01"`, `"02"`, atau `"Langkah A"`). Admin diberi kendali penuh untuk mengedit teks visual ini sesuai selera branding UMKM!

## 23. Step 5 - Part 4: Migrasi UI Dasbor Template WhatsApp (`/admin/whatsapp-templates`) & Interactive Helper Buttons

Menutup **Step 5**, kita menyelesaikan migrasi Dasbor **Template WhatsApp (`/admin/whatsapp-templates`)** ke Golang REST API, tempat admin mengatur sapaan pesan otomatis yang terhubung dengan tombol-tombol CTA di seluruh website.

### Peningkatan UX dengan Tombol Sisip Variabel (Interactive Placeholder Buttons)

Pola pesan dinamis mengandalkan variabel seperti `{product_name}` yang nantinya diganti oleh kode frontend saat tombol WhatsApp ditekan. Agar admin tidak salah ketik (*typo*) saat menulis tanda kurung kurawal, kita menambahkan tombol bantuan interaktif di atas kotak pesan:
- Tombol `+ {product_name}`, `+ {price}`, dan `+ {category}`.
- Saat diklik, fungsi `insertPlaceholder(tag)` langsung menyisipkan variabel tersebut ke dalam teks pesan secara mulus. Ini adalah contoh penerapan *Error Prevention* yang sangat berharga bagi pengguna awam!

### Otomatisasi Format snake_case untuk Nama Template

Agar nama template konsisten dan aman saat dipanggil sebagai parameter pengenal, fungsi `handleNameChange` mengkonversi input teks admin menjadi format `snake_case` secara *real-time* (spasi diubah menjadi underscore `_` dan huruf besar diubah menjadi kecil).

### Tonggak Besar: Keseluruhan Step 5 Selesai! 🎉

Dengan rampungnya modul Template WhatsApp ini, **seluruh 5 modul Dasbor Admin UNA Project** (Produk, Testimoni, Tutorial, Langkah Pemesanan, dan Template WhatsApp) kini telah **100% termigrasi**!
Semua halaman admin kini tidak lagi bergantung pada data mock statis di `src/data/`, melainkan beroperasi secara penuh menggunakan arsitektur **BFF (React Server Components + Next.js Server Actions)** yang berkomunikasi secara aman dengan **server Golang REST API** berperforma tinggi. Proyek UNA Project kini memiliki fondasi *full-stack* yang modern, tangguh, type-safe, dan siap dipelajari sebagai karya portofolio unggulan!
