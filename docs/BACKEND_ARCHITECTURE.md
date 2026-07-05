# Arsitektur Backend UNA Project (Decoupled Cloud Architecture)

Dokumen ini menjelaskan arsitektur sistem backend untuk UNA Project Web. Proyek ini berevolusi dari landing page statis menjadi sistem **Full-Stack Decoupled Architecture** yang memisahkan antarmuka pengguna (Frontend Next.js) dengan layanan manajemen data (Backend Golang REST API & PostgreSQL).

---

## 1. Filosofi & Alasan Pemilihan Stack

Pemilihan teknologi untuk UNA Project didasarkan pada tiga prinsip utama:
1. **Portfolio & Learning Value**: Menguasai kombinasi **Next.js + Golang + PostgreSQL** memberikan nilai tinggi di industri rekayasa perangkat lunak modern.
2. **Performa & Efisiensi Sumber Daya**: Binary Golang sangat ringan (komsumsi RAM < 30MB) dengan waktu start ekstrim cepat (*lightning-fast cold start* < 0.5 detik).
3. **Zero-Cost / Free Tier Optimization**: Arsitektur ini dirancang agar dapat berjalan pada layanan *cloud free tier* (Supabase + Google Cloud Run + Vercel) dengan biaya **Rp 0 / $0 selamanya** untuk skala UMKM.

---

## 2. Diagram Arsitektur Sistem

```mermaid
graph TD
    subgraph "Client Layer"
        User["Calon Customer / Pengunjung"]
        Admin["Admin / Pengurus UNA Project"]
    end

    subgraph "Frontend Layer (Vercel)"
        NextUI["Next.js App Router (Landing Page & /product)"]
        AdminUI["Next.js Admin Dashboard (/admin/*)"]
    end

    subgraph "Backend Layer (Google Cloud Run / Railway)"
        GoAPI["Golang REST API Server (Echo / Fiber)"]
        AuthMdw["JWT Authentication Middleware"]
    end

    subgraph "Data Layer (Supabase)"
        PostgreSQL[("PostgreSQL Database")]
    end

    User -->|HTTP GET (SSG / ISR / Client Fetch)| NextUI
    Admin -->|HTTP GET / POST / PUT / DELETE| AdminUI
    
    NextUI -->|Public REST API (JSON)| GoAPI
    AdminUI -->|Protected REST API + Bearer JWT| AuthMdw
    AuthMdw -->|Validated| GoAPI
    
    GoAPI -->|SQL queries (sqlc / pgx)| PostgreSQL
```

---

## 3. Komponen Sistem

### A. Frontend Layer (Next.js di Vercel)
- **Role**: Bertindak sebagai *presentation layer* murni.
- **Landing Page & Katalog**: Menggunakan Static Site Generation (SSG) atau Incremental Static Regeneration (ISR) untuk mengambil katalog produk dari public endpoint Golang.
- **Admin Dashboard (`/admin`)**: Halaman *client-side* atau *server-rendered* yang dilindungi oleh pengecekan sesi/cookie. Berkomunikasi dengan backend menggunakan *Bearer Token (JWT)*.

### B. Backend Layer (Golang REST API di Google Cloud Run)
- **Role**: Mengelola logika bisnis, autentikasi admin, validasi input, dan komunikasi ke database.
- **Framework / Router**: Menggunakan **Echo** atau **Fiber** (atau Go 1.22+ `net/http` stdlib) untuk performa tinggi dan routing yang bersih.
- **Architecture Pattern**: Menerapkan **Clean / Layered Architecture**:
  - **Handler Layer**: Menerima HTTP request, memparsing JSON/params, dan mengirimkan HTTP response.
  - **Service Layer**: Berisi *business logic* (misal: validasi harga tidak boleh negatif, format slug otomatis).
  - **Repository Layer**: Bertanggung jawab untuk mengeksekusi query SQL ke PostgreSQL.

### C. Data Layer (PostgreSQL di Supabase)
- **Role**: Penyimpanan data relasional utama untuk seluruh fitur aplikasi.
- **Database Driver**: Menggunakan **`pgx`** dikombinasikan dengan **`sqlc`** (mengubah SQL mentah menjadi kode Go *type-safe* secara otomatis).

---

## 4. Keunggulan Komparatif (Golang vs Node.js/Java di Serverless)

| Metrik | Golang (Google Cloud Run) | Node.js / Next.js API | Java / Spring Boot |
| :--- | :--- | :--- | :--- |
| **Ukuran Binary/Image** | ~15 - 25 MB (Alpine/Scratch) | ~150 - 300 MB | ~200 - 500 MB |
| **Cold Start Time** | **< 0.5 detik** (Nyaris instan) | 2 - 4 detik | 5 - 15 detik |
| **Konsumsi RAM Idle** | ~10 - 30 MB | ~100 - 200 MB | ~300 - 600 MB |
| **Concurrency** | Goroutines (Sangat ringan) | Event Loop (Single thread) | OS Threads (Berat) |

---

## 5. Alur Keamanan (Authentication Flow)

1. **Login**: Admin mengirimkan `email` dan `password` ke endpoint `POST /api/v1/auth/login`.
2. **Verifikasi**: Golang memverifikasi password menggunakan *hashing algorithm* (`bcrypt` / `argon2`).
3. **Penerbitan Token**: Jika valid, server menerbitkan **JSON Web Token (JWT)** dengan masa berlaku (misal: 24 jam).
4. **Penyimpanan di Client**: Next.js menyimpan token di dalam `httpOnly Secure Cookie` atau LocalStorage.
5. **Request Terproteksi**: Setiap request ke endpoint manajemen (`/api/v1/admin/*`) wajib menyertakan header:
   `Authorization: Bearer <token_jwt>`
6. **Middleware Verification**: Golang JWT Middleware memverifikasi tanda tangan (*signature*) token sebelum mengizinkan request masuk ke Handler.
