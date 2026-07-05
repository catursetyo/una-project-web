# Learning Notes

## Admin Dashboard Foundation

Yang dipelajari:

- Route group `(dashboard)` memisahkan layout dashboard dan login tanpa mengubah URL `/admin`.
- Dynamic route `[section]` memakai satu halaman untuk lima modul pengelolaan.
- `src/data/admin.ts` mengubah data publik menjadi baris tabel admin sehingga UI tetap data-driven.
- Client Component hanya dipakai untuk bagian yang membutuhkan URL browser (`usePathname`).
- Tombol CRUD sengaja belum aktif sampai REST API Golang dan sesi cookie httpOnly tersedia.
