import { useState } from "react";
import { PengeluaranContext } from "./pengeluaran_context";
import { pengeluaranAwal, buatId } from "../utils/pengeluaran";

export default function PengeluaranProvider({ children }) {
  const [daftar, setDaftar] = useState(pengeluaranAwal);

  function tambah(data) {
    setDaftar((prev) => [...prev, { ...data, id: buatId(prev) }]);
  }

  function ubah(data) {
    setDaftar((prev) => prev.map((d) => (d.id === data.id ? data : d)));
  }

  function hapus(id) {
    setDaftar((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <PengeluaranContext.Provider value={{ daftar, tambah, ubah, hapus }}>
      {children}
    </PengeluaranContext.Provider>
  );
}