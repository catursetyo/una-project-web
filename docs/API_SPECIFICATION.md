# Spesifikasi REST API UNA Project

Dokumen ini mendefinisikan antarmuka komunikasi (REST API) antara Frontend Next.js dan Backend Golang.

---

## 1. Konvensi Umum

- **Base URL (Production)**: `https://api.unaproject.com/v1`
- **Base URL (Local Dev)**: `http://localhost:8080/v1`
- **Format Data**: `application/json`
- **Autentikasi Admin**: Header `Authorization: Bearer <jwt_token>`
- **Format Respons Standar**:
  ```json
  {
    "success": true,
    "message": "Pesan status operasi",
    "data": { ... } // atau [...]
  }
  ```
- **Format Respons Error**:
  ```json
  {
    "success": false,
    "error_code": "ERR_NOT_FOUND",
    "message": "Produk dengan slug tersebut tidak ditemukan"
  }
  ```

---

## 2. Public Endpoints (Untuk Frontend Landing Page & Katalog)

Endpoint ini bersifat terbuka (tidak memerlukan token JWT) dan digunakan oleh Next.js untuk merender tampilan ke pengunjung.

### A. Katalog Produk
- `GET /products` — Mengambil daftar seluruh produk aktif (mendukung filter `?category=...&featured=true`).
- `GET /products/:slug` — Mengambil detail spesifikasi produk beserta varian harganya.

**Contoh Respons `GET /products/:slug`**:
```json
{
  "success": true,
  "data": {
    "id": "c303282d-f2e6-46ca-a04a-35d3d873712d",
    "slug": "jws-led-tv-32-inch",
    "name": "JWS Android TV 32 Inch",
    "category": "JWS Android TV",
    "short_description": "Display jam waktu sholat modern berbasis Smart TV Android.",
    "price_start_from": 2500000,
    "image_url": "https://...",
    "features": ["Akurasi GPS", "Auto Murotal", "Custom Running Text"],
    "variants": [
      {
        "id": "e1123a1a-1234-5678-90ab-cdef12345678",
        "name": "Paket Tanpa TV (Lisensi & Mini PC saja)",
        "price": 1250000
      },
      {
        "id": "e2234b2b-1234-5678-90ab-cdef12345678",
        "name": "Paket Lengkap TV 32 Inch",
        "price": 2500000
      }
    ]
  }
}
```

### B. Testimoni
- `GET /testimonials` — Mengambil daftar testimoni aktif yang diurutkan berdasarkan `order_index`.

### C. Tutorial & Alur Pemesanan
- `GET /tutorials` — Mengambil daftar tutorial beserta langkah-langkahnya.
- `GET /order-steps` — Mengambil 3 langkah alur transaksi aktif.
- `GET /whatsapp-templates/:name` — Mengambil pola pesan WhatsApp berdasarkan nama template (misal: `konsultasi_jws`).

---

## 3. Protected Admin Endpoints (Khusus Admin Dashboard)

Semua endpoint di bawah ini wajib menyertakan header `Authorization: Bearer <jwt_token>`.

### A. Autentikasi Admin
- `POST /auth/login` — Login admin dengan `email` dan `password`, mengembalikan token JWT.
- `GET /auth/me` — Memeriksa validitas token dan profil admin saat ini.

### B. Manajemen Produk (CRUD)
- `POST /admin/products` — Membuat produk baru.
- `PUT /admin/products/:id` — Memperbarui data produk dan variannya.
- `DELETE /admin/products/:id` — Menghapus produk (dan seluruh variannya via cascade).

**Contoh Request Body `POST /admin/products`**:
```json
{
  "name": "JWS RGB 2 Panel Frame Figura 100x50",
  "category": "JWS RGB Panel",
  "short_description": "Tampilan full color RGB dengan pigura emas kayu eksklusif.",
  "description": "Spesifikasi lengkap JWS RGB...",
  "price_start_from": 1850000,
  "is_featured": true,
  "features": ["Full Color RGB", "Kontrol via HP Android", "Buzzer Waktu Sholat"],
  "variants": [
    {
      "name": "Ukuran 100x50 cm",
      "price": 1850000,
      "order_index": 1
    }
  ]
}
```

### C. Manajemen Testimoni (CRUD)
- `POST /admin/testimonials` — Menambahkan dokumentasi foto pemasangan baru.
- `PUT /admin/testimonials/:id` — Mengedit judul, deskripsi, atau urutan tampil.
- `DELETE /admin/testimonials/:id` — Menghapus testimoni.

### D. Manajemen Tutorial (CRUD)
- `POST /admin/tutorials` — Menambahkan panduan pengoperasian baru beserta langkah-langkahnya.
- `PUT /admin/tutorials/:id` — Mengedit panduan dan langkah tutorial.
- `DELETE /admin/tutorials/:id` — Menghapus panduan.

### E. Manajemen Alur Transaksi (CRUD)
- `PUT /admin/order-steps` — Memperbarui teks, urutan, atau judul langkah pemesanan di landing page.

### F. Manajemen Template Chat WhatsApp (CRUD)
- `GET /admin/whatsapp-templates` — Melihat seluruh daftar template chat.
- `POST /admin/whatsapp-templates` — Membuat template chat baru.
- `PUT /admin/whatsapp-templates/:id` — Mengedit format pesan kustom (misal: mengubah sapaan atau format tanya harga).
- `DELETE /admin/whatsapp-templates/:id` — Menghapus template chat.

**Contoh Request Body `PUT /admin/whatsapp-templates/:id`**:
```json
{
  "template_name": "minta_katalog",
  "category": "katalog",
  "message_pattern": "Assalamualaikum UNA Project, saya melihat website dan tertarik minta katalog lengkap serta price list terbaru untuk kebutuhan masjid/mushola kami. Terima kasih.",
  "is_default": true,
  "is_active": true
}
```
