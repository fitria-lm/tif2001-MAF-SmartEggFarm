import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import MainLayout from "./components/main_layout";
import Dashboard from "./pages/dashboard";
import DataKandang from "./pages/kandang/data_kandang";
import Panen from "./pages/kandang/panen";
import Pakan from "./pages/kandang/pakan";
import PenjualanTelur from "./pages/pemasaran/penjualan_telur";
import SettingHarga from "./pages/pemasaran/setting_harga";
import PenjualanLainnya from "./pages/pemasaran/penjualan_lainnya";
import Pengeluaran from "./pages/operasional/pengeluaran";
import GajiKaryawan from "./pages/operasional/gaji_karyawan";
import NotFound from "./pages/notfound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Semua halaman di dalam sini memakai sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/beranda" element={<Dashboard />} />

        <Route path="/kandang" element={<Navigate to="/kandang/data-kandang" replace />} />
        <Route path="/kandang/data-kandang" element={<DataKandang />} />
        <Route path="/kandang/panen" element={<Panen />} />
        <Route path="/kandang/pakan" element={<Pakan />} />
        <Route
          path="/kandang/kalkulator-pakan"
          element={<Navigate to="/kandang/pakan?tab=kalkulator" replace />}
        />
        <Route path="/pemasaran" element={<Navigate to="/pemasaran/penjualan-telur" replace />} />
        <Route path="/pemasaran/penjualan-telur" element={<PenjualanTelur />} />
        {/* Sementara: nanti Setting Harga jadi tab di Penjualan Telur */}
        <Route path="/pemasaran/penjualan-telur/setting-harga" element={<SettingHarga />} />
        <Route path="/pemasaran/penjualan-lainnya" element={<PenjualanLainnya />} />
        <Route path="/penjualan/*" element={<Navigate to="/pemasaran" replace />} />

        <Route path="/operasional" element={<Navigate to="/operasional/pengeluaran" replace />} />
        <Route path="/operasional/pengeluaran" element={<Pengeluaran />} />
        <Route path="/operasional/gaji-karyawan" element={<GajiKaryawan />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}