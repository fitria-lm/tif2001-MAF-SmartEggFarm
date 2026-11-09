export const formatRupiah = (angka) =>
    "Rp " + new Intl.NumberFormat("id-ID").format(angka);
export const formatTanggal = (isoString) =>
  new Date(isoString + "T00:00:00").toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });