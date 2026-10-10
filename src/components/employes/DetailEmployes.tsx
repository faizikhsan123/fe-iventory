// DetailKaryawan.tsx
import { useEffect, type CSSProperties } from "react";
import { useParams, useNavigate } from "react-router"; // sebelumnya "react-router-dom"
import { AlertCircle, ArrowLeft, Inbox, Package, RefreshCw, User } from "lucide-react";
import useEmployeDetail from "@/hooks/employes/detail";
import { formatTanggalIndo } from "@/lib/tanggal";
import { STORAGE_URL } from "@/lib/axios";
import { expiringLabel, isExpiring } from "@/lib/contract";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border #BFCCE3, muted #50688C
  semantik: merah #B3261E (bg #FDECEA, border #F2B8B5) khusus error
*/

// pola garis halus di banner navy (warna solid, bukan transparan)
const gridStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, #1B3F68 1px, transparent 1px), linear-gradient(to bottom, #1B3F68 1px, transparent 1px)",
  backgroundSize: "36px 36px",
};

const DetailKaryawan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error, handleGet } = useEmployeDetail();

  useEffect(() => {
    if (id) {
      handleGet(id);
    }
  }, [id, handleGet]);

  const BackButton = (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#BFCCE3] bg-white px-3 text-sm font-semibold text-[#112D4E] transition hover:bg-[#DBE2EF] active:scale-[0.98]"
    >
      <ArrowLeft size={16} />
      Kembali
    </button>
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 sm:space-y-6">
        <div className="h-10 w-28 rounded-lg bg-[#DBE2EF]" />
        <div className="h-64 rounded-lg bg-[#DBE2EF] sm:rounded-xl" />
        <div className="h-64 rounded-lg bg-[#DBE2EF] sm:rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        {BackButton}
        <div className="flex flex-col items-center gap-3 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-4 py-14 text-center sm:rounded-xl">
          <AlertCircle className="h-9 w-9 text-[#B3261E]" />
          <p className="max-w-md break-words text-sm font-medium text-[#B3261E]">{error}</p>
          {id && (
            <button
              onClick={() => handleGet(id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#F2B8B5] bg-white px-5 text-sm font-semibold text-[#B3261E] transition hover:bg-[#FDECEA] active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Coba lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { employe, statistik, riwayat_diberikan } = data;
  const isActive = employe.status === "active";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>{BackButton}</div>

      {/* ================= KARTU PROFIL ================= */}
      <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
        <div className="h-24 bg-[#112D4E] sm:h-32" style={gridStyle} />
        <div className="h-1.5 w-full bg-[#3F72AF]" />

        <div className="px-4 pb-5 sm:px-8 sm:pb-6">
          <div className="-mt-14 flex flex-col items-center gap-4 text-center sm:-mt-16 sm:flex-row sm:items-end sm:text-left">
            {/* Avatar */}
            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-[#DBE2EF] ring-4 ring-white sm:h-28 sm:w-28">
              {employe.file ? (
                <img src={`${STORAGE_URL}${employe.file}`} alt={employe.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-[#3F72AF]" />
              )}
            </div>

            {/* Nama + info */}
            <div className="min-w-0 flex-1 sm:pb-1">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  isActive
                    ? "bg-[#112D4E] text-white"
                    : "bg-[#F9F7F7] text-[#50688C] ring-1 ring-inset ring-[#BFCCE3]"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#8FB0DC]" : "bg-[#9DB2D3]"}`} />
                {employe.status}
              </span>
              <h2 className="mt-1 break-words text-xl font-extrabold text-[#112D4E] sm:text-2xl">{employe.name}</h2>
              <p className="text-sm text-[#50688C]">
                {employe.position} · {employe.division}
              </p>
            </div>

            {/* Statistik */}
            <div className="flex w-full items-center gap-3 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] px-5 py-3 text-left sm:w-auto">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold tabular-nums leading-none text-[#112D4E]">
                  {statistik.total_barang_diterima}
                </p>
                <p className="mt-1 text-xs text-[#50688C]">Total Barang Diterima</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= KONTRAK ================= */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(
          [
            { label: "Group", value: employe.group_name ?? "Belum masuk group" },
            {
              label: "Contract When Joined",
              value: employe.contract_start ? formatTanggalIndo(employe.contract_start) : "-",
            },
            {
              label: "Contract Expired",
              value: employe.contract_end ? formatTanggalIndo(employe.contract_end) : "-",
              danger: isExpiring(employe.contract_end),
              hint: expiringLabel(employe.contract_end),
            },
            { label: "Perpanjangan Kontrak", value: `${employe.contract_renewals ?? 0}x` },
          ] as { label: string; value: string; danger?: boolean; hint?: string | null }[]
        ).map(({ label, value, danger, hint }) => (
          <div
            key={label}
            className={`rounded-lg border p-4 shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl ${
              danger ? "border-[#F2B8B5] bg-[#FDECEA]" : "border-[#DBE2EF] bg-white"
            }`}
          >
            <p className="text-xs text-[#50688C]">{label}</p>
            <p className={`mt-1 break-words text-lg font-extrabold ${danger ? "text-[#B3261E]" : "text-[#112D4E]"}`}>
              {value}
            </p>
            {hint && <p className="mt-0.5 text-xs font-semibold text-[#B3261E]">{hint}</p>}
          </div>
        ))}
      </div>


      {/* ================= MCU ================= */}
      <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
        <div className="flex items-center gap-2.5 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6 sm:py-4">
          <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
          <h3 className="font-bold text-[#112D4E]">Riwayat MCU</h3>
        </div>
        {(data.mcus ?? []).length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#50688C]">Belum ada data MCU untuk karyawan ini</p>
        ) : (
          <ul className="divide-y divide-[#DBE2EF]">
            {data.mcus.map((m) => (
              <li key={m.id} className="space-y-1 p-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#112D4E]">
                    {m.place_name}
                    {m.mcu_name ? ` · ${m.mcu_name}` : ""}
                  </p>
                  <p className="text-xs font-semibold text-[#50688C]">{formatTanggalIndo(m.mcu_date)}</p>
                </div>
                <p className="text-xs text-[#50688C]">Alergi: {m.allergies || "-"}</p>
                {m.summary && <p className="text-sm text-[#112D4E]">{m.summary}</p>}
                <p className="text-xs">
                  <span className="text-[#50688C]">MCU berikutnya: </span>
                  <span className={m.is_latest !== false && isExpiring(m.next_mcu_date) ? "font-semibold text-[#B3261E]" : "text-[#112D4E]"}>
                    {m.next_mcu_date ? formatTanggalIndo(m.next_mcu_date) : "-"}
                  </span>
                  {m.is_latest !== false && expiringLabel(m.next_mcu_date) && (
                    <span className="ml-1.5 font-semibold text-[#B3261E]">({expiringLabel(m.next_mcu_date)})</span>
                  )}
                  {m.document && (
                    <>
                      {" · "}
                      <a
                        href={`${STORAGE_URL}${m.document}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#3F72AF] underline"
                      >
                        Dokumen
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ================= RIWAYAT ================= */}
      <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
        <div className="flex items-center gap-2.5 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6 sm:py-4">
          <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
          <h3 className="font-bold text-[#112D4E]">Riwayat Diberikan</h3>
        </div>
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
      <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#DBE2EF]">
          <Inbox className="h-6 w-6 text-[#3F72AF]" />
        </div>
        <p className="text-sm text-[#50688C]">Belum ada barang yang diberikan ke karyawan ini</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: kartu */}
      <ul className="divide-y divide-[#DBE2EF] md:hidden">
        {data.map((row, index) => (
          <li key={index} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-[#112D4E]">{row.barang}</p>
                <p className="mt-0.5 break-all text-xs font-semibold text-[#3F72AF]">{row.transaction_number}</p>
              </div>
              <span className="shrink-0 text-sm font-extrabold text-[#112D4E]">{row.qty} unit</span>
            </div>
            <div className="mt-2 flex items-start justify-between gap-3 text-xs">
              <span className="min-w-0 break-words text-[#50688C]">{row.note || "-"}</span>
              <span className="shrink-0 text-[#50688C]">{formatTanggalIndo(row.date)}</span>
            </div>z
          </li>
        ))}
      </ul>

      {/* Tablet & desktop: tabel */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="bg-[#F9F7F7] text-xs uppercase tracking-wide text-[#50688C]">
              <th className="px-6 py-3 font-semibold">No. Transaksi</th>
              <th className="px-4 py-3 font-semibold">Tanggal</th>
              <th className="px-4 py-3 font-semibold">Barang</th>
              <th className="px-4 py-3 font-semibold">Qty</th>
              <th className="px-6 py-3 font-semibold">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {data.map((row, index) => (
              <tr key={index} className="text-[#112D4E] transition-colors hover:bg-[#F9F7F7]">
                <td className="whitespace-nowrap px-6 py-3.5 font-semibold">{row.transaction_number}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[#50688C]">{formatTanggalIndo(row.date)}</td>
                <td className="px-4 py-3.5 font-medium">{row.barang}</td>
                <td className="whitespace-nowrap px-4 py-3.5 font-bold">{row.qty} unit</td>
                <td className="px-6 py-3.5 text-[#50688C]">{row.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}