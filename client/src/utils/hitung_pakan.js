const keAngka = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export function hitungPakan({ kebutuhanGram, jumlahAyam, bahan }) {
  const konsumsiPerHari = (keAngka(kebutuhanGram) * keAngka(jumlahAyam)) / 1000;

  const rows = bahan.map((b) => {
    const persen = keAngka(b.persen);
    const harga = keAngka(b.harga) > 0 ? keAngka(b.harga) : null;
    const kg = (konsumsiPerHari * persen) / 100;
    return {
      id: b.id,
      nama: (b.nama ?? "").trim(),
      persen,
      kg,
      harga,
      biaya: harga === null ? null : kg * harga,
    };
  });

  const totalPersen = rows.reduce((t, r) => t + r.persen, 0);
  const totalKg = rows.reduce((t, r) => t + r.kg, 0);
  const persenValid = Math.abs(totalPersen - 100) < 0.005;

  const adaHarga = rows.some((r) => r.harga !== null);
  const biayaLengkap =
    adaHarga && rows.every((r) => r.persen === 0 || r.harga !== null);

  return {
    konsumsiPerHari,
    rows,
    totalPersen,
    totalKg,
    persenValid,
    adaHarga,
    biayaLengkap,
    totalBiaya: biayaLengkap
      ? rows.reduce((t, r) => t + (r.biaya ?? 0), 0)
      : null,
    biayaPerKgPakan: biayaLengkap
      ? rows.reduce((t, r) => t + (r.persen / 100) * (r.harga ?? 0), 0)
      : null,
  };
}