export const formatRupiah = (angka) =>
    "Rp " + new Intl.NumberFormat("id-ID").format(angka);