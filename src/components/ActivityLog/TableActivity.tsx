// TableAvtivity.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronLeft,
  ChevronRight,
  Cog,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import useActivity from "@/hooks/Activity/get";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border #BFCCE3, border toolbar #9DB2D3,
           muted #50688C, placeholder #7B8FAE
  semantik: merah #B3261E (bg #FDECEA, border #F2B8B5) khusus barang keluar & error
*/

interface TypeConfig {
  label: string;
  badge: string;
  iconBg: string;
  iconColor: string;
  icon: LucideIcon;
}

const TYPE_CONFIG: Record<string, TypeConfig> = {
  stockin: {
    label: "Barang Masuk",
    badge: "bg-[#DBE2EF] text-[#112D4E] ring-[#BFCCE3]",
    iconBg: "bg-[#DBE2EF]",
    iconColor: "text-[#112D4E]",
    icon: ArrowDownToLine,
  },
  stockout: {
    label: "Barang Keluar",
    badge: "bg-[#FDECEA] text-[#B3261E] ring-[#F2B8B5]",
    iconBg: "bg-[#FDECEA]",
    iconColor: "text-[#B3261E]",
    icon: ArrowUpFromLine,
  },
  system: {
    label: "Sistem",
    badge: "bg-[#F9F7F7] text-[#50688C] ring-[#DBE2EF]",
    iconBg: "bg-[#F9F7F7]",
    iconColor: "text-[#50688C]",
    icon: Cog,
  },
};

const getConfig = (type?: string | null): TypeConfig =>
  TYPE_CONFIG[type ?? ""] ?? { ...TYPE_CONFIG.system, label: type ?? "-" };

const FILTERS = [
  { value: "all", label: "Semua Aktivitas" },
  { value: "stockin", label: "Barang Masuk" },
  { value: "stockout", label: "Barang Keluar" },
  { value: "system", label: "Sistem" },
];

// Input solid putih. text-base di HP biar iOS tidak auto-zoom.
const dateClass =
  "h-11 w-full min-w-0 rounded-lg border border-[#9DB2D3] bg-white px-3 text-base text-[#112D4E] outline-none transition hover:border-[#3F72AF] focus:border-[#3F72AF] focus:ring-4 focus:ring-[#F9F7F7] sm:text-sm";

const searchClass =
  "h-11 w-full rounded-lg border border-[#9DB2D3] bg-white pl-10 pr-9 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#F9F7F7] sm:text-sm";

const pageBtnClass =
  "h-10 rounded-lg border border-[#BFCCE3] bg-white px-3 text-[#112D4E] hover:bg-[#DBE2EF] disabled:opacity-50";

const TableAvtivity = () => {
  // keyword = isi input, search = keyword yang sudah dikonfirmasi & dikirim ke API
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const perPage = 10;
  const { data, error, handleGet, loading, meta } = useActivity();

  useEffect(() => {
    handleGet({
      search,
      type: type === "all" ? "" : type,
      page,
      per_page: perPage,
      start: startDate,
      end: endDate,
    });
  }, [search, type, page, startDate, endDate, handleGet]);

  const lastPage = meta?.last_page ?? 1;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearch(keyword);
  };

  const clearSearch = () => {
    setKeyword("");
    setSearch("");
    setPage(1);
  };

  const resetDates = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      {/* ================= TOOLBAR ================= */}
      <div className="space-y-3 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <form onSubmit={handleSubmit} className="flex w-full gap-2 lg:max-w-lg">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF]"
                size={17}
              />
              <Input
                className={searchClass}
                placeholder="Cari detail aktivitas"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Hapus pencarian"
                  className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#50688C] transition hover:bg-[#DBE2EF] hover:text-[#112D4E]"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <Button
              disabled={loading}
              className="h-11 rounded-lg bg-[#112D4E] px-5 text-white transition hover:bg-[#0B2240] disabled:opacity-60"
            >
              Cari
            </Button>
          </form>

          {/* Rentang tanggal */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="grid w-full grid-cols-1 items-center gap-2 min-[420px]:grid-cols-[1fr_auto_1fr] sm:w-auto">
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className={dateClass}
                aria-label="Tanggal mulai"
              />
              <span className="hidden text-sm text-[#50688C] min-[420px]:block">s/d</span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className={dateClass}
                aria-label="Tanggal akhir"
              />
            </div>
            {(startDate || endDate) && (
              <button
                type="button"
                onClick={resetDates}
                className="h-10 rounded-lg px-3 text-sm font-semibold text-[#B3261E] transition hover:bg-[#FDECEA]"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Filter jenis (chip, bisa digeser di HP) */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setType(f.value);
                setPage(1);
              }}
              className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
                type === f.value
                  ? "bg-[#112D4E] text-white"
                  : "border border-[#9DB2D3] bg-white text-[#112D4E] hover:border-[#3F72AF]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="divide-y divide-[#DBE2EF]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-3 p-4 sm:px-6">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-[#DBE2EF]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-[#DBE2EF]" />
                <div className="h-3 w-2/3 rounded bg-[#EBEFF6]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ERROR ================= */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
          <AlertCircle size={32} className="text-[#B3261E]" />
          <p className="text-sm font-medium text-[#B3261E]">{error}</p>
        </div>
      )}

      {/* ================= KOSONG ================= */}
      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#DBE2EF]">
            <Search size={28} className="text-[#3F72AF]" />
          </div>
          <p className="font-semibold text-[#112D4E]">Aktivitas tidak ditemukan</p>
          <p className="text-sm text-[#50688C]">Coba gunakan kata kunci atau filter lain</p>
        </div>
      )}

      {/* ================= DATA ================= */}
      {!loading && !error && data.length > 0 && (
        <>
          {/* Mobile: kartu */}
          <ul className="divide-y divide-[#DBE2EF] md:hidden">
            {data.map((activity, index) => {
              const cfg = getConfig(activity.type);
              const Icon = cfg.icon;
              return (
                <li key={activity.id} className="flex gap-3 p-4">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ring-1 ring-inset ring-[#DBE2EF] ${cfg.iconBg}`}
                  >
                    <Icon size={18} className={cfg.iconColor} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cfg.badge}`}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs font-medium text-[#50688C]">
                        #{(page - 1) * perPage + index + 1}
                      </span>
                    </div>
                    <p className="mt-1.5 break-words text-sm text-[#112D4E]">{activity.detail ?? "-"}</p>
                    <p className="mt-1 text-xs font-medium text-[#50688C]">{activity.date}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Desktop/tablet: tabel */}
          <div className="hidden w-full overflow-x-auto md:block">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">No</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Tanggal - Waktu</TableHead>
                  {/* kalau API punya field khusus nama aktivitas, ganti di kolom ini */}
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Aktivitas</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Jenis</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Detail</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((activity, index) => {
                  const cfg = getConfig(activity.type);
                  return (
                    <TableRow key={activity.id} className="border-[#DBE2EF] transition-colors hover:bg-[#F9F7F7]">
                      <TableCell className="px-4 py-4 text-[#50688C] lg:px-6">
                        {(page - 1) * perPage + index + 1}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4 font-medium text-[#112D4E] lg:px-6">
                        {activity.date}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-[#112D4E] lg:px-6">{activity.type ?? "-"}</TableCell>
                      <TableCell className="px-4 py-4 lg:px-6">
                        {activity.type ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cfg.badge}`}
                          >
                            {cfg.label}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs whitespace-normal break-words px-4 py-4 text-[#50688C] lg:px-6">
                        {activity.detail ?? "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="flex items-center justify-between gap-3 border-t border-[#DBE2EF] bg-[#F9F7F7] p-4">
            <span className="text-sm text-[#50688C]">
              Hal. <b className="text-[#112D4E]">{page}</b> dari <b className="text-[#112D4E]">{lastPage}</b>
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className={pageBtnClass}
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>
              <Button
                variant="outline"
                className={pageBtnClass}
                disabled={page >= lastPage || loading}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Halaman berikutnya"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableAvtivity;