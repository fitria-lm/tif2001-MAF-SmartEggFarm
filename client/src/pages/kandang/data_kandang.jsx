import { useMemo, useState } from "react";
import Tabs from "../../components/tabs";
import StatCard from "../../components/stat_card";
import PopulasiKandang from "../../components/populasi_kandang";
import KematianKandang from "../../components/kematian_kandang";
import {
  kandangAwal,
  kematianAwal,
  hitungRingkasan,
} from "../../utils/data_kandang";

export default function DataKandang() {
  const [kandang, setKandang] = useState(kandangAwal);
  const [kematian, setKematian] = useState(kematianAwal);

  const ringkasan = useMemo(
    () => hitungRingkasan(kandang, kematian),
    [kandang, kematian],
  );

  const tabs = [
    {
      key: "populasi",
      label: "Populasi",
      content: (
        <PopulasiKandang
          kandang={kandang}
          setKandang={setKandang}
          kematian={kematian}
          setKematian={setKematian}
        />
      ),
    },
        {
      key: "kematian",
      label: "Kematian",
      content: (
        <KematianKandang
          kandang={kandang}
          kematian={kematian}
          setKematian={setKematian}
        />
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Data Kandang</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Populasi"
          value={`${ringkasan.totalPopulasi.toLocaleString("id-ID")} ekor`}
          size="lg"
        />
        <StatCard
          label="Total Kematian"
          value={`${ringkasan.totalMati.toLocaleString("id-ID")} ekor`}
          color="orange"
          size="lg"
        />
        <StatCard
          label="Persentase Kematian"
          value={`${ringkasan.persen.toLocaleString("id-ID", {
            maximumFractionDigits: 1,
          })}%`}
          color="orange"
          variant="outline"
          size="lg"
        />
      </div>

      <Tabs tabs={tabs} defaultTab="populasi" />
    </div>
  );
}