import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-white px-4">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Buka atau tutup menu"
          className="text-primary"
        >
          <Menu size={28} />
        </button>

        {/* Placeholder logo, ganti kalau logo sudah siap */}
        <div className="rounded-lg border-2 border-dashed border-primary-light px-3 py-1 text-xs font-semibold text-primary">
          LOGO
        </div>
      </header>

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}