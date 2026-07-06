# UNA Project API

Backend minimum untuk autentikasi dashboard UNA Project. Service memakai Go `net/http`, PostgreSQL, bcrypt, dan JWT HS256.

## 1. Jalankan PostgreSQL Lokal

```bash
cd backend
docker compose up -d db
```

Migration schema dan seed konten dijalankan otomatis ketika volume database pertama kali dibuat. Credential pada `compose.yaml` hanya untuk localhost dan port database hanya di-bind ke `127.0.0.1`.

## 2. Konfigurasi

```bash
cd backend
cp .env.example .env
```

Connection string contoh sudah menunjuk ke PostgreSQL Docker. Ganti `JWT_SECRET` dengan secret acak minimal 32 karakter:

```bash
openssl rand -base64 48
```

Load environment untuk terminal aktif:

```bash
set -a
. ./.env
set +a
```

Go tidak membaca `.env` otomatis; ini sengaja menghindari dependency tambahan.

## 3. Migration Supabase

Bagian ini tidak diperlukan untuk database Docker. Untuk Supabase, gunakan direct connection dan jalankan:

```bash
psql "$DATABASE_URL" -f migrations/001_init.sql
psql "$DATABASE_URL" -f migrations/002_seed_frontend_content.sql
```

Jalankan kedua migration secara berurutan satu kali pada database Supabase baru. Migration kedua memindahkan konten awal frontend ke PostgreSQL. Jangan menjalankannya otomatis setiap container start.

## 4. Buat Admin

```bash
go run ./cmd/create-admin \
  -email admin@unaproject.my.id \
  -name "UNA Admin"
```

CLI meminta password dan konfirmasi melalui terminal tanpa menampilkan input. Menjalankan kembali command untuk email yang sama akan memperbarui nama dan password hash.

## 5. Jalankan API

```bash
go run ./cmd/api
```

Endpoint:

```text
GET  /healthz
POST /v1/auth/login
GET  /v1/auth/me
GET  /v1/products
GET  /v1/testimonials
GET  /v1/tutorials
GET  /v1/order-steps
GET  /v1/whatsapp-templates
GET|POST|PUT|DELETE /v1/admin/*
```

Pada terminal lain, jalankan frontend dari root repository:

```bash
npm run dev
```

Buka `http://admin.localhost:3000`. Jika wildcard localhost tidak didukung komputer, tambahkan `127.0.0.1 admin.localhost` ke hosts file.

## 6. Verifikasi

```bash
go test ./...
go vet ./...
go build ./cmd/api ./cmd/create-admin
```

Jangan commit `.env`, connection string, JWT secret, password, atau output credential.

Untuk menghapus seluruh data lokal dan mengulang migration dari awal:

```bash
docker compose down -v
```

Perintah tersebut destruktif dan hanya boleh dipakai untuk database development lokal.
