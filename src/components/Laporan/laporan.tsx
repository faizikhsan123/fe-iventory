// StockDashboardSection.tsx (Laporan)
import  { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTopBorrowed } from "@/hooks/Laporan/TopBorrow";
import { usePenerimaanStok, type StockHistoryItem } from "@/hooks/Laporan/penerimaan";
import useTransaction, { type TransactionData } from "@/hooks/Laporan/BaranngKeluar";
import useLowStock, { type LowStockItem } from "@/hooks/Laporan/lowStock";
import useStockTrend, { type TrendItem } from "@/hooks/Laporan/Trend";
import useCategoryDistribution, { type CategoryItem } from "@/hooks/Laporan/Distribution";


// ============================================================
// DAFTAR TAB YANG ADA DI HALAMAN INI
// ============================================================

type TabKey = "top-diberikan" | "penerimaan-stok" | "barang-keluar" | "stok-kritis";

const DAFTAR_TAB: { key: TabKey; label: string }[] = [
  { key: "top-diberikan", label: "Top Diberikan" },
  { key: "penerimaan-stok", label: "Penerimaan Stok" },
  { key: "barang-keluar", label: "Barang Keluar" },
  { key: "stok-kritis", label: "Stok Kritis" },
];

const TAB_DEFAULT: TabKey = "top-diberikan";

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

  // --- Data chart (selalu tampil, gak tergantung tab) ---
  const { data: dataTrend, loading: loadingTrend, handleGet: getTrend } = useStockTrend();
  const { data: dataKategori, loading: loadingKategori, handleGet: getKategori } = useCategoryDistribution();

  useEffect(() => {
    if (tabAktif === "top-diberikan") {
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

  useEffect(() => {
    getTrend();
    getKategori();
  }, [getTrend, getKategori]);

  // Stok Kritis gak butuh filter tanggal (snapshot kondisi sekarang, bukan histori)
  const tampilkanFilterTanggal = tabAktif !== "stok-kritis";

  return (
    <div className="w-full space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Tombol-tombol tab + filter tanggal */}
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

          {/* Filter tanggal — cuma tampil di tab yang butuh histori */}
          {tampilkanFilterTanggal && (
            <div className="flex items-center gap-2">
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
            </div>
          )}
        </div>

        {/* Isi tab "Top Diberikan" */}
        {tabAktif === "top-diberikan" && (
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

      {/* Grid 2 chart baru */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartTrenStok data={dataTrend} loading={loadingTrend} />
        <ChartDistribusiKategori data={dataKategori} loading={loadingKategori} />
      </div>
    </div>
  );
}

// ============================================================
// SUB-KOMPONEN: TABEL TOP DIBERIKAN
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
            <BarisTabel key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BarisTabel({ item }: { item: TopBorrowedItem }) {
  const warnaKategori = item.category === "APD" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600";

  return (
    <tr className="text-slate-700">
      <td className="py-3.5 pr-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 text-xs font-semibold text-white">
          {item.rank}
        </span>
      </td>
      <td className="py-3.5 pr-4 font-medium text-slate-900">{item.name}</td>
      <td className="py-3.5 pr-4">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${warnaKategori}`}>{item.category}</span>
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
            <th className="py-3 pr-4 font-medium">Supplier</th>
            <th className="py-3 pr-4 font-medium">Qty</th>
            <th className="py-3 pr-4 font-medium">Catatan</th>
            <th className="py-3 pr-4 font-medium">User</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {dataMasuk.map((item, index) => (
            <tr key={index} className="text-slate-700">
              <td className="py-3.5 pr-4 text-slate-500">{item.date}</td>
              <td className="py-3.5 pr-4 font-medium text-slate-900">{item.item_id?.name ?? "—"}</td>
              <td className="py-3.5 pr-4 text-slate-500">{item.supplier_id?.name ?? "—"}</td>
              <td className="py-3.5 pr-4 font-medium text-emerald-600">
                +{item.qty} {item.item_id?.unit ?? ""}
              </td>
              <td className="py-3.5 pr-4 text-slate-500">{item.note || "—"}</td>
              <td className="py-3.5 pr-4 text-slate-500">{item.user_id?.name ?? "—"}</td>
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
            <th className="py-3 pr-4 font-medium">No. Transaksi</th>
            <th className="py-3 pr-4 font-medium">Barang</th>
            <th className="py-3 pr-4 font-medium">Karyawan</th>
            <th className="py-3 pr-4 font-medium">Qty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((trx) => (
            <tr key={trx.id} className="text-slate-700">
              <td className="py-3.5 pr-4 text-slate-500">{trx.date}</td>
              <td className="py-3.5 pr-4 font-medium text-blue-600">{trx.transaction_number}</td>
              <td className="py-3.5 pr-4 font-medium text-slate-900">{trx.barang || "—"}</td>
              <td className="py-3.5 pr-4 text-slate-500">{trx.employe_name ?? "—"}</td>
              <td className="py-3.5 pr-4 font-medium text-red-600">-{trx.total_qty}</td>
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
              <tr key={item.id} className="text-slate-700">
                <td className="py-3.5 pr-4 font-medium text-slate-900">{item.name}</td>
                <td className="py-3.5 pr-4 text-slate-500">{item.category}</td>
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

// ============================================================
// CHART: TREN STOK MASUK & KELUAR
// ============================================================

const NAMA_BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

function formatBulan(bulan: string) {
  const [, bulanAngka] = bulan.split("-");
  return NAMA_BULAN[parseInt(bulanAngka, 10) - 1];
}

function ChartTrenStok({ data, loading }: { data: TrendItem[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">Memuat data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">Belum ada data</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.flatMap((d) => [d.stock_masuk, d.stock_keluar]), 10);
  const bulanAwal = formatBulan(data[0].bulan);
  const bulanAkhir = formatBulan(data[data.length - 1].bulan);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Tren Stok Masuk & Keluar</h3>
          <p className="text-sm text-slate-400">
            {bulanAwal} — {bulanAkhir} {new Date().getFullYear()}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
            Stock Masuk
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-violet-500" />
            Stock Keluar
          </span>
        </div>
      </div>

      <div className="flex h-56 items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-48 w-full items-end justify-center gap-1">
              <div
                className="w-full max-w-[18px] rounded-t-sm bg-blue-500"
                style={{ height: `${(item.stock_masuk / maxValue) * 100}%` }}
                title={`Stock Masuk: ${item.stock_masuk}`}
              />
              <div
                className="w-full max-w-[18px] rounded-t-sm bg-violet-500"
                style={{ height: `${(item.stock_keluar / maxValue) * 100}%` }}
                title={`Stock Keluar: ${item.stock_keluar}`}
              />
            </div>
            <span className="text-xs text-slate-400">{formatBulan(item.bulan)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CHART: DISTRIBUSI KATEGORI
// ============================================================

const WARNA_KATEGORI: Record<string, { dot: string; bar: string; text: string }> = {
  apd: { dot: "bg-blue-500", bar: "bg-blue-500", text: "text-blue-600" },
  tools: { dot: "bg-violet-500", bar: "bg-violet-500", text: "text-violet-600" },
};

const LABEL_KATEGORI: Record<string, string> = {
  apd: "APD",
  tools: "Tools",
};

function ChartDistribusiKategori({ data, loading }: { data: CategoryItem[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">Memuat data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">Belum ada data</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 font-semibold text-slate-900">Distribusi Kategori</h3>

      <div className="space-y-4">
        {data.map((item) => {
          const warna = WARNA_KATEGORI[item.category] ?? {
            dot: "bg-slate-400",
            bar: "bg-slate-400",
            text: "text-slate-600",
          };
          const label = LABEL_KATEGORI[item.category] ?? item.category;

          return (
            <div key={item.category}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className={`h-2.5 w-2.5 rounded-sm ${warna.dot}`} />
                  {label}
                </span>
                <span className="text-slate-400">{item.total} unit</span>
                <span className={`font-semibold ${warna.text}`}>{item.percentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${warna.bar}`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}