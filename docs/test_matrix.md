# Test Matrix - Smart Egg Farm

Dokumen ini memetakan skenario pengujian otomatis yang dijalankan oleh CI (`npm test` di folder `server`). Setiap baris merepresentasikan satu `test()` di `server/tests/*.test.js`.

Terakhir diperbarui: Sprint 1 (Pert 8)

## 1. Unit Test - Auth Controller (`server/tests/auth.test.js`)

| ID | Modul | Skenario | Ekspektasi | Status | Bukti |
|---|---|---|---|---|---|
| UT-01 | Auth/Register | Password disimpan sebagai hash bcrypt (bukan plaintext) | `bcrypt.compare("password123", hash)` = `true` | Passed | [CI run](https://github.com/OWNER/REPO/actions/workflows/ci.yml) |
| UT-02 | Auth/Register | Field `nama`/`username`/`password` kosong | HTTP 400 | Passed | [CI run](https://github.com/OWNER/REPO/actions/workflows/ci.yml) |
| UT-03 | Auth/Register | Username sudah terdaftar | HTTP 409 | Passed | [CI run](https://github.com/OWNER/REPO/actions/workflows/ci.yml) |
| UT-04 | Auth/Login | Login sukses menerbitkan JWT dengan masa berlaku 24 jam | `decoded.exp - decoded.iat = 86400` | Passed | [CI run](https://github.com/OWNER/REPO/actions/workflows/ci.yml) |
| UT-05 | Auth/Login | Password salah | HTTP 401 | Passed | [CI run](https://github.com/OWNER/REPO/actions/workflows/ci.yml) |
| UT-06 | Auth/Login | Username tidak terdaftar | HTTP 401 | Passed | [CI run](https://github.com/OWNER/REPO/actions/workflows/ci.yml) |
| UT-07 | Auth/Login | `JWT_SECRET` tidak dikonfigurasi | HTTP 500 | Passed | [CI run](https://github.com/OWNER/REPO/actions/workflows/ci.yml) |

## 2. Unit Test - Flagged for Rewrite (`server/tests/auth.test.js`, "Auth Validation Suite")

Dua test di bawah tidak mengimpor kode aplikasi - mereka menguji regex dan array yang didefinisikan di dalam file test itu sendiri. Jika logika validasi di controller dihapus, kedua test tetap hijau. Status: perlu ditulis ulang atau dihapus (koordinasi dengan Mhs 2).

| ID | Modul | Skenario | Masalah | Status |
|---|---|---|---|---|
| UT-08 | Auth/Validasi | "Validasi format email pengguna" | Regex didefinisikan di dalam test, bukan diimpor dari `src/` | Needs fix |
| UT-09 | Auth/Validasi | "Validasi peran pengguna (Admin/Karyawan/Kasir)" | Array role didefinisikan di dalam test, bukan dari `src/` | Needs fix |

## 3. Planned Tests - Auth Middleware (Sprint 2)

`server/src/middlewares/verifyToken.js` belum memiliki test. Middleware ini melindungi seluruh rute privat; coverage saat ini 0%. Akan ditulis oleh Mhs 2 di `server/tests/verifyToken.test.js`.

| ID | Modul | Skenario | Ekspektasi | Status |
|---|---|---|---|---|
| UT-10 | Auth/Middleware | Request tanpa header `Authorization` | HTTP 401 | Planned |
| UT-11 | Auth/Middleware | Header bukan format `Bearer <token>` | HTTP 401 | Planned |
| UT-12 | Auth/Middleware | `JWT_SECRET` tidak diset | HTTP 500 | Planned |
| UT-13 | Auth/Middleware | Token invalid / expired | HTTP 401 | Planned |
| UT-14 | Auth/Middleware | Token valid | `next()` dipanggil, `req.user` terisi | Planned |

## 4. Ringkasan

| Kategori | Jumlah |
|---|---|
| Passed (test nyata, menguji kode aplikasi) | 7 |
| Needs fix (test theater, tidak menguji kode) | 2 |
| Planned (Sprint 2) | 5 |
| Total skenario test yang berjalan dan lulus saat ini | 7 |

## 5. Catatan

- Verifikasi lokal: `cd server && npm test` - semua 9 test di `auth.test.js` lulus.
- Verifikasi CI: setiap PR ke `main` menjalankan `npm test` via `.github/workflows/ci.yml`. URL run dilampirkan di kolom Bukti.
- Coverage: `npm run test:coverage` belum tersedia di `server/package.json` (menunggu Mhs 2). Akan ditambahkan Sprint 2.
- Client-side tests: belum ada. Akan dipetakan di dokumen terpisah setelah job client aktif di CI (koordinasi dengan Mhs 1).