# CI Architecture & Pipeline Specification - Smart Egg Farm

## 1. Overview
Pipeline Continuous Integration (CI) dikonfigurasi menggunakan GitHub Actions untuk memvalidasi setiap perubahan kode (Pull Request / Push) ke cabang `main`.

## 2. Trigger Events
- **Push Events:** Cabang `main`.
- **Pull Request Events:** Target cabang `main`.

## 3. Workflow Jobs & Steps
1. **Checkout Code:** Mengambil versi kode terbaru dari repositori.
2. **Setup Node.js Environment:** Mengonfigurasi Node.js v18 dengan caching npm.
3. **Install Dependencies:** Mengunduh pustaka/paket dependensi proyek.
4. **Run Linter Check:** Memeriksa kesesuaian gaya penulisan kode (ESLint/Prettier).
5. **Structure Verification:** Memastikan tidak ada berkas konfigurasi kritis yang hilang.
