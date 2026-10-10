import { priorityBadgeClass, rfqStatusBadgeClass, rfqStatusLabel } from "@/lib/rfq";

const base = "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset";

export const StatusBadge = ({ status }: { status: string }) => (
  <span className={`${base} ${rfqStatusBadgeClass[status] ?? ""}`}>{rfqStatusLabel(status)}</span>
);

export const PriorityBadge = ({ code, title }: { code: string; title?: string }) => (
  <span className={`${base} ${priorityBadgeClass[code.charAt(0)] ?? ""}`} title={title}>
    {code}
  </span>
);
