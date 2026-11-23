import { formatRupiah, formatTanggal } from "../utils/format";
import { isPakan, urutkanTerbaru } from "../utils/pengeluaran";

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

// Untuk kategori Pakan: "Jagung - 300 kg". Kategori lain: "-".
function detailPakan(row) {
  if (!isPakan(row.kategori)) return "-";
  return `${row.bahan} - ${Number(row.jumlahKg).toLocaleString("id-ID")} kg`;
}

export default function PengeluaranTable({ data, onEdit, onDelete }) {
  const rows = urutkanTerbaru(data);

  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        Belum ada data pengeluaran.
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
              <th className="px-3 py-2 font-semibold">Tanggal</th>
              <th className="px-3 py-2 font-semibold">Kategori</th>
              <th className="px-3 py-2 font-semibold">Keterangan</th>
              <th className="px-3 py-2 font-semibold">Detail Pakan</th>
              <th className="px-3 py-2 font-semibold">Nominal</th>
              <th className="px-3 py-2 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="px-3 py-2">{formatTanggal(row.tanggal)}</td>
                <td className="px-3 py-2">{row.kategori}</td>
                <td className="px-3 py-2">{row.keterangan}</td>
                <td className="px-3 py-2">{detailPakan(row)}</td>
                <td className="px-3 py-2 font-medium">
                  {formatRupiah(row.nominal)}
                </td>
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
              <span className="font-semibold text-[#3E7642]">
                {row.kategori}
              </span>
              <span className="text-gray-600">{formatTanggal(row.tanggal)}</span>
            </div>
            <p className="mt-2 text-sm font-medium">{row.keterangan}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Nominal</p>
                <p className="font-medium">{formatRupiah(row.nominal)}</p>
              </div>
              {isPakan(row.kategori) && (
                <div>
                  <p className="text-gray-500">Detail Pakan</p>
                  <p className="font-medium">{detailPakan(row)}</p>
                </div>
              )}
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