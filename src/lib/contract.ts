// Aturan kontrak: berakhir <= 30 hari lagi (atau sudah lewat) ditandai merah di semua halaman
export const EXPIRING_DAYS = 30;

// sisa hari sampai contract_end (YYYY-MM-DD); negatif = sudah lewat; null = tidak ada tanggal
export const daysLeft = (end?: string | null): number | null => {
  if (!end) return null;
  const [y, m, d] = end.split("-").map(Number);
  if (!y || !m || !d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(y, m - 1, d).getTime() - today.getTime()) / 86_400_000);
};

export const isExpiring = (end?: string | null): boolean => {
  const n = daysLeft(end);
  return n !== null && n <= EXPIRING_DAYS;
};

// teks singkat untuk badge, null kalau kontrak masih aman
export const expiringLabel = (end?: string | null): string | null => {
  const n = daysLeft(end);
  if (n === null || n > EXPIRING_DAYS) return null;
  if (n < 0) return `Berakhir ${Math.abs(n)} hari lalu`;
  if (n === 0) return "Berakhir hari ini";
  return `${n} hari lagi`;
};

export const expiringTextClass = "font-semibold text-[#B3261E]";
export const expiringBadgeClass =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#FDECEA] px-2 py-0.5 text-xs font-bold text-[#B3261E] ring-1 ring-inset ring-[#F2B8B5]";
