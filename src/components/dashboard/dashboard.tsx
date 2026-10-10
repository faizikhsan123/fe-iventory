// Dashboard.tsx
import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  CheckCircle2,
  CalendarClock,
  Stethoscope,
  FileBarChart,
  Inbox,
  Package,
  RefreshCw,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import useDashboard from "@/hooks/dashboard/get";
import { useAuth } from "@/hooks/auth/useAuth";
import { formatTanggalIndo } from "@/lib/tanggal";
import { expiringLabel } from "@/lib/contract";
import TurnoverCard from "./TurnoverCard";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border #BFCCE3, muted #50688C, redup di navy #9DB2D3
  semantik: merah #B3261E (bg #FDECEA, border #F2B8B5) khusus barang keluar, stok habis, error
*/

// pola garis halus di banner navy (warna solid, bukan transparan)
const gridStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, #1B3F68 1px, transparent 1px), linear-gradient(to bottom, #1B3F68 1px, transparent 1px)",
  backgroundSize: "36px 36px",
};

// ============================================================
// HELPER
// ============================================================

// angka menghitung naik saat pertama tampil (dimatikan kalau user pilih reduced motion)
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

const getSapaan = () => {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
};

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
  const { data, loading, error, handleGet } = useDashboard();
  const { user } = useAuth();

  useEffect(() => {
    handleGet();
  }, [handleGet]);

  const namaDepan = user?.name?.split(" ")[0];

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-4 py-14 text-center sm:rounded-xl">
        <AlertCircle className="h-9 w-9 text-[#B3261E]" />
        <p className="max-w-md break-words text-sm font-medium text-[#B3261E]">{error}</p>
        <button
          onClick={() => handleGet()}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#F2B8B5] bg-white px-5 text-sm font-semibold text-[#B3261E] transition hover:bg-[#FDECEA] active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          Coba lagi
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { summary, aktivitas_stok, transaksi_terbaru, kontrak_berakhir = [], mcu_berikutnya = [] } = data;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Banner sambutan */}
      <section
        className="relative overflow-hidden rounded-lg bg-[#112D4E] sm:rounded-xl"
        style={gridStyle}
      >
        <div className="relative flex flex-col gap-4 p-5 pb-6 sm:flex-row sm:items-center sm:justify-between sm:p-7 sm:pb-8">
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold leading-tight text-white sm:text-2xl lg:text-3xl">
              {getSapaan()}
              {namaDepan ? `, ${namaDepan}` : ""}
            </h2>
            <p className="mt-1.5 text-sm text-[#DBE2EF] sm:text-base">
              Pantau stok dan pergerakan barang APD &amp; Tools hari ini.
            </p>
          </div>

          <Link
            to="/laporan"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#F9F7F7] px-5 text-sm font-bold text-[#112D4E] outline-none transition hover:bg-[#DBE2EF] focus-visible:ring-4 focus-visible:ring-[#9DB2D3] active:scale-95 sm:w-auto"
          >
            <FileBarChart className="h-4 w-4" />
            Lihat laporan
          </Link>
        </div>

        {/* Pita palet */}
        <div
          className="absolute inset-x-0 bottom-0 flex h-1.5"
          aria-hidden="true"
        >
          <span className="h-full flex-[4] bg-[#F9F7F7]" />
          <span className="h-full flex-[3] bg-[#DBE2EF]" />
          <span className="h-full flex-[2] bg-[#3F72AF]" />
        </div>
      </section>

      {/* Card summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        <CardSummary
          icon={Package}
          tone="navy"
          label="Total Barang"
          value={summary.total_barang}
        />
        <CardSummary
          icon={BarChart3}
          tone="azure"
          label="Stok Saat Ini"
          value={summary.current_stock}
        />
        <CardSummary
          icon={ArrowDownCircle}
          tone="sky"
          label="Barang Keluar"
          value={summary.barang_keluar}
        />
        <CardSummary
          icon={CheckCircle2}
          tone="ice"
          label="Barang Masuk"
          value={summary.barang_masuk}
        />
        <CardSummary
          icon={XCircle}
          tone="danger"
          label="Stok Habis"
          value={summary.out_of_stock}
          alert={summary.out_of_stock > 0}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <KontrakBerakhirCard data={kontrak_berakhir} />
      <McuBerikutnyaCard data={mcu_berikutnya} />

      <TurnoverCard />

      {/* Tabel: tumpuk ke bawah, baru 2 kolom di layar sangat lebar */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 2xl:grid-cols-2">
        <TabelAktivitasStok data={aktivitas_stok} />
        <TabelTransaksiTerbaru data={transaksi_terbaru} />
      </div>
    </div>
  );
};

export default Dashboard;

// ============================================================
// SKELETON LOADING
// ============================================================

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-5 sm:space-y-6">
      <div className="h-36 rounded-lg bg-[#DBE2EF] sm:h-40 sm:rounded-xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-28 rounded-lg bg-[#DBE2EF] sm:rounded-xl ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
          />
        ))}
      </div>
      <div className="h-72 rounded-lg bg-[#DBE2EF] sm:rounded-xl" />
    </div>
  );
}

// ============================================================
// CARD SUMMARY
// ============================================================

type Tone = "navy" | "azure" | "sky" | "ice" | "danger";

// warna tile icon + garis atas kartu, semuanya dari palet (danger khusus stok habis)
const toneClass: Record<Tone, { tile: string; top: string }> = {
  navy: { tile: "bg-[#112D4E] text-white", top: "border-t-[#112D4E]" },
  azure: { tile: "bg-[#3F72AF] text-white", top: "border-t-[#3F72AF]" },
  sky: { tile: "bg-[#DBE2EF] text-[#112D4E]", top: "border-t-[#9DB2D3]" },
  ice: { tile: "bg-[#F9F7F7] text-[#112D4E] border border-[#BFCCE3]", top: "border-t-[#DBE2EF]" },
  danger: { tile: "bg-[#B3261E] text-white", top: "border-t-[#B3261E]" },
};

interface CardSummaryProps {
  icon: LucideIcon;
  tone: Tone;
  label: string;
  value: number;
  alert?: boolean;
  className?: string;
}

function CardSummary({ icon: Icon, tone, label, value, alert, className = "" }: CardSummaryProps) {
  const count = useCountUp(value);
  const t = toneClass[tone];
  return (
    <div
      className={`min-w-0 rounded-lg border border-t-[3px] bg-white p-4 shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl sm:p-5 ${
        alert ? "border-[#F2B8B5]" : "border-[#DBE2EF]"
      } ${t.top} ${className}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className={`grid h-10 w-10 place-items-center rounded-lg sm:h-11 sm:w-11 ${t.tile}`}>
          <Icon className="h-5 w-5" />
        </div>
        {alert && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEA] px-2.5 py-0.5 text-xs font-bold text-[#B3261E] ring-1 ring-inset ring-[#F2B8B5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B3261E]" />
            Perlu restock
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold leading-none tabular-nums text-[#112D4E] sm:text-3xl">
        {count.toLocaleString("id-ID")}
      </p>
      <p className="mt-1.5 truncate text-xs font-medium text-[#50688C] sm:text-sm">{label}</p>
    </div>
  );
}

// ============================================================
// KERANGKA PANEL (dipakai kedua tabel)
// ============================================================

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex items-center gap-2.5 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6 sm:py-4">
        <span
          className="h-4 w-1 rounded-full bg-[#3F72AF]"
          aria-hidden="true"
        />
        <h2 className="font-bold text-[#112D4E]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Kosong({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#DBE2EF]">
        <Inbox className="h-6 w-6 text-[#3F72AF]" />
      </div>
      <p className="text-sm text-[#50688C]">{text}</p>
    </div>
  );
}

// ============================================================
// TABEL AKTIVITAS STOK TERBARU
// ============================================================

interface AktivitasStokItem {
  date: string;
  part_number: string;
  name: string;
  type: string;
  qty: number;

  user_name: string;
}

function TabelAktivitasStok({ data }: { data: AktivitasStokItem[] }) {
  return (
    <Panel title="Aktivitas Stok Terbaru">
      {data.length === 0 ? (
        <Kosong text="Belum ada aktivitas" />
      ) : (
        <>
          {/* Mobile: kartu */}
          <ul className="divide-y divide-[#DBE2EF] md:hidden">
            {data.map((item, index) => {
              const isIn = item.type === "in";
              const Icon = isIn ? ArrowDownToLine : ArrowUpFromLine;
              return (
                <li
                  key={index}
                  className="flex gap-3 p-4"
                >
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                      isIn ? "bg-[#DBE2EF] text-[#112D4E]" : "bg-[#FDECEA] text-[#B3261E]"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="break-words text-sm font-semibold text-[#112D4E]">{item.name}</p>
                      <span className={`shrink-0 text-sm font-extrabold ${isIn ? "text-[#112D4E]" : "text-[#B3261E]"}`}>
                        {isIn ? "+" : "-"}
                        {item.qty}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#3F72AF]">{item.part_number}</p>
                    <p className="mt-1 text-xs text-[#50688C]">
                      {formatTanggalIndo(item.date)}, {item.user_name}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Tablet & desktop: tabel */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-[#DBE2EF] text-sm text-[#112D4E]">
                  <th className="px-6 py-3 font-semibold">Tanggal</th>
                  <th className="px-3 py-3 font-semibold">Part No.</th>
                  <th className="px-3 py-3 font-semibold">Nama Barang</th>
                  <th className="px-3 py-3 font-semibold">Aktivitas</th>
                  <th className="px-3 py-3 font-semibold">Qty</th>
                  {/* <th className="px-6 py-3 font-semibold">User</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE2EF]">
                {data.map((item, index) => {
                  const isIn = item.type === "in";
                  return (
                    <tr
                      key={index}
                      className="text-[#112D4E] transition-colors hover:bg-[#F9F7F7]"
                    >
                      <td className="whitespace-nowrap px-6 py-3.5 text-[#50688C]">{formatTanggalIndo(item.date)}</td>
                      <td className="whitespace-nowrap px-3 py-3.5 font-medium text-[#3F72AF]">{item.part_number}</td>
                      <td className="px-3 py-3.5 font-medium">{item.name}</td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                            isIn
                              ? "bg-[#DBE2EF] text-[#112D4E] ring-[#BFCCE3]"
                              : "bg-[#FDECEA] text-[#B3261E] ring-[#F2B8B5]"
                          }`}
                        >
                          {isIn ? "Stok Masuk" : "Stok Keluar"}
                        </span>
                      </td>
                      <td className={`px-3 py-3.5 font-bold ${isIn ? "text-[#112D4E]" : "text-[#B3261E]"}`}>
                        {isIn ? "+" : "-"}
                        <span>
                          {item.qty}
                        </span>
                      </td>
                      {/* <td className="whitespace-nowrap px-6 py-3.5 text-[#50688C]">{item.user_name}</td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Panel>
  );
}

// ============================================================
// TABEL TRANSAKSI TERBARU
// ============================================================

interface TransaksiTerbaruItem {
  transaction_number: string;
  employe_name: string;
  barang: string;
  category: string;
  date: string;
}

function TabelTransaksiTerbaru({ data }: { data: TransaksiTerbaruItem[] }) {
  return (
    <Panel title="Transaksi Terbaru">
      {data.length === 0 ? (
        <Kosong text="Belum ada transaksi" />
      ) : (
        <>
          {/* Mobile: kartu */}
          <ul className="divide-y divide-[#DBE2EF] md:hidden">
            {data.map((trx, index) => (
              <li
                key={index}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 break-all text-sm font-bold text-[#112D4E]">{trx.transaction_number}</p>
                  <span className="shrink-0 text-xs text-[#50688C]">{formatTanggalIndo(trx.date)}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#112D4E]">{trx.employe_name}</p>
                <p className="break-words text-xs text-[#50688C]">{trx.barang || "—"}</p>
              </li>
            ))}
          </ul>

          {/* Tablet & desktop: tabel */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="bg-[#DBE2EF] text-sm text-[#112D4E]">
                  {/* <th className="px-6 py-3 font-semibold">No. Transaksi</th> */}
                  <th className="px-3 py-3 font-semibold">Karyawan</th>
                  <th className="px-3 py-3 font-semibold">Barang</th>
                  <th className="px-3 py-3 font-semibold">Kategori</th>
                  <th className="px-6 py-3 font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE2EF]">
                {data.map((trx, index) => (
                  <tr
                    key={index}
                    className="text-[#112D4E] transition-colors hover:bg-[#F9F7F7]"
                  >
                    {/* <td className="whitespace-nowrap px-6 py-3.5 font-semibold text-[#112D4E]">
                      {trx.transaction_number}
                    </td> */}
                    <td className="px-3 py-3.5 font-medium">{trx.employe_name}</td>
                    <td className="px-3 py-3.5 text-[#50688C]">{trx.barang || "—"}</td>
                    <td className="px-3 py-3.5 text-[#50688C]">{trx.category || "—"}</td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-[#50688C]">{formatTanggalIndo(trx.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}






      
    </Panel>




  );
}

// ============================================================
// KONTRAK SEGERA BERAKHIR (<= 30 hari, termasuk yang sudah lewat)
// ============================================================

interface KontrakBerakhirItem {
  id: number;
  name: string;
  id_number: string;
  division: string;
  position: string;
  group_name: string | null;
  contract_end: string;
  days_left: number;
}

function KontrakBerakhirCard({ data }: { data: KontrakBerakhirItem[] }) {
  if (data.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-[#F2B8B5] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex items-center justify-between gap-3 border-b border-[#F2B8B5] bg-[#FDECEA] px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2.5">
          <CalendarClock className="h-5 w-5 text-[#B3261E]" />
          <h3 className="font-bold text-[#B3261E]">
            Kontrak Segera Berakhir <span className="text-xs font-semibold">(30 hari)</span>
          </h3>
          <span className="rounded-full bg-[#B3261E] px-2 py-0.5 text-xs font-bold text-white">{data.length}</span>
        </div>
        <Link to="/contracts" className="text-sm font-semibold text-[#B3261E] underline-offset-2 hover:underline">
          Lihat semua
        </Link>
      </div>

      <ul className="divide-y divide-[#F2B8B5]/60">
        {data.map((k) => (
          <li key={k.id}>
            <Link
              to={`/contracts/${k.id}`}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-[#FDECEA] sm:px-6"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-bold text-[#B3261E]">{k.name}</p>
                <p className="text-xs text-[#50688C]">
                  {k.id_number} · {k.position} · {k.division}
                  {k.group_name ? ` · ${k.group_name}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#B3261E]">{formatTanggalIndo(k.contract_end)}</p>
                <p className="text-xs font-bold text-[#B3261E]">{expiringLabel(k.contract_end)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// MCU SEGERA JATUH TEMPO (<= 30 hari, termasuk yang sudah lewat)
// ============================================================

interface McuBerikutnyaItem {
  id: number;
  employes_id: number;
  name: string;
  id_number: string;
  division: string;
  position: string;
  group_name: string | null;
  place_name: string;
  next_mcu_date: string;
  days_left: number;
}

function McuBerikutnyaCard({ data }: { data: McuBerikutnyaItem[] }) {
  if (data.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-[#F2B8B5] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex items-center justify-between gap-3 border-b border-[#F2B8B5] bg-[#FDECEA] px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2.5">
          <Stethoscope className="h-5 w-5 text-[#B3261E]" />
          <h3 className="font-bold text-[#B3261E]">
            MCU Segera Jatuh Tempo <span className="text-xs font-semibold">(30 hari)</span>
          </h3>
          <span className="rounded-full bg-[#B3261E] px-2 py-0.5 text-xs font-bold text-white">{data.length}</span>
        </div>
        <Link to="/mcu" className="text-sm font-semibold text-[#B3261E] underline-offset-2 hover:underline">
          Lihat semua
        </Link>
      </div>

      <ul className="divide-y divide-[#F2B8B5]/60">
        {data.map((m) => (
          <li key={m.id}>
            <Link
              to={`/employes/${m.employes_id}`}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-[#FDECEA] sm:px-6"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-bold text-[#B3261E]">{m.name}</p>
                <p className="text-xs text-[#50688C]">
                  {m.id_number} · {m.position} · {m.division}
                  {m.group_name ? ` · ${m.group_name}` : ""}
                </p>
                <p className="text-xs text-[#50688C]">MCU terakhir di {m.place_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#B3261E]">{formatTanggalIndo(m.next_mcu_date)}</p>
                <p className="text-xs font-bold text-[#B3261E]">{expiringLabel(m.next_mcu_date)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
