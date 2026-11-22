import { formatRupiah, formatTanggal } from "../utils/format";

export default function AntreanOrder({
  antrean,
  onSelesaikan,
  onEdit,
  onHapus,
}) {
  // Order paling lama di atas
  const dataUrut = [...antrean].sort(
    (a, b) => a.tanggal.localeCompare(b.tanggal) || a.id.localeCompare(b.id),
  );

  function hapus(order) {
    if (window.confirm(`Hapus order ${order.id} atas nama ${order.nama}?`)) {
      onHapus(order.id);
    }
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#ACC695] bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-[#ACC695]/30 text-left text-primary">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Grade</th>
            <th className="px-4 py-3">Berat</th>
            <th className="px-4 py-3">Harga/kg</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataUrut.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                Tidak ada order dalam antrean.
              </td>
            </tr>
          )}
          {dataUrut.map((o) => (
            <tr key={o.id} className="border-t border-gray-100">
              <td className="px-4 py-3">{o.id}</td>
              <td className="px-4 py-3">{formatTanggal(o.tanggal)}</td>
              <td className="px-4 py-3">{o.nama}</td>
              <td className="px-4 py-3">Grade {o.grade}</td>
              <td className="px-4 py-3">{o.berat} kg</td>
              <td className="px-4 py-3">{formatRupiah(o.harga)}</td>
              <td className="px-4 py-3 font-semibold">
                {formatRupiah(o.total)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onSelesaikan(o.id)}
                    className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
                  >
                    Selesaikan
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(o)}
                    className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => hapus(o)}
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
  );
}
