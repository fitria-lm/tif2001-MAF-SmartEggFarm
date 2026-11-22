import { describe, it, expect } from "vitest";
import {
  hitungTotal,
  buatIdOrder,
  selesaikanOrder,
  ringkasanSelesai,
  antreanAwal,
  selesaiAwal,
} from "./penjualan_telur";

describe("hitungTotal", () => {
  it("mengalikan berat dengan harga", () => {
    expect(hitungTotal(10, 28000)).toBe(280000);
  });
  it("mendukung berat desimal", () => {
    expect(hitungTotal(12.5, 28000)).toBe(350000);
  });
  it("mengembalikan 0 untuk input kosong atau tidak valid", () => {
    expect(hitungTotal("", 28000)).toBe(0);
    expect(hitungTotal(10, 0)).toBe(0);
    expect(hitungTotal(-5, 28000)).toBe(0);
  });
});

describe("buatIdOrder", () => {
  it("membuat ID berikutnya dari semua order", () => {
    expect(buatIdOrder([...antreanAwal, ...selesaiAwal])).toBe("ORD-007");
  });
  it("mulai dari ORD-001 jika kosong", () => {
    expect(buatIdOrder([])).toBe("ORD-001");
  });
});

describe("selesaikanOrder", () => {
  it("memindahkan order dari antrean ke selesai", () => {
    const hasil = selesaikanOrder(
      antreanAwal,
      selesaiAwal,
      "ORD-002",
      "2026-11-22",
    );
    expect(hasil.antrean).toHaveLength(2);
    expect(hasil.antrean.find((o) => o.id === "ORD-002")).toBeUndefined();
    expect(hasil.selesai[0].id).toBe("ORD-002");
    expect(hasil.selesai[0].tanggalSelesai).toBe("2026-11-22");
  });
  it("tidak mengubah data jika ID tidak ditemukan", () => {
    const hasil = selesaikanOrder(
      antreanAwal,
      selesaiAwal,
      "ORD-999",
      "2026-11-22",
    );
    expect(hasil.antrean).toBe(antreanAwal);
    expect(hasil.selesai).toBe(selesaiAwal);
  });
});

describe("ringkasanSelesai", () => {
  it("menghitung jumlah order, total berat, dan total pendapatan", () => {
    expect(ringkasanSelesai(selesaiAwal)).toEqual({
      jumlahOrder: 3,
      totalBerat: 45.5,
      totalPendapatan: 1258000,
    });
  });
  it("mengembalikan nol untuk data kosong", () => {
    expect(ringkasanSelesai([])).toEqual({
      jumlahOrder: 0,
      totalBerat: 0,
      totalPendapatan: 0,
    });
  });
});
