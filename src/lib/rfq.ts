import { daysLeft, EXPIRING_DAYS } from "@/lib/contract";

// Daftar prioritas (kode, guide, PIC) datang dari backend (/rfqs/options), satu sumber kebenaran.
// Di sini hanya label & warna tampilan.

export const RFQ_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "on_hold", label: "On Hold" },
] as const;

export type RfqStatus = (typeof RFQ_STATUSES)[number]["value"];

export const rfqStatusLabel = (s: string) => RFQ_STATUSES.find((x) => x.value === s)?.label ?? s;

// pending merah (sama seperti kolom Status di log), selebihnya dari palet aplikasi
export const rfqStatusBadgeClass: Record<string, string> = {
  pending: "bg-[#FDECEA] text-[#B3261E] ring-[#F2B8B5]",
  won: "bg-[#112D4E] text-white ring-[#112D4E]",
  lost: "bg-[#F9F7F7] text-[#50688C] ring-[#BFCCE3]",
  on_hold: "bg-[#DBE2EF] text-[#112D4E] ring-[#9DB2D3]",
};

// grup prioritas: A = BDM, B = Engineering, C = Management, D = On hold, E = Loss
export const PRIORITY_GROUPS = ["A", "B", "C", "D", "E"] as const;

export const priorityGroupLabel: Record<string, string> = {
  A: "A · BDM",
  B: "B · Engineering",
  C: "C · Management",
  D: "D · On hold",
  E: "E · Loss",
};

export const priorityBadgeClass: Record<string, string> = {
  A: "bg-[#112D4E] text-white ring-[#112D4E]",
  B: "bg-[#3F72AF] text-white ring-[#3F72AF]",
  C: "bg-[#DBE2EF] text-[#112D4E] ring-[#9DB2D3]",
  D: "bg-[#F9F7F7] text-[#50688C] ring-[#BFCCE3]",
  E: "bg-[#FDECEA] text-[#B3261E] ring-[#F2B8B5]",
};

// RFQ pending yang deadline-nya <= 14 hari (atau lewat) ditandai merah, sama seperti kontrak dan MCU
export const isRfqDue = (status: string, deadline?: string | null): boolean => {
  if (status !== "pending") return false;
  const n = daysLeft(deadline);
  return n !== null && n <= EXPIRING_DAYS;
};

export const monthYear = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "-";
