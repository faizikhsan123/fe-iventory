// @/lib/rupiah.ts
export const formatRupiah = (value: string | number | null | undefined): string => {
  // kosong / null -> tampilkan strip
  if (value === null || value === undefined || value === "") return "-";

  const angka = Number(value);
  if (Number.isNaN(angka)) return "-";

  // 20000000 -> "20.000.000"
  return `Rp ${new Intl.NumberFormat("id-ID").format(angka)}`;
};