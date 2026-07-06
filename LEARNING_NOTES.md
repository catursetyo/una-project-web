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

- Backend Golang dan database belum tersedia.
- Login baru dapat bekerja setelah `POST /auth/login` dan `GET /auth/me` mengikuti kontrak API.
- Data dashboard masih berasal dari file lokal.
- Create, update, delete, upload media, rate limiting, dan audit log belum diimplementasikan.
- CSP ditunda sampai daftar origin production final.

Urutan lanjutan yang aman:

1. Buat `backend/` dengan health endpoint, migration, dan auth.
2. Deploy API dan atur `API_URL` server-only pada Vercel.
3. Verifikasi login dan cookie pada `admin.unaproject.my.id`.
4. Hubungkan endpoint list admin.
5. Implementasikan mutation satu resource terlebih dahulu, dimulai dari produk.
6. Tambahkan upload setelah storage dan validasi file ditentukan.

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
