import { useMemo, useState } from "react";
import { StokContext } from "./stok_context";
import { stokMasukAwal, hitungStokTersedia } from "../utils/stok_pakan";
import { transaksiAwal } from "../utils/penjualan_lainnya";

// Menyimpan data yang dipakai bersama oleh beberapa halaman:
// stok masuk (halaman Pakan) dan transaksi penjualan (Penjualan Lainnya).
// Nanti bagian ini diganti dengan data dari backend.
export default function StokProvider({ children }) {
  const [stokMasuk, setStokMasuk] = useState(stokMasukAwal);
  const [transaksi, setTransaksi] = useState(transaksiAwal);

  const stokTersedia = useMemo(
    () => hitungStokTersedia(stokMasuk, transaksi),
    [stokMasuk, transaksi],
  );

  const value = useMemo(
    () => ({ stokMasuk, setStokMasuk, transaksi, setTransaksi, stokTersedia }),
    [stokMasuk, transaksi, stokTersedia],
  );

  return <StokContext.Provider value={value}>{children}</StokContext.Provider>;
}