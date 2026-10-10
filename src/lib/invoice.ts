import { DIVISIONS, type Division } from "@/lib/divisions";

// Tahapan invoice jasa, berurutan. Samakan dengan Invoice::STATUSES di backend kalau tahapannya diubah.
export const INVOICE_STATUSES = [
  { value: "drafting_timesheet", label: "Drafting Timesheet", hint: "Timesheet disusun" },
  { value: "waiting_approved_timesheet", label: "Waiting Approved Timesheet", hint: "Menunggu timesheet disetujui" },
  { value: "waiting_service_receipt", label: "Waiting Service Receipt", hint: "Menunggu service receipt" },
  { value: "waiting_work_order", label: "Waiting Work Order", hint: "Menunggu work order" },
  { value: "paid", label: "Paid", hint: "Pembayaran diterima" },
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]["value"];

export const INVOICE_DIVISIONS = DIVISIONS;
export type InvoiceDivision = Division;

export type SortDirection = "asc" | "desc";

export const statusIndex = (s: string) => INVOICE_STATUSES.findIndex((x) => x.value === s);
export const statusLabel = (s: string) => INVOICE_STATUSES.find((x) => x.value === s)?.label ?? s;

export const rupiah = (n: number | null | undefined) =>
  n == null ? "-" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// warna badge per status (makin gelap makin dekat ke Paid; palet aplikasi saja)
export const statusBadgeClass: Record<string, string> = {
  drafting_timesheet: "bg-[#F9F7F7] text-[#50688C] ring-[#BFCCE3]",
  waiting_approved_timesheet: "bg-[#DBE2EF] text-[#112D4E] ring-[#9DB2D3]",
  waiting_service_receipt: "bg-[#8FB0DC] text-[#112D4E] ring-[#8FB0DC]",
  waiting_work_order: "bg-[#3F72AF] text-white ring-[#3F72AF]",
  paid: "bg-[#112D4E] text-white ring-[#112D4E]",
};
