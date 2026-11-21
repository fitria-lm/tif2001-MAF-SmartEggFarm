// Data dummy, nanti diganti data dari server
export const kandangAwal = [
  {
    id: 1,
    nama: "Kandang A",
    kapasitas: 1000,
    populasiAwal: 800,
    tanggalMasuk: "2026-08-01",
    umurMasukMinggu: 18,
  },
  {
    id: 2,
    nama: "Kandang B",
    kapasitas: 800,
    populasiAwal: 600,
    tanggalMasuk: "2026-09-15",
    umurMasukMinggu: 16,
  },
];

export const kematianAwal = [
  { id: 1, tanggal: "2026-10-05", kandangId: 1, jumlah: 5, penyebab: "Sakit" },
  { id: 2, tanggal: "2026-10-20", kandangId: 1, jumlah: 3, penyebab: "Stres panas" },
  { id: 3, tanggal: "2026-11-02", kandangId: 2, jumlah: 4, penyebab: "Sakit" },
];

// Total ayam mati di satu kandang
export const totalKematian = (kandangId, daftarKematian) =>
  daftarKematian
    .filter((item) => item.kandangId === kandangId)
    .reduce((jumlah, item) => jumlah + (Number(item.jumlah) || 0), 0);

// Populasi saat ini = populasi awal dikurangi total kematian
export const populasiSaatIni = (kandang, daftarKematian) =>
  Math.max(
    0,
    Number(kandang.populasiAwal) - totalKematian(kandang.id, daftarKematian),
  );

// Persentase kematian terhadap populasi awal (0 jika populasi awal 0)
export const persentaseKematian = (kandang, daftarKematian) => {
  const awal = Number(kandang.populasiAwal);
  if (awal <= 0) return 0;
  return (totalKematian(kandang.id, daftarKematian) / awal) * 100;
};

// Ringkasan seluruh kandang untuk kartu di atas halaman
export const hitungRingkasan = (daftarKandang, daftarKematian) => {
  const totalAwal = daftarKandang.reduce(
    (jumlah, k) => jumlah + (Number(k.populasiAwal) || 0),
    0,
  );
  const totalMati = daftarKematian.reduce(
    (jumlah, item) => jumlah + (Number(item.jumlah) || 0),
    0,
  );
  return {
    totalPopulasi: daftarKandang.reduce(
      (jumlah, k) => jumlah + populasiSaatIni(k, daftarKematian),
      0,
    ),
    totalMati,
    persen: totalAwal > 0 ? (totalMati / totalAwal) * 100 : 0,
  };
};

// Umur ayam sekarang (minggu) = umur saat masuk + minggu sejak tanggal masuk
export const umurSekarangMinggu = (kandang, hariIni = new Date()) => {
  const masuk = new Date(kandang.tanggalMasuk + "T00:00:00");
  const selisihHari = Math.floor((hariIni - masuk) / (1000 * 60 * 60 * 24));
  return Number(kandang.umurMasukMinggu) + Math.max(0, Math.floor(selisihHari / 7));
};

// Batas jumlah kematian yang boleh diinput = sisa populasi kandang (saat tambah/edit)
export const sisaPopulasi = (kandang, daftarKematian, abaikanId = null) => {
  const lain = daftarKematian.filter((item) => item.id !== abaikanId);
  return Math.max(0, Number(kandang.populasiAwal) - totalKematian(kandang.id, lain));
};