import Tabs from "../../components/tabs";
import StokPakan from "../../components/stok_pakan";
import KalkulatorPakan from "./kalkulator_pakan";

export default function Pakan() {
  const tabs = [
    { key: "stok", label: "Stok Pakan", content: <StokPakan /> },
    { key: "kalkulator", label: "Kalkulator Pakan", content: <KalkulatorPakan /> },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Pakan</h1>
      <Tabs tabs={tabs} defaultTab="stok" />
    </div>
  );
}