import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";

const Navbar = ({ title }: { title: string }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const tanggal = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const jam = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">Inventaris APD &amp; Tools · PT Vando Teknik Solusi</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
          <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
          {tanggal}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
          <Clock className="h-3.5 w-3.5 text-violet-500" />
          {jam}
        </span>
      </div>
    </div>
  );
};

export default Navbar;