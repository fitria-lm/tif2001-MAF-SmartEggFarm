import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Sementara dummy, nanti diganti data kandang dari API
export const KANDANG_OPTIONS = ["Kandang A", "Kandang B", "Kandang C"];

const schema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jumlahTelur: z.coerce
    .number()
    .int("Harus bilangan bulat")
    .positive("Jumlah telur harus lebih dari 0"),
  beratPanen: z.coerce.number().positive("Berat panen harus lebih dari 0"),
  kandang: z.string().min(1, "Kandang wajib dipilih"),
});

const EMPTY = { tanggal: "", jumlahTelur: "", beratPanen: "", kandang: "" };

const inputClass =
  "w-full rounded-full border border-[#3E7642] bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#ACC695]";

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-black">{label}</span>
      {children}
      {error && <p className="mt-1 pl-2 text-xs text-red-600">{error}</p>}
    </label>
  );
}

export default function PanenForm({ editing, onSave, onCancelEdit, onLihatData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: EMPTY });

  // Saat tombol Edit ditekan, isi form dengan data yang dipilih
  useEffect(() => {
    reset(
      editing
        ? {
            tanggal: editing.tanggal,
            jumlahTelur: editing.jumlahTelur,
            beratPanen: editing.beratPanen,
            kandang: editing.kandang,
          }
        : EMPTY
    );
  }, [editing, reset]);

  const submit = handleSubmit((values) => {
    onSave(values);
    reset(EMPTY);
  });

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-3 rounded-3xl border border-[#ACC695] p-4"
    >
      {editing && (
        <Field label="ID Panen">
          <input
            value={editing.id}
            readOnly
            disabled
            className={`${inputClass} border-gray-300 bg-gray-100 text-gray-500`}
          />
        </Field>
      )}

      <Field label="Tanggal" error={errors.tanggal?.message}>
        <input type="date" className={inputClass} {...register("tanggal")} />
      </Field>

      <Field label="Jumlah Telur" error={errors.jumlahTelur?.message}>
        <input
          type="number"
          inputMode="numeric"
          placeholder="Butir"
          className={inputClass}
          {...register("jumlahTelur")}
        />
      </Field>

      <Field label="Berat Panen" error={errors.beratPanen?.message}>
        <input
          type="number"
          step="0.1"
          inputMode="decimal"
          placeholder="Kg"
          className={inputClass}
          {...register("beratPanen")}
        />
      </Field>

      <Field label="Kandang" error={errors.kandang?.message}>
        <select className={inputClass} {...register("kandang")}>
          <option value="">Pilih kandang</option>
          {KANDANG_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </Field>

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