import { describe, it, expect } from "vitest";
import {
  kandangAwal,
  kematianAwal,
  totalKematian,
  populasiSaatIni,
  persentaseKematian,
  hitungRingkasan,
  umurSekarangMinggu,
  sisaPopulasi,
} from "./data_kandang";

const [kandangA, kandangB] = kandangAwal;

describe("totalKematian", () => {
  it("menjumlahkan kematian hanya untuk kandang yang dipilih", () => {
    expect(totalKematian(1, kematianAwal)).toBe(8);
    expect(totalKematian(2, kematianAwal)).toBe(4);
  });

  it("mengembalikan 0 jika tidak ada catatan", () => {
    expect(totalKematian(1, [])).toBe(0);
    expect(totalKematian(99, kematianAwal)).toBe(0);
  });
});

describe("populasiSaatIni", () => {
  it("populasi awal dikurangi total kematian", () => {
    expect(populasiSaatIni(kandangA, kematianAwal)).toBe(792);
    expect(populasiSaatIni(kandangB, kematianAwal)).toBe(596);
  });

  it("tidak pernah bernilai negatif", () => {
    const kandang = { id: 5, populasiAwal: 10 };
    const kematian = [{ id: 1, kandangId: 5, jumlah: 15 }];
    expect(populasiSaatIni(kandang, kematian)).toBe(0);
  });
});

describe("persentaseKematian", () => {
  it("menghitung persen terhadap populasi awal", () => {
    expect(persentaseKematian(kandangA, kematianAwal)).toBeCloseTo(1, 5);
    expect(persentaseKematian(kandangB, kematianAwal)).toBeCloseTo(0.667, 2);
  });

  it("mengembalikan 0 jika populasi awal 0", () => {
    const kandang = { id: 7, populasiAwal: 0 };
    expect(persentaseKematian(kandang, [])).toBe(0);
  });
});

describe("hitungRingkasan", () => {
  it("menghitung total populasi, kematian, dan persen seluruh kandang", () => {
    const hasil = hitungRingkasan(kandangAwal, kematianAwal);
    expect(hasil.totalPopulasi).toBe(1388);
    expect(hasil.totalMati).toBe(12);
    expect(hasil.persen).toBeCloseTo(0.857, 2);
  });

  it("semua nol jika belum ada kandang", () => {
    expect(hitungRingkasan([], [])).toEqual({
      totalPopulasi: 0,
      totalMati: 0,
      persen: 0,
    });
  });
});

describe("umurSekarangMinggu", () => {
  it("umur masuk ditambah minggu penuh sejak tanggal masuk", () => {
    const hariIni = new Date("2026-08-29T00:00:00"); // 28 hari = 4 minggu
    expect(umurSekarangMinggu(kandangA, hariIni)).toBe(22);
  });

  it("belum genap seminggu tidak menambah umur", () => {
    const hariIni = new Date("2026-08-05T00:00:00"); // 4 hari
    expect(umurSekarangMinggu(kandangA, hariIni)).toBe(18);
  });

  it("tanggal sebelum tanggal masuk tidak mengurangi umur", () => {
    const hariIni = new Date("2026-07-01T00:00:00");
    expect(umurSekarangMinggu(kandangA, hariIni)).toBe(18);
  });
});

describe("sisaPopulasi", () => {
  it("populasi awal dikurangi kematian kandang tersebut", () => {
    expect(sisaPopulasi(kandangA, kematianAwal)).toBe(792);
  });

  it("saat edit, catatan yang sedang diedit tidak ikut dihitung", () => {
    // catatan id 1 (5 ekor) diabaikan -> 800 - 3 = 797
    expect(sisaPopulasi(kandangA, kematianAwal, 1)).toBe(797);
  });
});