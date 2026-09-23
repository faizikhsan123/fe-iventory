import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useItemDetail from "@/hooks/items/detail";
import { STORAGE_URL } from "@/lib/axios";

const DetailBarang = () => {
  // ambil id dari URL, contoh route: /items/:id
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error, handleGet } = useItemDetail();

  useEffect(() => {
    if (id) {
      handleGet(id);
    }
  }, [id, handleGet]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-400">Memuat detail barang...</div>
    );
  }

  if (error) {
    return <div className="flex h-64 items-center justify-center text-sm text-red-500">{error}</div>;
  }

  if (!data) {
    return null;
  }

  const { item, statistik, riwayat_stok, riwayat_pemberian } = data;

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
        <h1 className="text-xl font-bold text-neutral-900">Detail Barang</h1>
        <p className="text-sm text-neutral-500">
          {item.part_number} — {item.name}
        </p>
      </div>

      {/* Card Info Utama: gambar besar di kiri, card-card info di kanan */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Gambar diperbesar */}
          <div className="flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 lg:h-56 lg:w-56">
            {item.file ? (
              <img
                src={`${STORAGE_URL}${item.file}`}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-6xl">📦</span>
            )}
          </div>

          {/* Nama + info grid, di samping gambar */}
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                {item.part_number}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">{item.name}</h2>
            <p className="mb-4 text-sm text-neutral-500">
              {item.brand} · {item.category}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InfoBox
                label="Kategori"
                value={item.category}
              />
              <InfoBox
                label="Tipe"
                value={item.type || "-"}
              />
              <InfoBox
                label="Ukuran"
                value={item.size || "-"}
              />
              <InfoBox
                label="Satuan"
                value={item.unit}
              />
              <InfoBox
                label="Stok Saat Ini"
                value={`${item.current_stock} unit`}
                highlight
              />
              <InfoBox
                label="Minimum Stok"
                value={`${item.min_stock} unit`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Informasi Barang + Statistik */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Informasi Barang */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-neutral-900">Informasi Barang</h3>
          <div className="space-y-3 text-sm">
            <InfoRow
              label="Deskripsi"
              value={item.description || "-"}
            />
            <InfoRow
              label="Tanggal Terakhir Masuk"
              value={statistik.tanggal_terakhir_masuk || "-"}
            />
          </div>
        </div>

        {/* Statistik Penggunaan */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-neutral-900">Statistik Penggunaan</h3>
          <StatBar
            label="Total Diberikan"
            value={statistik.total_diberikan}
            color="bg-emerald-500"
          />
        </div>
      </div>

      {/* Riwayat Stok */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-neutral-900">Riwayat Stok</h3>
        <TabelRiwayatStok data={riwayat_stok} />
      </div>

      {/* Riwayat Pemberian */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-neutral-900">Riwayat Pemberian</h3>
        <TabelRiwayatPemberian data={riwayat_pemberian} />
      </div>
    </div>
  );
};

export default DetailBarang;

// ============================================================
// KOMPONEN KECIL
// ============================================================

function InfoBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-neutral-400">{label}</p>
      <p className={`font-semibold ${highlight ? "text-blue-600" : "text-neutral-900"}`}>{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-neutral-50 pb-2">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right font-medium text-neutral-900">{value}</span>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const maxAsumsi = 200;
  const persentase = Math.min((value / maxAsumsi) * 100, 100);

  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-700">{label}</span>
        <span className="font-semibold text-neutral-900">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${persentase}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================
// TABEL RIWAYAT STOK
// ============================================================

interface RiwayatStokItem {
  date: string;
  type: string;
  qty: number;
  note: string | null;
  user_name: string;
  supplier_name: string | null;
}

function TabelRiwayatStok({ data }: { data: RiwayatStokItem[] }) {
  if (data.length === 0) {
    return <div className="flex h-24 items-center justify-center text-sm text-neutral-400">Belum ada riwayat stok</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
            <th className="py-2 pr-3 font-medium">Tanggal</th>
            <th className="py-2 pr-3 font-medium">Tipe</th>
            <th className="py-2 pr-3 font-medium">Qty</th>
            <th className="py-2 pr-3 font-medium">Supplier</th>
            <th className="py-2 pr-3 font-medium">Catatan</th>
            <th className="py-2 pr-3 font-medium">User</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {data.map((row, index) => {
            const isIn = row.type === "in";
            return (
              <tr
                key={index}
                className="text-neutral-700"
              >
                <td className="py-3 pr-3 text-neutral-500">{row.date}</td>
                <td className="py-3 pr-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      isIn ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {isIn ? "Stock In" : "Stock Out"}
                  </span>
                </td>
                <td className={`py-3 pr-3 font-medium ${isIn ? "text-emerald-600" : "text-red-600"}`}>
                  {isIn ? "+" : "-"}
                  {row.qty}
                </td>
                <td className="py-3 pr-3 text-neutral-500">{row.supplier_name ?? "-"}</td>
                <td className="py-3 pr-3 text-neutral-500">{row.note || "-"}</td>
                <td className="py-3 pr-3 text-neutral-500">{row.user_name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// TABEL RIWAYAT PEMBERIAN
// ============================================================

interface RiwayatPemberianItem {
  transaction_number: string;
  date: string;
  qty: number;
  employe_name: string;
  note: string | null;
}

function TabelRiwayatPemberian({ data }: { data: RiwayatPemberianItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-neutral-400">Belum ada riwayat pemberian</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
            <th className="py-2 pr-3 font-medium">No. Transaksi</th>
            <th className="py-2 pr-3 font-medium">Tanggal</th>
            <th className="py-2 pr-3 font-medium">Qty</th>
            <th className="py-2 pr-3 font-medium">Karyawan</th>
            <th className="py-2 pr-3 font-medium">Catatan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {data.map((row, index) => (
            <tr
              key={index}
              className="text-neutral-700"
            >
              <td className="py-3 pr-3 font-medium text-blue-600">{row.transaction_number}</td>
              <td className="py-3 pr-3 text-neutral-500">{row.date}</td>
              <td className="py-3 pr-3 font-medium text-red-600">-{row.qty}</td>
              <td className="py-3 pr-3 text-neutral-900">{row.employe_name}</td>
              <td className="py-3 pr-3 text-neutral-500">{row.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}