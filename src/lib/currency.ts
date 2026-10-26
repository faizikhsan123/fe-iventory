// Util nominal (Rupiah, gaya id-ID): titik = ribuan, koma = desimal.
// "raw" = string angka murni untuk form/API: "10000000" atau "1234.5" (titik desimal, tanpa pemisah ribuan).

/** Batas digit bagian bulat; kolom backend decimal(15,2) -> 13 digit. */
export const MAX_INT_DIGITS = 13;

const groupThousands = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Teks bebas (ketikan/paste, mis. "Rp 10.000.000") -> raw. Koma = desimal hanya bila decimals > 0. */
export function parseCurrency(input: string, decimals = 0): string {
  let text = input.replace(/[^\d,]/g, "");
  if (decimals <= 0) text = text.replace(/,.*$/, ""); // buang bagian desimal bila tidak didukung
  const commaAt = text.indexOf(",");
  const intPart = (commaAt === -1 ? text : text.slice(0, commaAt)).replace(/^0+(?=\d)/, "").slice(0, MAX_INT_DIGITS);
  if (commaAt === -1) return intPart;
  const frac = text.slice(commaAt + 1).replace(/,/g, "").slice(0, decimals);
  return `${intPart === "" ? "0" : intPart}.${frac}`;
}

/** raw -> tampilan "10.000.000" / "1.234,5" (koma akhir dipertahankan saat user baru mengetik koma). */
export function formatRaw(raw: string): string {
  if (!raw) return "";
  const [int, frac] = raw.split(".");
  const grouped = groupThousands(int);
  return frac === undefined ? grouped : `${grouped},${frac}`;
}

/** Nilai dari server/form (10000000, "10000000.00", null) -> raw. */
export function valueToRaw(value: string | number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  const fixed = num.toFixed(Math.max(decimals, 0));
  const [int, frac = ""] = fixed.split(".");
  const trimmed = frac.replace(/0+$/, "");
  return trimmed ? `${int}.${trimmed}` : int;
}

/** Untuk tampilan read-only: 10000000 / "10000000.00" -> "10.000.000". Kosong -> "". */
export function formatCurrency(value: string | number | null | undefined, decimals = 0): string {
  const raw = valueToRaw(value, decimals);
  return raw.startsWith("-") ? `-${formatRaw(raw.slice(1))}` : formatRaw(raw);
}
