import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatTanggal } from "../utils/format";
import { formatIdPanen, totalBeratKg, totalButir } from "../utils/panen";

const formatButir = (n) => `${n.toLocaleString("id-ID")} butir`;
const formatKg = (n) =>
  `${n.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} Kg`;

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

function ToggleButton({ terbuka, onClick, label }) {
  const Icon = terbuka ? ChevronDown : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={terbuka}
      aria-label={label}
      className="rounded-full p-1 text-[#3E7642] hover:bg-[#ACC695]/40"
    >
      <Icon size={16} />
    </button>
  );
}

export default function PanenTable({ data, onEdit, onDelete }) {
  // ID panen yang rinciannya sedang dibuka
  const [terbuka, setTerbuka] = useState(() => new Set());

  const toggle = (idPanen) => {
    setTerbuka((prev) => {
      const next = new Set(prev);
      if (next.has(idPanen)) next.delete(idPanen);
      else next.add(idPanen);
      return next;
    });
  };

  const rows = [...data].sort(
    (a, b) => b.tanggal.localeCompare(a.tanggal) || b.idPanen - a.idPanen
  );

  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        Belum ada data panen.
      </p>
    );
  }

  return (
    <>
      {/* Desktop: tabel, rincian per grade bisa dibuka */}
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
            {rows.map((row) => {
              const buka = terbuka.has(row.idPanen);
              const id = formatIdPanen(row.idPanen);
              return (
                <Fragment key={row.idPanen}>
                  <tr className="border-b border-gray-100">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <ToggleButton
                          terbuka={buka}
                          onClick={() => toggle(row.idPanen)}
                          label={`${buka ? "Tutup" : "Buka"} rincian ${id}`}
                        />
                        <span>{id}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">{formatTanggal(row.tanggal)}</td>
                    <td className="px-3 py-2">{row.kandang}</td>
                    <td className="px-3 py-2">{formatButir(totalButir(row))}</td>
                    <td className="px-3 py-2">{formatKg(totalBeratKg(row))}</td>
                    <td className="px-3 py-2">
                      <ActionButtons
                        row={row}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </td>
                  </tr>

                  {buka &&
                    row.detail.map((d) => (
                      <tr
                        key={d.tipeTelur}
                        className="border-b border-gray-100 bg-[#ACC695]/15 text-gray-700"
                      >
                        <td colSpan={3} className="py-1.5 pl-12 pr-3 text-xs">
                          Grade {d.tipeTelur}
                        </td>
                        <td className="px-3 py-1.5 text-xs">
                          {formatButir(d.jumlahTelur)}
                        </td>
                        <td className="px-3 py-1.5 text-xs">
                          {formatKg(d.beratPanenKg)}
                        </td>
                        <td />
                      </tr>
                    ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: kartu, rincian lewat tombol "Lihat rincian" */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => {
          const buka = terbuka.has(row.idPanen);
          return (
            <li
              key={row.idPanen}
              className="rounded-2xl border border-[#ACC695] p-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#3E7642]">
                  {formatIdPanen(row.idPanen)}
                </span>
                <span className="text-gray-600">
                  {formatTanggal(row.tanggal)}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Kandang</p>
                  <p className="font-medium">{row.kandang}</p>
                </div>
                <div>
                  <p className="text-gray-500">Telur</p>
                  <p className="font-medium">{formatButir(totalButir(row))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Berat</p>
                  <p className="font-medium">{formatKg(totalBeratKg(row))}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggle(row.idPanen)}
                aria-expanded={buka}
                className="mt-3 text-xs font-medium text-[#3E7642] underline"
              >
                {buka ? "Sembunyikan rincian" : "Lihat rincian"}
              </button>

              {buka && (
                <ul className="mt-2 space-y-1 rounded-xl bg-[#ACC695]/15 p-2 text-xs">
                  {row.detail.map((d) => (
                    <li
                      key={d.tipeTelur}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">Grade {d.tipeTelur}</span>
                      <span>
                        {formatButir(d.jumlahTelur)} · {formatKg(d.beratPanenKg)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-3">
                <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}