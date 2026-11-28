// Logika Panen: header (kandang, tanggal) + rincian per grade telur.
// Total butir dan total berat tidak disimpan, selalu dijumlahkan dari rincian.

export const TIPE_TELUR = ["A", "B", "C"];

// Data dummy, nanti diganti data dari API
export const PANEN_AWAL = [
  {
    idPanen: 1,
    tanggal: "2026-10-23",
    kandang: "Kandang A",
    detail: [
      { tipeTelur: "A", jumlahTelur: 1700, beratPanenKg: 140.0 },
      { tipeTelur: "B", jumlahTelur: 900, beratPanenKg: 70.5 },
      { tipeTelur: "C", jumlahTelur: 350, beratPanenKg: 35.0 },
    ],
  },
  {
    idPanen: 2,
    tanggal: "2026-10-24",
    kandang: "Kandang B",
    detail: [
      { tipeTelur: "A", jumlahTelur: 1750, beratPanenKg: 145.0 },
      { tipeTelur: "B", jumlahTelur: 850, beratPanenKg: 68.0 },
      { tipeTelur: "C", jumlahTelur: 400, beratPanenKg: 37.0 },
    ],
  },
  {
    idPanen: 3,
    tanggal: "2026-10-25",
    kandang: "Kandang A",
    detail: [
      { tipeTelur: "A", jumlahTelur: 1800, beratPanenKg: 150.0 },
      { tipeTelur: "B", jumlahTelur: 900, beratPanenKg: 70.2 },
      { tipeTelur: "C", jumlahTelur: 400, beratPanenKg: 38.0 },
    ],
  },
];

const bulatkan1 = (n) => Math.round(n * 10) / 10;
const kosong = (v) => v === "" || v === null || v === undefined;

// 3 -> "PNN-003" (ID ditampilkan, bukan disimpan)
export function formatIdPanen(idPanen) {
  return `PNN-${String(idPanen).padStart(3, "0")}`;
}

export function idPanenBerikutnya(data) {
  return Math.max(0, ...data.map((p) => p.idPanen)) + 1;
}

export function totalButir(panen) {
  return panen.detail.reduce((sum, d) => sum + d.jumlahTelur, 0);
}

export function totalBeratKg(panen) {
  return bulatkan1(panen.detail.reduce((sum, d) => sum + d.beratPanenKg, 0));
}

// Baris form kosong: satu baris per grade
export function buatBarisKosong() {
  return TIPE_TELUR.map((tipeTelur) => ({
    tipeTelur,
    jumlahTelur: "",
    beratPanenKg: "",
  }));
}

// Panen tersimpan -> baris form (untuk Edit). Grade yang tidak ada dikosongkan.
export function panenKeBaris(panen) {
  return TIPE_TELUR.map((tipeTelur) => {
    const d = panen.detail.find((x) => x.tipeTelur === tipeTelur);
    return {
      tipeTelur,
      jumlahTelur: d ? d.jumlahTelur : "",
      beratPanenKg: d ? d.beratPanenKg : "",
    };
  });
}

// Validasi input form mentah. Error rincian dikunci per tipe telur.
export function validasiPanen({ tanggal, kandang, baris }) {
  const errors = { baris: {} };

  if (!tanggal) errors.tanggal = "Tanggal wajib diisi";
  if (!kandang) errors.kandang = "Kandang wajib dipilih";

  const tipeSeen = new Set();
  let terisi = 0;

  baris.forEach((b) => {
    const butirKosong = kosong(b.jumlahTelur);
    const beratKosong = kosong(b.beratPanenKg);
    if (butirKosong && beratKosong) return; // grade tidak ada hari itu

    if (tipeSeen.has(b.tipeTelur)) {
      errors.umum = "Satu grade hanya boleh muncul satu kali";
      return;
    }
    tipeSeen.add(b.tipeTelur);
    terisi += 1;

    const butir = Number(b.jumlahTelur);
    const berat = Number(b.beratPanenKg);
    const err = {};
    if (butirKosong || !Number.isInteger(butir) || butir <= 0) {
      err.jumlahTelur = "Butir harus bilangan bulat lebih dari 0";
    }
    if (beratKosong || !Number.isFinite(berat) || berat <= 0) {
      err.beratPanenKg = "Berat harus lebih dari 0";
    }
    if (Object.keys(err).length > 0) errors.baris[b.tipeTelur] = err;
  });

  if (terisi === 0 && !errors.umum) {
    errors.umum = "Minimal satu grade harus diisi";
  }

  const valid =
    !errors.tanggal &&
    !errors.kandang &&
    !errors.umum &&
    Object.keys(errors.baris).length === 0;

  return { valid, errors };
}

// Input form (sudah valid) -> objek panen siap disimpan
export function buatPanen({ tanggal, kandang, baris }, idPanen) {
  const detail = baris
    .filter((b) => !(kosong(b.jumlahTelur) && kosong(b.beratPanenKg)))
    .map((b) => ({
      tipeTelur: b.tipeTelur,
      jumlahTelur: Number(b.jumlahTelur),
      beratPanenKg: bulatkan1(Number(b.beratPanenKg)),
    }));
  return { idPanen, tanggal, kandang, detail };
}