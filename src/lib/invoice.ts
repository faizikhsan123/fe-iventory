// Tahapan invoice jasa, berurutan. Samakan dengan Invoice::STATUSES di backend kalau tahapannya diubah.
export const INVOICE_STATUSES = [
  { value: "drafting_timesheet", label: "Drafting Timesheet", hint: "Timesheet is being drafted" },
  { value: "waiting_approved_timesheet", label: "Waiting Approved Timesheet", hint: "Waiting for timesheet approval" },
  { value: "waiting_quote_or_invoicing", label: "Waiting Quote or Invoicing", hint: "Waiting for quote or invoicing" },
  { value: "waiting_service_receipt", label: "Waiting Service Receipt", hint: "Waiting for service receipt" },
  { value: "waiting_work_order", label: "Waiting Work Order", hint: "Waiting for work order" },
  { value: "waiting_payment", label: "Waiting Payment", hint: "Waiting for payment" },
  { value: "paid", label: "Paid", hint: "Payment received" },
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]["value"];

// Divisi untuk invoice: tanpa Safety (invoice lama berdivisi Safety tetap tampil apa adanya).
export const INVOICE_DIVISIONS = ["Gas Analyzer", "I&C-PMR", "I&C-ER", "Dryer"] as const;
export type InvoiceDivision = (typeof INVOICE_DIVISIONS)[number];

export type SortDirection = "asc" | "desc";

export const statusIndex = (s: string) => INVOICE_STATUSES.findIndex((x) => x.value === s);
export const statusLabel = (s: string) => INVOICE_STATUSES.find((x) => x.value === s)?.label ?? s;

export const rupiah = (n: number | null | undefined) =>
  n == null ? "-" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// warna badge per status (makin gelap makin dekat ke Paid; palet aplikasi saja)
export const statusBadgeClass: Record<string, string> = {
  drafting_timesheet: "bg-[#F9F7F7] text-[#50688C] ring-[#BFCCE3]",
  waiting_approved_timesheet: "bg-[#DBE2EF] text-[#112D4E] ring-[#9DB2D3]",
  waiting_quote_or_invoicing: "bg-[#C7D6EE] text-[#112D4E] ring-[#9DB2D3]",
  waiting_service_receipt: "bg-[#8FB0DC] text-[#112D4E] ring-[#8FB0DC]",
  waiting_work_order: "bg-[#3F72AF] text-white ring-[#3F72AF]",
  waiting_payment: "bg-[#FDECC8] text-[#7A4B00] ring-[#E9C46A]",
  paid: "bg-[#112D4E] text-white ring-[#112D4E]",
};

// Dokumen pendukung invoice (samakan dengan backend: type quote|wo|invoice, maks 10 MB)
export const INVOICE_DOC_TYPES = [
  { value: "quote", label: "Quote" },
  { value: "wo", label: "WO" },
  { value: "invoice", label: "Invoice" },
] as const;
export type InvoiceDocType = (typeof INVOICE_DOC_TYPES)[number]["value"];

export const INVOICE_DOC_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"] as const;
export const INVOICE_DOC_MAX_BYTES = 10 * 1024 * 1024;
export const INVOICE_DOC_ACCEPT = INVOICE_DOC_EXTENSIONS.map((e) => `.${e}`).join(",");

// Return pesan error, atau null kalau file valid.
export const validateInvoiceDoc = (file: File): string | null => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(INVOICE_DOC_EXTENSIONS as readonly string[]).includes(ext))
    return `Format .${ext || "?"} is not supported. Use: ${INVOICE_DOC_EXTENSIONS.join(", ")}`;
  if (file.size > INVOICE_DOC_MAX_BYTES) return "Maximum file size is 10 MB";
  if (file.size === 0) return "File is empty";
  return null;
};
