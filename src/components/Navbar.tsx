import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";

interface NavbarProps {
  title: string;
}

const chipClass =
  "inline-flex h-10 min-w-0 items-center gap-2 rounded-lg border border-[#DBE2EF] bg-white px-3 text-xs font-bold text-[#112D4E]";

const Navbar = ({ title }: NavbarProps) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30_000);
    
    return () => clearInterval(timer);
  }, []);

  const tanggal = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jam = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="mb-5 sm:mb-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        {/* Judul */}
        <div className="flex min-w-0 items-stretch gap-3">
          <span className="w-1 shrink-0 rounded-full bg-[#3F72AF]" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#112D4E] sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-xs leading-5 text-[#50688C] sm:text-sm">
              Inventaris APD &amp; Tools, PT Vando Teknik Solusi
            </p>
          </div>
        </div>

        {/* Tanggal + jam */}
        <div className="flex flex-wrap gap-2">
          <span className={chipClass}>
            <CalendarDays className="h-4 w-4 shrink-0 text-[#3F72AF]" />
            <span className="truncate">{tanggal}</span>
          </span>

          <span className={chipClass}>
            <Clock className="h-4 w-4 shrink-0 text-[#3F72AF]" />
            {jam}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;