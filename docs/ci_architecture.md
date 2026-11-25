# CI Architecture & Pipeline Specification - Smart Egg Farm

## Status Implementasi (Sprint 1)

Dokumen ini menggambarkan arsitektur target CI. Kondisi aktual per Sprint 1:

| Aspek | Target | Implementasi Saat Ini | Catatan |
|---|---|---|---|
| Scope job | Server + Client | Server saja | Job client menunggu konflik `client/` diselesaikan (Mhs 1) |
| Node.js | v22 | v20 | Naik ke v22 bersamaan aktivasi job client |
| Cache npm | Server + Client | Server saja | Menyesuaikan scope job |
| Branch protection `main` | Required status check | Belum dikonfigurasi | Dijadwalkan setelah CI hijau stabil |

Bagian yang ditandai **[PLANNED]** belum ada di `.github/workflows/ci.yml`.

## 1. Overview

Pipeline Continuous Integration (CI) dikonfigurasi menggunakan GitHub Actions untuk memvalidasi setiap perubahan kode (Pull Request / Push) ke cabang `main`.

- Saat ini: CI mencakup server (lint + unit test).
- Target (Sprint 2): CI mencakup server + client (lint + test + build).

## 2. Trigger Events

- Push Events: Cabang `main`.
- Pull Request Events: Target cabang `main`.

## 3. Workflow Jobs & Steps

### 3.1 Server (backend) - Implemented

1. Checkout Code: `actions/checkout@v4`.
2. Setup Node.js Environment: Node.js v20 dengan caching npm, mengacu ke `server/package-lock.json`.
3. Install Dependencies (server): `npm ci` di folder `server`.
4. Run Linter (server): `npm run lint` (ESLint sesuai `server/eslint.config.js`). CI gagal keras jika lint error - tidak ada `--if-present`.
5. Run Unit Tests (server): `npm test` (Jest + Supertest). Detail di `docs/test_matrix.md`.

### 3.2 Client (frontend) - [PLANNED] Sprint 2

Akan diaktifkan setelah konflik merge di folder `client/` diselesaikan dan branch `feat/client-auth-pages` (Mhs 1) di-merge ke `main`.

6. Install Dependencies (client): `npm ci` di folder `client`.
7. Run Linter (client): `npm run lint` (ESLint sesuai `client/eslint.config.js`).
8. Run Unit Tests (client): `npm test` (Vitest).
9. Build (client): `npm run build` - memastikan import case-sensitive (Linux) dan bundle valid.

## 4. Branch Protection (main) - [PLANNED]

Konfigurasi yang direncanakan di Settings -> Branches -> Branch protection rules untuk `main`:

- Require a pull request before merging.
- Require approvals (minimal 1).
- Require status checks to pass before merging:
  - `Code Linting & Automated Unit Testing` (dari `ci.yml`)
- Require branches to be up to date before merging.
- Allow force pushes: disabled.
- Allow deletions: disabled.

Status: belum dikonfigurasi. Akan diaktifkan setelah CI hijau stabil minimal 1 sprint. Bukti screenshot akan dilampirkan di PR Sprint 1.

## 5. Catatan Penting

- Langkah Build (client) wajib ada saat job client diaktifkan, karena masalah huruf besar/kecil pada `import` (mis. `./pages/Login` vs `./pages/login.jsx`) hanya terdeteksi saat build di Linux.
- Cache npm saat ini hanya untuk `server/package-lock.json`. Saat job client aktif, tambahkan `client/package-lock.json` ke `cache-dependency-path`.
- `cd.yml` masih placeholder (no-op). Deploy sungguhan dijadwalkan Sprint 2 dan akan didokumentasikan di sini.