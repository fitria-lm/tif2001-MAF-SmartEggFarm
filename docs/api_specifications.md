# API Specifications — SmartEggFarm

## 1. Register

* **Endpoint:** `POST /api/auth/register`

* **Fungsi:** Mendaftarkan pengguna baru.

* **Request Body:**

  ```json
  {
    "nama": "Mea",
    "email": "mearhmh22gmail.com",
    "password": "Mearhmh123"
  }
  ```

* **Respons sukses:** `201 Created`

* **Respons gagal:** `400 Bad Request` jika data tidak lengkap atau email sudah terdaftar.

## 2. Login

* **Endpoint:** `POST /api/auth/login`

* **Fungsi:** Memverifikasi email dan password pengguna.

* **Request Body:**

  ```json
  {
    "email": "mearhmh22@gmail.com",
    "password": "Mearhmh123"
  }
  ```

* **Respons sukses:** `200 OK`, berisi token JWT.

* **Respons gagal:** `401 Unauthorized` jika kredensial tidak valid.

## Catatan

* Password disimpan dalam bentuk hash menggunakan bcryptjs.
* Token JWT berlaku selama 24 jam.
* Endpoint menggunakan format JSON.

