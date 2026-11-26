import { KATEGORI } from "../utils/pengeluaran";

const inputClass =
  "w-full rounded-2xl border border-[#ACC695] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

export default function PengeluaranFilter({
  kategori,
  bulan,
  onKategoriChange,
  onBulanChange,
  onReset,
}) {
  const adaFilter = kategori !== "" || bulan !== "";

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <div>
        <label className="mb-1 block text-sm font-medium">Kategori</label>
        <select
          value={kategori}
          onChange={(e) => onKategoriChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Semua Kategori</option>
          {KATEGORI.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Bulan</label>
        <input
          type="month"
          value={bulan}
          onChange={(e) => onBulanChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={!adaFilter}
        className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reset
      </button>
    </div>
  );
}