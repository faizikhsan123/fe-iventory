export function formatTanggalIndo(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

const ID_MONTHS: Record<string, string> = {
  januari: "January",
  februari: "February",
  maret: "March",
  april: "April",
  mei: "May",
  juni: "June",
  juli: "July",
  agustus: "August",
  september: "September",
  oktober: "October",
  november: "November",
  desember: "December",
  // singkatan
  jan: "Jan",
  feb: "Feb",
  mar: "Mar",
  apr: "Apr",
  jun: "Jun",
  jul: "Jul",
  agu: "Aug",
  agt: "Aug",
  sep: "Sep",
  okt: "Oct",
  nov: "Nov",
  des: "Dec",
};

const ID_DAYS: Record<string, string> = {
  senin: "Monday",
  selasa: "Tuesday",
  rabu: "Wednesday",
  kamis: "Thursday",
  jumat: "Friday",
  "jum'at": "Friday",
  sabtu: "Saturday",
  minggu: "Sunday",
};

/**
 * Tampilkan tanggal dari server dalam bahasa Inggris.
 * - "08 Oktober 2026" (sudah terformat Indonesia oleh backend) -> "08 October 2026"
 * - "2026-10-08" / "2026-10-08 00:00:00" (ISO) -> "08 October 2026"
 * - selain itu (mis. "-") dikembalikan apa adanya.
 */
export function formatServerDate(value: string | null | undefined): string {
  if (!value) return "";
  const text = String(value).trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
  if (iso) {
    const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    }
    return text;
  }
  return text.replace(/[A-Za-z']+/g, (w) => {
    const k = w.toLowerCase();
    return ID_MONTHS[k] ?? ID_DAYS[k] ?? w;
  });
}
