import GreetingBanner from "../components/greeting_banner";
import StatCard from "../components/stat_card";
import { formatRupiah } from "../utils/format";

// Data dummy, nanti diganti data dari API
const data = {
  ringkasan: {
    pendapatanTotal: 5000000000,
    pengeluaranBersih: 5000000000,
    pendapatanBersih: 5000000000,
  },
  kandang: {
    totalPanen: 250,
    avgPanen: 50,
    avgJumlahTelur: 50,
    avgBeratTelur: 56.78,
    panenHariIni: 250,
    telurHariIni: 3000,
    beratTelurHariIni: 62,
  },
  penjualan: {
    totalPenjualan: 250,
    avgPenjualan: 50,
    penjualanHariIni: 250,
    pendapatanHariIni: 25000000,
  },
};

function SectionTitle({ children }) {
  return <h2 className="mb-3 text-sm font-medium text-black">{children}</h2>;
}

export default function Dashboard() {
  const { ringkasan, kandang, penjualan } = data;

  return (
    <div className="space-y-6">
      <GreetingBanner />

      {/* Ringkasan */}
      <section>
        <SectionTitle>Ringkasan</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            size="lg"
            color="green"
            variant="solid"
            label="Pendapatan"
            sublabel="Total"
            value={formatRupiah(ringkasan.pendapatanTotal)}
          />
          <StatCard
            size="lg"
            color="orange"
            variant="solid"
            label="Pengeluaran"
            sublabel="Bersih"
            value={formatRupiah(ringkasan.pengeluaranBersih)}
          />
          <StatCard
            size="lg"
            color="green"
            variant="outline"
            label="Pendapatan"
            sublabel="Bersih"
            value={formatRupiah(ringkasan.pendapatanBersih)}
          />
        </div>
      </section>

      {/* Performa Kandang */}
      <section>
        <SectionTitle>Performa Kandang</SectionTitle>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard size="sm" color="green" label="Total Panen" value={`${kandang.totalPanen.toFixed(1)} Kg`} />
          <StatCard size="sm" color="green" label="Avg. Panen" value={`${kandang.avgPanen} Kg/day`} />
          <StatCard size="sm" color="green" label="Avg. Jumlah Telur" value={`${kandang.avgJumlahTelur} Butir / day`} />
          <StatCard size="sm" color="green" label="Avg. Berat Telur" value={`${kandang.avgBeratTelur} gram`} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatCard size="md" color="green" variant="outline" label="Panen Hari Ini" value={`${kandang.panenHariIni.toFixed(1)} Kilogram`} />
          <StatCard size="md" color="green" variant="outline" label="Jumlah Telur Hari Ini" value={`${kandang.telurHariIni} Butir`} />
          <StatCard size="md" color="green" variant="outline" label="Berat Telur Hari Ini" value={`${kandang.beratTelurHariIni} gram / butir`} />
        </div>
      </section>

      {/* Performa Penjualan */}
      <section>
        <SectionTitle>Performa Penjualan</SectionTitle>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard size="sm" color="orange" label="Total Penjualan" value={`${penjualan.totalPenjualan.toFixed(1)} Kg`} />
          <StatCard size="sm" color="orange" label="Avg. Penjualan" value={`${penjualan.avgPenjualan} Kg/day`} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatCard size="md" color="orange" variant="outline" label="Penjualan Hari Ini" value={`${penjualan.penjualanHariIni.toFixed(1)} Kilogram`} />
          <StatCard size="md" color="orange" variant="outline" label="Pendapatan Penjualan Hari Ini" value={formatRupiah(penjualan.pendapatanHariIni)} />
        </div>
      </section>
    </div>
  );
}