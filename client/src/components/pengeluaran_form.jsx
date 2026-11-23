import { useState } from "react";
import {
  KATEGORI,
  isPakan,
  validasiPengeluaran,
  buatPengeluaran,
} from "../utils/pengeluaran";
import { BAHAN_PAKAN } from "../utils/stok_pakan";

const hariIni = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD, waktu lokal

const inputClass =
  "w-full rounded-2xl border border-[#ACC695] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

export default function PengeluaranForm({ dataEdit, onSimpan, onBatal }) {
  const [tanggal, setTanggal] = useState(dataEdit?.tanggal ?? hariIni());
  const [kategori, setKategori] = useState(dataEdit?.kategori ?? KATEGORI[0]);
  const [keterangan, setKeterangan] = useState(dataEdit?.keterangan ?? "");
  const [nominal, setNominal] = useState(
    dataEdit ? String(dataEdit.nominal) : "",
  );
  const [bahan, setBahan] = useState(dataEdit?.bahan ?? BAHAN_PAKAN[0]);
  const [jumlahKg, setJumlahKg] = useState(
    dataEdit?.jumlahKg ? String(dataEdit.jumlahKg) : "",
  );
  const [error, setError] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const form = { tanggal, kategori, keterangan, nominal, bahan, jumlahKg };
    const err = validasiPengeluaran(form);
    setError(err);
    if (Object.keys(err).length > 0) return;

    onSimpan(buatPengeluaran(form, dataEdit?.id));

    if (!dataEdit) {
      setKeterangan("");
      setNominal("");
      setJumlahKg("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-[#ACC695] bg-white p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-primary">
        {dataEdit ? "Edit Pengeluaran" : "Input Pengeluaran Baru"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Tanggal</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className={inputClass}
          />
          {error.tanggal && (
            <p className="mt-1 text-xs text-red-600">{error.tanggal}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className={inputClass}
          >
            {KATEGORI.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          {error.kategori && (
            <p className="mt-1 text-xs text-red-600">{error.kategori}</p>
          )}
        </div>

        {isPakan(kategori) && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Jenis Bahan
              </label>
              <select
                value={bahan}
                onChange={(e) => setBahan(e.target.value)}
                className={inputClass}
              >
                {BAHAN_PAKAN.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {error.bahan && (
                <p className="mt-1 text-xs text-red-600">{error.bahan}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Jumlah (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={jumlahKg}
                onChange={(e) => setJumlahKg(e.target.value)}
                className={inputClass}
              />
              {error.jumlahKg && (
                <p className="mt-1 text-xs text-red-600">{error.jumlahKg}</p>
              )}
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Keterangan</label>
          <input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className={inputClass}
          />
          {error.keterangan && (
            <p className="mt-1 text-xs text-red-600">{error.keterangan}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nominal (Rp)</label>
          <input
            type="number"
            min="0"
            step="1000"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            className={inputClass}
          />
          {error.nominal && (
            <p className="mt-1 text-xs text-red-600">{error.nominal}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
        >
          {dataEdit ? "Simpan Perubahan" : "Simpan Pengeluaran"}
        </button>
        {dataEdit && (
          <button
            type="button"
            onClick={onBatal}
            className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}