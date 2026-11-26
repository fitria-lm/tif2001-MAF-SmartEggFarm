// Logika & data dummy halaman Operasional > Pengeluaran.

export const KATEGORI_PAKAN = "Pakan";

export const KATEGORI = [
  KATEGORI_PAKAN,
  "Obat/Vaksin",
  "Listrik/Air",
  "Perawatan Kandang",
  "Lainnya",
];

// Tanggal memakai format ISO (YYYY-MM-DD), sama seperti hasil <input type="date">.
// Untuk kategori Pakan, "bahan" dan "jumlahKg" terisi; kategori lain bernilai null.
export const pengeluaranAwal = [
  {
    id: 1,
    tanggal: "2026-11-02",
    kategori: "Pakan",
    keterangan: "Beli jagung giling",
    nominal: 1500000,
    bahan: "Jagung",
    jumlahKg: 300,
  },
  {
    id: 2,
    tanggal: "2026-11-05",
    kategori: "Pakan",
    keterangan: "Beli konsentrat",
    nominal: 1200000,
    bahan: "Konsentrat",
    jumlahKg: 100,
  },
  {
    id: 3,
    tanggal: "2026-11-08",
    kategori: "Obat/Vaksin",
    keterangan: "Vaksin ND dan vitamin",
    nominal: 350000,
    bahan: null,
    jumlahKg: null,
  },
  {
    id: 4,
    tanggal: "2026-11-12",
    kategori: "Listrik/Air",
    keterangan: "Tagihan listrik kandang",
    nominal: 420000,
    bahan: null,
    jumlahKg: null,
  },
  {
    id: 5,
    tanggal: "2026-11-18",
    kategori: "Perawatan Kandang",
    keterangan: "Perbaikan atap kandang",
    nominal: 600000,
    bahan: null,
    jumlahKg: null,
  },
];

export function isPakan(kategori) {
  return kategori === KATEGORI_PAKAN;
}

// Mengembalikan objek error per field. Objek kosong berarti data valid.
export function validasiPengeluaran(data) {
  const errors = {};

  if (!data.tanggal) errors.tanggal = "Tanggal wajib diisi";
  if (!KATEGORI.includes(data.kategori)) errors.kategori = "Pilih kategori";
  if (!String(data.keterangan ?? "").trim()) {
    errors.keterangan = "Keterangan wajib diisi";
  }
  if (!(Number(data.nominal) > 0)) {
    errors.nominal = "Nominal harus lebih dari 0";
  }

  if (isPakan(data.kategori)) {
    if (!data.bahan) errors.bahan = "Pilih jenis bahan";
    if (!(Number(data.jumlahKg) > 0)) {
      errors.jumlahKg = "Jumlah harus lebih dari 0";
    }
  }

  return errors;
}

// Mengubah isi form (semua string) menjadi data pengeluaran yang rapi.
export function buatPengeluaran(data, id) {
  const pakan = isPakan(data.kategori);
  return {
    id,
    tanggal: data.tanggal,
    kategori: data.kategori,
    keterangan: String(data.keterangan).trim(),
    nominal: Number(data.nominal),
    bahan: pakan ? data.bahan : null,
    jumlahKg: pakan ? Number(data.jumlahKg) : null,
  };
}

export function buatId(daftar) {
  if (daftar.length === 0) return 1;
  return Math.max(...daftar.map((item) => item.id)) + 1;
}

// kategori: "" = semua kategori. bulan: "YYYY-MM", "" = semua bulan.
export function filterPengeluaran(daftar, { kategori = "", bulan = "" } = {}) {
  return daftar.filter((item) => {
    const cocokKategori = !kategori || item.kategori === kategori;
    const cocokBulan = !bulan || item.tanggal.startsWith(bulan);
    return cocokKategori && cocokBulan;
  });
}

export function urutkanTerbaru(daftar) {
  return [...daftar].sort(
    (a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id,
  );
}

export function totalPengeluaran(daftar) {
  return daftar.reduce((total, item) => total + item.nominal, 0);
}

// Hasil: { Pakan: 0, "Obat/Vaksin": 0, ... } (semua kategori selalu ada).
export function totalPerKategori(daftar) {
  const hasil = Object.fromEntries(KATEGORI.map((k) => [k, 0]));
  daftar.forEach((item) => {
    hasil[item.kategori] += item.nominal;
  });
  return hasil;
}

export function stokMasukPerBahan(daftar) {
  const hasil = {};
  daftar.forEach((item) => {
    if (!isPakan(item.kategori)) return;
    hasil[item.bahan] = (hasil[item.bahan] ?? 0) + item.jumlahKg;
  });
  return hasil;
}