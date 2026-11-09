# API Specifications - SmartEggFarm

Base path: `/api/v1/auth`. Semua endpoint memakai format JSON.

## 1. Register

* **Endpoint:** `POST /api/v1/auth/register`
* **Fungsi:** Mendaftarkan pengguna baru.
* **Request Body:**

  ```json
  {
    "nama": "Budi",
    "username": "budi",
    "password": "password123"
  }
  ```

* **Respons sukses:** `201 Created`

  ```json
  { "message": "Registrasi berhasil" }
  ```

* **Respons gagal:**
  * `400 Bad Request` jika nama, username, atau password kosong.
  * `409 Conflict` jika username sudah terdaftar.
  * `500 Internal Server Error` jika terjadi kesalahan pada server.

## 2. Login

* **Endpoint:** `POST /api/v1/auth/login`
* **Fungsi:** Memverifikasi username dan password pengguna, lalu menerbitkan token JWT.
* **Request Body:**

  ```json
  {
    "username": "budi",
    "password": "password123"
  }
  ```

* **Respons sukses:** `200 OK`

  ```json
  {
    "message": "Login berhasil",
    "token": "<token JWT>",
    "user": { "id": "...", "nama": "Budi", "username": "budi" }
  }
  ```

* **Respons gagal:**
  * `400 Bad Request` jika username atau password kosong.
  * `401 Unauthorized` jika username atau password salah.
  * `500 Internal Server Error` jika terjadi kesalahan pada server.

## Catatan

* Password disimpan dalam bentuk hash menggunakan bcryptjs (salt rounds 10).
* Token JWT berlaku selama 24 jam.
* Rute privat memakai header `Authorization: Bearer <token>` yang divalidasi oleh middleware `verifyToken`.
