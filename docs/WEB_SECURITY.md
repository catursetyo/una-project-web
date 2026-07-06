# Panduan Web Security untuk AI Agent

Panduan ini wajib dibaca sebelum mengubah autentikasi, dashboard, API, database, upload, environment, atau deployment UNA Project.

## Scope dan Trust Boundary

```text
https://unaproject.my.id          website publik Next.js
https://admin.unaproject.my.id    dashboard admin Next.js
Next.js server                    BFF dan pemegang cookie session
Golang API                        autentikasi, otorisasi, validasi bisnis
PostgreSQL                        persistence dan constraint
```

Subdomain admin bukan lapisan keamanan. Semua route dan mutation admin tetap wajib memverifikasi session pada server dan authorization pada Golang API.

## Aturan Wajib Agent

1. Fail closed: konfigurasi atau session yang tidak valid harus menolak akses.
2. Jangan menyimpan JWT, password, atau secret di Client Component, `localStorage`, URL, log, atau `NEXT_PUBLIC_*`.
3. Jangan membuat algoritma crypto sendiri. Gunakan implementasi standar/library backend yang terawat.
4. Jangan mengandalkan menyembunyikan tombol atau Proxy sebagai authorization final.
5. Validasi input pada boundary Next.js dan ulangi validasi bisnis pada Golang API.
6. Semua mutation harus memverifikasi session dan role admin tepat sebelum memanggil API.
7. Jangan menampilkan detail database, stack trace, token, atau status akun pada error publik.
8. Perubahan DNS, secret, production data, migration, atau deployment membutuhkan izin eksplisit user.

## Environment dan Secret

Frontend server-only:

```env
API_URL=http://localhost:8080/v1
ADMIN_HOST=admin.localhost
PUBLIC_SITE_URL=http://localhost:3000
```

Backend local:

```env
APP_ENV=development
PORT=8080
DATABASE_URL=postgresql://...
JWT_SECRET=...
ALLOWED_ORIGINS=http://localhost:3000,http://admin.localhost:3000
```

Production frontend:

```env
API_URL=https://<cloud-run-service>/v1
ADMIN_HOST=admin.unaproject.my.id
PUBLIC_SITE_URL=https://unaproject.my.id
```

- `API_URL` tidak perlu `NEXT_PUBLIC_` karena request admin dilakukan server-side.
- `DATABASE_URL` dan `JWT_SECRET` hanya berada di Secret Manager/backend.
- `.env*`, private key, service-account JSON, dump database, dan credential file tidak boleh di-commit.
- Jika secret terekspos, hentikan penggunaan dan rotasi; menghapus dari commit terbaru saja tidak cukup.

## Authentication dan Session

Alur yang diizinkan:

```text
Login form
  -> Next.js Server Action
  -> POST Golang /auth/login
  -> JWT diterima server Next.js
  -> cookie host-only HttpOnly
  -> GET Golang /auth/me pada setiap secure session check
```

Cookie admin:

- nama tidak mengandung data user;
- `HttpOnly: true`;
- `Secure: true` di production;
- `SameSite: Lax` atau lebih ketat;
- `Path: /`;
- jangan set `Domain`, sehingga cookie hanya berlaku pada host yang membuatnya;
- umur cookie tidak boleh melebihi expiry token backend.

Login harus mengembalikan pesan generik untuk email tidak dikenal dan password salah. Backend wajib memberi rate limit dan audit log aman pada endpoint login.

Implementasi awal memakai limiter global per instance sebanyak 10 percobaan per menit. Ini cukup untuk local development dan baseline satu service, tetapi bukan rate limit terdistribusi; sebelum menaikkan jumlah instance atau traffic, tambahkan pembatasan di edge/Cloud Armor tanpa menghapus validasi aplikasi.

## Authorization

- Next.js DAL memanggil `/auth/me` dan hanya meneruskan DTO minimal: `id`, `name`, dan `email`.
- Golang API wajib memverifikasi signature, expiry, issuer/audience bila digunakan, serta role untuk setiap endpoint `/admin/*`.
- Server Action/Route Handler harus mengulang `verifyAdminSession()`; layout guard hanya membantu navigasi, bukan melindungi mutation.
- Record draft/nonaktif hanya boleh keluar melalui endpoint admin terproteksi.

## Subdomain dan Origin

- `admin.unaproject.my.id` dan `unaproject.my.id` memakai deployment Next.js yang sama.
- Root subdomain admin boleh diarahkan ke `/admin`, tetapi route tetap dilindungi session.
- Link “Lihat situs” harus memakai `PUBLIC_SITE_URL`, bukan `/`, karena `/` pada subdomain admin kembali ke dashboard.
- CORS backend hanya mengizinkan origin yang benar-benar melakukan browser request. Jika seluruh request API lewat Next.js server, CORS browser tidak perlu dibuka lebar.
- Jangan gunakan wildcard origin bersama credential.

## CSRF

- Gunakan Server Action/Route Handler same-origin untuk mutation admin.
- Pertahankan cookie `SameSite=Lax` atau `Strict`.
- Periksa `Origin`/`Host` untuk endpoint custom yang menerima credential atau mutation lintas boundary.
- Request `GET` tidak boleh mengubah data.

## XSS dan Template WhatsApp

- Render teks melalui React; jangan memakai `dangerouslySetInnerHTML` untuk konten admin/customer.
- Placeholder WhatsApp hanya boleh berasal dari allowlist seperti `{product_name}`, `{variant_name}`, dan `{category}`.
- Jangan mengevaluasi template sebagai JavaScript atau HTML.
- URL media harus menggunakan protokol dan host yang diizinkan.

## Database dan API

- Gunakan parameterized query; jangan menyusun SQL dari input string.
- Pertahankan constraint database untuk harga, rating, unique slug, dan relasi.
- Produk beserta varian serta tutorial beserta langkahnya dimutasi dalam satu transaksi.
- Batasi ukuran body, panjang string, jumlah array, dan pagination pada API.
- Outbound fetch harus memiliki timeout dan tidak menerima URL internal/arbitrer untuk mencegah SSRF.

## Upload Media

Ketika upload diimplementasikan:

- batasi ukuran dan jumlah file;
- validasi MIME dan signature file, bukan ekstensi saja;
- buat nama object baru; jangan percaya filename user;
- simpan di object storage, bukan filesystem container;
- tolak SVG/HTML aktif kecuali disanitasi dengan pipeline yang teruji;
- jangan membuat bucket admin-write menjadi public-write.

## Response Header dan Cache

Gunakan baseline:

- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy` untuk menonaktifkan fitur browser yang tidak dipakai;
- `Cache-Control: private, no-store` untuk login dan dashboard.

CSP ketat hanya ditambahkan setelah seluruh script, image, font, analytics, dan API origin diinventarisasi. Jangan menyalin CSP yang membuat aplikasi rusak atau mengandalkan `unsafe-eval` di production.

## Dependency dan Supply Chain

- Gunakan npm sesuai lockfile dan Go modules sesuai `go.sum`.
- Jangan menambahkan package untuk fungsi yang sudah tersedia di platform/stdlib.
- Review maintainer, release, dan advisory sebelum dependency baru.
- Jangan menjalankan script install atau binary tidak dikenal tanpa inspeksi.

## Logging dan Incident

Log boleh memuat request ID, method, path, status, duration, admin ID, dan error code aman. Log tidak boleh memuat credential, JWT, body login, database URL, atau data pribadi penuh.

Jika terjadi exposure:

1. cabut/rotasi credential;
2. invalidasi session terkait;
3. periksa log dan scope dampak;
4. pulihkan dari versi sehat;
5. dokumentasikan penyebab dan pencegahan tanpa menyalin secret.

## Security Checklist Agent

Sebelum handoff:

- route admin tanpa cookie diarahkan ke login;
- cookie invalid/kedaluwarsa ditolak;
- login error tidak membocorkan status akun;
- mutation tanpa role admin menghasilkan `401/403`;
- dashboard tidak tersimpan di cache publik;
- secret tidak muncul pada bundle, HTML, log, diff, atau history;
- CORS tidak wildcard dengan credential;
- lint, test, build, dan smoke test domain publik/admin lolos.
