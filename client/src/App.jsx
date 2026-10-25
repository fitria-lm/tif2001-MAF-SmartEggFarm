import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./components/main_layout";
import Dashboard from "./pages/dashboard";
import Panen from "./pages/Kandang/panen";
import KalkulatorPakan from "./pages/Kandang/kalkulator_pakan";
import DataPenjualan from "./pages/Penjualan/data_penjualan";
import SettingHarga from "./pages/Penjualan/setting_harga";
import Operasional from "./pages/operasional";
import NotFound from "./pages/notfound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Semua halaman di dalam sini memakai sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/beranda" element={<Dashboard />} />

        <Route path="/kandang" element={<Navigate to="/kandang/panen" replace />} />
        <Route path="/kandang/panen" element={<Panen />} />
        <Route path="/kandang/kalkulator-pakan" element={<KalkulatorPakan />} />

        <Route path="/penjualan" element={<Navigate to="/penjualan/data-penjualan" replace />} />
        <Route path="/penjualan/data-penjualan" element={<DataPenjualan />} />
        <Route path="/penjualan/setting-harga" element={<SettingHarga />} />

        <Route path="/operasional" element={<Operasional />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}