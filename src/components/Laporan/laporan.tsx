// StockDashboardSection.tsx (Laporan)
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router"; // sebelumnya "react-router-dom"
import { useTopBorrowed } from "@/hooks/Laporan/TopBorrow";
import { usePenerimaanStok, type StockHistoryItem } from "@/hooks/Laporan/penerimaan";
import useTransaction, { type TransactionData, type TransactionLineItem } from "@/hooks/Laporan/BaranngKeluar";
import useLowStock, { type LowStockItem } from "@/hooks/Laporan/lowStock";
import useExport from "@/hooks/Laporan/exportRecordPengeluaran";

import { AlertCircle, Download, Inbox, Loader2, Info, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import EditQuantityDialog, { type EditQuantityState } from "./EditQuantityDialog";
import StockOnHandTab from "../StockonHandTab";
import { CATEGORY_BADGE_FALLBACK, CATEGORY_BADGE_STYLE, categoryLabel } from "@/lib/itemCategory";
import { formatServerDate } from "@/lib/tanggal";

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

function BadgeKategori({ value }: { value?: string | null }) {
  if (!value) return <span className="text-[#7B8FAE]">—</span>;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${
        CATEGORY_BADGE_STYLE[value.toLowerCase()] ?? CATEGORY_BADGE_FALLBACK
      }`}
    >
      {categoryLabel(value)}
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

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#BFCCE3] bg-white text-[#112D4E] transition hover:border-[#3F72AF] hover:bg-[#DBE2EF]"
    >
      <Pencil className="h-4 w-4" />
    </button>
  );
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
  { key: "record-pengeluaran", label: "Issue Records" },
  { key: "penerimaan-stok", label: "Stock Receipts" },
  { key: "barang-keluar", label: "Stock Out" },
  { key: "stok-kritis", label: "Low Stock" },
  { key: "stock-on-hand", label: "Stock on Hand" },
];

// tab tanpa endpoint export (stock-on-hand) tidak ada di sini
const EXPORT_CONFIG: Partial<Record<TabKey, { endpoint: string; filename: string }>> = {
  "record-pengeluaran": { endpoint: "/items/export-ranking", filename: "record-pengeluaran.xlsx" },
  "penerimaan-stok": { endpoint: "/stock-history/export-in", filename: "penerimaan-stok.xlsx" },
  "barang-keluar": { endpoint: "/transactions/export", filename: "barang-keluar.xlsx" },
  "stok-kritis": { endpoint: "/items/export-low-stock", filename: "stok-kritis.xlsx" },
  "stock-on-hand": { endpoint: "/items/export-stock-on-hand", filename: "stock-on-hand.xlsx" },
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
  const { isAdmin } = useAuth();
  const [editState, setEditState] = useState<EditQuantityState | null>(null);

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

  const refreshActiveTab = useCallback(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabAktif, startDate, endDate]);

  useEffect(() => {
    refreshActiveTab();
  }, [refreshActiveTab]);

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
                  aria-label="Start date"
                />
                <span className="hidden text-sm text-[#50688C] min-[420px]:block">to</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={dateClass}
                  aria-label="End date"
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
              Showing current stock levels
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
              {loadingExport ? "Downloading..." : "Export Excel"}
            </button>
          )}
        </div>
      </div>

      {/* ================= ISI TAB ================= */}
      {tabAktif === "record-pengeluaran" && (
        <TabelTopDiberikan data={dataTopBorrowed} loading={loadingTopDiberikan} error={errorTopDiberikan} />
      )}
      {tabAktif === "penerimaan-stok" && (
        <TabelPenerimaanStok
          data={dataPenerimaanStok}
          loading={loadingPenerimaan}
          error={errorPenerimaan}
          canEdit={isAdmin}
          onEdit={setEditState}
        />
      )}
      {tabAktif === "barang-keluar" && (
        <TabelBarangKeluar
          data={dataBarangKeluar}
          loading={loadingBarangKeluar}
          error={errorBarangKeluar}
          canEdit={isAdmin}
          onEdit={setEditState}
        />
      )}
      {tabAktif === "stok-kritis" && (
        <TabelStokKritis data={dataStokKritis} loading={loadingStokKritis} error={errorStokKritis} />
      )}
      {tabAktif === "stock-on-hand" && (
        <div className="p-4 sm:p-6">
          <StockOnHandTab />
        </div>
      )}

      <EditQuantityDialog state={editState} onClose={() => setEditState(null)} onSaved={refreshActiveTab} />
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
    emptyText: "No data for this period",
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
                <span className="text-xs text-[#50688C]">Stock: {item.current_stock} units</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-extrabold text-[#112D4E]">{item.total_pinjam}x</p>
              <p className="text-xs text-[#50688C]">Issued</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Tablet & desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className={THEAD}>
              <th className={TH}>Rank</th>
              <th className={TH}>Item Name</th>
              <th className={TH}>Category</th>
              <th className={TH}>Current Stock</th>
              <th className={TH}>Total Issued</th>
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
                <td className={TD}>{item.current_stock} units</td>
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
  canEdit: boolean;
  onEdit: (state: EditQuantityState) => void;
}

function TabelPenerimaanStok({ data, loading, error, canEdit, onEdit }: TabelPenerimaanStokProps) {
  const dataMasuk = data.filter((item) => item.type === "in");

  const status = statusView({
    loading,
    error,
    empty: dataMasuk.length === 0,
    emptyText: "No stock receipts for this period",
  });
  if (status) return status;

  const editFor = (item: StockHistoryItem): EditQuantityState | null =>
    canEdit && item.type === "in" && item.id !== undefined
      ? {
          target: { kind: "stock-history", id: item.id },
          itemName: item.item_id?.name ?? "-",
          currentQty: item.qty,
          unit: item.item_id?.unit,
          type: "in",
        }
      : null;

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
                  <span className="text-xs text-[#50688C]">{formatServerDate(item.date)}</span>
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
                Ending stock: <b className="text-[#112D4E]">{item.item_id?.current_stock ?? "—"}</b>
              </span>
            </div>
            {editFor(item) && (
              <div className="mt-2 flex justify-end">
                <EditButton
                  label={`Edit quantity of ${item.item_id?.name ?? "item"}`}
                  onClick={() => onEdit(editFor(item)!)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Tablet & desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className={THEAD}>
              <th className={TH}>Date</th>
              <th className={TH}>Item</th>
              <th className={TH}>Category</th>
              <th className={TH}>Supplier</th>
              <th className={TH}>Specialty</th>
              <th className={TH}>Qty</th>
              <th className={TH}>Ending Stock</th>
              {canEdit && <th className={TH}>Edit</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {dataMasuk.map((item, index) => (
              <tr key={index} className={TR}>
                <td className={`${TD} whitespace-nowrap text-[#50688C]`}>{formatServerDate(item.date)}</td>
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
                {canEdit && (
                  <td className={TD}>
                    {editFor(item) && (
                      <EditButton
                        label={`Edit quantity of ${item.item_id?.name ?? "item"}`}
                        onClick={() => onEdit(editFor(item)!)}
                      />
                    )}
                  </td>
                )}
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
  canEdit: boolean;
  onEdit: (state: EditQuantityState) => void;
}

// One edit button per item inside a transaction (a transaction can hold several items).
function TransactionEditCell({
  items,
  onEdit,
}: {
  items: TransactionLineItem[];
  onEdit: (state: EditQuantityState) => void;
}) {
  if (items.length === 0) return <span className="text-[#7B8FAE]">-</span>;
  const multi = items.length > 1;
  return (
    <ul className="space-y-1.5">
      {items.map((it) => (
        <li key={it.id} className="flex items-center gap-2">
          <EditButton
            label={`Edit quantity of ${it.item_name}`}
            onClick={() =>
              onEdit({
                target: { kind: "transaction-item", id: it.id },
                itemName: it.item_name,
                currentQty: it.qty,
                unit: it.unit ?? undefined,
                type: "out",
              })
            }
          />
          {multi && (
            <span className="min-w-0 break-words text-xs text-[#50688C]">
              {it.item_name} <b className="text-[#112D4E]">(-{it.qty})</b>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function TabelBarangKeluar({ data, loading, error, canEdit, onEdit }: TabelBarangKeluarProps) {
  const status = statusView({
    loading,
    error,
    empty: data.length === 0,
    emptyText: "No stock out records for this period",
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
              <span className="text-[#50688C]">{formatServerDate(trx.date)}</span>
              <span className="text-[#50688C]">
                Ending stock: <b className="text-[#112D4E]">{trx.total_stock}</b>
              </span>
            </div>
            {canEdit && (
              <div className="mt-3 border-t border-[#DBE2EF] pt-3">
                <p className="mb-1.5 text-xs font-semibold text-[#112D4E]">Edit</p>
                <TransactionEditCell items={trx.items ?? []} onEdit={onEdit} />
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Tablet & desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className={THEAD}>
              <th className={TH}>Date</th>
              <th className={TH}>Item</th>
              <th className={TH}>Employee</th>
              <th className={TH}>Qty</th>
              <th className={TH}>Ending Stock</th>
              {canEdit && <th className={TH}>Edit</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {data.map((trx) => (
              <tr key={trx.id} className={TR}>
                <td className={`${TD} whitespace-nowrap text-[#50688C]`}>{formatServerDate(trx.date)}</td>
                <td className={`${TD} font-medium`}>{trx.barang || "—"}</td>
                <td className={`${TD} text-[#50688C]`}>{trx.employe_name ?? "—"}</td>
                <td className={`${TD} font-bold text-[#B3261E]`}>-{trx.total_qty}</td>
                <td className={`${TD} font-semibold text-[#112D4E]`}>{trx.total_stock}</td>
                {canEdit && (
                  <td className={TD}>
                    <TransactionEditCell items={trx.items ?? []} onEdit={onEdit} />
                  </td>
                )}
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
      {habis ? "Out of stock" : "Low"}
    </span>
  );
}

function TabelStokKritis({ data, loading, error }: TabelStokKritisProps) {
  const status = statusView({
    loading,
    error,
    empty: data.length === 0,
    emptyText: "No items with low stock",
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
              <th className={TH}>Item</th>
              <th className={TH}>Category</th>
              <th className={TH}>Current Stock</th>
              <th className={TH}>Min. Stock</th>
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