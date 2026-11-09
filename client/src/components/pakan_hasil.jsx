import StatCard from "./stat_card";
import { formatRupiah } from "../utils/format";

const kg = (n) => `${n.toFixed(2)} Kg`;
const rp = (n) => formatRupiah(Math.round(n));

export default function PakanHasil({ hasil }) {
  const {
    konsumsiPerHari,
    rows,
    totalPersen,
    totalKg,
    persenValid,
    adaHarga,
    biayaLengkap,
    totalBiaya,
    biayaPerKgPakan,
  } = hasil;

  return (
    <section className="space-y-4 rounded-3xl border border-[#ACC695] p-4 md:min-h-[28rem]">
      <h2 className="text-sm font-semibold text-[#3E7642]">Hasil Perhitungan</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          size="lg"
          color="green"
          variant="solid"
          label="Konsumsi"
          sublabel="Per Hari"
          value={kg(konsumsiPerHari)}
        />
        {biayaLengkap && (
          <>
            <StatCard
              size="lg"
              color="orange"
              variant="solid"
              label="Biaya Pakan"
              sublabel="Per Hari"
              value={rp(totalBiaya)}
            />
            <StatCard
              size="lg"
              color="orange"
              variant="outline"
              label="Biaya"
              sublabel="Per Kg Pakan"
              value={rp(biayaPerKgPakan)}
            />
          </>
        )}
      </div>

      {konsumsiPerHari === 0 && (
        <p className="text-xs text-gray-500">
          Isi kebutuhan pakan dan jumlah ayam untuk melihat hasil.
        </p>
      )}
      {adaHarga && !biayaLengkap && (
        <p className="text-xs text-[#CD7E23]">
          Lengkapi harga semua bahan untuk melihat total biaya.
        </p>
      )}

      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          Belum ada bahan. Tambahkan bahan pada form.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#ACC695] text-[#3E7642]">
                <th className="px-3 py-2 font-semibold">Nama Bahan</th>
                <th className="px-3 py-2 text-right font-semibold">Persentase</th>
                <th className="px-3 py-2 text-right font-semibold">
                  Komposisi (Kg)
                </th>
                {adaHarga && (
                  <th className="px-3 py-2 text-right font-semibold">Biaya</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-gray-100">
                  <td className="px-3 py-2">{r.nama || "(tanpa nama)"}</td>
                  <td className="px-3 py-2 text-right">{+r.persen.toFixed(2)}%</td>
                  <td className="px-3 py-2 text-right">{kg(r.kg)}</td>
                  {adaHarga && (
                    <td className="px-3 py-2 text-right">
                      {r.biaya === null ? "-" : rp(r.biaya)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#3E7642] font-semibold">
                <td className="px-3 py-2">Total</td>
                <td
                  className={`px-3 py-2 text-right ${
                    persenValid ? "text-[#3E7642]" : "text-red-600"
                  }`}
                >
                  {+totalPersen.toFixed(2)}%
                </td>
                <td className="px-3 py-2 text-right">{kg(totalKg)}</td>
                {adaHarga && (
                  <td className="px-3 py-2 text-right">
                    {biayaLengkap ? rp(totalBiaya) : "-"}
                  </td>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}