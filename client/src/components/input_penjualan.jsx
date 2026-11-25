import { useState } from "react";
import {
  JENIS_BARANG,
  adalahPakanPokok,
  buatTransaksi,
  namaBarang,
  sisaStokSetelahKeranjang,
  subtotalItem,
  totalItems,
  validasiCheckout,
  validasiItem,
} from "../utils/penjualan_lainnya";
import { formatRupiah } from "../utils/format";
import { useStok } from "../context/stok_context";

const hariIni = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

const barisKosong = () => ({ jenis: "", nama: "", jumlah: "", harga: "" });

const formatKg = (angka) => `${Number(angka).toLocaleString("id-ID")} Kg`;

const kelasInput =
  "mt-1 w-full rounded-full border border-primary px-4 py-2 outline-none";

export default function InputPenjualan() {
  const { setTransaksi, stokTersedia } = useStok();

  const [tanggal, setTanggal] = useState(hariIni);
  const [pembeli, setPembeli] = useState("");
  const [items, setItems] = useState([]);
  const [baris, setBaris] = useState(barisKosong);
  const [errorBaris, setErrorBaris] = useState("");
  const [errorCheckout, setErrorCheckout] = useState([]);
  const [sukses, setSukses] = useState("");

  // Sisa stok setelah barang yang sudah masuk keranjang diambil
  const sisaStok = sisaStokSetelahKeranjang(stokTersedia, items);

  const ubahBaris = (field, value) => {
    setBaris((prev) => ({ ...prev, [field]: value }));
    setErrorBaris("");
  };

  const tambahBarang = () => {
    const pesan = validasiItem(baris, stokTersedia, items);
    if (pesan) {
      setErrorBaris(pesan);
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        jenis: baris.jenis,
        ...(baris.jenis === "Lainnya" ? { nama: baris.nama.trim() } : {}),
        jumlah: Number(baris.jumlah),
        harga: Number(baris.harga),
      },
    ]);
    setBaris(barisKosong());
    setErrorBaris("");
    setErrorCheckout([]);
    setSukses("");
  };

  const hapusBarang = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setErrorCheckout([]);
  };

  const checkout = () => {
    const data = { tanggal, pembeli, items };
    const errors = validasiCheckout(data, stokTersedia);
    if (errors.length > 0) {
      setErrorCheckout(errors);
      setSukses("");
      return;
    }
    setTransaksi((prev) => [...prev, buatTransaksi(prev, data)]);
    setSukses(
      `Transaksi ${pembeli.trim()} berhasil disimpan (${formatRupiah(totalItems(items))}).`,
    );
    setPembeli("");
    setItems([]);
    setBaris(barisKosong());
    setErrorCheckout([]);
    setErrorBaris("");
  };

  const labelOpsi = (jenis) => {
    if (!adalahPakanPokok(jenis)) return jenis;
    return sisaStok[jenis] <= 0
      ? `${jenis} (stok habis)`
      : `${jenis} (sisa ${formatKg(sisaStok[jenis])})`;
  };

  return (
    <div className="space-y-6">
      {sukses && (
        <div className="rounded-2xl border border-[#ACC695] bg-[#ACC695]/30 px-4 py-3 text-sm text-primary">
          {sukses}
        </div>
      )}

      <div className="rounded-3xl border border-[#ACC695] bg-white p-5">
        <h2 className="text-lg font-semibold text-primary">Data Pembeli</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tanggal-penjualan" className="block text-sm font-medium">
              Tanggal
            </label>
            <input
              id="tanggal-penjualan"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className={kelasInput}
            />
          </div>
          <div>
            <label htmlFor="nama-pembeli" className="block text-sm font-medium">
              Nama Pembeli
            </label>
            <input
              id="nama-pembeli"
              type="text"
              value={pembeli}
              onChange={(e) => setPembeli(e.target.value)}
              placeholder="Nama pembeli"
              className={kelasInput}
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#ACC695] bg-white p-5">
        <h2 className="text-lg font-semibold text-primary">Tambah Barang</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="jenis-barang" className="block text-sm font-medium">
              Jenis Barang
            </label>
            <select
              id="jenis-barang"
              value={baris.jenis}
              onChange={(e) => ubahBaris("jenis", e.target.value)}
              className={kelasInput}
            >
              <option value="">Pilih jenis barang</option>
              {JENIS_BARANG.map((jenis) => (
                <option
                  key={jenis}
                  value={jenis}
                  disabled={adalahPakanPokok(jenis) && sisaStok[jenis] <= 0}
                >
                  {labelOpsi(jenis)}
                </option>
              ))}
            </select>
          </div>

          {baris.jenis === "Lainnya" && (
            <div>
              <label htmlFor="nama-barang" className="block text-sm font-medium">
                Nama Barang
              </label>
              <input
                id="nama-barang"
                type="text"
                value={baris.nama}
                onChange={(e) => ubahBaris("nama", e.target.value)}
                placeholder="Mis. karung bekas"
                className={kelasInput}
              />
            </div>
          )}

          <div>
            <label htmlFor="jumlah-barang" className="block text-sm font-medium">
              Jumlah (Kg)
            </label>
            <input
              id="jumlah-barang"
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={baris.jumlah}
              onChange={(e) => ubahBaris("jumlah", e.target.value)}
              className={kelasInput}
            />
          </div>

          <div>
            <label htmlFor="harga-barang" className="block text-sm font-medium">
              Harga per Kg (Rp)
            </label>
            <input
              id="harga-barang"
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={baris.harga}
              onChange={(e) => ubahBaris("harga", e.target.value)}
              className={kelasInput}
            />
          </div>

          <div>
            <span className="block text-sm font-medium">Subtotal</span>
            <div className="mt-1 rounded-full bg-[#ACC695]/30 px-4 py-2 font-semibold text-primary">
              {formatRupiah(subtotalItem(baris))}
            </div>
          </div>
        </div>

        {errorBaris && <p className="mt-3 text-sm text-red-600">{errorBaris}</p>}

        <button
          type="button"
          onClick={tambahBarang}
          className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white"
        >
          Tambah ke Keranjang
        </button>
      </div>

      <div className="rounded-3xl border border-[#ACC695] bg-white p-5">
        <h2 className="text-lg font-semibold text-primary">Keranjang</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-[#ACC695]/30 text-left text-primary">
              <tr>
                <th className="px-4 py-3">Barang</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Harga per Kg</th>
                <th className="px-4 py-3">Subtotal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    Keranjang masih kosong.
                  </td>
                </tr>
              )}
              {items.map((item, index) => (
                <tr key={`${item.jenis}-${index}`} className="border-t border-gray-100">
                  <td className="px-4 py-3">{namaBarang(item)}</td>
                  <td className="px-4 py-3">{formatKg(item.jumlah)}</td>
                  <td className="px-4 py-3">{formatRupiah(item.harga)}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatRupiah(subtotalItem(item))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => hapusBarang(index)}
                        className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-sm text-gray-500">Total Keseluruhan</span>
            <p className="text-2xl font-bold text-primary">
              {formatRupiah(totalItems(items))}
            </p>
          </div>
          <button
            type="button"
            onClick={checkout}
            disabled={items.length === 0}
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            Checkout
          </button>
        </div>

        {errorCheckout.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-600">
            {errorCheckout.map((pesan) => (
              <li key={pesan}>{pesan}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}