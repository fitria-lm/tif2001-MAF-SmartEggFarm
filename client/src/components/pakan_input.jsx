const inputClass =
  "w-full rounded-full border border-[#3E7642] bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#ACC695]";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-black">{label}</span>
      {children}
    </label>
  );
}

export default function PakanInput({
  form,
  totalPersen,
  persenValid,
  onField,
  onBahan,
  onTambah,
  onHapus,
  onReset,
}) {
  return (
    <div className="space-y-4 rounded-3xl border border-[#ACC695] p-4">
      <Field label="Kebutuhan Pakan (gram/ekor/hari)">
        <input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="Gram"
          className={inputClass}
          value={form.kebutuhanGram}
          onChange={(e) => onField("kebutuhanGram", e.target.value)}
        />
      </Field>

      <Field label="Jumlah Ayam (ekor)">
        <input
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          placeholder="Ekor"
          className={inputClass}
          value={form.jumlahAyam}
          onChange={(e) => onField("jumlahAyam", e.target.value)}
        />
      </Field>

      <div>
        <p className="mb-2 text-xs font-semibold text-[#3E7642]">
          Komposisi Pakan
        </p>

        <ul className="space-y-2">
          {form.bahan.map((b) => (
            <li
              key={b.id}
              className="space-y-2 rounded-2xl border border-[#ACC695] p-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Jenis bahan (mis. Jagung)"
                  className={inputClass}
                  value={b.nama}
                  onChange={(e) => onBahan(b.id, "nama", e.target.value)}
                />
                <button
                  type="button"
                  aria-label="Hapus bahan"
                  onClick={() => onHapus(b.id)}
                  className="shrink-0 rounded-full border border-red-600 px-3 text-xs font-medium text-red-600 hover:bg-red-600 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Persentase (%)">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="%"
                    className={inputClass}
                    value={b.persen}
                    onChange={(e) => onBahan(b.id, "persen", e.target.value)}
                  />
                </Field>
                <Field label="Harga/Kg (opsional)">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="Rp"
                    className={inputClass}
                    value={b.harga}
                    onChange={(e) => onBahan(b.id, "harga", e.target.value)}
                  />
                </Field>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onTambah}
          className="mt-2 w-full rounded-full border border-[#3E7642] py-1.5 text-xs font-semibold uppercase tracking-wide text-[#3E7642] hover:bg-[#3E7642] hover:text-white"
        >
          + Tambah Bahan
        </button>

        <p
          className={`mt-2 pl-2 text-xs ${
            persenValid ? "text-[#3E7642]" : "text-red-600"
          }`}
        >
          {persenValid
            ? "Total persentase: 100%"
            : `Total persentase harus 100% (sekarang ${+totalPersen.toFixed(2)}%)`}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-full border border-[#CD7E23] py-1.5 text-xs font-semibold uppercase tracking-wide text-[#CD7E23] hover:bg-[#CD7E23] hover:text-white"
      >
        Reset
      </button>
    </div>
  );
}