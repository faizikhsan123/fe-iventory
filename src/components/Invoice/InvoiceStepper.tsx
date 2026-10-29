import { Check } from "lucide-react";
import { INVOICE_STATUSES, statusIndex } from "@/lib/invoice";

// posisi invoice di tahapan: langkah yang sudah lewat terisi, langkah sekarang disorot.
// compact: lingkaran kecil tanpa label (tabel/kartu). Penuh: tiap langkah berbagi lebar sama, label membungkus,
// jadi 7 tahap tetap muat di layar HP tanpa scroll horizontal.
const InvoiceStepper = ({ status, compact = false }: { status: string; compact?: boolean }) => {
  const current = statusIndex(status);

  return (
    <ol
      className={`flex ${compact ? "items-center" : "w-full items-start"}`}
      aria-label={`Invoice status: ${INVOICE_STATUSES[current]?.label ?? status}`}
    >
      {INVOICE_STATUSES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={s.value}
            aria-current={active ? "step" : undefined}
            className={compact ? "flex items-center" : "relative flex min-w-0 flex-1 flex-col items-center gap-1"}
          >
            {!compact && i > 0 && (
              <span
                aria-hidden="true"
                className={`absolute right-1/2 top-3 h-0.5 sm:top-3.5 w-full -translate-y-1/2 ${i <= current ? "bg-[#3F72AF]" : "bg-[#DBE2EF]"}`}
              />
            )}
            <span
              title={s.hint}
              className={`relative grid place-items-center rounded-full text-[10px] font-bold ring-2 ${
                compact ? "h-5 w-5" : "h-6 w-6 sm:h-7 sm:w-7 sm:text-xs"
              } ${
                active
                  ? "bg-[#112D4E] text-white ring-[#8FB0DC]"
                  : done
                    ? "bg-[#3F72AF] text-white ring-[#3F72AF]"
                    : "bg-white text-[#7B8FAE] ring-[#BFCCE3]"
              }`}
            >
              {done ? <Check size={compact ? 11 : 14} /> : i + 1}
            </span>
            {!compact && (
              <span
                className={`px-0 text-center text-[9px] font-semibold leading-tight break-words sm:px-0.5 sm:text-[11px] ${active ? "text-[#112D4E]" : "text-[#7B8FAE]"}`}
              >
                {s.label}
              </span>
            )}
            {compact && i < INVOICE_STATUSES.length - 1 && (
              <span aria-hidden="true" className={`h-0.5 w-4 ${done ? "bg-[#3F72AF]" : "bg-[#DBE2EF]"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default InvoiceStepper;
