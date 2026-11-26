
# SMART EGG FARM

[![CI](https://github.com/fitria-lm/tif2001-MAF-SmartEggFarm/actions/workflows/ci.yml/badge.svg)](https://github.com/fitria-lm/tif2001-MAF-SmartEggFarm/actions/workflows/ci.yml)

## Sistem Manajemen Peternakan Ayam Petelur Berbasis Web

Smart Egg Farm merupakan proyek pengembangan perangkat lunak berbasis web untuk memenuhi tugas mata kuliah **Software Development**.

## Kelompok 10 - Software Development

**Nama Tim:** DevFarmX

### Anggota Kelompok

1. Mea Inta Rohmah
2. Aryo Putra Firmansya
3. Fitria Lukluul Maknun

## Latar Belakang

Pengelolaan peternakan ayam petelur membutuhkan pencatatan data operasional yang meliputi jumlah panen, pengeluaran, produksi telur, serta transaksi penjualan.

Apabila pencatatan masih dilakukan secara manual atau menggunakan media yang terpisah, proses pemantauan data menjadi kurang efisien dan berpotensi menimbulkan ketidaksesuaian data.

## Solusi Aplikasi

Smart Egg Farm merupakan sistem informasi manajemen peternakan ayam petelur berbasis web yang mengintegrasikan pencatatan kegiatan operasional, transaksi, dan berbagai data peternakan lainnya ke dalam satu sistem.

Sistem ini menyediakan beberapa fitur utama sebagai berikut:

### 1. Dashboard
Menampilkan ringkasan informasi dan keseluruhan data peternakan untuk memudahkan pemantauan kondisi operasional.

### 2. Kandang

Menyediakan fitur pengelolaan data dan aktivitas kandang yang meliputi:

- **Data Kandang:** Mengelola data ayam, termasuk populasi dan mortalitas ayam.
- **Panen:** Mengelola data panen, mulai dari input, edit, hapus, hingga melihat riwayat panen.
- **Pakan:** Mengelola stok pakan, menyediakan kalkulator kebutuhan pakan, serta informasi harga pakan.

### 3. Pemasaran

Menyediakan fitur pengelolaan penjualan hasil peternakan yang meliputi:

- **Penjualan Telur:** Mengatur harga telur, mencatat pesanan, mengelola antrean pesanan, serta memantau pesanan yang telah selesai.
- **Penjualan Lainnya:** Mengelola data penjualan produk sampingan peternakan, seperti jagung dan produk lainnya.

### 4. Operasional

Menyediakan fitur pengelolaan kebutuhan operasional peternakan yang meliputi:

- **Pengeluaran:** Mencatat dan mengelola data pengeluaran peternakan.
- **Gaji Karyawan:** Mengelola data dan pembayaran gaji karyawan.

## Target Pengguna

Sistem Smart Egg Farm dirancang untuk digunakan oleh beberapa jenis pengguna dengan hak akses yang berbeda:

### 1. Pemilik / Admin Peternakan
Memiliki akses untuk mengelola dan memantau seluruh data serta aktivitas peternakan.

### 2. Karyawan Kandang
Bertugas menginput data panen dan mengakses fitur kalkulator pakan.

### 3. Kasir
Bertugas mengelola dan mencatat transaksi penjualan.

## Development

### Prasyarat

Pastikan perangkat telah memiliki perangkat lunak berikut:

- Node.js v20 atau lebih baru
- npm
- PostgreSQL (untuk database backend)

### Struktur Folder

```text
SMART-EGG-FARM/
├── client/                 # Frontend React + Vite
├── server/                 # Backend Express + PostgreSQL
├── docs/                   # Dokumentasi teknis
├── .github/                # Konfigurasi CI dan template GitHub
└── README.md
```

### Menjalankan Backend

1. Masuk ke direktori backend:

   ```bash
   cd server
   ```

2. Instal seluruh dependensi:

   ```bash
   npm ci
   ```

3. Salin file konfigurasi environment:

   ```bash
   cp .env.example .env
   ```

4. Isi konfigurasi `DATABASE_URL` dan `JWT_SECRET` pada file `.env`.

5. Jalankan server:

   ```bash
   npm start
   ```

### Menjalankan Frontend

1. Masuk ke direktori frontend:

   ```bash
   cd client
   ```

2. Instal seluruh dependensi:

   ```bash
   npm ci
   ```

3. Jalankan development server:

   ```bash
   npm run dev
   ```

## Lint dan Testing

Pemeriksaan kode dan pengujian dilakukan pada masing-masing bagian aplikasi.

### Backend

Jalankan perintah berikut dari direktori `server/`:

```bash
npm run lint
npm test
```

### Frontend

Jalankan perintah berikut dari direktori `client/`:

```bash
npm run lint
npm run build
```

## Continuous Integration (CI)

Setiap *push* dan *pull request* ke branch `main` akan menjalankan pipeline Continuous Integration (CI) yang dikonfigurasi melalui `.github/workflows/ci.yml`.

Pipeline CI yang telah diimplementasikan mencakup:

- **Lint:** Pemeriksaan kualitas kode menggunakan ESLint pada direktori `server/`.
- **Unit Testing:** Pengujian otomatis menggunakan Jest dan Supertest pada direktori `server/`.

Status implementasi CI dan rencana pengembangan Sprint 2, yang mencakup penambahan job untuk client, penggunaan Node.js v22, serta konfigurasi branch protection, didokumentasikan lebih lanjut dalam `docs/ci_architecture.md`.

## Dokumentasi

Dokumentasi teknis proyek tersedia di direktori `docs/` dan beberapa file pendukung pada direktori utama.

| File | Deskripsi |
|---|---|
| `docs/ci_architecture.md` | Dokumentasi arsitektur pipeline CI dan status implementasinya. |
| `docs/secrets_reference.md` | Referensi environment variable dan aturan keamanan. |
| `docs/test_matrix.md` | Matriks skenario pengujian otomatis. |
| `docs/api_specifications.md` | Spesifikasi endpoint REST API. |
| `docs/database_schema.sql` | Skema database aplikasi. |
| `CHANGELOG.md` | Riwayat perubahan dan pengembangan proyek. |

## Kontribusi

Kontribusi dalam pengembangan Smart Egg Farm dilakukan melalui mekanisme Git dan Pull Request (PR).

Ketentuan kontribusi:

1. Buat branch baru dari `main` dengan nama yang deskriptif sesuai perubahan yang dilakukan.

   Contoh:
   - `feat/client-auth-pages`
   - `fix/server-jwt-expiry`

2. Ikuti checklist kontribusi yang tersedia pada `.github/pull_request_template.md`.

3. Pastikan seluruh pemeriksaan CI berhasil (*passing*) sebelum mengajukan permintaan review.

4. Koordinasikan proses review dan persetujuan melalui Pull Request sebelum melakukan merge ke branch `main`.
