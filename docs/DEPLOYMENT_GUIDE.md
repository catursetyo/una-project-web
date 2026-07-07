# Panduan Deployment untuk AI Agent

Deployment mengubah sistem eksternal. Jangan deploy, membuat project cloud, menjalankan migration production, atau mengubah environment variable tanpa permintaan/izin eksplisit user.

## Target

| Komponen | Target | Konfigurasi rahasia |
| --- | --- | --- |
| Website + dashboard Next.js | Satu project Vercel | Tidak membutuhkan secret database |
| Golang REST API | Google Cloud Run atau target yang disetujui user | `DATABASE_URL`, `JWT_SECRET` |
| PostgreSQL | Supabase/PostgreSQL yang disetujui user | Credential database |

Domain production:

```text
unaproject.my.id          website publik
admin.unaproject.my.id    dashboard admin
```

Free tier dapat berubah. Jangan menjanjikan biaya nol tanpa memeriksa kebijakan provider saat deployment dilakukan.

## Environment

### Frontend

```env
API_URL=http://localhost:8080/v1
ADMIN_HOST=admin.localhost
PUBLIC_SITE_URL=http://localhost:3000
```

`API_URL` dibaca server-side oleh Server Component/Action. Jangan menaruh token atau credential pada prefix `NEXT_PUBLIC_`.

### Backend

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=8080
ALLOWED_ORIGINS=http://localhost:3000,http://admin.localhost:3000
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
MEDIA_BUCKET=una-media
```

Gunakan secret manager/provider environment settings. Jangan commit file `.env` berisi nilai nyata.

## Urutan Deployment

1. Pastikan lint, test, dan build lokal lolos.
2. Buat backup database sebelum migration yang berisiko.
3. Terapkan migration database.
4. Deploy backend dan verifikasi health/public endpoint.
5. Atur URL backend pada frontend.
6. Atur domain `unaproject.my.id` dan `admin.unaproject.my.id` pada project Vercel yang sama.
7. Deploy frontend.
8. Jalankan smoke test publik dan admin.

Jangan melanjutkan ke tahap berikutnya jika tahap sebelumnya gagal.

## Preflight Frontend

```bash
npm ci
npm run lint
npm run build
```

Gunakan npm karena repository memiliki `package-lock.json`.

## Preflight Backend

```bash
cd backend
go test ./...
go vet ./...
go build ./cmd/api ./cmd/create-admin
```

Image Cloud Run menggunakan `backend/Dockerfile`. Jalankan migration dan `cmd/create-admin` sebelum menerima login production; keduanya tidak dijalankan otomatis saat container start.

Urutan migration untuk database baru:

```bash
cd backend
psql "$DATABASE_URL" -f migrations/001_init.sql
psql "$DATABASE_URL" -f migrations/002_seed_frontend_content.sql
psql "$DATABASE_URL" -f migrations/003_analytics_events.sql
```

## Smoke Test

Periksa minimal:

- landing page dan katalog dapat dibuka;
- detail produk valid dan slug tidak dikenal menghasilkan 404;
- public API tidak menampilkan draft;
- login valid dan invalid bekerja tanpa membocorkan detail akun;
- route admin menolak sesi kosong/kedaluwarsa;
- root `admin.unaproject.my.id` mengarah ke `/admin` dan link kembali menuju `unaproject.my.id`;
- create/update/delete merefleksikan data setelah refresh;
- CTA WhatsApp menghasilkan pesan yang benar;
- tidak ada error console atau request 5xx.

## Keamanan

- Jangan mencetak nilai secret dalam command output atau laporan.
- Gunakan credential scoped dan rotasi bila pernah terekspos.
- Cloud Run boleh menerima request publik hanya karena endpoint public diperlukan; endpoint admin tetap wajib dilindungi JWT.
- Batasi CORS ke domain deployment yang digunakan.
- Cookie auth production wajib `HttpOnly` dan `Secure`.
- Jangan set atribut `Domain` pada cookie admin; biarkan host-only untuk `admin.unaproject.my.id`.
- Ikuti [`WEB_SECURITY.md`](WEB_SECURITY.md) sebelum membuka akses dashboard production.

## Rollback

Sebelum deployment, catat versi frontend, image backend, dan migration terakhir. Jika smoke test gagal:

1. Hentikan rollout.
2. Kembalikan frontend/backend ke versi terakhir yang sehat.
3. Rollback database hanya jika migration menyediakan langkah aman; jika tidak, pulihkan dari backup.
4. Laporkan failure dan bukti, jangan menyembunyikan deployment parsial.

## Handoff

Laporan deployment harus berisi target/environment, versi yang terpasang, migration yang dijalankan, hasil smoke test, dan rollback point. Jangan menyertakan nilai secret.
