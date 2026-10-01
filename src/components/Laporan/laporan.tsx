// StockDashboardSection.tsx (Laporan)
import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router"; // sebelumnya "react-router-dom"
import { useTopBorrowed } from "@/hooks/Laporan/TopBorrow";
import { usePenerimaanStok, type StockHistoryItem } from "@/hooks/Laporan/penerimaan";
import useTransaction, { type TransactionData } from "@/hooks/Laporan/BaranngKeluar";
import useLowStock, { type LowStockItem } from "@/hooks/Laporan/lowStock";
import useExport from "@/hooks/Laporan/exportRecordPengeluaran";

import { AlertCircle, Download, Inbox, Loader2, Info } from "lucide-react";
import StockOnHandTab from "../StockonHandTab";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border input #BFCCE3, border toolbar #9DB2D3,
           muted #50688C, placeholder #7B8FAE
  semantik: merah #B3261E (bg #FDECEA, border #F2B8B5), amber #8A5A00 (bg #FFF4DB, border #F2C96B)
*/

// ============================================================
// BADGE & STYLE
// ============================================================

const CATEGORY_STYLE: Record<string, string> = {
  apd: "bg-[#DBE2EF] text-[#112D4E] ring-[#BFCCE3]",
  tools: "bg-white text-[#112D4E] ring-[#3F72AF]",
};

function BadgeKategori({ value }: { value?: string | null }) {
  if (!value) return <span className="text-[#7B8FAE]">—</span>;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${
        CATEGORY_STYLE[value.toLowerCase()] ?? "bg-[#F9F7F7] text-[#50688C] ring-[#DBE2EF]"
      }`}
    >
      {value}
    </span>
  );
}

// ============================================================
// STATUS (loading / error / kosong) dipakai semua tabel
// ============================================================

function statusView(opts: { loading: boolean; error: string; empty: boolean; emptyText: string }): ReactNode | null {
  if (opts.loading) {
    return (
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
    );
  }

  if (opts.error) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
        <AlertCircle className="h-8 w-8 text-[#B3261E]" />
        <p className="text-sm font-medium text-[#B3261E]">{opts.error}</p>
      </div>
    );
  }

  if (opts.empty) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#DBE2EF]">
          <Inbox className="h-6 w-6 text-[#3F72AF]" />
        </div>
        <p className="text-sm text-[#50688C]">{opts.emptyText}</p>
      </div>
    );
  }

  return null;
}

// header tabel desktop
const TH = "px-4 py-3 font-semibold first:pl-6 last:pr-6";
const TD = "px-4 py-3.5 first:pl-6 last:pr-6";
const THEAD = "bg-[#DBE2EF] text-left text-sm text-[#112D4E]";
const TR = "text-[#112D4E] transition-colors hover:bg-[#F9F7F7]";

// ============================================================
// DAFTAR TAB
// ============================================================

type TabKey = "record-pengeluaran" | "penerimaan-stok" | "barang-keluar" | "stok-kritis" | "stock-on-hand";

const DAFTAR_TAB: { key: TabKey; label: string }[] = [
  { key: "record-pengeluaran", label: "Record Pengeluaran" },
  { key: "penerimaan-stok", label: "Penerimaan Stok" },
  { key: "barang-keluar", label: "Barang Keluar" },
  { key: "stok-kritis", label: "Stok Kritis" },
  { key: "stock-on-hand", label: "Stock On Hand" },
];

// tab tanpa endpoint export (stock-on-hand) tidak ada di sini
const EXPORT_CONFIG: Partial<Record<TabKey, { endpoint: string; filename: string }>> = {
  "record-pengeluaran": { endpoint: "/items/export-ranking", filename: "record-pengeluaran.xlsx" },
  "penerimaan-stok": { endpoint: "/stock-history/export-in", filename: "penerimaan-stok.xlsx" },
  "barang-keluar": { endpoint: "/transactions/export", filename: "barang-keluar.xlsx" },
  "stok-kritis": { endpoint: "/items/export-low-stock", filename: "stok-kritis.xlsx" },
};

const TAB_DEFAULT: TabKey = "record-pengeluaran";

function apakahTabValid(value: string | null): value is TabKey {
  const semuaKey = DAFTAR_TAB.map((tab) => tab.key);
  return value !== null && semuaKey.includes(value as TabKey);
}

// Input tanggal solid putih. text-base di HP biar iOS tidak auto-zoom.
const dateClass =
  "h-11 w-full min-w-0 rounded-lg border border-[#9DB2D3] bg-white px-3 text-base text-[#112D4E] outline-none transition hover:border-[#3F72AF] focus:border-[#3F72AF] focus:ring-4 focus:ring-[#F9F7F7] sm:text-sm";

// ============================================================
// KOMPONEN UTAMA
// ============================================================

export default function StockDashboardSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabDariUrl = searchParams.get("tab");
  const tabAktif: TabKey = apakahTabValid(tabDariUrl) ? tabDariUrl : TAB_DEFAULT;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { loadingExport, handleExport } = useExport();

  const exportConfig = EXPORT_CONFIG[tabAktif];

  function exportTabAktif() {
    if (!exportConfig) return;
    handleExport(exportConfig.endpoint, exportConfig.filename, {
      start: startDate || undefined,
      end: endDate || undefined,
    });
  }

  function pindahTab(tabBaru: TabKey) {
    const paramsBaru = new URLSearchParams(searchParams);
    paramsBaru.set("tab", tabBaru);
    setSearchParams(paramsBaru, { replace: true });
  }

  const { dataTopBorrowed, loading: loadingTopDiberikan, error: errorTopDiberikan, getTopBorrowed } = useTopBorrowed();
  const {
    dataPenerimaanStok,
    loading: loadingPenerimaan,
    error: errorPenerimaan,
    getPenerimaanStok,
  } = usePenerimaanStok();
  const {
    data: dataBarangKeluar,
    loading: loadingBarangKeluar,
    error: errorBarangKeluar,
    handleGet: getBarangKeluar,
  } = useTransaction();
  const {
    data: dataStokKritis,
    loading: loadingStokKritis,
    error: errorStokKritis,
    handleGet: getStokKritis,
  } = useLowStock();

  useEffect(() => {
    if (tabAktif === "record-pengeluaran") {
      getTopBorrowed(startDate || undefined, endDate || undefined);
    }
    if (tabAktif === "penerimaan-stok") {
      getPenerimaanStok({ start: startDate || undefined, end: endDate || undefined });
    }
    if (tabAktif === "barang-keluar") {
      getBarangKeluar({ start: startDate || undefined, end: endDate || undefined });
    }
    if (tabAktif === "stok-kritis") {
      getStokKritis({});
    }
    // stock-on-hand ambil datanya sendiri di dalam komponen StockOnHandTab
  }, [tabAktif, startDate, endDate]);

  // Stok Kritis & Stock On Hand = snapshot kondisi sekarang, jadi tidak butuh filter tanggal
  const tampilkanFilterTanggal = tabAktif !== "stok-kritis" && tabAktif !== "stock-on-hand";

  return (
    <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      {/* ================= HEADER: TAB + FILTER + EXPORT ================= */}
      <div className="space-y-4 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4 sm:p-6">
        {/* Tab (bisa digeser di HP) */}
        <div
          role="tablist"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {DAFTAR_TAB.map((tab) => {
            const sedangAktif = tabAktif === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={sedangAktif}
                onClick={() => pindahTab(tab.key)}
                className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
                  sedangAktif
                    ? "bg-[#112D4E] text-white"
                    : "border border-[#9DB2D3] bg-white text-[#112D4E] hover:border-[#3F72AF]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter tanggal / info */}
          {tampilkanFilterTanggal ? (
            <div className="flex flex-wrap items-center gap-2">
              <div className="grid w-full grid-cols-1 items-center gap-2 min-[420px]:grid-cols-[1fr_auto_1fr] sm:w-auto">
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={dateClass}
                  aria-label="Tanggal mulai"
                />
                <span className="hidden text-sm text-[#50688C] min-[420px]:block">s/d</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={dateClass}
                  aria-label="Tanggal akhir"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="h-10 rounded-lg px-3 text-sm font-semibold text-[#B3261E] transition hover:bg-[#FDECEA]"
                >
                  Reset
                </button>
              )}
            </div>
          ) : (
            <p className="inline-flex items-center gap-2 text-sm text-[#50688C]">
              <Info className="h-4 w-4 shrink-0 text-[#3F72AF]" />
              Menampilkan kondisi stok saat ini
            </p>
          )}

          {/* Export (disembunyikan kalau tab belum punya endpoint export) */}
          {exportConfig && (
            <button
              type="button"
              onClick={exportTabAktif}
              disabled={loadingExport}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#112D4E] px-5 text-sm font-semibold text-white transition hover:bg-[#0B2240] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loadingExport ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {loadingExport ? "Mengunduh..." : "Export Excel"}
            </button>
          )}
        </div>
      </div>

      {/* ================= ISI TAB ================= */}
      {tabAktif === "record-pengeluaran" && (
        <TabelTopDiberikan data={dataTopBorrowed} loading={loadingTopDiberikan} error={errorTopDiberikan} />
      )}
      {tabAktif === "penerimaan-stok" && (
        <TabelPenerimaanStok data={dataPenerimaanStok} loading={loadingPenerimaan} error={errorPenerimaan} />
      )}
      {tabAktif === "barang-keluar" && (
        <TabelBarangKeluar data={dataBarangKeluar} loading={loadingBarangKeluar} error={errorBarangKeluar} />
      )}
      {tabAktif === "stok-kritis" && (
        <TabelStokKritis data={dataStokKritis} loading={loadingStokKritis} error={errorStokKritis} />
      )}
      {tabAktif === "stock-on-hand" && (
        <div className="p-4 sm:p-6">
          <StockOnHandTab />
        </div>
      )}
    </div>
  );
}

// ============================================================
// TABEL RECORD PENGELUARAN (TOP DIBERIKAN)
// ============================================================

interface TopBorrowedItem {
  id: number;
  rank: number;
  name: string;
  category: string;
  current_stock: number;
  total_pinjam: number;
}

// peringkat 1-3 pakai tingkatan warna palet
const RANK_STYLE = [
  "bg-[#112D4E] text-white",
  "bg-[#3F72AF] text-white",
  "bg-[#DBE2EF] text-[#112D4E] ring-1 ring-inset ring-[#BFCCE3]",
];

function RankBadge({ rank }: { rank: number }) {
  const top3 = rank >= 1 && rank <= 3;
  return (
    <span
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${
        top3 ? RANK_STYLE[rank - 1] : "bg-[#F9F7F7] text-[#50688C] ring-1 ring-inset ring-[#DBE2EF]"
      }`}
    >
      {rank}
    </span>
  );
}

interface TabelTopDiberikanProps {
  data: TopBorrowedItem[];
  loading: boolean;
  error: string;
}

function TabelTopDiberikan({ data, loading, error }: TabelTopDiberikanProps) {
  const status = statusView({
    loading,
    error,
    empty: data.length === 0,
    emptyText: "Belum ada data untuk periode ini",
  });
  if (status) return status;

  return (
    <>
      {/* Mobile */}
      <ul className="divide-y divide-[#DBE2EF] md:hidden">
        {data.map((item) => (
          <li key={item.id} className="flex items-center gap-3 p-4">
            <RankBadge rank={item.rank} />
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-semibold text-[#112D4E]">{item.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <BadgeKategori value={item.category} />
                <span className="text-xs text-[#50688C]">Stok: {item.current_stock} unit</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-extrabold text-[#112D4E]">{item.total_pinjam}x</p>
              <p className="text-xs text-[#50688C]">Diberikan</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Tablet & desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className={THEAD}>
              <th className={TH}>Peringkat</th>
              <th className={TH}>Nama Barang</th>
              <th className={TH}>Kategori</th>
              <th className={TH}>Stok Saat Ini</th>
              <th className={TH}>Total Diberikan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {data.map((item) => (
              <tr key={item.id} className={TR}>
                <td className={TD}>
                  <RankBadge rank={item.rank} />
                </td>
                <td className={`${TD} font-medium`}>{item.name}</td>
                <td className={TD}>
                  <BadgeKategori value={item.category} />
                </td>
                <td className={TD}>{item.current_stock} unit</td>
                <td className={`${TD} font-bold text-[#112D4E]`}>{item.total_pinjam}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ============================================================
// TABEL PENERIMAAN STOK
// ============================================================

interface TabelPenerimaanStokProps {
  data: StockHistoryItem[];
  loading: boolean;
  error: string;
}

function TabelPenerimaanStok({ data, loading, error }: TabelPenerimaanStokProps) {
  const dataMasuk = data.filter((item) => item.type === "in");

  const status = statusView({
    loading,
    error,
    empty: dataMasuk.length === 0,
    emptyText: "Belum ada data penerimaan stok untuk periode ini",
  });
  if (status) return status;

  return (
    <>
      {/* Mobile */}
      <ul className="divide-y divide-[#DBE2EF] md:hidden">
        {dataMasuk.map((item, index) => (
          <li key={index} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-[#112D4E]">{item.item_id?.name ?? "—"}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <BadgeKategori value={item.item_id?.category} />
                  <span className="text-xs text-[#50688C]">{item.date}</span>
                </div>
              </div>
              <span className="shrink-0 text-base font-extrabold text-[#112D4E]">
                +{item.qty} {item.item_id?.unit ?? ""}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] px-3 py-2 text-xs">
              <span className="flex min-w-0 items-center gap-2 text-[#50688C]">
                <span className="truncate">{item.supplier_id?.name ?? "—"}</span>
                <BadgeKategori value={item.supplier_id?.spesialis} />
              </span>
              <span className="text-[#50688C]">
                Stok akhir: <b className="text-[#112D4E]">{item.item_id?.current_stock ?? "—"}</b>
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Tablet & desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className={THEAD}>
              <th className={TH}>Tanggal</th>
              <th className={TH}>Barang</th>
              <th className={TH}>Category</th>
              <th className={TH}>Supplier</th>
              <th className={TH}>Spesialis</th>
              <th className={TH}>Qty</th>
              <th className={TH}>Stock Akhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {dataMasuk.map((item, index) => (
              <tr key={index} className={TR}>
                <td className={`${TD} whitespace-nowrap text-[#50688C]`}>{item.date}</td>
                <td className={`${TD} font-medium`}>{item.item_id?.name ?? "—"}</td>
                <td className={TD}>
                  <BadgeKategori value={item.item_id?.category} />
                </td>
                <td className={`${TD} text-[#50688C]`}>{item.supplier_id?.name ?? "—"}</td>
                <td className={TD}>
                  <BadgeKategori value={item.supplier_id?.spesialis} />
                </td>
                <td className={`${TD} whitespace-nowrap font-bold text-[#112D4E]`}>
                  +{item.qty} {item.item_id?.unit ?? ""}
                </td>
                <td className={`${TD} text-[#50688C]`}>{item.item_id?.current_stock ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ============================================================
// TABEL BARANG KELUAR
// ============================================================

interface TabelBarangKeluarProps {
  data: TransactionData[];
  loading: boolean;
  error: string;
}

function TabelBarangKeluar({ data, loading, error }: TabelBarangKeluarProps) {
  const status = statusView({
    loading,
    error,
    empty: data.length === 0,
    emptyText: "Belum ada data barang keluar untuk periode ini",
  });
  if (status) return status;

  return (
    <>
      {/* Mobile */}
      <ul className="divide-y divide-[#DBE2EF] md:hidden">
        {data.map((trx) => (
          <li key={trx.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-[#112D4E]">{trx.barang || "—"}</p>
                <p className="mt-0.5 text-xs text-[#50688C]">{trx.employe_name ?? "—"}</p>
              </div>
              <span className="shrink-0 text-base font-extrabold text-[#B3261E]">-{trx.total_qty}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[#50688C]">{trx.date}</span>
              <span className="text-[#50688C]">
                Stok akhir: <b className="text-[#112D4E]">{trx.total_stock}</b>
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Tablet & desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className={THEAD}>
              <th className={TH}>Tanggal</th>
              <th className={TH}>Barang</th>
              <th className={TH}>Karyawan</th>
              <th className={TH}>Qty</th>
              <th className={TH}>Stock Akhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {data.map((trx) => (
              <tr key={trx.id} className={TR}>
                <td className={`${TD} whitespace-nowrap text-[#50688C]`}>{trx.date}</td>
                <td className={`${TD} font-medium`}>{trx.barang || "—"}</td>
                <td className={`${TD} text-[#50688C]`}>{trx.employe_name ?? "—"}</td>
                <td className={`${TD} font-bold text-[#B3261E]`}>-{trx.total_qty}</td>
                <td className={`${TD} font-semibold text-[#112D4E]`}>{trx.total_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ============================================================
// TABEL STOK KRITIS
// ============================================================

interface TabelStokKritisProps {
  data: LowStockItem[];
  loading: boolean;
  error: string;
}

function StatusBadge({ habis }: { habis: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        habis
          ? "bg-[#FDECEA] text-[#B3261E] ring-[#F2B8B5]"
          : "bg-[#FFF4DB] text-[#8A5A00] ring-[#F2C96B]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${habis ? "bg-[#B3261E]" : "bg-[#F2A900]"}`} />
      {habis ? "Habis" : "Menipis"}
    </span>
  );
}

function TabelStokKritis({ data, loading, error }: TabelStokKritisProps) {
  const status = statusView({
    loading,
    error,
    empty: data.length === 0,
    emptyText: "Tidak ada barang dengan stok kritis",
  });
  if (status) return status;

  return (
    <>
      {/* Mobile */}
      <ul className="divide-y divide-[#DBE2EF] md:hidden">
        {data.map((item) => {
          const habis = Number(item.current_stock) <= 0;
          const min = Number(item.min_stock) || 0;
          const persen = min > 0 ? Math.min((Number(item.current_stock) / min) * 100, 100) : 0;
          return (
            <li key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-[#112D4E]">{item.name}</p>
                  <div className="mt-1">
                    <BadgeKategori value={item.category} />
                  </div>
                </div>
                <StatusBadge habis={habis} />
              </div>

              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#B3261E]">
                    {item.current_stock} {item.unit}
                  </span>
                  <span className="text-[#50688C]">
                    Min. {item.min_stock} {item.unit}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#DBE2EF]">
                  <div
                    className={`h-full rounded-full ${habis ? "bg-[#B3261E]" : "bg-[#F2A900]"}`}
                    style={{ width: `${persen}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Tablet & desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className={THEAD}>
              <th className={TH}>Barang</th>
              <th className={TH}>Kategori</th>
              <th className={TH}>Stok Saat Ini</th>
              <th className={TH}>Min. Stok</th>
              <th className={TH}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {data.map((item) => {
              const habis = Number(item.current_stock) <= 0;
              return (
                <tr key={item.id} className={TR}>
                  <td className={`${TD} font-medium`}>{item.name}</td>
                  <td className={TD}>
                    <BadgeKategori value={item.category} />
                  </td>
                  <td className={`${TD} font-bold text-[#B3261E]`}>
                    {item.current_stock} {item.unit}
                  </td>
                  <td className={`${TD} text-[#50688C]`}>
                    {item.min_stock} {item.unit}
                  </td>
                  <td className={TD}>
                    <StatusBadge habis={habis} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}