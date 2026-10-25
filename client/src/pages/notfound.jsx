import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-primary">404</h1>
      <p className="text-gray-500">Halaman tidak ditemukan.</p>
      <Link to="/beranda" className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white">
        Kembali ke Beranda
      </Link>
    </div>
  );
}