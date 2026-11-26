import Tabs from "../../components/tabs";
import InputPenjualan from "../../components/input_penjualan";
import RiwayatPenjualan from "../../components/riwayat_penjualan";

// Data transaksi dan stok ada di StokProvider (context), jadi halaman ini
// tidak perlu menyimpan state sendiri.
export default function PenjualanLainnya() {
  const tabs = [
    { key: "input", label: "Input Penjualan", content: <InputPenjualan /> },
    { key: "riwayat", label: "Riwayat Penjualan", content: <RiwayatPenjualan /> },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Penjualan Lainnya</h1>
      <Tabs tabs={tabs} defaultTab="input" />
    </div>
  );
}