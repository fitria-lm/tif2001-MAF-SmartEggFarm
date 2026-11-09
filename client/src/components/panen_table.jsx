import { formatTanggal } from "../utils/format";

function ActionButtons({ row, onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onEdit(row)}
        className="rounded-full border border-[#3E7642] px-3 py-1 text-xs font-medium text-[#3E7642] hover:bg-[#3E7642] hover:text-white"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(row)}
        className="rounded-full border border-red-600 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-600 hover:text-white"
      >
        Hapus
      </button>
    </div>
  );
}

export default function PanenTable({ data, onEdit, onDelete }) {
  const rows = [...data].sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        Belum ada data panen.
      </p>
    );
  }

  return (
    <>
      {/* Desktop: tabel */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#ACC695] text-[#3E7642]">
              <th className="px-3 py-2 font-semibold">ID</th>
              <th className="px-3 py-2 font-semibold">Tanggal</th>
              <th className="px-3 py-2 font-semibold">Kandang</th>
              <th className="px-3 py-2 font-semibold">Jumlah Telur</th>
              <th className="px-3 py-2 font-semibold">Berat Panen</th>
              <th className="px-3 py-2 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="px-3 py-2">{row.id}</td>
                <td className="px-3 py-2">{formatTanggal(row.tanggal)}</td>
                <td className="px-3 py-2">{row.kandang}</td>
                <td className="px-3 py-2">
                  {row.jumlahTelur.toLocaleString("id-ID")} butir
                </td>
                <td className="px-3 py-2">{Number(row.beratPanen).toFixed(1)} Kg</td>
                <td className="px-3 py-2">
                  <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: kartu */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-[#ACC695] p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#3E7642]">{row.id}</span>
              <span className="text-gray-600">{formatTanggal(row.tanggal)}</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Kandang</p>
                <p className="font-medium">{row.kandang}</p>
              </div>
              <div>
                <p className="text-gray-500">Telur</p>
                <p className="font-medium">
                  {row.jumlahTelur.toLocaleString("id-ID")} butir
                </p>
              </div>
              <div>
                <p className="text-gray-500">Berat</p>
                <p className="font-medium">{Number(row.beratPanen).toFixed(1)} Kg</p>
              </div>
            </div>
            <div className="mt-3">
              <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}