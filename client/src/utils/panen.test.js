import { describe, it, expect } from "vitest";
import {
  PANEN_AWAL,
  formatIdPanen,
  idPanenBerikutnya,
  totalButir,
  totalBeratKg,
  buatBarisKosong,
  panenKeBaris,
  validasiPanen,
  buatPanen,
} from "./panen";

const barisIsi = (a = {}, b = {}, c = {}) => [
  { tipeTelur: "A", jumlahTelur: "", beratPanenKg: "", ...a },
  { tipeTelur: "B", jumlahTelur: "", beratPanenKg: "", ...b },
  { tipeTelur: "C", jumlahTelur: "", beratPanenKg: "", ...c },
];

describe("format dan id", () => {
  it("memformat ID panen", () => {
    expect(formatIdPanen(3)).toBe("PNN-003");
    expect(formatIdPanen(125)).toBe("PNN-125");
  });

  it("menghitung ID berikutnya", () => {
    expect(idPanenBerikutnya([])).toBe(1);
    expect(idPanenBerikutnya(PANEN_AWAL)).toBe(4);
  });
});

describe("total panen", () => {
  it("menjumlahkan rincian (contoh Kandang A, 25 Okt)", () => {
    const p = PANEN_AWAL[2];
    expect(totalButir(p)).toBe(3100);
    expect(totalBeratKg(p)).toBe(258.2);
  });

  it("tidak terkena galat desimal", () => {
    const p = {
      detail: [
        { tipeTelur: "A", jumlahTelur: 1, beratPanenKg: 0.1 },
        { tipeTelur: "B", jumlahTelur: 1, beratPanenKg: 0.2 },
      ],
    };
    expect(totalBeratKg(p)).toBe(0.3);
  });
});

describe("validasiPanen", () => {
  const dasar = { tanggal: "2026-11-27", kandang: "Kandang A" };

  it("menerima satu grade saja", () => {
    const r = validasiPanen({
      ...dasar,
      baris: barisIsi({ jumlahTelur: "100", beratPanenKg: "6.5" }),
    });
    expect(r.valid).toBe(true);
  });

  it("menolak jika tidak ada grade terisi", () => {
    const r = validasiPanen({ ...dasar, baris: buatBarisKosong() });
    expect(r.valid).toBe(false);
    expect(r.errors.umum).toMatch(/Minimal satu grade/);
  });

  it("menolak grade yang tidak lengkap", () => {
    const r = validasiPanen({
      ...dasar,
      baris: barisIsi({ jumlahTelur: "100" }, { beratPanenKg: "5" }),
    });
    expect(r.valid).toBe(false);
    expect(r.errors.baris.A.beratPanenKg).toBeDefined();
    expect(r.errors.baris.B.jumlahTelur).toBeDefined();
  });

  it("menolak nol, negatif, dan butir desimal", () => {
    const r = validasiPanen({
      ...dasar,
      baris: barisIsi(
        { jumlahTelur: "0", beratPanenKg: "5" },
        { jumlahTelur: "10.5", beratPanenKg: "5" },
        { jumlahTelur: "10", beratPanenKg: "-1" }
      ),
    });
    expect(r.errors.baris.A.jumlahTelur).toBeDefined();
    expect(r.errors.baris.B.jumlahTelur).toBeDefined();
    expect(r.errors.baris.C.beratPanenKg).toBeDefined();
  });

  it("menolak tanggal dan kandang kosong", () => {
    const r = validasiPanen({
      tanggal: "",
      kandang: "",
      baris: barisIsi({ jumlahTelur: "1", beratPanenKg: "1" }),
    });
    expect(r.errors.tanggal).toBeDefined();
    expect(r.errors.kandang).toBeDefined();
  });

  it("menolak grade ganda", () => {
    const r = validasiPanen({
      ...dasar,
      baris: [
        { tipeTelur: "A", jumlahTelur: "1", beratPanenKg: "1" },
        { tipeTelur: "A", jumlahTelur: "2", beratPanenKg: "2" },
      ],
    });
    expect(r.errors.umum).toMatch(/satu kali/);
  });
});

describe("buatPanen dan panenKeBaris", () => {
  it("hanya menyimpan grade yang terisi, sebagai angka", () => {
    const p = buatPanen(
      {
        tanggal: "2026-11-27",
        kandang: "Kandang B",
        baris: barisIsi(
          { jumlahTelur: "100", beratPanenKg: "6.55" },
          {},
          { jumlahTelur: "50", beratPanenKg: "3" }
        ),
      },
      7
    );
    expect(p.idPanen).toBe(7);
    expect(p.detail).toEqual([
      { tipeTelur: "A", jumlahTelur: 100, beratPanenKg: 6.6 },
      { tipeTelur: "C", jumlahTelur: 50, beratPanenKg: 3 },
    ]);
  });

  it("mengisi ulang baris form saat edit, grade absen dikosongkan", () => {
    const p = {
      idPanen: 9,
      tanggal: "2026-11-27",
      kandang: "Kandang A",
      detail: [{ tipeTelur: "B", jumlahTelur: 80, beratPanenKg: 5 }],
    };
    expect(panenKeBaris(p)).toEqual([
      { tipeTelur: "A", jumlahTelur: "", beratPanenKg: "" },
      { tipeTelur: "B", jumlahTelur: 80, beratPanenKg: 5 },
      { tipeTelur: "C", jumlahTelur: "", beratPanenKg: "" },
    ]);
  });
});