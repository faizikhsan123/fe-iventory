import { Check } from "lucide-react";
import { INVOICE_STATUSES, statusIndex } from "@/lib/invoice";

// posisi invoice di tahapan: langkah yang sudah lewat terisi, langkah sekarang disorot
const InvoiceStepper = ({ status, compact = false }: { status: string; compact?: boolean }) => {
  const current = statusIndex(status);

  return (
    <ol className="flex items-center" aria-label={`Status invoice: ${INVOICE_STATUSES[current]?.label ?? status}`}>
      {INVOICE_STATUSES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.value} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                title={s.hint}
                className={`grid place-items-center rounded-full text-[10px] font-bold ring-2 ${
                  compact ? "h-5 w-5" : "h-7 w-7 text-xs"
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
                <span className={`text-[11px] font-semibold ${active ? "text-[#112D4E]" : "text-[#7B8FAE]"}`}>
                  {s.label}
                </span>
              )}
            </div>
            {i < INVOICE_STATUSES.length - 1 && (
              <span
                aria-hidden="true"
                className={`h-0.5 ${compact ? "w-4" : "mx-1 mb-4 w-8 sm:w-12"} ${done ? "bg-[#3F72AF]" : "bg-[#DBE2EF]"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default InvoiceStepper;
