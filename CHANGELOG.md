# Changelog

Semua perubahan penting pada proyek Smart Egg Farm didokumentasikan di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
dan proyek ini menggunakan [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Sprint 1 (Pertemuan 6-9)

### Added

- CI workflow `.github/workflows/ci.yml` untuk server: lint (ESLint) + unit test (Jest + Supertest) pada setiap push dan pull request ke `main`.
- `.github/pull_request_template.md` dengan checklist QA/DevOps, scope modul, dan bukti pengujian.
- `.github/ISSUE_TEMPLATE/bug_report.md` dan `.github/ISSUE_TEMPLATE/feature_request.md`.
- Unit test auth pada `server/tests/auth.test.js`:
  - register: password hash bcrypt, validasi field kosong, duplikat username
  - login: JWT 24 jam, password salah, username tidak terdaftar, `JWT_SECRET` kosong
- Dokumentasi QA/DevOps:
  - `docs/ci_architecture.md` - arsitektur pipeline CI dan status implementasi
  - `docs/secrets_reference.md` - daftar environment variable dan aturan keamanan
  - `docs/test_matrix.md` - matriks skenario test otomatis
- `.gitignore` hardening: `.env`, `coverage/`, `dist/`, `node_modules/`, log.
- `server/eslint.config.js` dengan flat config untuk Node.js + CommonJS.
- Badge status CI pada `README.md`.

### Changed

- Rename `docs/tes_matrix.md` menjadi `docs/test_matrix.md` (perbaikan penamaan).
- `docs/ci_architecture.md` diselaraskan dengan kondisi aktual: job client ditandai `[PLANNED]` sampai konflik merge di folder `client/` diselesaikan.
- `ci.yml`: menghapus flag `--if-present` pada step lint agar CI gagal keras jika lint error.
- `cd.yml`: ditandai sebagai placeholder (no-op). Deploy sungguhan dijadwalkan Sprint 2.

### Fixed

- Test placeholder lama diganti dengan test nyata yang mengimpor `server/src/app.js` dan menguji perilaku controller auth.

### Planned (Sprint 2)

- Job client di `ci.yml`: `npm ci`, `npm run lint`, `npm test` (Vitest), `npm run build`.
- Naikkan Node.js di CI dari v20 ke v22.
- `server/tests/verifyToken.test.js` untuk middleware autentikasi (5 skenario).
- `"test:coverage": "jest --coverage"` di `server/package.json`.
- Branch protection `main`: required status check `Code Linting & Automated Unit Testing`.
- Implementasi deploy sungguhan di `cd.yml`.