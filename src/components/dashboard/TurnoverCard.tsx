import { useState } from "react";
import { AlertCircle, ChevronDown, UserMinus, UserPlus, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useTurnover from "@/hooks/dashboard/turnover";
import { formatTanggalIndo } from "@/lib/tanggal";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const selectClass =
  "h-10 rounded-lg border border-[#BFCCE3] bg-white px-3 text-sm font-semibold text-[#112D4E] outline-none transition hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF]";

function MonthMultiSelect({ value, onChange }: { value: number[]; onChange: (v: number[]) => void }) {
  const toggle = (m: number) =>
    onChange(value.includes(m) ? value.filter((x) => x !== m) : [...value, m].sort((a, b) => a - b));
  const text =
    value.length === 0 ? "Whole year" : value.length <= 2 ? value.map((m) => MONTHS[m - 1]).join(", ") : `${value.length} months`;

  return (
    <Popover>
      <PopoverTrigger aria-label="Select months" className={`${selectClass} inline-flex min-w-36 items-center justify-between gap-2`}>
        <span className="truncate">{text}</span>
        <ChevronDown className="h-4 w-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="mb-1 flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-[#50688C]">Select months</span>
          <button
            type="button"
            onClick={() => onChange([])}
            disabled={value.length === 0}
            className="text-xs font-semibold text-[#3F72AF] hover:underline disabled:opacity-40"
          >
            All / Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-0.5">
          {MONTH_NAMES.map((name, i) => (
            <label key={name} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-[#112D4E] hover:bg-[#F9F7F7]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#112D4E]"
                checked={value.includes(i + 1)}
                onChange={() => toggle(i + 1)}
              />
              {name}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const pct = (n: number | null | undefined) => (n == null ? "-" : `${n.toFixed(2)}%`);

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#DBE2EF] text-[#112D4E]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-extrabold tabular-nums leading-none text-[#112D4E]">{value}</p>
        <p className="mt-1 truncate text-xs text-[#50688C]">{label}</p>
      </div>
    </div>
  );
}

const TurnoverCard = () => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [months, setMonths] = useState<number[]>([]); // kosong = per tahun
  const { data, error, isFetching } = useTurnover(year, months);

  const years = data?.years?.length ? data.years : [year];
  // label periode dibuat di frontend (server mengirim nama bulan bahasa Indonesia)
  const periodLabel = data
    ? months.length === 0
      ? `Year ${data.period.year}`
      : months.length === 1
        ? `${MONTH_NAMES[months[0] - 1]} ${data.period.year}`
        : `${months.map((m) => MONTHS[m - 1]).join(", ")} ${data.period.year}`
    : "";
  const maxRate = Math.max(1, ...(data?.monthly ?? []).map((m) => m.turnover_rate ?? 0));

  return (
    <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex flex-col gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
          <h3 className="font-bold text-[#112D4E]">Employee Turnover Rate</h3>
        </div>
        <div className="flex gap-2">
          <select aria-label="Year" className={selectClass} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <MonthMultiSelect value={months} onChange={setMonths} />
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm font-medium text-[#B3261E]">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {!error && !data && <div className="h-48 animate-pulse bg-[#F9F7F7]" />}

      {!error && data && (
        <div className={`space-y-5 p-4 transition-opacity sm:p-6 ${isFetching ? "opacity-60" : ""}`}>
          {/* Ringkasan periode */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <div className="col-span-2 rounded-lg bg-[#112D4E] p-4 text-white lg:col-span-1">
              <p className="text-xs text-[#9DB2D3]">{periodLabel}</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums leading-none">{pct(data.summary.turnover_rate)}</p>
              <p className="mt-1.5 text-xs text-[#9DB2D3]">Turnover rate</p>
            </div>
            <Stat icon={UserMinus} label="Employees left" value={String(data.summary.left)} />
            <Stat icon={UserPlus} label="Employees joined" value={String(data.summary.joined)} />
            <Stat
              icon={Users}
              label="Headcount start → end"
              value={`${data.summary.headcount_start} → ${data.summary.headcount_end}`}
            />
            <Stat icon={Users} label="Average headcount" value={String(data.summary.average_headcount)} />
          </div>

          {/* Per bulan dalam tahun terpilih (klik bar untuk pilih/batal pilih bulan) */}
          <div>
            <p className="mb-2 text-xs font-semibold text-[#50688C]">Turnover rate per month, {data.period.year}</p>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
              {data.monthly.map((m) => {
                const h = m.turnover_rate ? Math.max(6, (m.turnover_rate / maxRate) * 64) : 3;
                const active = months.includes(m.month);
                return (
                  <button
                    key={m.month}
                    type="button"
                    disabled={m.future}
                    onClick={() =>
                      setMonths((prev) =>
                        prev.includes(m.month) ? prev.filter((x) => x !== m.month) : [...prev, m.month].sort((a, b) => a - b),
                      )
                    }
                    aria-pressed={active}
                    aria-label={`${MONTH_NAMES[m.month - 1]}: ${pct(m.turnover_rate)}, ${m.left} left`}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-center transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      active ? "border-[#112D4E] bg-[#DBE2EF]" : "border-[#DBE2EF] bg-white hover:bg-[#F9F7F7]"
                    }`}
                  >
                    <span className="flex h-16 items-end">
                      <span
                        className={`w-4 rounded-t ${m.left > 0 ? "bg-[#B3261E]" : "bg-[#9DB2D3]"}`}
                        style={{ height: m.future ? 3 : h }}
                      />
                    </span>
                    <span className="text-[11px] font-bold text-[#112D4E]">{MONTHS[m.month - 1]}</span>
                    <span className="text-[10px] tabular-nums text-[#50688C]">{m.future ? "-" : pct(m.turnover_rate)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Karyawan yang keluar di periode ini */}
          <div>
            <p className="mb-2 text-xs font-semibold text-[#50688C]">Employees who left, {periodLabel}</p>
            {data.left_employees.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#BFCCE3] px-4 py-6 text-center text-sm text-[#50688C]">
                No employees left during this period
              </p>
            ) : (
              <ul className="divide-y divide-[#DBE2EF] rounded-lg border border-[#DBE2EF]">
                {data.left_employees.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-[#112D4E]">{e.name}</p>
                      <p className="text-xs text-[#50688C]">
                        {e.position} · {e.division}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-[#50688C]">{formatTanggalIndo(e.left_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-xs text-[#7B8FAE]">
            Turnover rate = employees who left ÷ average headcount × 100. Average headcount = (headcount at start +
            headcount at end of period) ÷ 2.
          </p>
        </div>
      )}
    </div>
  );
};

export default TurnoverCard;
