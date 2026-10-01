// DetailBarang.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { AlertCircle, ArrowLeft, Inbox, Package } from "lucide-react";
import useItemDetail from "@/hooks/items/detail";
import { STORAGE_URL } from "@/lib/axios";
import { formatTanggalIndo } from "@/lib/tanggal";
import { formatRupiah } from "@/lib/Harga";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border #BFCCE3, muted #50688C
  semantik: merah #B3261E (bg #FDECEA, border #F2B8B5) khusus stok keluar & error
*/

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
      <div className="animate-pulse space-y-4 sm:space-y-6">
        <div className="h-12 w-2/3 rounded-lg bg-[#DBE2EF]" />
        <div className="h-64 rounded-lg bg-[#DBE2EF] sm:rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <div className="h-40 rounded-lg bg-[#DBE2EF] sm:rounded-xl" />
          <div className="h-40 rounded-lg bg-[#DBE2EF] sm:rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-4 py-14 text-center sm:rounded-xl">
        <AlertCircle className="h-8 w-8 text-[#B3261E]" />
        <p className="max-w-md break-words text-sm font-medium text-[#B3261E]">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { item, statistik, riwayat_stok, riwayat_pemberian } = data;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-3 inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#BFCCE3] bg-white px-3 text-sm font-semibold text-[#112D4E] transition hover:bg-[#DBE2EF] active:scale-[0.98]"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        <div className="flex min-w-0 items-stretch gap-3">
          <span className="w-1 shrink-0 rounded-full bg-[#3F72AF]" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-[#112D4E] sm:text-2xl">Detail Barang</h1>
            <p className="mt-0.5 break-words text-xs leading-5 text-[#50688C] sm:text-sm">
              {item.part_number} — {item.name}
            </p>
          </div>
        </div>
      </div>

      {/* Card Info Utama: gambar di kiri, info di kanan */}
      <div className="rounded-lg border border-[#DBE2EF] bg-white p-4 shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
          {/* Gambar */}
          <div className="grid h-48 w-full shrink-0 place-items-center overflow-hidden rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] sm:w-48 lg:h-56 lg:w-56">
            {item.file ? (
              <img
                src={`${STORAGE_URL}${item.file}`}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-14 w-14 text-[#9DB2D3]" />
            )}
          </div>

          {/* Nama + info grid */}
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-full bg-[#DBE2EF] px-2.5 py-0.5 text-xs font-bold text-[#112D4E] ring-1 ring-inset ring-[#BFCCE3]">
              {item.part_number}
            </span>
            <h2 className="mt-2 break-words text-lg font-extrabold text-[#112D4E] sm:text-xl">{item.name}</h2>
            <p className="mb-4 text-sm capitalize text-[#50688C]">
              {item.brand} · {item.category}
            </p>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
              <InfoBox
                label="Harga Perolehan"
                value={formatRupiah(item.price)}
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
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Informasi Barang */}
        <Panel title="Informasi Barang">
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
        </Panel>

        {/* Statistik Penggunaan */}
        <Panel title="Statistik Penggunaan">
          <StatBar
            label="Total Diberikan"
            value={statistik.total_diberikan}
            color="bg-[#3F72AF]"
          />
        </Panel>
      </div>

      {/* Riwayat Stok */}
      <Panel
        title="Riwayat Stok"
        flush
      >
        <TabelRiwayatStok data={riwayat_stok} />
      </Panel>

      {/* Riwayat Pemberian */}
      <Panel
        title="Riwayat Pemberian"
        flush
      >
        <TabelRiwayatPemberian data={riwayat_pemberian} />
      </Panel>
    </div>
  );
};

export default DetailBarang;

// ============================================================
// KOMPONEN KECIL
// ============================================================

function Panel({ title, children, flush }: { title: string; children: React.ReactNode; flush?: boolean }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex items-center gap-2.5 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6 sm:py-4">
        <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
        <h3 className="font-bold text-[#112D4E]">{title}</h3>
      </div>
      <div className={flush ? "" : "p-4 sm:p-6"}>{children}</div>
    </div>
  );
}

function Kosong({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#DBE2EF]">
        <Inbox className="h-5 w-5 text-[#3F72AF]" />
      </div>
      <p className="text-sm text-[#50688C]">{text}</p>
    </div>
  );
}

function InfoBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`min-w-0 rounded-lg p-3 ${
        highlight ? "bg-[#112D4E]" : "border border-[#DBE2EF] bg-[#F9F7F7]"
      }`}
    >
      <p className={`text-[11px] font-medium uppercase tracking-wide ${highlight ? "text-[#9DB2D3]" : "text-[#50688C]"}`}>
        {label}
      </p>
      <p className={`mt-0.5 break-words font-bold ${highlight ? "text-white" : "text-[#112D4E]"}`}>{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-[#DBE2EF] pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-[#50688C]">{label}</span>
      <span className="break-words font-semibold text-[#112D4E] sm:text-right">{value}</span>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const maxAsumsi = 200;
  const persentase = Math.min((value / maxAsumsi) * 100, 100);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-[#50688C]">{label}</span>
        <span className="font-extrabold text-[#112D4E]">{value}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#DBE2EF]">
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

function BadgeTipe({ isIn }: { isIn: boolean }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        isIn ? "bg-[#DBE2EF] text-[#112D4E] ring-[#BFCCE3]" : "bg-[#FDECEA] text-[#B3261E] ring-[#F2B8B5]"
      }`}
    >
      {isIn ? "Stock In" : "Stock Out"}
    </span>
  );
}

function TabelRiwayatStok({ data }: { data: RiwayatStokItem[] }) {
  if (data.length === 0) {
    return <Kosong text="Belum ada riwayat stok" />;
  }

  return (
    <>
      {/* Mobile: kartu */}
      <ul className="divide-y divide-[#DBE2EF] md:hidden">
        {data.map((row, index) => {
          const isIn = row.type === "in";
          return (
            <li key={index} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <BadgeTipe isIn={isIn} />
                  <p className="mt-1.5 text-xs text-[#50688C]">{formatTanggalIndo(row.date)}</p>
                </div>
                <span className={`shrink-0 text-lg font-extrabold ${isIn ? "text-[#112D4E]" : "text-[#B3261E]"}`}>
                  {isIn ? "+" : "-"}
                  {row.qty}
                </span>
              </div>

              <dl className="mt-3 space-y-1 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-3 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#50688C]">Supplier</dt>
                  <dd className="min-w-0 break-words text-right font-medium text-[#112D4E]">
                    {row.supplier_name ?? "-"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#50688C]">User</dt>
                  <dd className="min-w-0 break-words text-right font-medium text-[#112D4E]">{row.user_name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#50688C]">Catatan</dt>
                  <dd className="min-w-0 break-words text-right font-medium text-[#112D4E]">{row.note || "-"}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>

      {/* Tablet & desktop: tabel */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="bg-[#F9F7F7] text-xs uppercase tracking-wide text-[#50688C]">
              <th className="px-6 py-3 font-semibold">Tanggal</th>
              <th className="px-3 py-3 font-semibold">Tipe</th>
              <th className="px-3 py-3 font-semibold">Qty</th>
              <th className="px-3 py-3 font-semibold">Supplier</th>
              <th className="px-3 py-3 font-semibold">Catatan</th>
              <th className="px-6 py-3 font-semibold">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {data.map((row, index) => {
              const isIn = row.type === "in";
              return (
                <tr
                  key={index}
                  className="text-[#112D4E] transition-colors hover:bg-[#F9F7F7]"
                >
                  <td className="whitespace-nowrap px-6 py-3.5 text-[#50688C]">{formatTanggalIndo(row.date)}</td>
                  <td className="px-3 py-3.5">
                    <BadgeTipe isIn={isIn} />
                  </td>
                  <td className={`px-3 py-3.5 font-bold ${isIn ? "text-[#112D4E]" : "text-[#B3261E]"}`}>
                    {isIn ? "+" : "-"}
                    {row.qty}
                  </td>
                  <td className="px-3 py-3.5 text-[#50688C]">{row.supplier_name ?? "-"}</td>
                  <td className="px-3 py-3.5 text-[#50688C]">{row.note || "-"}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-[#50688C]">{row.user_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
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
    return <Kosong text="Belum ada riwayat pemberian" />;
  }

  return (
    <>
      {/* Mobile: kartu */}
      <ul className="divide-y divide-[#DBE2EF] md:hidden">
        {data.map((row, index) => (
          <li key={index} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-all text-sm font-bold text-[#112D4E]">{row.transaction_number}</p>
                <p className="mt-0.5 text-xs text-[#50688C]">{formatTanggalIndo(row.date)}</p>
              </div>
              <span className="shrink-0 text-lg font-extrabold text-[#B3261E]">-{row.qty}</span>
            </div>

            <p className="mt-2 text-sm font-medium text-[#112D4E]">{row.employe_name}</p>
            <p className="break-words text-xs text-[#50688C]">{row.note || "-"}</p>
          </li>
        ))}
      </ul>

      {/* Tablet & desktop: tabel */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="bg-[#F9F7F7] text-xs uppercase tracking-wide text-[#50688C]">
              <th className="px-6 py-3 font-semibold">No. Transaksi</th>
              <th className="px-3 py-3 font-semibold">Tanggal</th>
              <th className="px-3 py-3 font-semibold">Qty</th>
              <th className="px-3 py-3 font-semibold">Karyawan</th>
              <th className="px-6 py-3 font-semibold">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {data.map((row, index) => (
              <tr
                key={index}
                className="text-[#112D4E] transition-colors hover:bg-[#F9F7F7]"
              >
                <td className="whitespace-nowrap px-6 py-3.5 font-semibold">{row.transaction_number}</td>
                <td className="whitespace-nowrap px-3 py-3.5 text-[#50688C]">{formatTanggalIndo(row.date)}</td>
                <td className="px-3 py-3.5 font-bold text-[#B3261E]">-{row.qty}</td>
                <td className="px-3 py-3.5 font-medium">{row.employe_name}</td>
                <td className="px-6 py-3.5 text-[#50688C]">{row.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}