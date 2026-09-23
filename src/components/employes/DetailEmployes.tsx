import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Package } from "lucide-react";
import useEmployeDetail from "@/hooks/employes/detail";

const DetailKaryawan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error, handleGet } = useEmployeDetail();

  useEffect(() => {
    if (id) {
      handleGet(id);
    }
  }, [id, handleGet]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
        Memuat detail karyawan...
      </div>
    );
  }

  if (error) {
    return <div className="flex h-64 items-center justify-center text-sm text-red-500">{error}</div>;
  }

  if (!data) {
    return null;
  }

  const { employe, statistik, riwayat_diberikan } = data;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-2 flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        {/* <h1 className="text-xl font-bold text-neutral-900">Detail Karyawan</h1>
        <p className="text-sm text-neutral-500">{employe.name}</p> */}
      </div>

      {/* Card Info Karyawan */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <User className="h-9 w-9 text-blue-500" />
          </div>

          {/* Nama + info */}
          <div className="flex-1">
            <div className="mb-1">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  employe.status === "active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {employe.status}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">{employe.name}</h2>
            <p className="text-sm text-neutral-500">
              {employe.position} · {employe.division}
            </p>
          </div>

          {/* Statistik ringkas */}
          <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-5 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <Package className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">{statistik.total_barang_diterima}</p>
              <p className="text-xs text-neutral-500">Total Barang Diterima</p>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat Diberikan */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-neutral-900">Riwayat Diberikan</h3>
        <TabelRiwayatDiberikan data={riwayat_diberikan} />
      </div>
    </div>
  );
};

export default DetailKaryawan;

// ============================================================
// TABEL RIWAYAT DIBERIKAN
// ============================================================

interface RiwayatDiberikanItem {
  transaction_number: string;
  date: string;
  barang: string;
  qty: number;
  note: string | null;  
}

function TabelRiwayatDiberikan({ data }: { data: RiwayatDiberikanItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-neutral-400">
        Belum ada barang yang diberikan ke karyawan ini
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
            <th className="py-2 pr-3 font-medium">No. Transaksi</th>
            <th className="py-2 pr-3 font-medium">Tanggal</th>
            <th className="py-2 pr-3 font-medium">Barang</th>
            <th className="py-2 pr-3 font-medium">Qty</th>
            <th className="py-2 pr-3 font-medium">Catatan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {data.map((row, index) => (
            <tr key={index} className="text-neutral-700">
              <td className="py-3 pr-3 font-medium text-blue-600">{row.transaction_number}</td>
              <td className="py-3 pr-3 text-neutral-500">{row.date}</td>
              <td className="py-3 pr-3 font-medium text-neutral-900">{row.barang}</td>
              <td className="py-3 pr-3 font-medium text-emerald-600">{row.qty} unit</td>
              <td className="py-3 pr-3 text-neutral-500">{row.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}