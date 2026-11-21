import { useMemo, useRef, useState } from "react";
import {
  BAHAN_PAKAN,
  BATAS_MENIPIS_AWAL,
  stokMasukAwal,
  hitungStok,
  statusStok,
  totalBerat,
} from "../utils/stok_pakan";

const GAYA_STATUS = {
  aman: { label: "Aman", kelas: "bg-[#ACC695]/40 text-primary" },
  menipis: { label: "Menipis", kelas: "bg-[#CD7E23]/20 text-[#CD7E23]" },
  habis: { label: "Habis", kelas: "bg-red-100 text-red-600" },
};

const formKosong = () => ({
  tanggal: "",
  bahan: Object.fromEntries(BAHAN_PAKAN.map((nama) => [nama, ""])),
});

const formatTanggal = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatKg = (angka) => `${Number(angka).toLocaleString("id-ID")} Kg`;

export default function StokPakan() {
  const [stokMasuk, setStokMasuk] = useState(stokMasukAwal);
  const [batas, setBatas] = useState(BATAS_MENIPIS_AWAL);
  const [form, setForm] = useState(formKosong);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const stok = useMemo(() => hitungStok(stokMasuk), [stokMasuk]);

  const dataUrut = useMemo(
    () => [...stokMasuk].sort((a, b) => b.tanggal.localeCompare(a.tanggal)),
    [stokMasuk],
  );

  const bahanBermasalah = BAHAN_PAKAN.filter(
    (nama) => statusStok(stok[nama], batas) !== "aman",
  );

  const ubahTanggal = (value) => setForm((prev) => ({ ...prev, tanggal: value }));

  const ubahBahan = (nama, value) =>
    setForm((prev) => ({ ...prev, bahan: { ...prev.bahan, [nama]: value } }));

  const resetForm = () => {
    setForm(formKosong());
    setEditId(null);
    setError("");
  };

  const simpan = (e) => {
    e.preventDefault();

    const bahan = {};
    for (const nama of BAHAN_PAKAN) {
      const angka = Number(form.bahan[nama] || 0);
      if (angka < 0) {
        setError("Berat bahan tidak boleh negatif.");
        return;
      }
      bahan[nama] = angka;
    }

    if (!form.tanggal) {
      setError("Tanggal wajib diisi.");
      return;
    }
    if (totalBerat(bahan) <= 0) {
      setError("Isi berat minimal satu bahan.");
      return;
    }

    if (editId === null) {
      const idBaru = stokMasuk.reduce((maks, item) => Math.max(maks, item.id), 0) + 1;
      setStokMasuk((prev) => [...prev, { id: idBaru, tanggal: form.tanggal, bahan }]);
    } else {
      setStokMasuk((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, tanggal: form.tanggal, bahan } : item,
        ),
      );
    }
    resetForm();
  };

  const mulaiEdit = (item) => {
    setEditId(item.id);
    setError("");
    setForm({
      tanggal: item.tanggal,
      bahan: Object.fromEntries(
        BAHAN_PAKAN.map((nama) => [nama, String(item.bahan[nama] ?? "")]),
      ),
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hapus = (item) => {
    if (!window.confirm(`Hapus data stok masuk tanggal ${formatTanggal(item.tanggal)}?`)) {
      return;
    }
    setStokMasuk((prev) => prev.filter((x) => x.id !== item.id));
    if (editId === item.id) resetForm();
  };

  const totalForm = totalBerat(form.bahan);

  return (
    <div className="space-y-6">
      {bahanBermasalah.length > 0 && (
        <div className="rounded-2xl border border-[#CD7E23] bg-[#CD7E23]/10 px-4 py-3 text-sm text-[#CD7E23]">
          Perhatian: stok {bahanBermasalah.join(", ")} menipis atau habis.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {BAHAN_PAKAN.map((nama) => {
          const gaya = GAYA_STATUS[statusStok(stok[nama], batas)];
          return (
            <div
              key={nama}
              className="rounded-3xl border border-[#ACC695] bg-white p-5"
            >
              <p className="text-sm text-gray-500">{nama}</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {formatKg(stok[nama])}
              </p>
              <span
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${gaya.kelas}`}
              >
                {gaya.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-[#ACC695] bg-white p-5">
        <label
          htmlFor="batas-menipis"
          className="block text-sm font-medium text-black"
        >
          Batas stok menipis (Kg)
        </label>
        <input
          id="batas-menipis"
          type="number"
          min="0"
          value={batas}
          onChange={(e) => setBatas(e.target.value)}
          className="mt-2 w-full max-w-xs rounded-full border border-primary px-4 py-2 outline-none"
        />
        <p className="mt-2 text-xs text-gray-500">
          Bahan dengan stok di bawah angka ini ditandai "Menipis". Berlaku untuk
          semua bahan.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={simpan}
        className="rounded-3xl border border-[#ACC695] bg-white p-5"
      >
        <h2 className="text-lg font-semibold text-primary">
          {editId === null ? "Tambah Stok Masuk" : "Edit Stok Masuk"}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium">
              Tanggal
            </label>
            <input
              id="tanggal"
              type="date"
              value={form.tanggal}
              onChange={(e) => ubahTanggal(e.target.value)}
              className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
            />
          </div>

          {BAHAN_PAKAN.map((nama) => (
            <div key={nama}>
              <label htmlFor={`bahan-${nama}`} className="block text-sm font-medium">
                {nama} (Kg)
              </label>
              <input
                id={`bahan-${nama}`}
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={form.bahan[nama]}
                onChange={(e) => ubahBahan(nama, e.target.value)}
                className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
              />
            </div>
          ))}

          <div>
            <span className="block text-sm font-medium">Total Berat</span>
            <div className="mt-1 rounded-full bg-[#ACC695]/30 px-4 py-2 font-semibold text-primary">
              {formatKg(totalForm)}
            </div>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white"
          >
            {editId === null ? "Simpan" : "Simpan Perubahan"}
          </button>
          {editId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-primary px-6 py-2 text-sm font-semibold text-primary"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-3xl border border-[#ACC695] bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-[#ACC695]/30 text-left text-primary">
            <tr>
              <th className="px-4 py-3">Tanggal</th>
              {BAHAN_PAKAN.map((nama) => (
                <th key={nama} className="px-4 py-3">
                  {nama}
                </th>
              ))}
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataUrut.length === 0 && (
              <tr>
                <td
                  colSpan={BAHAN_PAKAN.length + 3}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Belum ada data stok masuk.
                </td>
              </tr>
            )}
            {dataUrut.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{formatTanggal(item.tanggal)}</td>
                {BAHAN_PAKAN.map((nama) => (
                  <td key={nama} className="px-4 py-3">
                    {formatKg(item.bahan[nama] ?? 0)}
                  </td>
                ))}
                <td className="px-4 py-3 font-semibold">
                  {formatKg(totalBerat(item.bahan))}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => mulaiEdit(item)}
                      className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => hapus(item)}
                      className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}