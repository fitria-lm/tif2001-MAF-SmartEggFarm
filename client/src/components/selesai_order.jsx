import StatCard from "./stat_card";
import { formatRupiah, formatTanggal } from "../utils/format";
import { ringkasanSelesai } from "../utils/penjualan_telur";

export default function SelesaiOrder({ selesai }) {
  const ringkasan = ringkasanSelesai(selesai);

  // Order yang paling baru selesai di atas
  const dataUrut = [...selesai].sort(
    (a, b) =>
      b.tanggalSelesai.localeCompare(a.tanggalSelesai) ||
      b.id.localeCompare(a.id),
  );

  return (
    <div>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Jumlah Order"
          value={ringkasan.jumlahOrder}
          variant="outline"
        />
        <StatCard
          label="Total Berat"
          value={`${ringkasan.totalBerat} kg`}
          variant="outline"
        />
        <StatCard
          label="Total Pendapatan"
          value={formatRupiah(ringkasan.totalPendapatan)}
        />
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[#ACC695] bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-[#ACC695]/30 text-left text-primary">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tanggal Order</th>
              <th className="px-4 py-3">Tanggal Selesai</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Berat</th>
              <th className="px-4 py-3">Harga/kg</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {dataUrut.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  Belum ada order yang selesai.
                </td>
              </tr>
            )}
            {dataUrut.map((o) => (
              <tr key={o.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{o.id}</td>
                <td className="px-4 py-3">{formatTanggal(o.tanggal)}</td>
                <td className="px-4 py-3">{formatTanggal(o.tanggalSelesai)}</td>
                <td className="px-4 py-3">{o.nama}</td>
                <td className="px-4 py-3">Grade {o.grade}</td>
                <td className="px-4 py-3">{o.berat} kg</td>
                <td className="px-4 py-3">{formatRupiah(o.harga)}</td>
                <td className="px-4 py-3 font-semibold">
                  {formatRupiah(o.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
