import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Inbox, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import FormAlert from "../common/FormAlert";
import PerformanceReviewSection from "../employes/PerformanceReviewSection";
import { useAuth } from "@/hooks/auth/useAuth";
import { useContractDetail } from "@/hooks/Contract/useContract";
import { formatTanggalIndo } from "@/lib/tanggal";
import { expiringLabel, isExpiring } from "@/lib/contract";
import { compactInputClass } from "@/lib/formStyles";

const fmt = (d?: string | null) => (d ? formatTanggalIndo(d) : "-");
const score = (n?: number | null) => (n != null ? n.toFixed(2) : "-");

function StatCard({ label, value, hint, danger }: { label: string; value: string; hint?: string; danger?: boolean }) {
  return (
    <div
      className={`rounded-lg border p-4 shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl ${
        danger ? "border-[#F2B8B5] bg-[#FDECEA]" : "border-[#DBE2EF] bg-white"
      }`}
    >
      <p className="text-xs text-[#50688C]">{label}</p>
      <p className={`mt-1 text-lg font-extrabold ${danger ? "text-[#B3261E]" : "text-[#112D4E]"}`}>{value}</p>
      {hint && <p className={`mt-0.5 text-xs ${danger ? "font-semibold text-[#B3261E]" : "text-[#50688C]"}`}>{hint}</p>}
    </div>
  );
}

// ============================================================
// FORM PERPANJANG KONTRAK
// Dipasang di dalam DialogContent, jadi state-nya otomatis fresh tiap dialog dibuka.
// ============================================================
function RenewalForm({
  currentEnd,
  saving,
  onSubmit,
  onClose,
}: {
  currentEnd: string | null;
  saving: boolean;
  onSubmit: (payload: { new_end: string; note?: string }) => Promise<string | null>;
  onClose: () => void;
}) {
  const [newEnd, setNewEnd] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnd) {
      setError("Tanggal berakhir baru wajib diisi");
      return;
    }
    const err = await onSubmit({ new_end: newEnd, note: note.trim() || undefined });
    if (err) setError(err);
    else onClose();
  };

  return (
    <>
      <DialogHeader className="border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
        <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Perpanjang Kontrak</DialogTitle>
        <DialogDescription className="text-sm text-[#50688C]">Kontrak saat ini berakhir: {fmt(currentEnd)}</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4 p-4 sm:p-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-[#112D4E]">Berakhir Sampai *</span>
          <Input type="date" className={compactInputClass} value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-[#112D4E]">Catatan</span>
          <Input
            className={compactInputClass}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Opsional"
            maxLength={255}
          />
        </label>

        <FormAlert message={error} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={onClose}
            className="h-11 rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF]"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="h-11 gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Perpanjang"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

// ============================================================
// HALAMAN DETAIL CONTRACT
// ============================================================
const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = Boolean(user?.roles?.includes("admin"));
  const { data, loading, error, saving, reload, addRenewal, deleteRenewal } = useContractDetail(id);
  const [renewOpen, setRenewOpen] = useState(false);

  const handleDeleteRenewal = async (renewalId: number) => {
    const ok = await Swal.fire({
      title: "Hapus perpanjangan ini?",
      text: "Jika ini perpanjangan terakhir, tanggal berakhir kontrak dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!ok.isConfirmed) return;
    const err = await deleteRenewal(renewalId);
    if (err) Swal.fire("Gagal!", err, "error");
  };

  const BackButton = (
    <button
      onClick={() => navigate("/contracts")}
      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#BFCCE3] bg-white px-3 text-sm font-semibold text-[#112D4E] transition hover:bg-[#DBE2EF] active:scale-[0.98]"
    >
      <ArrowLeft size={16} />
      Kembali
    </button>
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-28 rounded-lg bg-[#DBE2EF]" />
        <div className="h-32 rounded-xl bg-[#DBE2EF]" />
        <div className="h-64 rounded-xl bg-[#DBE2EF]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        {BackButton}
        <div className="flex flex-col items-center gap-3 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-4 py-14 text-center sm:rounded-xl">
          <AlertCircle className="h-9 w-9 text-[#B3261E]" />
          <p className="max-w-md break-words text-sm font-medium text-[#B3261E]">{error || "Data tidak ditemukan"}</p>
          <button
            onClick={reload}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#F2B8B5] bg-white px-5 text-sm font-semibold text-[#B3261E] transition hover:bg-[#FDECEA] active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>{BackButton}</div>

      {/* ============ PROFIL ============ */}
      <div className="rounded-lg border border-[#DBE2EF] bg-white p-4 shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl sm:p-6">
        <h2 className="break-words text-xl font-extrabold text-[#112D4E] sm:text-2xl">{data.name}</h2>
        <p className="text-sm text-[#50688C]">
          {data.id_number} · {data.position} · {data.division}
        </p>
      </div>

      {/* ============ RINGKASAN ============ */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Contract When Joined" value={fmt(data.contract_start)} />
        <StatCard
          label="Contract Expired"
          value={fmt(data.contract_end)}
          danger={isExpiring(data.contract_end)}
          hint={expiringLabel(data.contract_end) ?? undefined}
        />
        <StatCard label="Perpanjangan Kontrak" value={`${data.renewals_count}x`} />
        <StatCard label="Average Score" value={score(data.average_score)} hint={`dari ${data.reviews_count} review`} />
      </div>

      {data.reviews_count > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Safety (rata-rata)" value={score(data.safety_score)} />
          <StatCard label="Production (rata-rata)" value={score(data.production_score)} />
          <StatCard label="Cost (rata-rata)" value={score(data.cost_score)} />
        </div>
      )}

      {/* ============ RIWAYAT PERPANJANGAN ============ */}
      <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
            <h3 className="font-bold text-[#112D4E]">Riwayat Perpanjangan Kontrak</h3>
          </div>
          {isAdmin && (
            <Button
              onClick={() => setRenewOpen(true)}
              className="h-9 gap-1.5 rounded-lg bg-[#112D4E] px-3 text-sm font-semibold text-white hover:bg-[#0B2240]"
            >
              <Plus size={16} /> Perpanjang Kontrak
            </Button>
          )}
        </div>

        {data.renewals.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#DBE2EF]">
              <Inbox className="h-6 w-6 text-[#3F72AF]" />
            </div>
            <p className="text-sm text-[#50688C]">Kontrak ini belum pernah diperpanjang</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#DBE2EF]">
            {data.renewals.map((r, i) => (
              <li key={r.id} className="flex items-center justify-between gap-3 p-4 sm:px-6">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#112D4E]">
                    Perpanjangan ke-{data.renewals.length - i}: {fmt(r.previous_end)} → {fmt(r.new_end)}
                  </p>
                  <p className="text-xs text-[#50688C]">
                    Dicatat {fmt(r.created_at)}
                    {r.note ? ` · ${r.note}` : ""}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRenewal(r.id)}
                    aria-label="Hapus perpanjangan"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#BFCCE3] bg-white hover:border-[#F2B8B5] hover:bg-[#FDECEA]"
                  >
                    <Trash2 size={16} className="text-[#B3261E]" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ============ PERFORMANCE REVIEW ============ */}
      {id && <PerformanceReviewSection employeId={id} onChange={reload} />}

      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent className="w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-md">
          <RenewalForm
            currentEnd={data.contract_end}
            saving={saving}
            onSubmit={addRenewal}
            onClose={() => setRenewOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractDetail;
