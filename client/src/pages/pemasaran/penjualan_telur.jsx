import { useState } from "react";
import Tabs from "../../components/tabs";
import OrderTelurForm from "../../components/order_telur_form";
import {
  antreanAwal,
  selesaiAwal,
  buatIdOrder,
} from "../../utils/penjualan_telur";

export default function PenjualanTelur() {
  const [antrean, setAntrean] = useState(antreanAwal);
  const [selesai] = useState(selesaiAwal);
  const [orderEdit, setOrderEdit] = useState(null);

  function simpanOrder(data) {
    if (data.id) {
      setAntrean((lama) =>
        lama.map((o) => (o.id === data.id ? { ...o, ...data } : o)),
      );
    } else {
      setAntrean((lama) => [
        { ...data, id: buatIdOrder([...lama, ...selesai]) },
        ...lama,
      ]);
    }
    setOrderEdit(null);
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
      content: <p>{antrean.length} order dalam antrean (tabel menyusul).</p>,
    },
    {
      key: "selesai",
      label: "Data Order Selesai",
      content: <p>{selesai.length} order selesai (tabel menyusul).</p>,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Penjualan Telur</h1>
      <Tabs tabs={tabs} defaultTab="order" />
    </div>
  );
}
