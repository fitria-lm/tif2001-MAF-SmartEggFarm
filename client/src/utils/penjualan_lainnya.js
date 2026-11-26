import { BAHAN_PAKAN } from "./stok_pakan";

// Barang yang tidak punya stok (tidak dicek dan tidak mengurangi stok pakan).
// Ayam Afkir sementara diperlakukan seperti ini; nanti dihubungkan ke Data Kandang.
export const JENIS_TANPA_STOK = ["Pakan Sisa", "Ayam Afkir", "Lainnya"];

export const JENIS_BARANG = [...BAHAN_PAKAN, ...JENIS_TANPA_STOK];

// Transaksi: { id, tanggal, pembeli, items: [{ jenis, nama?, jumlah (Kg), harga (per Kg) }] }
// Data dummy, nanti diganti data dari backend.
export const transaksiAwal = [
  {
    id: 1,
    tanggal: "2026-11-18",
    pembeli: "Pak Budi",
    items: [
      { jenis: "Jagung", jumlah: 50, harga: 6000 },
      { jenis: "Dedak", jumlah: 20, harga: 4500 },
    ],
  },
  {
    id: 2,
    tanggal: "2026-11-20",
    pembeli: "Bu Sari",
    items: [
      { jenis: "Pakan Sisa", jumlah: 30, harga: 2000 },
      { jenis: "Ayam Afkir", jumlah: 12, harga: 35000 },
    ],
  },
];

export const adalahPakanPokok = (jenis) => BAHAN_PAKAN.includes(jenis);

// Nama yang ditampilkan: untuk "Lainnya" memakai nama yang diketik
export const namaBarang = (item) =>
  item.jenis === "Lainnya" && item.nama ? item.nama : item.jenis;

export const subtotalItem = (item) =>
  (Number(item.jumlah) || 0) * (Number(item.harga) || 0);

export const totalItems = (items) =>
  items.reduce((jumlah, item) => jumlah + subtotalItem(item), 0);

export const totalTransaksi = (trx) => totalItems(trx.items);

export const totalPenjualan = (daftar) =>
  daftar.reduce((jumlah, trx) => jumlah + totalTransaksi(trx), 0);

export const jumlahTransaksi = (daftar) => daftar.length;

const bulatkan = (angka) => Math.round(angka * 1000) / 1000;

// Total Kg pakan pokok per bahan yang sedang ada di keranjang
export const jumlahPakanDiKeranjang = (items) => {
  const hasil = Object.fromEntries(BAHAN_PAKAN.map((nama) => [nama, 0]));
  items.forEach((item) => {
    if (adalahPakanPokok(item.jenis)) {
      hasil[item.jenis] += Number(item.jumlah) || 0;
    }
  });
  return hasil;
};

// Sisa stok setelah keranjang diambil (untuk ditampilkan di dropdown/form)
export const sisaStokSetelahKeranjang = (stokTersedia, items) => {
  const dikeranjang = jumlahPakanDiKeranjang(items);
  return Object.fromEntries(
    BAHAN_PAKAN.map((nama) => [
      nama,
      bulatkan(stokTersedia[nama] - dikeranjang[nama]),
    ]),
  );
};

// Validasi satu baris barang (sebelum dimasukkan ke keranjang).
// Mengembalikan pesan error atau "" jika valid.
export const validasiItem = (item, stokTersedia, itemsLain = []) => {
  if (!JENIS_BARANG.includes(item.jenis)) return "Pilih jenis barang.";
  if (item.jenis === "Lainnya" && !String(item.nama || "").trim()) {
    return "Nama barang wajib diisi untuk jenis Lainnya.";
  }
  const jumlah = Number(item.jumlah);
  if (!(jumlah > 0)) return "Jumlah (Kg) harus lebih dari 0.";
  const harga = Number(item.harga);
  if (!(harga > 0)) return "Harga per Kg harus lebih dari 0.";

  if (adalahPakanPokok(item.jenis)) {
    const sisa = sisaStokSetelahKeranjang(stokTersedia, itemsLain)[item.jenis];
    if (sisa <= 0) return `Stok ${item.jenis} habis.`;
    if (jumlah > sisa) {
      return `Stok ${item.jenis} tidak cukup (sisa ${sisa} Kg).`;
    }
  }
  return "";
};

// Validasi seluruh checkout. Mengembalikan array pesan error ([] jika valid).
export const validasiCheckout = ({ tanggal, pembeli, items }, stokTersedia) => {
  const errors = [];
  if (!tanggal) errors.push("Tanggal wajib diisi.");
  if (!String(pembeli || "").trim()) errors.push("Nama pembeli wajib diisi.");
  if (items.length === 0) {
    errors.push("Keranjang masih kosong.");
    return errors;
  }

  items.forEach((item, i) => {
    if (!JENIS_BARANG.includes(item.jenis)) {
      errors.push(`Barang ${i + 1}: pilih jenis barang.`);
    } else if (item.jenis === "Lainnya" && !String(item.nama || "").trim()) {
      errors.push(`Barang ${i + 1}: nama barang wajib diisi.`);
    }
    if (!(Number(item.jumlah) > 0)) {
      errors.push(`Barang ${i + 1}: jumlah harus lebih dari 0.`);
    }
    if (!(Number(item.harga) > 0)) {
      errors.push(`Barang ${i + 1}: harga harus lebih dari 0.`);
    }
  });

  // Stok dicek gabungan, supaya jenis yang sama di dua baris tidak lolos
  const dikeranjang = jumlahPakanDiKeranjang(items);
  BAHAN_PAKAN.forEach((nama) => {
    if (dikeranjang[nama] > stokTersedia[nama]) {
      errors.push(
        `Stok ${nama} tidak cukup (diminta ${dikeranjang[nama]} Kg, tersedia ${stokTersedia[nama]} Kg).`,
      );
    }
  });
  return errors;
};

export const idTransaksiBaru = (daftar) =>
  daftar.reduce((maks, trx) => Math.max(maks, trx.id), 0) + 1;

// Membuat objek transaksi yang bersih dari data form
export const buatTransaksi = (daftar, { tanggal, pembeli, items }) => ({
  id: idTransaksiBaru(daftar),
  tanggal,
  pembeli: pembeli.trim(),
  items: items.map((item) => ({
    jenis: item.jenis,
    ...(item.jenis === "Lainnya" ? { nama: String(item.nama).trim() } : {}),
    jumlah: Number(item.jumlah),
    harga: Number(item.harga),
  })),
});