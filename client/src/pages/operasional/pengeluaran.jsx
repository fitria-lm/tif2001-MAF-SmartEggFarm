import { useState } from "react";
import StatCard from "../../components/stat_card";
import PengeluaranForm from "../../components/pengeluaran_form";
import PengeluaranFilter from "../../components/pengeluaran_filter";
import PengeluaranTable from "../../components/pengeluaran_table";
import { usePengeluaran } from "../../context/pengeluaran_context";
import { formatRupiah } from "../../utils/format";
import { filterPengeluaran, totalPengeluaran } from "../../utils/pengeluaran";

export default function Pengeluaran() {
  const { daftar, tambah, ubah, hapus } = usePengeluaran();
  const [dataEdit, setDataEdit] = useState(null);
  const [kategori, setKategori] = useState("");
  const [bulan, setBulan] = useState("");

  const tampil = filterPengeluaran(daftar, { kategori, bulan });
  const adaFilter = kategori !== "" || bulan !== "";

  function handleSimpan(data) {
    if (data.id) {
      ubah(data);
      setDataEdit(null);
    } else {
      tambah(data);
    }
  }

  function handleEdit(row) {
    setDataEdit(row);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleHapus(row) {
    if (!window.confirm(`Hapus pengeluaran "${row.keterangan}"?`)) return;
    hapus(row.id);
    if (dataEdit?.id === row.id) setDataEdit(null);
  }

  function handleReset() {
    setKategori("");
    setBulan("");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Pengeluaran</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Pengeluaran"
          sublabel={adaFilter ? "Sesuai filter" : "Semua periode"}
          value={formatRupiah(totalPengeluaran(tampil))}
        />
        <StatCard
          label="Jumlah Transaksi"
          sublabel={adaFilter ? "Sesuai filter" : "Semua periode"}
          value={String(tampil.length)}
          color="orange"
        />
      </div>

      <PengeluaranForm
        key={dataEdit ? `edit-${dataEdit.id}` : "baru"}
        dataEdit={dataEdit}
        onSimpan={handleSimpan}
        onBatal={() => setDataEdit(null)}
      />

      <section className="rounded-3xl border border-[#ACC695] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary">
          Data Pengeluaran
        </h2>
        <div className="mb-4">
          <PengeluaranFilter
            kategori={kategori}
            bulan={bulan}
            onKategoriChange={setKategori}
            onBulanChange={setBulan}
            onReset={handleReset}
          />
        </div>
        <PengeluaranTable
          data={tampil}
          onEdit={handleEdit}
          onDelete={handleHapus}
        />
      </section>
    </div>
  );
}