# Secrets Reference & Environment Variables

## Daftar Variabel Lingkungan (Environment Variables)

| Variabel | Deskripsi | Contoh | Wajib |
| :--- | :--- | :--- | :--- |
| `PORT` | Port server backend | `5000` | Opsional (default 5000) |
| `DATABASE_URL` | URL koneksi database PostgreSQL | `postgresql://user:pass@localhost:5432/smarteggfarm` | Ya |
| `JWT_SECRET` | Kunci rahasia untuk enkripsi token JWT | string acak panjang | Ya |

> **Catatan Keamanan:**
> - Dilarang keras mengunggah file `.env` ke repositori GitHub.
> - Gunakan **GitHub Secrets** untuk pipeline CI/CD jika diperlukan.
> - `.env.example` **boleh** di-commit sebagai template (tanpa nilai rahasia).
> - Nama variabel yang dipakai backend: **`DATABASE_URL`** (bukan `DB_URI`).