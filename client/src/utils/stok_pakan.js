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

// Stok saat ini per bahan = total semua stok masuk
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