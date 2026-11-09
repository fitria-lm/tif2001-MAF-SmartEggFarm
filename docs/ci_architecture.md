# CI Architecture & Pipeline Specification - Smart Egg Farm

## 1. Overview
Pipeline Continuous Integration (CI) dikonfigurasi menggunakan GitHub Actions untuk memvalidasi setiap perubahan kode (Pull Request / Push) ke cabang `main`. CI mencakup **server** dan **client**.

## 2. Trigger Events
- **Push Events:** Cabang `main`.
- **Pull Request Events:** Target cabang `main`.

## 3. Workflow Jobs & Steps

### Server (backend)
1. **Checkout Code:** Mengambil versi kode terbaru dari repositori.
2. **Setup Node.js Environment:** Node.js **v22** dengan caching npm.
3. **Install Dependencies (server):** `npm ci` di folder `server`.
4. **Run Linter (server):** ESLint sesuai konfigurasi `server/eslint.config.js`.
5. **Run Unit Tests (server):** Jest + Supertest.

### Client (frontend)
6. **Install Dependencies (client):** `npm ci` di folder `client`.
7. **Run Linter (client):** ESLint sesuai `client/eslint.config.js`.
8. **Run Unit Tests (client):** Vitest.
9. **Build (client):** `npm run build` — memastikan import case-sensitive (Linux) dan bundle valid.

## 4. Catatan Penting
- Langkah **Build (client)** wajib ada, karena masalah huruf besar/kecil pada `import` (mis. `./pages/Login` vs `./pages/login.jsx`) hanya terdeteksi saat build di Linux.
- Cache npm dikonfigurasi untuk dua folder: `server/package-lock.json` dan `client/package-lock.json`.