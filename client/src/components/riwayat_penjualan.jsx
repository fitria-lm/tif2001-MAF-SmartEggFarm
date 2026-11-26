import { Fragment, useMemo, useState } from "react";
import StatCard from "./stat_card";
import { formatRupiah, formatTanggal } from "../utils/format";
import {
  jumlahTransaksi,
  namaBarang,
  subtotalItem,
  totalPenjualan,
  totalTransaksi,
} from "../utils/penjualan_lainnya";
import { useStok } from "../context/stok_context";

const formatKg = (angka) => `${Number(angka).toLocaleString("id-ID")} Kg`;

export default function RiwayatPenjualan() {
  const { transaksi, setTransaksi } = useStok();
  const [terbuka, setTerbuka] = useState(null);

  // Transaksi paling baru di atas
  const dataUrut = useMemo(
    () =>
      [...transaksi].sort(
        (a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id,
      ),
    [transaksi],
  );

  const hapus = (trx) => {
    const yakin = window.confirm(
      `Hapus transaksi ${trx.pembeli} (${formatTanggal(trx.tanggal)})? Stok pakan dari transaksi ini akan dikembalikan.`,
    );
    if (!yakin) return;
    setTransaksi((prev) => prev.filter((x) => x.id !== trx.id));
    if (terbuka === trx.id) setTerbuka(null);
  };

  const ubahDetail = (id) => setTerbuka((prev) => (prev === id ? null : id));

  return (
    <div>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Penjualan"
          value={formatRupiah(totalPenjualan(transaksi))}
        />
        <StatCard
          label="Jumlah Transaksi"
          value={jumlahTransaksi(transaksi)}
          variant="outline"
        />
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[#ACC695] bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-[#ACC695]/30 text-left text-primary">
            <tr>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Pembeli</th>
              <th className="px-4 py-3">Barang</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataUrut.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Belum ada transaksi penjualan.
                </td>
              </tr>
            )}
            {dataUrut.map((trx) => (
              <Fragment key={trx.id}>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">{formatTanggal(trx.tanggal)}</td>
                  <td className="px-4 py-3">{trx.pembeli}</td>
                  <td className="px-4 py-3">
                    {trx.items.map(namaBarang).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatRupiah(totalTransaksi(trx))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => ubahDetail(trx.id)}
                        className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {terbuka === trx.id ? "Tutup" : "Detail"}
                      </button>
                      <button
                        type="button"
                        onClick={() => hapus(trx)}
                        className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>

                {terbuka === trx.id && (
                  <tr className="bg-[#ACC695]/10">
                    <td colSpan={5} className="px-4 py-3">
                      <table className="w-full text-xs">
                        <thead className="text-left text-gray-500">
                          <tr>
                            <th className="py-1 pr-4">Barang</th>
                            <th className="py-1 pr-4">Jumlah</th>
                            <th className="py-1 pr-4">Harga per Kg</th>
                            <th className="py-1">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trx.items.map((item, i) => (
                            <tr key={`${item.jenis}-${i}`}>
                              <td className="py-1 pr-4">{namaBarang(item)}</td>
                              <td className="py-1 pr-4">{formatKg(item.jumlah)}</td>
                              <td className="py-1 pr-4">
                                {formatRupiah(item.harga)}
                              </td>
                              <td className="py-1 font-semibold">
                                {formatRupiah(subtotalItem(item))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}