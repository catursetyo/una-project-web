# Kontrak REST API untuk AI Agent

Gunakan dokumen ini saat menghubungkan Next.js dengan backend Golang. Jangan mengubah path, casing, atau bentuk respons hanya di salah satu sisi.

## Konvensi

- Production: `https://api.unaproject.com/v1`.
- Local: `http://localhost:8080/v1`.
- Content type: `application/json`.
- Field JSON: `snake_case`.
- ID persistence: UUID string.
- Admin API: `Authorization: Bearer <jwt_token>`.

Respons sukses:

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {}
}
```

Respons gagal:

```json
{
  "success": false,
  "error_code": "ERR_NOT_FOUND",
  "message": "Data tidak ditemukan",
  "errors": {}
}
```

`errors` opsional dan hanya dipakai untuk error validasi per field.

## Status HTTP

| Status | Penggunaan |
| --- | --- |
| `200` | GET/PUT berhasil |
| `201` | POST berhasil |
| `204` | DELETE berhasil tanpa body |
| `400` | JSON atau parameter tidak valid |
| `401` | Belum login atau token tidak valid |
| `403` | Tidak memiliki izin |
| `404` | Resource tidak ditemukan |
| `409` | Slug/nama unik sudah dipakai |
| `422` | Validasi field gagal |
| `500` | Error internal tanpa membocorkan detail |

## Public Endpoints

| Method | Path | Tujuan |
| --- | --- | --- |
| GET | `/products?category=&featured=` | Produk aktif |
| GET | `/products/:slug` | Detail produk aktif dan variannya |
| GET | `/testimonials` | Testimoni aktif berdasarkan `order_index` |
| GET | `/tutorials` | Tutorial aktif beserta langkahnya |
| GET | `/order-steps` | Alur pemesanan aktif |
| GET | `/whatsapp-templates/:name` | Template pesan aktif berdasarkan nama |

Contoh produk:

```json
{
  "id": "c303282d-f2e6-46ca-a04a-35d3d873712d",
  "slug": "jws-led-tv-32-inch",
  "name": "JWS LED TV 32 Inch",
  "category": "Jam Waktu Sholat",
  "short_description": "Aplikasi jadwal sholat berbasis Android TV.",
  "description": "Deskripsi lengkap produk.",
  "dimensions": "32 inch",
  "features": ["Akurasi GPS", "Setting via smartphone"],
  "price_start_from": 3700000,
  "image_url": null,
  "video_url": "https://youtu.be/example",
  "is_featured": true,
  "variants": [
    {
      "id": "e1123a1a-1234-5678-90ab-cdef12345678",
      "name": "Tanpa STB",
      "price": 3700000,
      "description": "Instalasi langsung di Google TV",
      "order_index": 1
    }
  ]
}
```

## Authentication

| Method | Path | Tujuan |
| --- | --- | --- |
| POST | `/auth/login` | Verifikasi email/password dan mengembalikan JWT |
| GET | `/auth/me` | Profil admin dari token valid |

Login request:

```json
{
  "email": "admin@unaproject.com",
  "password": "secret"
}
```

Frontend tidak boleh menyimpan token di `localStorage`. Route server Next.js menerima token dari API lalu menyimpannya sebagai cookie `httpOnly`, `Secure` di production, dan `SameSite=Lax` atau lebih ketat.

## Protected Admin Endpoints

### Produk

| Method | Path |
| --- | --- |
| GET | `/admin/products?status=&page=&limit=` |
| GET | `/admin/products/:id` |
| POST | `/admin/products` |
| PUT | `/admin/products/:id` |
| DELETE | `/admin/products/:id` |

### Testimoni

| Method | Path |
| --- | --- |
| GET | `/admin/testimonials` |
| POST | `/admin/testimonials` |
| PUT | `/admin/testimonials/:id` |
| DELETE | `/admin/testimonials/:id` |

### Tutorial

| Method | Path |
| --- | --- |
| GET | `/admin/tutorials` |
| POST | `/admin/tutorials` |
| PUT | `/admin/tutorials/:id` |
| DELETE | `/admin/tutorials/:id` |

### Alur Pemesanan

| Method | Path |
| --- | --- |
| GET | `/admin/order-steps` |
| PUT | `/admin/order-steps` |

### Template WhatsApp

| Method | Path |
| --- | --- |
| GET | `/admin/whatsapp-templates` |
| POST | `/admin/whatsapp-templates` |
| PUT | `/admin/whatsapp-templates/:id` |
| DELETE | `/admin/whatsapp-templates/:id` |

Contoh payload produk:

```json
{
  "slug": "jws-rgb-2-panel",
  "name": "JWS RGB 2 Panel",
  "category": "Jam Waktu Sholat",
  "short_description": "JWS full color dengan akurasi GPS.",
  "description": "Deskripsi lengkap.",
  "dimensions": "100 x 50 cm",
  "features": ["Full color", "Setting via smartphone"],
  "price_start_from": 1850000,
  "image_url": null,
  "video_url": null,
  "is_featured": true,
  "is_active": true,
  "order_index": 1,
  "variants": [
    {
      "name": "Versi biasa",
      "price": 1850000,
      "description": null,
      "order_index": 1
    }
  ]
}
```

Contoh payload template:

```json
{
  "template_name": "tanya_produk",
  "category": "produk",
  "message_pattern": "Assalamualaikum, saya tertarik dengan {product_name}.",
  "is_default": true,
  "is_active": true
}
```

## Aturan Implementasi Agent

- Validasi seluruh input kembali di backend; validasi UI bukan batas keamanan.
- Harga tidak boleh negatif, rating harus `1..5`, slug dan nama template harus unik.
- Public endpoint hanya mengembalikan data aktif.
- Admin list harus menyertakan data aktif dan draft.
- DELETE parent wajib menghormati cascade pada schema dan memerlukan konfirmasi UI.
- Jangan meneruskan pesan error database mentah kepada client.
- Map `snake_case` API ke type frontend secara eksplisit pada boundary.
- Gunakan `AbortSignal`/timeout untuk request jaringan dan tampilkan loading, empty, serta error state.
