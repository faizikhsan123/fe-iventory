// Dashboard.tsx
import { useEffect } from "react";
import { Package, BarChart3, ArrowDownCircle, CheckCircle2, XCircle } from "lucide-react";
import useDashboard from "@/hooks/dashboard/get";

const Dashboard = () => {
  const { data, loading, error, handleGet } = useDashboard();

  useEffect(() => {
    handleGet();
  }, [handleGet]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        Memuat dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { summary, aktivitas_stok, transaksi_terbaru } = data;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Selamat Datang 👋</h1>
        <p className="text-sm text-slate-500">Ringkasan inventaris</p>
      </div>

      {/* Card Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <CardSummary
          icon={<Package className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50"
          label="Total Barang"
          value={summary.total_barang}
        />
        <CardSummary
          icon={<BarChart3 className="h-5 w-5 text-sky-600" />}
          iconBg="bg-sky-50"
          label="Stok Saat Ini"
          value={summary.current_stock}
        />
        <CardSummary
          icon={<ArrowDownCircle className="h-5 w-5 text-violet-600" />}
          iconBg="bg-violet-50"
          label="Barang Keluar"
          value={summary.barang_keluar}
        />
        <CardSummary
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          label="Barang Masuk"
          value={summary.barang_masuk}
        />
        <CardSummary
          icon={<XCircle className="h-5 w-5 text-red-600" />}
          iconBg="bg-red-50"
          label="Stok Habis"
          value={summary.out_of_stock}
        />
      </div>

      {/* 2 Tabel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TabelAktivitasStok data={aktivitas_stok} />
        <TabelTransaksiTerbaru data={transaksi_terbaru} />
      </div>
    </div>
  );
};

export default Dashboard;

// ============================================================
// CARD SUMMARY
// ============================================================

interface CardSummaryProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number;
}

function CardSummary({ icon, iconBg, label, value }: CardSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value.toLocaleString("id-ID")}</p>
      <p className="text-sm text-slate-500">{label}</p>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Aktivitas Stok Terbaru</h2>
       
      </div>

      {data.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-slate-400">
          Belum ada aktivitas
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3 font-medium">Tanggal</th>
                <th className="py-2 pr-3 font-medium">Part No.</th>
                <th className="py-2 pr-3 font-medium">Nama Barang</th>
                <th className="py-2 pr-3 font-medium">Aktivitas</th>
                <th className="py-2 pr-3 font-medium">Qty</th>
                <th className="py-2 pr-3 font-medium">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item, index) => {
                const isIn = item.type === "in";
                return (
                  <tr key={index} className="text-slate-700">
                    <td className="py-3 pr-3 text-slate-500">{item.date}</td>
                    <td className="py-3 pr-3 text-blue-600">{item.part_number}</td>
                    <td className="py-3 pr-3 font-medium text-slate-900">{item.name}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          isIn ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {isIn ? "Stok Masuk" : "Stok Keluar"}
                      </span>
                    </td>
                    <td className={`py-3 pr-3 font-medium ${isIn ? "text-emerald-600" : "text-red-600"}`}>
                      {isIn ? "+" : "-"}
                      {item.qty}
                    </td>
                    <td className="py-3 pr-3 text-slate-500">{item.user_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TABEL TRANSAKSI TERBARU
// ============================================================

interface TransaksiTerbaruItem {
  transaction_number: string;
  employe_name: string;
  barang: string;
  date: string;
}

function TabelTransaksiTerbaru({ data }: { data: TransaksiTerbaruItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Transaksi Terbaru</h2>
      
      </div>

      {data.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-slate-400">
          Belum ada transaksi
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3 font-medium">No. Transaksi</th>
                <th className="py-2 pr-3 font-medium">Karyawan</th>
                <th className="py-2 pr-3 font-medium">Barang</th>
                <th className="py-2 pr-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((trx, index) => (
                <tr key={index} className="text-slate-700">
                  <td className="py-3 pr-3 font-medium text-blue-600">{trx.transaction_number}</td>
                  <td className="py-3 pr-3 text-slate-900">{trx.employe_name}</td>
                  <td className="py-3 pr-3 text-slate-500">{trx.barang || "—"}</td>
                  <td className="py-3 pr-3 text-slate-500">{trx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}