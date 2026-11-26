import { describe, it, expect } from "vitest";
import {
  stokMasukAwal,
  hitungStok,
  hitungTerjual,
  hitungStokTersedia,
  stokMasukAman,
} from "./stok_pakan";

const transaksiContoh = [
  {
    id: 1,
    tanggal: "2026-11-20",
    pembeli: "Pak Budi",
    items: [
      { jenis: "Jagung", jumlah: 100, harga: 5000 },
      { jenis: "Dedak", jumlah: 30, harga: 4000 },
      { jenis: "Pakan Sisa", jumlah: 50, harga: 1000 },
    ],
  },
  {
    id: 2,
    tanggal: "2026-11-21",
    pembeli: "Bu Sari",
    items: [{ jenis: "Jagung", jumlah: 50.5, harga: 5000 }],
  },
];

describe("hitungTerjual", () => {
  it("bernilai 0 untuk semua bahan jika belum ada transaksi", () => {
    expect(hitungTerjual([])).toEqual({ Jagung: 0, Konsentrat: 0, Dedak: 0 });
  });

  it("menjumlahkan pakan pokok antar transaksi dan mengabaikan barang lain", () => {
    expect(hitungTerjual(transaksiContoh)).toEqual({
      Jagung: 150.5,
      Konsentrat: 0,
      Dedak: 30,
    });
  });
});

describe("hitungStokTersedia", () => {
  it("sama dengan total stok masuk jika belum ada penjualan", () => {
    expect(hitungStokTersedia(stokMasukAwal, [])).toEqual(
      hitungStok(stokMasukAwal),
    );
  });

  it("stok masuk dikurangi terjual", () => {
    expect(hitungStokTersedia(stokMasukAwal, transaksiContoh)).toEqual({
      Jagung: 1050 - 150.5,
      Konsentrat: 490,
      Dedak: 300,
    });
  });
});

describe("stokMasukAman", () => {
  it("aman jika stok masuk tidak diubah", () => {
    expect(stokMasukAman(stokMasukAwal, transaksiContoh)).toBe(true);
  });

  it("tidak aman jika stok masuk dihapus sehingga stok tersedia negatif", () => {
    const tanpaJagung = stokMasukAwal.map((item) => ({
      ...item,
      bahan: { ...item.bahan, Jagung: 0 },
    }));
    expect(stokMasukAman(tanpaJagung, transaksiContoh)).toBe(false);
  });

  it("aman jika stok tepat habis (sama dengan yang terjual)", () => {
    const pas = [
      { id: 1, tanggal: "2026-11-01", bahan: { Jagung: 150.5, Konsentrat: 0, Dedak: 30 } },
    ];
    expect(stokMasukAman(pas, transaksiContoh)).toBe(true);
  });
});