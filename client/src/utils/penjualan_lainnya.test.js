import { describe, it, expect } from "vitest";
import {
  JENIS_BARANG,
  transaksiAwal,
  namaBarang,
  subtotalItem,
  totalTransaksi,
  totalPenjualan,
  jumlahTransaksi,
  jumlahPakanDiKeranjang,
  sisaStokSetelahKeranjang,
  validasiItem,
  validasiCheckout,
  buatTransaksi,
} from "./penjualan_lainnya";

const stok = { Jagung: 100, Konsentrat: 0, Dedak: 50 };

describe("perhitungan", () => {
  it("subtotal = jumlah x harga", () => {
    expect(subtotalItem({ jenis: "Jagung", jumlah: 10, harga: 6000 })).toBe(60000);
  });

  it("total transaksi menjumlahkan semua barang", () => {
    expect(totalTransaksi(transaksiAwal[0])).toBe(50 * 6000 + 20 * 4500);
  });

  it("total penjualan dan jumlah transaksi", () => {
    expect(totalPenjualan(transaksiAwal)).toBe(
      50 * 6000 + 20 * 4500 + 30 * 2000 + 12 * 35000,
    );
    expect(jumlahTransaksi(transaksiAwal)).toBe(2);
    expect(totalPenjualan([])).toBe(0);
  });

  it("nama barang: Lainnya memakai nama yang diketik", () => {
    expect(namaBarang({ jenis: "Lainnya", nama: "Karung bekas" })).toBe("Karung bekas");
    expect(namaBarang({ jenis: "Jagung" })).toBe("Jagung");
  });

  it("daftar jenis barang memuat pakan pokok dan barang tanpa stok", () => {
    expect(JENIS_BARANG).toEqual([
      "Jagung",
      "Konsentrat",
      "Dedak",
      "Pakan Sisa",
      "Ayam Afkir",
      "Lainnya",
    ]);
  });
});

describe("keranjang dan stok", () => {
  const items = [
    { jenis: "Jagung", jumlah: 30, harga: 6000 },
    { jenis: "Jagung", jumlah: 20, harga: 6000 },
    { jenis: "Pakan Sisa", jumlah: 500, harga: 2000 },
  ];

  it("menjumlahkan pakan pokok di keranjang dan mengabaikan barang tanpa stok", () => {
    expect(jumlahPakanDiKeranjang(items)).toEqual({ Jagung: 50, Konsentrat: 0, Dedak: 0 });
  });

  it("sisa stok setelah keranjang", () => {
    expect(sisaStokSetelahKeranjang(stok, items)).toEqual({
      Jagung: 50,
      Konsentrat: 0,
      Dedak: 50,
    });
  });
});

describe("validasiItem", () => {
  it("lolos untuk pakan dengan stok cukup", () => {
    expect(validasiItem({ jenis: "Jagung", jumlah: 100, harga: 6000 }, stok)).toBe("");
  });

  it("menolak jumlah melebihi stok", () => {
    expect(validasiItem({ jenis: "Jagung", jumlah: 101, harga: 6000 }, stok)).toContain(
      "tidak cukup",
    );
  });

  it("menolak barang yang stoknya habis", () => {
    expect(validasiItem({ jenis: "Konsentrat", jumlah: 1, harga: 7000 }, stok)).toBe(
      "Stok Konsentrat habis.",
    );
  });

  it("memperhitungkan barang yang sudah ada di keranjang", () => {
    const sudahAda = [{ jenis: "Jagung", jumlah: 80, harga: 6000 }];
    expect(
      validasiItem({ jenis: "Jagung", jumlah: 30, harga: 6000 }, stok, sudahAda),
    ).toContain("sisa 20 Kg");
  });

  it("barang tanpa stok tidak dicek stok", () => {
    expect(validasiItem({ jenis: "Pakan Sisa", jumlah: 9999, harga: 1000 }, stok)).toBe("");
  });

  it("menolak jumlah atau harga yang tidak valid", () => {
    expect(validasiItem({ jenis: "Dedak", jumlah: 0, harga: 4000 }, stok)).toContain("Jumlah");
    expect(validasiItem({ jenis: "Dedak", jumlah: 5, harga: 0 }, stok)).toContain("Harga");
    expect(validasiItem({ jenis: "", jumlah: 5, harga: 100 }, stok)).toContain("jenis");
  });

  it("Lainnya wajib punya nama", () => {
    expect(validasiItem({ jenis: "Lainnya", nama: " ", jumlah: 1, harga: 100 }, stok)).toContain(
      "Nama barang",
    );
    expect(validasiItem({ jenis: "Lainnya", nama: "Karung", jumlah: 1, harga: 100 }, stok)).toBe("");
  });
});

describe("validasiCheckout", () => {
  const dasar = { tanggal: "2026-11-22", pembeli: "Pak Joko" };

  it("lolos jika semua benar", () => {
    const items = [
      { jenis: "Jagung", jumlah: 40, harga: 6000 },
      { jenis: "Ayam Afkir", jumlah: 10, harga: 35000 },
    ];
    expect(validasiCheckout({ ...dasar, items }, stok)).toEqual([]);
  });

  it("menolak keranjang kosong, tanggal, dan pembeli kosong", () => {
    const errors = validasiCheckout({ tanggal: "", pembeli: " ", items: [] }, stok);
    expect(errors).toHaveLength(3);
  });

  it("menolak jenis yang sama di dua baris jika totalnya melebihi stok", () => {
    const items = [
      { jenis: "Dedak", jumlah: 30, harga: 4000 },
      { jenis: "Dedak", jumlah: 30, harga: 4000 },
    ];
    const errors = validasiCheckout({ ...dasar, items }, stok);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("Stok Dedak tidak cukup");
  });
});

describe("buatTransaksi", () => {
  it("membuat id baru dan membersihkan data", () => {
    const trx = buatTransaksi(transaksiAwal, {
      tanggal: "2026-11-22",
      pembeli: "  Pak Joko ",
      items: [
        { jenis: "Jagung", jumlah: "10", harga: "6000" },
        { jenis: "Lainnya", nama: " Karung ", jumlah: "2", harga: "1500" },
      ],
    });
    expect(trx.id).toBe(3);
    expect(trx.pembeli).toBe("Pak Joko");
    expect(trx.items).toEqual([
      { jenis: "Jagung", jumlah: 10, harga: 6000 },
      { jenis: "Lainnya", nama: "Karung", jumlah: 2, harga: 1500 },
    ]);
  });

  it("id pertama adalah 1 jika belum ada transaksi", () => {
    const trx = buatTransaksi([], {
      tanggal: "2026-11-22",
      pembeli: "A",
      items: [{ jenis: "Dedak", jumlah: 1, harga: 1 }],
    });
    expect(trx.id).toBe(1);
  });
});