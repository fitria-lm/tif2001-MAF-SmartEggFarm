import { useState } from "react";
import PanenForm from "../../components/panen_form";
import PanenTable from "../../components/panen_table";
import {
  PANEN_AWAL,
  buatPanen,
  formatIdPanen,
  idPanenBerikutnya,
} from "../../utils/panen";

export default function Panen() {
  // Data dummy, nanti diganti data dari API
  const [data, setData] = useState(PANEN_AWAL);
  const [editing, setEditing] = useState(null);
  const [mobileView, setMobileView] = useState("form"); // "form" | "data"

  const handleSave = (input) => {
    if (editing) {
      const diperbarui = buatPanen(input, editing.idPanen);
      setData((prev) =>
        prev.map((p) => (p.idPanen === editing.idPanen ? diperbarui : p))
      );
      setEditing(null);
      setMobileView("data");
    } else {
      setData((prev) => [...prev, buatPanen(input, idPanenBerikutnya(prev))]);
    }
  };

  const handleEdit = (row) => {
    setEditing(row);
    setMobileView("form");
  };

  const handleDelete = (row) => {
    const id = formatIdPanen(row.idPanen);
    if (
      !window.confirm(
        `Hapus data panen ${id}? Semua rincian grade-nya ikut terhapus.`
      )
    )
      return;
    setData((prev) => prev.filter((p) => p.idPanen !== row.idPanen));
    if (editing?.idPanen === row.idPanen) setEditing(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(280px,340px)_1fr] md:items-start">
      {/* Form: di mobile tampil saat mobileView = "form" */}
      <div className={`${mobileView === "form" ? "block" : "hidden"} md:block`}>
        <PanenForm
          // key berubah saat masuk/keluar mode edit, supaya form dibuat ulang
          key={editing ? editing.idPanen : "baru"}
          editing={editing}
          onSave={handleSave}
          onCancelEdit={() => setEditing(null)}
          onLihatData={() => setMobileView("data")}
        />
      </div>

      {/* Data: di mobile tampil saat mobileView = "data" */}
      <section
        className={`${
          mobileView === "data" ? "block" : "hidden"
        } rounded-3xl border border-[#ACC695] p-4 md:block md:min-h-[28rem]`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#3E7642]">Data Panen</h2>
          <button
            type="button"
            onClick={() => setMobileView("form")}
            className="rounded-full bg-[#3E7642] px-3 py-1 text-xs font-semibold text-white md:hidden"
          >
            + Tambah Data
          </button>
        </div>
        <PanenTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
      </section>
    </div>
  );
}