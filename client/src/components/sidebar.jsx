import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { House, Warehouse, BriefcaseBusiness, UserSearch } from "lucide-react";

const menus = [
  { label: "Beranda", to: "/beranda", icon: House },
  {
    label: "Kandang",
    to: "/kandang",
    icon: Warehouse,
    children: [
      { label: "Panen", to: "/kandang/panen" },
      { label: "Kalkulator Pakan", to: "/kandang/kalkulator-pakan" },
    ],
  },
  {
    label: "Penjualan",
    to: "/penjualan",
    icon: BriefcaseBusiness,
    children: [
      { label: "Data Penjualan", to: "/penjualan/data-penjualan" },
      { label: "Setting Harga", to: "/penjualan/setting-harga" },
    ],
  },
  { label: "Operasional", to: "/operasional", icon: UserSearch },
];

const pillClass = (active) =>
  `flex w-full items-center gap-3 rounded-full border border-primary px-4 py-2 text-sm font-semibold transition ${
    active ? "bg-primary-light text-primary" : "bg-primary text-white hover:opacity-90"
  }`;

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      {/* Latar gelap, klik untuk menutup drawer */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 bg-white px-4 pt-20 shadow-lg transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-3">
          {menus.map((item) => {
            const Icon = item.icon;

            // Menu tanpa sub-menu
            if (!item.children) {
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => pillClass(isActive)}
                >
                  <Icon size={20} />
                  {item.label}
                </NavLink>
              );
            }

            // Menu dengan sub-menu (Kandang, Penjualan)
            const isParentActive = pathname.startsWith(item.to);
            const isOpen = expanded === item.label;

            return (
              <div key={item.label} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  className={pillClass(isParentActive)}
                >
                  <Icon size={20} />
                  {item.label}
                </button>

                {isOpen &&
                  item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `ml-6 rounded-full border border-primary px-4 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? "bg-primary-light text-primary"
                            : "bg-white text-primary hover:bg-primary-light/40"
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}