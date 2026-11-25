export const BAHAN_PAKAN = ["Jagung", "Konsentrat", "Dedak"];
export const BATAS_MENIPIS_AWAL = 100; // Kg

// Data dummy, nanti diganti data dari Operasional (Pengeluaran)
export const stokMasukAwal = [
  {
    id: 1,
    tanggal: "2026-11-03",
    bahan: { Jagung: 400, Konsentrat: 250, Dedak: 150 },
  },
  {
    id: 2,
    tanggal: "2026-11-10",
    bahan: { Jagung: 300, Konsentrat: 200, Dedak: 100 },
  },
  {
    id: 3,
    tanggal: "2026-11-17",
    bahan: { Jagung: 350, Konsentrat: 40, Dedak: 80 },
  },
];

// Total berat satu kali stok masuk (otomatis dari jumlah bahan)
export const totalBerat = (bahan) =>
  BAHAN_PAKAN.reduce((jumlah, nama) => jumlah + (Number(bahan[nama]) || 0), 0);

// Total stok masuk per bahan (belum dikurangi penjualan)
export const hitungStok = (daftar) => {
  const stok = {};
  BAHAN_PAKAN.forEach((nama) => {
    stok[nama] = daftar.reduce(
      (jumlah, item) => jumlah + (Number(item.bahan[nama]) || 0),
      0,
    );
  });
  return stok;
};

// Status: "habis" | "menipis" | "aman"
export const statusStok = (jumlah, batas) => {
  if (jumlah <= 0) return "habis";
  if (jumlah < Number(batas)) return "menipis";
  return "aman";
};

// Bentuk transaksi penjualan (dipakai halaman Penjualan Lainnya):
// { id, tanggal, pembeli, items: [{ jenis, jumlah, harga }] }
// Hanya item dengan jenis yang termasuk BAHAN_PAKAN yang mengurangi stok.
export const hitungTerjual = (transaksi) => {
  const terjual = Object.fromEntries(BAHAN_PAKAN.map((nama) => [nama, 0]));
  transaksi.forEach((trx) => {
    trx.items.forEach((item) => {
      if (BAHAN_PAKAN.includes(item.jenis)) {
        terjual[item.jenis] += Number(item.jumlah) || 0;
      }
    });
  });
  return terjual;
};

const bulatkan = (angka) => Math.round(angka * 1000) / 1000;

// Stok tersedia = total stok masuk - total terjual
export const hitungStokTersedia = (stokMasuk, transaksi) => {
  const masuk = hitungStok(stokMasuk);
  const terjual = hitungTerjual(transaksi);
  return Object.fromEntries(
    BAHAN_PAKAN.map((nama) => [nama, bulatkan(masuk[nama] - terjual[nama])]),
  );
};

// Apakah daftar stok masuk (setelah diedit/dihapus) masih cukup
// untuk menutup semua penjualan yang sudah tercatat?
export const stokMasukAman = (stokMasukBaru, transaksi) => {
  const tersedia = hitungStokTersedia(stokMasukBaru, transaksi);
  return BAHAN_PAKAN.every((nama) => tersedia[nama] >= 0);
};