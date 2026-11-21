import { useSearchParams } from "react-router-dom";

export default function Tabs({ tabs, defaultTab }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const dariUrl = searchParams.get("tab");
  const aktifKey = tabs.some((t) => t.key === dariUrl)
    ? dariUrl
    : (defaultTab ?? tabs[0].key);

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto border-b border-gray-200 mb-6"
      >
        {tabs.map((t) => {
          const aktif = t.key === aktifKey;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={aktif}
              onClick={() => setSearchParams({ tab: t.key })}
              className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                aktif
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Semua tab tetap dirender, yang tidak aktif disembunyikan,
          supaya isian kalkulator tidak hilang saat pindah tab */}
      {tabs.map((t) => (
        <div key={t.key} role="tabpanel" hidden={t.key !== aktifKey}>
          {t.content}
        </div>
      ))}
    </div>
  );
}