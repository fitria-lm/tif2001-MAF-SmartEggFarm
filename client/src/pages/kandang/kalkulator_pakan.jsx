import { useMemo, useState } from "react";
import PakanInput from "../../components/pakan_input";
import PakanHasil from "../../components/pakan_hasil";
import { hitungPakan } from "../../utils/hitung_pakan";

let nextId = 1;
const bahanBaru = (nama = "") => ({ id: nextId++, nama, persen: "", harga: "" });

const formAwal = () => ({
  kebutuhanGram: "",
  jumlahAyam: "",
  bahan: [bahanBaru("Jagung"), bahanBaru("Konsentrat"), bahanBaru("Dedak")],
});

export default function KalkulatorPakan() {
  const [form, setForm] = useState(formAwal);

  // Dihitung ulang otomatis setiap form berubah (real-time)
  const hasil = useMemo(() => hitungPakan(form), [form]);

  const ubahField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const ubahBahan = (id, field, value) =>
    setForm((prev) => ({
      ...prev,
      bahan: prev.bahan.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    }));

  const tambahBahan = () =>
    setForm((prev) => ({ ...prev, bahan: [...prev.bahan, bahanBaru()] }));

  const hapusBahan = (id) =>
    setForm((prev) => ({
      ...prev,
      bahan: prev.bahan.filter((b) => b.id !== id),
    }));

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(280px,380px)_1fr] md:items-start">
      <PakanInput
        form={form}
        totalPersen={hasil.totalPersen}
        persenValid={hasil.persenValid}
        onField={ubahField}
        onBahan={ubahBahan}
        onTambah={tambahBahan}
        onHapus={hapusBahan}
        onReset={() => setForm(formAwal())}
      />
      <PakanHasil hasil={hasil} />
    </div>
  );
}