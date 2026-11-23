import { describe, it, expect } from "vitest";
import {
  KATEGORI,
  pengeluaranAwal,
  isPakan,
  validasiPengeluaran,
  buatPengeluaran,
  buatId,
  filterPengeluaran,
  urutkanTerbaru,
  totalPengeluaran,
  totalPerKategori,
  stokMasukPerBahan,
} from "./pengeluaran";

const formPakanValid = {
  tanggal: "2026-11-20",
  kategori: "Pakan",
  keterangan: "Beli dedak",
  nominal: "800000",
  bahan: "Dedak",
  jumlahKg: "200",
};

describe("isPakan", () => {
  it("true hanya untuk kategori Pakan", () => {
    expect(isPakan("Pakan")).toBe(true);
    expect(isPakan("Lainnya")).toBe(false);
  });
});

describe("validasiPengeluaran", () => {
  it("lolos untuk data pakan yang lengkap", () => {
    expect(validasiPengeluaran(formPakanValid)).toEqual({});
  });

  it("lolos untuk kategori non-pakan tanpa bahan dan jumlah", () => {
    const data = {
      tanggal: "2026-11-20",
      kategori: "Listrik/Air",
      keterangan: "Tagihan air",
      nominal: "150000",
    };
    expect(validasiPengeluaran(data)).toEqual({});
  });

  it("menandai semua field dasar yang kosong", () => {
    const errors = validasiPengeluaran({
      tanggal: "",
      kategori: "",
      keterangan: "   ",
      nominal: "",
    });
    expect(Object.keys(errors).sort()).toEqual([
      "kategori",
      "keterangan",
      "nominal",
      "tanggal",
    ]);
  });

  it("menolak nominal nol atau negatif", () => {
    expect(
      validasiPengeluaran({ ...formPakanValid, nominal: "0" }).nominal,
    ).toBeDefined();
    expect(
      validasiPengeluaran({ ...formPakanValid, nominal: "-5000" }).nominal,
    ).toBeDefined();
  });

  it("kategori pakan wajib bahan dan jumlah Kg", () => {
    const errors = validasiPengeluaran({
      ...formPakanValid,
      bahan: "",
      jumlahKg: "0",
    });
    expect(errors.bahan).toBeDefined();
    expect(errors.jumlahKg).toBeDefined();
  });

  it("kategori non-pakan tidak memeriksa bahan dan jumlah Kg", () => {
    const errors = validasiPengeluaran({
      ...formPakanValid,
      kategori: "Lainnya",
      bahan: "",
      jumlahKg: "",
    });
    expect(errors.bahan).toBeUndefined();
    expect(errors.jumlahKg).toBeUndefined();
  });
});

describe("buatPengeluaran", () => {
  it("mengubah string menjadi angka dan menyimpan data pakan", () => {
    expect(buatPengeluaran(formPakanValid, 7)).toEqual({
      id: 7,
      tanggal: "2026-11-20",
      kategori: "Pakan",
      keterangan: "Beli dedak",
      nominal: 800000,
      bahan: "Dedak",
      jumlahKg: 200,
    });
  });

  it("mengosongkan bahan dan jumlah Kg untuk kategori non-pakan", () => {
    const hasil = buatPengeluaran(
      { ...formPakanValid, kategori: "Lainnya", keterangan: "  Servis pompa  " },
      8,
    );
    expect(hasil.bahan).toBeNull();
    expect(hasil.jumlahKg).toBeNull();
    expect(hasil.keterangan).toBe("Servis pompa");
  });
});

describe("buatId", () => {
  it("mulai dari 1 jika daftar kosong", () => {
    expect(buatId([])).toBe(1);
  });

  it("memakai id terbesar + 1", () => {
    expect(buatId(pengeluaranAwal)).toBe(6);
  });
});

describe("filterPengeluaran", () => {
  it("tanpa filter mengembalikan semua data", () => {
    expect(filterPengeluaran(pengeluaranAwal)).toHaveLength(5);
  });

  it("memfilter per kategori", () => {
    const hasil = filterPengeluaran(pengeluaranAwal, { kategori: "Pakan" });
    expect(hasil).toHaveLength(2);
    expect(hasil.every((item) => item.kategori === "Pakan")).toBe(true);
  });

  it("memfilter per bulan", () => {
    expect(filterPengeluaran(pengeluaranAwal, { bulan: "2026-11" })).toHaveLength(5);
    expect(filterPengeluaran(pengeluaranAwal, { bulan: "2026-10" })).toHaveLength(0);
  });

  it("menggabungkan filter kategori dan bulan", () => {
    const hasil = filterPengeluaran(pengeluaranAwal, {
      kategori: "Listrik/Air",
      bulan: "2026-11",
    });
    expect(hasil.map((item) => item.id)).toEqual([4]);
  });
});

describe("urutkanTerbaru", () => {
  it("mengurutkan tanggal terbaru lebih dulu", () => {
    const hasil = urutkanTerbaru(pengeluaranAwal);
    expect(hasil.map((item) => item.id)).toEqual([5, 4, 3, 2, 1]);
  });

  it("tanggal sama diurutkan dari id terbesar", () => {
    const daftar = [
      { id: 1, tanggal: "2026-11-10", nominal: 1 },
      { id: 2, tanggal: "2026-11-10", nominal: 1 },
    ];
    expect(urutkanTerbaru(daftar).map((item) => item.id)).toEqual([2, 1]);
  });

  it("tidak mengubah array asli", () => {
    const salinan = [...pengeluaranAwal];
    urutkanTerbaru(pengeluaranAwal);
    expect(pengeluaranAwal).toEqual(salinan);
  });
});

describe("totalPengeluaran", () => {
  it("menjumlahkan semua nominal", () => {
    expect(totalPengeluaran(pengeluaranAwal)).toBe(4070000);
  });

  it("0 untuk daftar kosong", () => {
    expect(totalPengeluaran([])).toBe(0);
  });
});

describe("totalPerKategori", () => {
  it("menjumlahkan per kategori dan semua kategori selalu ada", () => {
    const hasil = totalPerKategori(pengeluaranAwal);
    expect(Object.keys(hasil)).toEqual(KATEGORI);
    expect(hasil["Pakan"]).toBe(2700000);
    expect(hasil["Obat/Vaksin"]).toBe(350000);
    expect(hasil["Listrik/Air"]).toBe(420000);
    expect(hasil["Perawatan Kandang"]).toBe(600000);
    expect(hasil["Lainnya"]).toBe(0);
  });
});
describe("stokMasukPerBahan", () => {
  it("menjumlahkan Kg pakan per bahan dari kategori Pakan saja", () => {
    expect(stokMasukPerBahan(pengeluaranAwal)).toEqual({
      Jagung: 300,
      Konsentrat: 100,
    });
  });

  it("menggabungkan beberapa pembelian bahan yang sama", () => {
    const daftar = [
      ...pengeluaranAwal,
      { id: 6, tanggal: "2026-11-20", kategori: "Pakan", keterangan: "Beli jagung", nominal: 500000, bahan: "Jagung", jumlahKg: 100 },
    ];
    expect(stokMasukPerBahan(daftar).Jagung).toBe(400);
  });

  it("objek kosong jika tidak ada pengeluaran pakan", () => {
    expect(stokMasukPerBahan([])).toEqual({});
  });
});