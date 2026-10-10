import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export type PageMeta = { current_page: number; last_page: number; per_page: number; total: number };

const btn = "h-9 w-9 rounded-lg border-[#BFCCE3] bg-white";

const Pagination = ({
  meta,
  unit,
  onChange,
}: {
  meta: PageMeta | null;
  unit: string;
  onChange: (page: number) => void;
}) => {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#DBE2EF] px-4 py-3 text-sm text-[#50688C]">
      <span>
        Halaman {meta.current_page} dari {meta.last_page} · {meta.total} {unit}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className={btn}
          disabled={meta.current_page <= 1}
          onClick={() => onChange(meta.current_page - 1)}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={btn}
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onChange(meta.current_page + 1)}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
