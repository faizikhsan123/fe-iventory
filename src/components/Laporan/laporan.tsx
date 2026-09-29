// StockDashboardSection.tsx (Laporan)
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTopBorrowed } from "@/hooks/Laporan/TopBorrow";
import { usePenerimaanStok, type StockHistoryItem } from "@/hooks/Laporan/penerimaan";
import useTransaction, { type TransactionData } from "@/hooks/Laporan/BaranngKeluar";
import useLowStock, { type LowStockItem } from "@/hooks/Laporan/lowStock";
import useExport from "@/hooks/Laporan/exportRecordPengeluaran";
import { Download } from "lucide-react";

// ============================================================
// STYLE BADGE KATEGORI (sama kayak di TableItems)
// ============================================================

const CATEGORY_STYLE: Record<string, string> = {
  apd: "bg-blue-50 text-blue-700",
  tools: "bg-purple-50 text-purple-700",
};

function BadgeKategori({ value }: { value?: string | null }) {
  if (!value) return <span className="text-slate-500">—</span>;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        CATEGORY_STYLE[value.toLowerCase()] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {value}
    </span>
  );
}

// ============================================================
// DAFTAR TAB YANG ADA DI HALAMAN INI
// ============================================================

type TabKey = "record-pengeluaran" | "penerimaan-stok" | "barang-keluar" | "stok-kritis";

const DAFTAR_TAB: { key: TabKey; label: string }[] = [
  { key: "record-pengeluaran", label: "Record Pengeluaran" },
  { key: "penerimaan-stok", label: "Penerimaan Stok" },
  { key: "barang-keluar", label: "Barang Keluar" },
  { key: "stok-kritis", label: "Stok Kritis" },
];

// endpoint & nama file tiap tab (dipakai tombol Export Excel)
const EXPORT_CONFIG: Record<TabKey, { endpoint: string; filename: string }> = {
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

// ============================================================
// KOMPONEN UTAMA
// ============================================================

export default function StockDashboardSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabDariUrl = searchParams.get("tab");
  const tabAktif: TabKey = apakahTabValid(tabDariUrl) ? tabDariUrl : TAB_DEFAULT;

  // --- Filter tanggal (dipakai bersama, kecuali tab Stok Kritis) ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- Export (hook harus di DALAM komponen) ---
  const { loadingExport, handleExport } = useExport();

  function exportTabAktif() {
    const { endpoint, filename } = EXPORT_CONFIG[tabAktif];
    handleExport(endpoint, filename, {
      start: startDate || undefined,
      end: endDate || undefined,
    });
  }

  function pindahTab(tabBaru: TabKey) {
    const paramsBaru = new URLSearchParams(searchParams);
    paramsBaru.set("tab", tabBaru);
    setSearchParams(paramsBaru, { replace: true });
  }

  // --- Data per tab ---
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
  }, [tabAktif, startDate, endDate]);

  // Stok Kritis gak butuh filter tanggal (snapshot kondisi sekarang, bukan histori)
  const tampilkanFilterTanggal = tabAktif !== "stok-kritis";

  return (
    <div className="w-full space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Tombol-tombol tab + filter tanggal + export */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-slate-50 p-1">
            {DAFTAR_TAB.map((tab) => {
              const sedangAktif = tabAktif === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => pindahTab(tab.key)}
                  className={
                    sedangAktif
                      ? "rounded-md bg-white px-3.5 py-1.5 text-sm font-medium text-blue-600 shadow-sm"
                      : "rounded-md px-3.5 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter tanggal — cuma tampil di tab yang butuh histori */}
            {tampilkanFilterTanggal && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                />
                <span className="text-sm text-slate-400">—</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                />
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="text-sm text-slate-400 hover:text-slate-600"
                  >
                    Reset
                  </button>
                )}
              </>
            )}

            {/* Tombol export, ngikutin tab yang lagi aktif */}
            <button
              type="button"
              onClick={exportTabAktif}
              disabled={loadingExport}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {loadingExport ? "Mengunduh..." : "Export Excel"}
            </button>
          </div>
        </div>

        {/* Isi tab "Record Pengeluaran" */}
        {tabAktif === "record-pengeluaran" && (
          <TabelTopDiberikan
            data={dataTopBorrowed}
            loading={loadingTopDiberikan}
            error={errorTopDiberikan}
          />
        )}

        {/* Isi tab "Penerimaan Stok" */}
        {tabAktif === "penerimaan-stok" && (
          <TabelPenerimaanStok
            data={dataPenerimaanStok}
            loading={loadingPenerimaan}
            error={errorPenerimaan}
          />
        )}

        {/* Isi tab "Barang Keluar" */}
        {tabAktif === "barang-keluar" && (
          <TabelBarangKeluar
            data={dataBarangKeluar}
            loading={loadingBarangKeluar}
            error={errorBarangKeluar}
          />
        )}

        {/* Isi tab "Stok Kritis" */}
        {tabAktif === "stok-kritis" && (
          <TabelStokKritis
            data={dataStokKritis}
            loading={loadingStokKritis}
            error={errorStokKritis}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// SUB-KOMPONEN: TABEL RECORD PENGELUARAN (TOP DIBERIKAN)
// ============================================================

interface TopBorrowedItem {
  id: number;
  rank: number;
  name: string;
  category: string;
  current_stock: number;
  total_pinjam: number;
}

interface TabelTopDiberikanProps {
  data: TopBorrowedItem[];
  loading: boolean;
  error: string;
}

function TabelTopDiberikan({ data, loading, error }: TabelTopDiberikanProps) {
  if (loading) {
    return <div className="flex h-40 items-center justify-center text-sm text-slate-400">Memuat data...</div>;
  }

  if (error) {
    return <div className="flex h-40 items-center justify-center text-sm text-red-500">{error}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        Belum ada data untuk periode ini
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            <th className="py-3 pr-4 font-medium">Peringkat</th>
            <th className="py-3 pr-4 font-medium">Nama Barang</th>
            <th className="py-3 pr-4 font-medium">Kategori</th>
            <th className="py-3 pr-4 font-medium">Stok Saat Ini</th>
            <th className="py-3 pr-4 font-medium">Total Diberikan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <BarisTabel
              key={item.id}
              item={item}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BarisTabel({ item }: { item: TopBorrowedItem }) {
  return (
    <tr className="text-slate-700">
      <td className="py-3.5 pr-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 text-xs font-semibold text-white">
          {item.rank}
        </span>
      </td>
      <td className="py-3.5 pr-4 font-medium text-slate-900">{item.name}</td>
      <td className="py-3.5 pr-4">
        <BadgeKategori value={item.category} />
      </td>
      <td className="py-3.5 pr-4">{item.current_stock} unit</td>
      <td className="py-3.5 pr-4 font-medium text-violet-600">{item.total_pinjam}x</td>
    </tr>
  );
}

// ============================================================
// SUB-KOMPONEN: TABEL PENERIMAAN STOK
// ============================================================

interface TabelPenerimaanStokProps {
  data: StockHistoryItem[];
  loading: boolean;
  error: string;
}

function TabelPenerimaanStok({ data, loading, error }: TabelPenerimaanStokProps) {
  if (loading) {
    return <div className="flex h-40 items-center justify-center text-sm text-slate-400">Memuat data...</div>;
  }

  if (error) {
    return <div className="flex h-40 items-center justify-center text-sm text-red-500">{error}</div>;
  }

  const dataMasuk = data.filter((item) => item.type === "in");

  if (dataMasuk.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        Belum ada data penerimaan stok untuk periode ini
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            <th className="py-3 pr-4 font-medium">Tanggal</th>
            <th className="py-3 pr-4 font-medium">Barang</th>
            <th className="py-3 pr-4 font-medium">Category </th>
            <th className="py-3 pr-4 font-medium">Supplier</th>
            <th className="py-3 pr-4 font-medium">Spesialis</th>
            <th className="py-3 pr-4 font-medium">Qty</th>
            <th className="py-3 pr-4 font-medium">Stock Akhir</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {dataMasuk.map((item, index) => (
            <tr
              key={index}
              className="text-slate-700"
            >
              <td className="py-3.5 pr-4 text-slate-500">{item.date}</td>
              <td className="py-3.5 pr-4 font-medium text-slate-900">{item.item_id?.name ?? "—"}</td>
              <td className="py-3.5 pr-4">
                <BadgeKategori value={item.item_id?.category} />
              </td>
              <td className="py-3.5 pr-4 text-slate-500">{item.supplier_id?.name ?? "—"}</td>
              <td className="py-3.5 pr-4">
                <BadgeKategori value={item.supplier_id?.spesialis} />
              </td>
              <td className="py-3.5 pr-4 font-medium text-emerald-600">
                +{item.qty} {item.item_id?.unit ?? ""}
              </td>
              <td className="py-3.5 pr-4 text-slate-500">{item.item_id?.current_stock ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// SUB-KOMPONEN: TABEL BARANG KELUAR
// ============================================================

interface TabelBarangKeluarProps {
  data: TransactionData[];
  loading: boolean;
  error: string;
}

function TabelBarangKeluar({ data, loading, error }: TabelBarangKeluarProps) {
  if (loading) {
    return <div className="flex h-40 items-center justify-center text-sm text-slate-400">Memuat data...</div>;
  }

  if (error) {
    return <div className="flex h-40 items-center justify-center text-sm text-red-500">{error}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        Belum ada data barang keluar untuk periode ini
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            <th className="py-3 pr-4 font-medium">Tanggal</th>
            <th className="py-3 pr-4 font-medium">Barang</th>
            <th className="py-3 pr-4 font-medium">Karyawan</th>
            <th className="py-3 pr-4 font-medium">Qty</th>
            <th className="py-3 pr-4 font-medium">Stock Akhir</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((trx) => (
            <tr
              key={trx.id}
              className="text-slate-700"
            >
              <td className="py-3.5 pr-4 text-slate-500">{trx.date}</td>
              <td className="py-3.5 pr-4 font-medium text-slate-900">{trx.barang || "—"}</td>
              <td className="py-3.5 pr-4 text-slate-500">{trx.employe_name ?? "—"}</td>
              <td className="py-3.5 pr-4 font-medium text-red-600">-{trx.total_qty}</td>
              <td className="py-3.5 pr-4 font-medium text-blue-600">{trx.total_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// SUB-KOMPONEN: TABEL STOK KRITIS
// ============================================================

interface TabelStokKritisProps {
  data: LowStockItem[];
  loading: boolean;
  error: string;
}

function TabelStokKritis({ data, loading, error }: TabelStokKritisProps) {
  if (loading) {
    return <div className="flex h-40 items-center justify-center text-sm text-slate-400">Memuat data...</div>;
  }

  if (error) {
    return <div className="flex h-40 items-center justify-center text-sm text-red-500">{error}</div>;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        Tidak ada barang dengan stok kritis
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            <th className="py-3 pr-4 font-medium">Barang</th>
            <th className="py-3 pr-4 font-medium">Kategori</th>
            <th className="py-3 pr-4 font-medium">Stok Saat Ini</th>
            <th className="py-3 pr-4 font-medium">Min. Stok</th>
            <th className="py-3 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => {
            const habis = Number(item.current_stock) <= 0;
            return (
              <tr
                key={item.id}
                className="text-slate-700"
              >
                <td className="py-3.5 pr-4 font-medium text-slate-900">{item.name}</td>
                <td className="py-3.5 pr-4">
                  <BadgeKategori value={item.category} />
                </td>
                <td className="py-3.5 pr-4 font-medium text-red-600">
                  {item.current_stock} {item.unit}
                </td>
                <td className="py-3.5 pr-4 text-slate-500">
                  {item.min_stock} {item.unit}
                </td>
                <td className="py-3.5 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      habis ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {habis ? "Habis" : "Menipis"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}