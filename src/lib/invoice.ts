// Tahapan invoice jasa, berurutan. Samakan dengan Invoice::STATUSES di backend kalau tahapannya diubah.
export const INVOICE_STATUSES = [
  { value: "draft", label: "Draft", hint: "Invoice disiapkan" },
  { value: "submitted", label: "Dikirim", hint: "Invoice dikirim ke client" },
  { value: "verified", label: "Diverifikasi", hint: "Invoice diverifikasi client" },
  { value: "paid", label: "Dibayar", hint: "Pembayaran diterima" },
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]["value"];

export const INVOICE_DIVISIONS = ["PMR", "ER", "Gas", "Dryer"] as const;
export type InvoiceDivision = (typeof INVOICE_DIVISIONS)[number];

export const statusIndex = (s: string) => INVOICE_STATUSES.findIndex((x) => x.value === s);
export const statusLabel = (s: string) => INVOICE_STATUSES.find((x) => x.value === s)?.label ?? s;

export const rupiah = (n: number | null | undefined) =>
  n == null ? "-" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// warna badge per status (navy -> biru -> hijau tidak dipakai; palet aplikasi saja)
export const statusBadgeClass: Record<string, string> = {
  draft: "bg-[#F9F7F7] text-[#50688C] ring-[#BFCCE3]",
  submitted: "bg-[#DBE2EF] text-[#112D4E] ring-[#9DB2D3]",
  verified: "bg-[#3F72AF] text-white ring-[#3F72AF]",
  paid: "bg-[#112D4E] text-white ring-[#112D4E]",
};
