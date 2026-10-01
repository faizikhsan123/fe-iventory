import { useEffect, useState } from "react";
import { Truck, Check, X, Info, type LucideIcon } from "lucide-react";

export type CardTone = "navy" | "azure" | "sky" | "ice";

export interface CardItem {
  icon: LucideIcon;
  value: number;
  label: string;
  tone?: CardTone;
}

// tile icon + garis atas kartu, semuanya dari palet
const toneClass: Record<CardTone, { tile: string; top: string }> = {
  navy: { tile: "bg-[#112D4E] text-white", top: "border-t-[#112D4E]" },
  azure: { tile: "bg-[#3F72AF] text-white", top: "border-t-[#3F72AF]" },
  sky: { tile: "bg-[#DBE2EF] text-[#112D4E]", top: "border-t-[#9DB2D3]" },
  ice: {
    tile: "bg-[#F9F7F7] text-[#112D4E] border border-[#BFCCE3]",
    top: "border-t-[#DBE2EF]",
  },
};

const defaultCards: CardItem[] = [
  { icon: Truck, value: 5, label: "Total Supplier", tone: "navy" },
  { icon: Check, value: 4, label: "Aktif", tone: "azure" },
  { icon: X, value: 1, label: "Tidak Aktif", tone: "sky" },
  { icon: Info, value: 5, label: "Kota", tone: "ice" },
];

// animasi hitung naik (dimatikan kalau user pilih reduced motion)
const useCountUp = (target: number, duration = 900) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return n;
};

const StatCard = ({ icon: Icon, value, label, tone = "navy" }: CardItem) => {
  const count = useCountUp(value);
  const t = toneClass[tone];

  return (
    <div
      className={`min-w-0 rounded-lg border border-[#DBE2EF] border-t-[3px] bg-white p-3.5 shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:p-5 ${t.top}`}
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg sm:h-12 sm:w-12 ${t.tile}`}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div className="min-w-0">
          <p className="text-2xl font-extrabold leading-none tabular-nums text-[#112D4E] sm:text-3xl">
            {count}
          </p>
          <p className="mt-1 truncate text-xs font-medium text-[#50688C] sm:text-sm">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

const CardComponent = ({ cards = defaultCards }: { cards?: CardItem[] }) => (
  <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
    {cards.map((card) => (
      <StatCard key={card.label} {...card} />
    ))}
  </div>
);

export default CardComponent;