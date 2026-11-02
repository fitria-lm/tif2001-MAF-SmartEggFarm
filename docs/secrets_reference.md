# Secrets Reference & Environment Variables

## Daftar Variabel Lingkungan (Environment Variables)
- `PORT`: Port server backend (contoh: `5000`).
- `DB_URI`: URL koneksi database PostgreSQL.
- `JWT_SECRET`: Kunci rahasia untuk enkripsi token JWT.

> **Catatan Keamanan:** Dilarang keras mengunggah file `.env` ke repositori GitHub. Gunakan GitHub Secrets untuk pipeline CI/CD jika diperlukan.