import { useState } from "react";
import PanenForm from "../../components/panen_form";
import PanenTable from "../../components/panen_table";

// Data dummy, nanti diganti data dari API
const INITIAL_DATA = [
  { id: "PNN-001", tanggal: "2026-10-23", jumlahTelur: 2950, beratPanen: 245.5, kandang: "Kandang A" },
  { id: "PNN-002", tanggal: "2026-10-24", jumlahTelur: 3000, beratPanen: 250, kandang: "Kandang B" },
  { id: "PNN-003", tanggal: "2026-10-25", jumlahTelur: 3100, beratPanen: 258.2, kandang: "Kandang A" },
];

export default function Panen() {
  const [data, setData] = useState(INITIAL_DATA);
  const [editing, setEditing] = useState(null);
  const [mobileView, setMobileView] = useState("form"); // "form" | "data"

  const handleSave = (values) => {
    if (editing) {
      setData((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...values } : d))
      );
      setEditing(null);
      setMobileView("data");
    } else {
      setData((prev) => {
        const next =
          Math.max(0, ...prev.map((d) => Number(d.id.split("-")[1]))) + 1;
        const id = `PNN-${String(next).padStart(3, "0")}`;
        return [...prev, { id, ...values }];
      });
    }
  };

  const handleEdit = (row) => {
    setEditing(row);
    setMobileView("form");
  };

  const handleDelete = (row) => {
    if (!window.confirm(`Hapus data panen ${row.id}?`)) return;
    setData((prev) => prev.filter((d) => d.id !== row.id));
    if (editing?.id === row.id) setEditing(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(220px,280px)_1fr] md:items-start">
      {/* Form: di mobile tampil saat mobileView = "form" */}
      <div className={`${mobileView === "form" ? "block" : "hidden"} md:block`}>
        <PanenForm
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