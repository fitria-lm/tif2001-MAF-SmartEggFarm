import { useMemo, useRef, useState } from "react";
import { populasiSaatIni, sisaPopulasi } from "../utils/data_kandang";
import { formatTanggal } from "../utils/format";

const SARAN_PENYEBAB = [
  "Sakit",
  "Stres panas",
  "Terinjak / kecelakaan",
  "Predator",
  "Tidak diketahui",
];

const formKosong = () => ({
  tanggal: "",
  kandangId: "",
  jumlah: "",
  penyebab: "",
});

const formatEkor = (angka) => `${Number(angka).toLocaleString("id-ID")} ekor`;

// Tanggal hari ini (zona waktu lokal) dalam format YYYY-MM-DD
const hariIniIso = () => {
  const sekarang = new Date();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const hari = String(sekarang.getDate()).padStart(2, "0");
  return `${sekarang.getFullYear()}-${bulan}-${hari}`;
};

export default function KematianKandang({ kandang, kematian, setKematian }) {
  const [form, setForm] = useState(formKosong);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const namaKandang = useMemo(
    () => Object.fromEntries(kandang.map((k) => [k.id, k.nama])),
    [kandang],
  );

  const dataUrut = useMemo(
    () =>
      [...kematian].sort(
        (a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id,
      ),
    [kematian],
  );

  const kandangTerpilih = kandang.find((k) => k.id === Number(form.kandangId));
  const batasInput = kandangTerpilih
    ? sisaPopulasi(kandangTerpilih, kematian, editId)
    : null;

  const ubah = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm(formKosong());
    setEditId(null);
    setError("");
  };

  const simpan = (e) => {
    e.preventDefault();

    const jumlah = Number(form.jumlah);

    if (!form.tanggal) {
      setError("Tanggal wajib diisi.");
      return;
    }
    if (!kandangTerpilih) {
      setError("Pilih kandang terlebih dahulu.");
      return;
    }
    if (form.tanggal > hariIniIso()) {
      setError("Tanggal tidak boleh di masa depan.");
      return;
    }
    if (form.tanggal < kandangTerpilih.tanggalMasuk) {
      setError(
        `Tanggal tidak boleh sebelum ayam masuk ${kandangTerpilih.nama} (${formatTanggal(
          kandangTerpilih.tanggalMasuk,
        )}).`,
      );
      return;
    }
    if (!Number.isInteger(jumlah) || jumlah <= 0) {
      setError("Jumlah kematian harus bilangan bulat lebih dari 0.");
      return;
    }
    if (jumlah > batasInput) {
      setError(
        `Jumlah melebihi sisa populasi ${kandangTerpilih.nama} (${formatEkor(batasInput)}).`,
      );
      return;
    }

    const data = {
      tanggal: form.tanggal,
      kandangId: kandangTerpilih.id,
      jumlah,
      penyebab: form.penyebab.trim() || "Tidak diketahui",
    };

    if (editId === null) {
      const idBaru = kematian.reduce((maks, m) => Math.max(maks, m.id), 0) + 1;
      setKematian((prev) => [...prev, { id: idBaru, ...data }]);
    } else {
      setKematian((prev) =>
        prev.map((m) => (m.id === editId ? { ...m, ...data } : m)),
      );
    }
    resetForm();
  };

  const mulaiEdit = (item) => {
    setEditId(item.id);
    setError("");
    setForm({
      tanggal: item.tanggal,
      kandangId: String(item.kandangId),
      jumlah: String(item.jumlah),
      penyebab: item.penyebab,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hapus = (item) => {
    if (
      !window.confirm(
        `Hapus catatan kematian ${namaKandang[item.kandangId]} tanggal ${formatTanggal(
          item.tanggal,
        )}?`,
      )
    ) {
      return;
    }
    setKematian((prev) => prev.filter((m) => m.id !== item.id));
    if (editId === item.id) resetForm();
  };

  if (kandang.length === 0) {
    return (
      <div className="rounded-3xl border border-[#ACC695] bg-white p-5 text-sm text-gray-500">
        Belum ada kandang. Tambahkan kandang di tab Populasi terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        ref={formRef}
        onSubmit={simpan}
        className="rounded-3xl border border-[#ACC695] bg-white p-5"
      >
        <h2 className="text-lg font-semibold text-primary">
          {editId === null ? "Catat Kematian Ayam" : "Edit Catatan Kematian"}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="tanggal-mati" className="block text-sm font-medium">
              Tanggal
            </label>
            <input
              id="tanggal-mati"
              type="date"
              value={form.tanggal}
              onChange={(e) => ubah("tanggal", e.target.value)}
              className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label htmlFor="kandang-mati" className="block text-sm font-medium">
              Kandang
            </label>
            <select
              id="kandang-mati"
              value={form.kandangId}
              onChange={(e) => ubah("kandangId", e.target.value)}
              className="mt-1 w-full rounded-full border border-primary bg-white px-4 py-2 outline-none"
            >
              <option value="">Pilih kandang</option>
              {kandang.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
            {kandangTerpilih && (
              <p className="mt-1 text-xs text-gray-500">
                Populasi saat ini: {formatEkor(populasiSaatIni(kandangTerpilih, kematian))}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="jumlah-mati" className="block text-sm font-medium">
              Jumlah (ekor)
            </label>
            <input
              id="jumlah-mati"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={form.jumlah}
              onChange={(e) => ubah("jumlah", e.target.value)}
              className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label htmlFor="penyebab-mati" className="block text-sm font-medium">
              Penyebab
            </label>
            <input
              id="penyebab-mati"
              type="text"
              list="saran-penyebab"
              placeholder="Opsional"
              value={form.penyebab}
              onChange={(e) => ubah("penyebab", e.target.value)}
              className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
            />
            <datalist id="saran-penyebab">
              {SARAN_PENYEBAB.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
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
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-[#ACC695]/30 text-left text-primary">
            <tr>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Kandang</th>
              <th className="px-4 py-3">Jumlah</th>
              <th className="px-4 py-3">Penyebab</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataUrut.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Belum ada catatan kematian.
                </td>
              </tr>
            )}
            {dataUrut.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{formatTanggal(item.tanggal)}</td>
                <td className="px-4 py-3 font-semibold">
                  {namaKandang[item.kandangId] ?? "-"}
                </td>
                <td className="px-4 py-3">{formatEkor(item.jumlah)}</td>
                <td className="px-4 py-3">{item.penyebab}</td>
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