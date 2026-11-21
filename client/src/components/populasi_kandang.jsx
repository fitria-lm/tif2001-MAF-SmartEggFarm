import { useMemo, useRef, useState } from "react";
import {
  persentaseKematian,
  populasiSaatIni,
  totalKematian,
  umurSekarangMinggu,
} from "../utils/data_kandang";
import { formatTanggal } from "../utils/format";

const formKosong = () => ({
  nama: "",
  kapasitas: "",
  populasiAwal: "",
  tanggalMasuk: "",
  umurMasukMinggu: "",
});

const formatEkor = (angka) => `${Number(angka).toLocaleString("id-ID")} ekor`;

const formatPersen = (angka) =>
  `${Number(angka).toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`;

export default function PopulasiKandang({
  kandang,
  setKandang,
  kematian,
  setKematian,
}) {
  const [form, setForm] = useState(formKosong);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const dataUrut = useMemo(
    () => [...kandang].sort((a, b) => a.nama.localeCompare(b.nama)),
    [kandang],
  );

  const ubah = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm(formKosong());
    setEditId(null);
    setError("");
  };

  const simpan = (e) => {
    e.preventDefault();

    const nama = form.nama.trim();
    const kapasitas = Number(form.kapasitas);
    const populasiAwal = Number(form.populasiAwal);
    const umurMasukMinggu = Number(form.umurMasukMinggu || 0);

    if (!nama) {
      setError("Nama kandang wajib diisi.");
      return;
    }
    const namaKembar = kandang.some(
      (k) => k.id !== editId && k.nama.toLowerCase() === nama.toLowerCase(),
    );
    if (namaKembar) {
      setError("Nama kandang sudah dipakai.");
      return;
    }
    if (!(kapasitas > 0)) {
      setError("Kapasitas harus lebih dari 0.");
      return;
    }
    if (!(populasiAwal >= 0) || form.populasiAwal === "") {
      setError("Populasi awal wajib diisi dan tidak boleh negatif.");
      return;
    }
    if (populasiAwal > kapasitas) {
      setError("Populasi awal tidak boleh melebihi kapasitas kandang.");
      return;
    }
    if (editId !== null && populasiAwal < totalKematian(editId, kematian)) {
      setError(
        "Populasi awal tidak boleh lebih kecil dari total kematian yang sudah tercatat.",
      );
      return;
    }
    if (!form.tanggalMasuk) {
      setError("Tanggal ayam masuk wajib diisi.");
      return;
    }
    if (umurMasukMinggu < 0) {
      setError("Umur ayam tidak boleh negatif.");
      return;
    }

    const data = {
      nama,
      kapasitas,
      populasiAwal,
      tanggalMasuk: form.tanggalMasuk,
      umurMasukMinggu,
    };

    if (editId === null) {
      const idBaru = kandang.reduce((maks, k) => Math.max(maks, k.id), 0) + 1;
      setKandang((prev) => [...prev, { id: idBaru, ...data }]);
    } else {
      setKandang((prev) =>
        prev.map((k) => (k.id === editId ? { ...k, ...data } : k)),
      );
    }
    resetForm();
  };

  const mulaiEdit = (item) => {
    setEditId(item.id);
    setError("");
    setForm({
      nama: item.nama,
      kapasitas: String(item.kapasitas),
      populasiAwal: String(item.populasiAwal),
      tanggalMasuk: item.tanggalMasuk,
      umurMasukMinggu: String(item.umurMasukMinggu),
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hapus = (item) => {
    const jumlahCatatan = kematian.filter((m) => m.kandangId === item.id).length;
    const peringatan =
      jumlahCatatan > 0
        ? ` ${jumlahCatatan} catatan kematian kandang ini juga akan terhapus.`
        : "";
    if (!window.confirm(`Hapus ${item.nama}?${peringatan}`)) return;

    setKandang((prev) => prev.filter((k) => k.id !== item.id));
    setKematian((prev) => prev.filter((m) => m.kandangId !== item.id));
    if (editId === item.id) resetForm();
  };

  return (
    <div className="space-y-6">
      <form
        ref={formRef}
        onSubmit={simpan}
        className="rounded-3xl border border-[#ACC695] bg-white p-5"
      >
        <h2 className="text-lg font-semibold text-primary">
          {editId === null ? "Tambah Kandang" : "Edit Kandang"}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label htmlFor="nama-kandang" className="block text-sm font-medium">
              Nama Kandang
            </label>
            <input
              id="nama-kandang"
              type="text"
              placeholder="Kandang C"
              value={form.nama}
              onChange={(e) => ubah("nama", e.target.value)}
              className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label htmlFor="kapasitas" className="block text-sm font-medium">
              Kapasitas (ekor)
            </label>
            <input
              id="kapasitas"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={form.kapasitas}
              onChange={(e) => ubah("kapasitas", e.target.value)}
              className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label htmlFor="populasi-awal" className="block text-sm font-medium">
              Populasi Awal (ekor)
            </label>
            <input
              id="populasi-awal"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={form.populasiAwal}
              onChange={(e) => ubah("populasiAwal", e.target.value)}
              className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label htmlFor="tanggal-masuk" className="block text-sm font-medium">
              Tanggal Ayam Masuk
            </label>
            <input
              id="tanggal-masuk"
              type="date"
              value={form.tanggalMasuk}
              onChange={(e) => ubah("tanggalMasuk", e.target.value)}
              className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label htmlFor="umur-masuk" className="block text-sm font-medium">
              Umur Saat Masuk (minggu)
            </label>
            <input
              id="umur-masuk"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={form.umurMasukMinggu}
              onChange={(e) => ubah("umurMasukMinggu", e.target.value)}
              className="mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none"
            />
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
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-[#ACC695]/30 text-left text-primary">
            <tr>
              <th className="px-4 py-3">Kandang</th>
              <th className="px-4 py-3">Kapasitas</th>
              <th className="px-4 py-3">Populasi Awal</th>
              <th className="px-4 py-3">Populasi Saat Ini</th>
              <th className="px-4 py-3">Kematian</th>
              <th className="px-4 py-3">Tanggal Masuk</th>
              <th className="px-4 py-3">Umur</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataUrut.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  Belum ada data kandang.
                </td>
              </tr>
            )}
            {dataUrut.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{item.nama}</td>
                <td className="px-4 py-3">{formatEkor(item.kapasitas)}</td>
                <td className="px-4 py-3">{formatEkor(item.populasiAwal)}</td>
                <td className="px-4 py-3 font-semibold text-primary">
                  {formatEkor(populasiSaatIni(item, kematian))}
                </td>
                <td className="px-4 py-3">
                  {formatEkor(totalKematian(item.id, kematian))} (
                  {formatPersen(persentaseKematian(item, kematian))})
                </td>
                <td className="px-4 py-3">{formatTanggal(item.tanggalMasuk)}</td>
                <td className="px-4 py-3">{umurSekarangMinggu(item)} minggu</td>
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