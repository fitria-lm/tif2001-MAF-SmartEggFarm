import { useState } from "react";
import {
  buatBarisKosong,
  formatIdPanen,
  panenKeBaris,
  validasiPanen,
} from "../utils/panen";

// Sementara dummy, nanti diganti data kandang dari API
const KANDANG_OPTIONS = ["Kandang A", "Kandang B", "Kandang C"];

const inputClass =
  "w-full rounded-full border border-[#3E7642] bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#ACC695]";

const formatAngka = (n, desimal = 0) =>
  n.toLocaleString("id-ID", {
    minimumFractionDigits: desimal,
    maximumFractionDigits: desimal,
  });

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-black">{label}</span>
      {children}
      {error && <p className="mt-1 pl-2 text-xs text-red-600">{error}</p>}
    </label>
  );
}

// Catatan: form ini mengisi state awalnya dari prop `editing`.
// Halaman harus memberi `key` yang berubah saat mode edit berganti
// (lihat pages/kandang/panen.jsx) supaya form dibuat ulang.
export default function PanenForm({ editing, onSave, onCancelEdit, onLihatData }) {
  const [tanggal, setTanggal] = useState(editing ? editing.tanggal : "");
  const [kandang, setKandang] = useState(editing ? editing.kandang : "");
  const [baris, setBaris] = useState(
    editing ? panenKeBaris(editing) : buatBarisKosong()
  );
  const [errors, setErrors] = useState({ baris: {} });

  const ubahBaris = (tipeTelur, field, value) => {
    setBaris((prev) =>
      prev.map((b) => (b.tipeTelur === tipeTelur ? { ...b, [field]: value } : b))
    );
  };

  // Total otomatis, hanya sebagai bantuan melihat angka sebelum disimpan
  const totalButir = baris.reduce((s, b) => s + (Number(b.jumlahTelur) || 0), 0);
  const totalBerat =
    Math.round(baris.reduce((s, b) => s + (Number(b.beratPanenKg) || 0), 0) * 10) /
    10;

  const submit = (e) => {
    e.preventDefault();
    const hasil = validasiPanen({ tanggal, kandang, baris });
    setErrors(hasil.errors);
    if (!hasil.valid) return;

    onSave({ tanggal, kandang, baris });

    if (!editing) {
      setTanggal("");
      setKandang("");
      setBaris(buatBarisKosong());
      setErrors({ baris: {} });
    }
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-3 rounded-3xl border border-[#ACC695] p-4"
    >
      {editing && (
        <Field label="ID Panen">
          <input
            value={formatIdPanen(editing.idPanen)}
            readOnly
            disabled
            className={`${inputClass} border-gray-300 bg-gray-100 text-gray-500`}
          />
        </Field>
      )}

      <Field label="Tanggal" error={errors.tanggal}>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Kandang" error={errors.kandang}>
        <select
          value={kandang}
          onChange={(e) => setKandang(e.target.value)}
          className={inputClass}
        >
          <option value="">Pilih kandang</option>
          {KANDANG_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </Field>

      <div>
        <p className="mb-2 text-xs font-medium text-black">Rincian per Grade</p>
        <div className="space-y-2">
          {baris.map((b) => {
            const err = errors.baris?.[b.tipeTelur];
            return (
              <div
                key={b.tipeTelur}
                className="rounded-2xl border border-[#ACC695] p-3"
              >
                <p className="mb-2 text-xs font-semibold text-[#3E7642]">
                  Grade {b.tipeTelur}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="Butir"
                      aria-label={`Jumlah butir grade ${b.tipeTelur}`}
                      value={b.jumlahTelur}
                      onChange={(e) =>
                        ubahBaris(b.tipeTelur, "jumlahTelur", e.target.value)
                      }
                      className={inputClass}
                    />
                    {err?.jumlahTelur && (
                      <p className="mt-1 pl-2 text-xs text-red-600">
                        {err.jumlahTelur}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0"
                      placeholder="Kg"
                      aria-label={`Berat grade ${b.tipeTelur} dalam Kg`}
                      value={b.beratPanenKg}
                      onChange={(e) =>
                        ubahBaris(b.tipeTelur, "beratPanenKg", e.target.value)
                      }
                      className={inputClass}
                    />
                    {err?.beratPanenKg && (
                      <p className="mt-1 pl-2 text-xs text-red-600">
                        {err.beratPanenKg}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-[#ACC695]/30 px-3 py-2 text-xs text-[#3E7642]">
        <span className="font-semibold">Total: </span>
        {formatAngka(totalButir)} butir · {formatAngka(totalBerat, 1)} Kg
      </div>

      {errors.umum && <p className="pl-2 text-xs text-red-600">{errors.umum}</p>}

      <div className="space-y-2 pt-2">
        <button
          type="submit"
          className="w-full rounded-full bg-[#3E7642] py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:opacity-90"
        >
          {editing ? "Simpan Perubahan" : "Simpan"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full rounded-full border border-[#CD7E23] py-1.5 text-xs font-semibold uppercase tracking-wide text-[#CD7E23] hover:bg-[#CD7E23] hover:text-white"
          >
            Batal Edit
          </button>
        )}

        {/* Hanya tampil di mobile */}
        <button
          type="button"
          onClick={onLihatData}
          className="w-full rounded-full border border-[#3E7642] py-1.5 text-xs font-semibold uppercase tracking-wide text-[#3E7642] md:hidden"
        >
          Lihat Data
        </button>
      </div>
    </form>
  );
}