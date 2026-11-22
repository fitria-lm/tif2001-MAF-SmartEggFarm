import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Tabs from "../../components/tabs";
import OrderTelurForm from "../../components/order_telur_form";
import AntreanOrder from "../../components/antrean_order";
import SelesaiOrder from "../../components/selesai_order";
import {
  antreanAwal,
  selesaiAwal,
  buatIdOrder,
  selesaikanOrder,
} from "../../utils/penjualan_telur";

const hariIni = () => new Date().toLocaleDateString("sv-SE");

export default function PenjualanTelur() {
  const [, setSearchParams] = useSearchParams();
  const [antrean, setAntrean] = useState(antreanAwal);
  const [selesai, setSelesai] = useState(selesaiAwal);
  const [orderEdit, setOrderEdit] = useState(null);

  function simpanOrder(data) {
    if (data.id) {
      setAntrean((lama) =>
        lama.map((o) => (o.id === data.id ? { ...o, ...data } : o)),
      );
      setSearchParams({ tab: "antrean" });
    } else {
      setAntrean((lama) => [
        { ...data, id: buatIdOrder([...lama, ...selesai]) },
        ...lama,
      ]);
    }
    setOrderEdit(null);
  }

  function mulaiEdit(order) {
    setOrderEdit(order);
    setSearchParams({ tab: "order" });
  }

  function hapusOrder(id) {
    setAntrean((lama) => lama.filter((o) => o.id !== id));
    if (orderEdit?.id === id) setOrderEdit(null);
  }

  function selesaikan(id) {
    const hasil = selesaikanOrder(antrean, selesai, id, hariIni());
    setAntrean(hasil.antrean);
    setSelesai(hasil.selesai);
    if (orderEdit?.id === id) setOrderEdit(null);
  }

  const tabs = [
    {
      key: "order",
      label: "Input Data Order",
      content: (
        <OrderTelurForm
          key={orderEdit?.id ?? "baru"}
          orderEdit={orderEdit}
          onSimpan={simpanOrder}
          onBatal={() => setOrderEdit(null)}
        />
      ),
    },
    {
      key: "antrean",
      label: "Antrean",
      content: (
        <AntreanOrder
          antrean={antrean}
          onSelesaikan={selesaikan}
          onEdit={mulaiEdit}
          onHapus={hapusOrder}
        />
      ),
    },
    {
      key: "selesai",
      label: "Data Order Selesai",
      content: <SelesaiOrder selesai={selesai} />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Penjualan Telur</h1>
      <Tabs tabs={tabs} defaultTab="order" />
    </div>
  );
}
