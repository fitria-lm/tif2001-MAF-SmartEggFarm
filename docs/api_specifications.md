# API Specifications - SmartEggFarm

Base path: `/api/auth`. Semua endpoint memakai format JSON.

## 1. Register

* **Endpoint:** `POST /api/auth/register`
* **Fungsi:** Mendaftarkan pengguna baru.
* **Request Body:**

  ```json
  {
    "nama": "Budi",
    "email": "budi@example.com",
    "password": "password123"
  }
  ```

* **Respons sukses:** `201 Created`

  ```json
  { "message": "Registrasi berhasil" }
  ```

* **Respons gagal:**
  * `400 Bad Request` jika nama, email, atau password kosong.
  * `409 Conflict` jika email sudah terdaftar.
  * `500 Internal Server Error` jika terjadi kesalahan pada server.

## 2. Login

* **Endpoint:** `POST /api/auth/login`
* **Fungsi:** Memverifikasi email dan password pengguna, lalu menerbitkan token JWT.
* **Request Body:**

  ```json
  {
    "email": "budi@example.com",
    "password": "password123"
  }
  ```

* **Respons sukses:** `200 OK`

  ```json
  {
    "message": "Login berhasil",
    "token": "<token JWT>",
    "user": { "id": "...", "nama": "Budi", "email": "budi@example.com" }
  }
  ```

* **Respons gagal:**
  * `400 Bad Request` jika email atau password kosong.
  * `401 Unauthorized` jika email atau password salah.
  * `500 Internal Server Error` jika terjadi kesalahan pada server.

## Catatan

* Password disimpan dalam bentuk hash menggunakan bcryptjs (salt rounds 10).
* Token JWT berlaku selama 24 jam.
* Rute privat memakai header `Authorization: Bearer <token>` yang divalidasi oleh middleware `verifyToken`.
