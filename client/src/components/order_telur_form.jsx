import { useState } from "react";
import { GRADE_TELUR, hitungTotal } from "../utils/penjualan_telur";
import { formatRupiah } from "../utils/format";

const hariIni = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD, waktu lokal

const inputClass =
  "w-full rounded-2xl border border-[#ACC695] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

export default function OrderTelurForm({ orderEdit, onSimpan, onBatal }) {
  const [nama, setNama] = useState(orderEdit?.nama ?? "");
  const [tanggal, setTanggal] = useState(orderEdit?.tanggal ?? hariIni());
  const [grade, setGrade] = useState(orderEdit?.grade ?? GRADE_TELUR[0]);
  const [berat, setBerat] = useState(orderEdit ? String(orderEdit.berat) : "");
  const [harga, setHarga] = useState(orderEdit ? String(orderEdit.harga) : "");
  const [error, setError] = useState({});

  const total = hitungTotal(berat, harga);

  function validasi() {
    const err = {};
    if (!nama.trim()) err.nama = "Nama pembeli wajib diisi.";
    if (!tanggal) err.tanggal = "Tanggal wajib diisi.";
    if (!(Number(berat) > 0)) err.berat = "Berat harus lebih dari 0.";
    if (!(Number(harga) > 0)) err.harga = "Harga harus lebih dari 0.";
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validasi();
    setError(err);
    if (Object.keys(err).length > 0) return;

    onSimpan({
      ...(orderEdit ? { id: orderEdit.id } : {}),
      nama: nama.trim(),
      tanggal,
      grade,
      berat: Number(berat),
      harga: Number(harga),
      total,
    });

    if (!orderEdit) {
      setNama("");
      setBerat("");
      setHarga("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-[#ACC695] bg-white p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-primary">
        {orderEdit ? `Edit Order ${orderEdit.id}` : "Input Order Baru"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Nama Pembeli</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className={inputClass}
          />
          {error.nama && (
            <p className="mt-1 text-xs text-red-600">{error.nama}</p>
          )}
        </div>

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
          <label className="mb-1 block text-sm font-medium">Tipe Telur</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className={inputClass}
          >
            {GRADE_TELUR.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Berat Telur (kg)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={berat}
            onChange={(e) => setBerat(e.target.value)}
            className={inputClass}
          />
          {error.berat && (
            <p className="mt-1 text-xs text-red-600">{error.berat}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Harga (Rp/kg)
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            className={inputClass}
          />
          {error.harga && (
            <p className="mt-1 text-xs text-red-600">{error.harga}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Total Harga</label>
          <div className="rounded-2xl bg-[#ACC695]/30 px-4 py-2 text-sm font-bold text-primary">
            {formatRupiah(total)}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
        >
          {orderEdit ? "Simpan Perubahan" : "Simpan Order"}
        </button>
        {orderEdit && (
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
