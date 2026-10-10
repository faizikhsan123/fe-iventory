import { useState } from "react";
import { AlertCircle, UserMinus, UserPlus, Users } from "lucide-react";
import useTurnover from "@/hooks/dashboard/turnover";
import { formatTanggalIndo } from "@/lib/tanggal";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const selectClass =
  "h-10 rounded-lg border border-[#BFCCE3] bg-white px-3 text-sm font-semibold text-[#112D4E] outline-none transition hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF]";

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
  const [month, setMonth] = useState<number | null>(null); // null = per tahun
  const { data, error, isFetching } = useTurnover(year, month);

  const years = data?.years?.length ? data.years : [year];
  const maxRate = Math.max(1, ...(data?.monthly ?? []).map((m) => m.turnover_rate ?? 0));

  return (
    <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex flex-col gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
          <h3 className="font-bold text-[#112D4E]">Turn Over Rate Karyawan</h3>
        </div>
        <div className="flex gap-2">
          <select aria-label="Tahun" className={selectClass} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            aria-label="Bulan"
            className={selectClass}
            value={month ?? ""}
            onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Per tahun</option>
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
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
              <p className="text-xs text-[#9DB2D3]">{data.period.label}</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums leading-none">{pct(data.summary.turnover_rate)}</p>
              <p className="mt-1.5 text-xs text-[#9DB2D3]">Turn over rate</p>
            </div>
            <Stat icon={UserMinus} label="Karyawan keluar" value={String(data.summary.left)} />
            <Stat icon={UserPlus} label="Karyawan masuk" value={String(data.summary.joined)} />
            <Stat
              icon={Users}
              label="Headcount awal → akhir"
              value={`${data.summary.headcount_start} → ${data.summary.headcount_end}`}
            />
            <Stat icon={Users} label="Rata-rata headcount" value={String(data.summary.average_headcount)} />
          </div>

          {/* Per bulan dalam tahun terpilih (klik bar untuk pilih bulan) */}
          <div>
            <p className="mb-2 text-xs font-semibold text-[#50688C]">Turn over rate per bulan, {data.period.year}</p>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
              {data.monthly.map((m) => {
                const h = m.turnover_rate ? Math.max(6, (m.turnover_rate / maxRate) * 64) : 3;
                const active = month === m.month;
                return (
                  <button
                    key={m.month}
                    type="button"
                    disabled={m.future}
                    onClick={() => setMonth(active ? null : m.month)}
                    aria-pressed={active}
                    aria-label={`${MONTH_NAMES[m.month - 1]}: ${pct(m.turnover_rate)}, ${m.left} keluar`}
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
            <p className="mb-2 text-xs font-semibold text-[#50688C]">Karyawan keluar, {data.period.label}</p>
            {data.left_employees.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#BFCCE3] px-4 py-6 text-center text-sm text-[#50688C]">
                Tidak ada karyawan yang keluar pada periode ini
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
            Turn over rate = karyawan keluar ÷ rata-rata headcount × 100. Rata-rata headcount = (headcount awal +
            headcount akhir periode) ÷ 2.
          </p>
        </div>
      )}
    </div>
  );
};

export default TurnoverCard;
