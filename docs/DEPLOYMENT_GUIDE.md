# Panduan Deployment UNA Project (Decoupled Stack)

Dokumen ini berisi panduan langkah demi langkah untuk melakukan deployment arsitektur terpisah UNA Project secara **100% Gratis (Free Tier)** menggunakan **Supabase**, **Google Cloud Run**, dan **Vercel**.

---

## 1. Deployment Database (Supabase PostgreSQL)

1. Buka [https://supabase.com](https://supabase.com) dan buat akun/login.
2. Klik **New Project**, pilih organisasi, beri nama proyek (misal: `una-project-db`), buat password database yang kuat, dan pilih region terdekat (**Singapore / `sin`**).
3. Setelah database siap, buka menu **SQL Editor** di panel kiri.
4. Salin seluruh isi skema SQL dari file [DATABASE_SCHEMA.md](file:///home/caur/programs/porto/una-project/docs/DATABASE_SCHEMA.md) dan jalankan (**Run**).
5. Buka menu **Project Settings** -> **Database**.
6. Pada bagian **Connection string**, pilih tab **URI** atau **Connection pooling**.
7. Salin *connection string* tersebut (ganti `[YOUR-PASSWORD]` dengan password yang kamu buat di langkah 2):
   `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`

---

## 2. Deployment Backend Golang (Google Cloud Run + Docker)

### A. Persiapan Dockerfile di Repo Golang
Pastikan repo backend Golang kamu memiliki `Dockerfile` multi-stage build yang ringan:

```dockerfile
# Stage 1: Build binary
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Stage 2: Minimal runtime image
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

### B. Deploy ke Google Cloud Run
1. Buka [Google Cloud Console](https://console.cloud.google.com) dan buat proyek baru (misal: `una-project-api`).
2. Aktifkan API: **Cloud Run API** dan **Cloud Build API**.
3. Buka **Cloud Run** -> Klik **Create Service**.
4. Pilih **Continuously deploy new revisions from a source repository** -> Hubungkan repo GitHub backend Golang kamu.
5. Pada pengaturan Service:
   - **Service name**: `una-project-api`
   - **Region**: `asia-southeast1` (Singapura - agar super cepat ke pengguna Indonesia & Supabase).
   - **Authentication**: Pilih **Allow unauthenticated invocations** (karena publik perlu mengakses katalog produk; autentikasi admin diurus oleh JWT Middleware kita).
6. Pada bagian **Container, Variables & Secrets** -> Tab **Environment variables**, tambahkan:
   - `DATABASE_URL` = `<Connection string Supabase dari Langkah 1>`
   - `JWT_SECRET` = `<String acak rahasia untuk token admin>`
   - `PORT` = `8080`
7. Klik **Create / Deploy**. Dalam 2-3 menit, kamu akan mendapatkan URL publik backend, misal:
   `https://una-project-api-xxxxx-as.a.run.app`

---

## 3. Deployment Frontend & Admin Dashboard (Vercel)

Karena landing page saat ini sudah terdeploy di Vercel, kamu hanya perlu menghubungkannya dengan API Golang yang baru saja online.

1. Buka dashboard Vercel -> Pilih proyek **una-project-web**.
2. Buka menu **Settings** -> **Environment Variables**.
3. Tambahkan variabel baru:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://una-project-api-xxxxx-as.a.run.app/v1`
   - **Environment**: Centang Production, Preview, dan Development.
4. Klik **Save**.
5. Buka tab **Deployments**, klik titik tiga pada deployment terakhir, dan pilih **Redeploy** agar Vercel membangun ulang web dengan variabel lingkungan yang baru.

---

## 4. Verifikasi & Pengujian Sistem

1. Buka URL landing page Vercel kamu (misal: `https://unaproject.com`).
2. Buka *Developer Tools* di browser (F12) -> Tab **Network**.
3. Pastikan request ke endpoint `https://una-project-api-xxxxx-as.a.run.app/v1/products` mengembalikan status **200 OK** dan merender produk dengan cepat.
4. Buka halaman `/admin/login`, coba masuk dengan kredensial admin yang telah di-seed di database, dan periksa apakah token JWT berhasil disimpan serta fungsi CRUD berjalan lancar!
