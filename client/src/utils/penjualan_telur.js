export const GRADE_TELUR = ["A", "B", "C"];

// Total harga = berat (kg) x harga per kg. Input tidak valid menghasilkan 0.
export function hitungTotal(berat, harga) {
  const b = Number(berat);
  const h = Number(harga);
  if (!Number.isFinite(b) || !Number.isFinite(h) || b <= 0 || h <= 0) {
    return 0;
  }
  return Math.round(b * h);
}

// ID berikutnya, misalnya ORD-007, dari gabungan antrean dan selesai.
export function buatIdOrder(semuaOrder) {
  const maks = semuaOrder.reduce(
    (m, o) => Math.max(m, Number(o.id.replace("ORD-", "")) || 0),
    0,
  );
  return `ORD-${String(maks + 1).padStart(3, "0")}`;
}

// Pindahkan order dari antrean ke selesai. ID tidak ditemukan: data tidak berubah.
export function selesaikanOrder(antrean, selesai, id, tanggalSelesai) {
  const order = antrean.find((o) => o.id === id);
  if (!order) return { antrean, selesai };
  return {
    antrean: antrean.filter((o) => o.id !== id),
    selesai: [{ ...order, tanggalSelesai }, ...selesai],
  };
}

export function ringkasanSelesai(selesai) {
  const totalBerat = selesai.reduce((s, o) => s + o.berat, 0);
  return {
    jumlahOrder: selesai.length,
    totalBerat: Math.round(totalBerat * 100) / 100,
    totalPendapatan: selesai.reduce((s, o) => s + o.total, 0),
  };
}

export const antreanAwal = [
  {
    id: "ORD-001",
    nama: "Bu Sari",
    tanggal: "2026-11-22",
    grade: "A",
    berat: 10,
    harga: 28000,
    total: 280000,
  },
  {
    id: "ORD-002",
    nama: "Pak Budi",
    tanggal: "2026-11-22",
    grade: "B",
    berat: 15,
    harga: 26000,
    total: 390000,
  },
  {
    id: "ORD-003",
    nama: "Warung Makmur",
    tanggal: "2026-11-21",
    grade: "C",
    berat: 20,
    harga: 24000,
    total: 480000,
  },
];

export const selesaiAwal = [
  {
    id: "ORD-004",
    nama: "Toko Sejahtera",
    tanggal: "2026-11-20",
    grade: "A",
    berat: 25,
    harga: 28000,
    total: 700000,
    tanggalSelesai: "2026-11-20",
  },
  {
    id: "ORD-005",
    nama: "Bu Ani",
    tanggal: "2026-11-19",
    grade: "B",
    berat: 8,
    harga: 26000,
    total: 208000,
    tanggalSelesai: "2026-11-19",
  },
  {
    id: "ORD-006",
    nama: "Pak Joko",
    tanggal: "2026-11-18",
    grade: "A",
    berat: 12.5,
    harga: 28000,
    total: 350000,
    tanggalSelesai: "2026-11-18",
  },
];
