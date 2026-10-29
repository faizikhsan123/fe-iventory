import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Inbox, Loader2, LogOut, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import FormAlert from "../common/FormAlert";
import PerformanceReviewSection from "../employes/PerformanceReviewSection";
import { useAuth } from "@/hooks/auth/useAuth";
import { useContractDetail } from "@/hooks/Contract/useContract";
import { formatTanggalIndo } from "@/lib/tanggal";
import { expiringLabel, isExpiring } from "@/lib/contract";
import { compactInputClass } from "@/lib/formStyles";

const fmt = (d?: string | null) => (d ? formatTanggalIndo(d) : "-");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
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
// CONTRACT RENEWAL FORM
// Mounted inside DialogContent, so its state is fresh each time the dialog opens.
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
      setError("New end date is required");
      return;
    }
    const err = await onSubmit({ new_end: newEnd, note: note.trim() || undefined });
    if (err) setError(err);
    else onClose();
  };

  return (
    <>
      <DialogHeader className="border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
        <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Renew Contract</DialogTitle>
        <DialogDescription className="text-sm text-[#50688C]">Current contract ends: {fmt(currentEnd)}</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4 p-4 sm:p-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-[#112D4E]">Extended Until *</span>
          <Input type="date" className={compactInputClass} value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-[#112D4E]">Notes</span>
          <Input
            className={compactInputClass}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional"
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
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="h-11 gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Renew"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

// ============================================================
// RESIGNATION FORM (react-hook-form + zod)
// ============================================================
const resignSchema = z.object({
  resign_date: z.string().min(1, "Resignation date is required"),
  reason: z.string().trim().min(1, "Reason is required").max(255, "Maximum 255 characters"),
});
type ResignValues = z.infer<typeof resignSchema>;

function ResignForm({
  name,
  saving,
  onSubmit,
  onClose,
}: {
  name: string;
  saving: boolean;
  onSubmit: (payload: ResignValues) => Promise<string | null>;
  onClose: () => void;
}) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResignValues>({ resolver: zodResolver(resignSchema), defaultValues: { resign_date: "", reason: "" } });

  const submit = handleSubmit(async (values) => {
    setServerError("");
    const ok = await Swal.fire({
      title: `Process resignation for ${name}?`,
      text:
        values.resign_date > todayStr()
          ? "Resignation is scheduled; status changes to Deactive on that date."
          : "The employee will be set to Deactive immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, process",
      cancelButtonText: "Cancel",
    });
    if (!ok.isConfirmed) return;
    const err = await onSubmit({ resign_date: values.resign_date, reason: values.reason.trim() });
    if (err) setServerError(err);
    else onClose();
  });

  return (
    <>
      <DialogHeader className="border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
        <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Employee Resignation</DialogTitle>
        <DialogDescription className="text-sm text-[#50688C]">{name}</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} noValidate className="space-y-4 p-4 sm:p-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-[#112D4E]">Resignation Date *</span>
          <Input
            type="date"
            className={compactInputClass}
            aria-invalid={Boolean(errors.resign_date)}
            {...register("resign_date")}
          />
          {errors.resign_date && <span className="text-xs text-[#B3261E]">{errors.resign_date.message}</span>}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-[#112D4E]">Reason *</span>
          <Textarea rows={3} maxLength={255} aria-invalid={Boolean(errors.reason)} {...register("reason")} />
          {errors.reason && <span className="text-xs text-[#B3261E]">{errors.reason.message}</span>}
        </label>

        <FormAlert message={serverError} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={onClose}
            className="h-11 rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="h-11 gap-2 rounded-lg bg-[#B3261E] px-5 font-bold text-white hover:bg-[#8F1F18]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Resign"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

// ============================================================
// CONTRACT DETAIL PAGE
// ============================================================
const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data, loading, error, saving, reload, addRenewal, deleteRenewal, resign } = useContractDetail(id);
  const [renewOpen, setRenewOpen] = useState(false);
  const [resignOpen, setResignOpen] = useState(false);

  // oldest first, newest at the bottom (stable: date, then id)
  const sortedRenewals = useMemo(
    () =>
      [...(data?.renewals ?? [])].sort((a, b) => {
        const ta = Date.parse(a.created_at ?? "") || 0;
        const tb = Date.parse(b.created_at ?? "") || 0;
        return ta - tb || a.id - b.id;
      }),
    [data?.renewals],
  );

  const handleDeleteRenewal = async (renewalId: number) => {
    const ok = await Swal.fire({
      title: "Delete this renewal?",
      text: "If this is the latest renewal, the contract end date will be reverted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (!ok.isConfirmed) return;
    const err = await deleteRenewal(renewalId);
    if (err) Swal.fire("Failed!", err, "error");
  };

  const BackButton = (
    <button
      onClick={() => navigate("/contracts")}
      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#BFCCE3] bg-white px-3 text-sm font-semibold text-[#112D4E] transition hover:bg-[#DBE2EF] active:scale-[0.98]"
    >
      <ArrowLeft size={16} />
      Back
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
          <p className="max-w-md break-words text-sm font-medium text-[#B3261E]">{error || "Data not found"}</p>
          <button
            onClick={reload}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#F2B8B5] bg-white px-5 text-sm font-semibold text-[#B3261E] transition hover:bg-[#FDECEA] active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const isActive = String(data.status).toLowerCase() === "active";
  const canResign = isAdmin && isActive && !data.left_at;
  const isScheduled = Boolean(data.left_at) && data.left_at!.slice(0, 10) > todayStr();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>{BackButton}</div>

      {/* ============ PROFIL ============ */}
      <div className="rounded-lg border border-[#DBE2EF] bg-white p-4 shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-extrabold text-[#112D4E] sm:text-2xl">{data.name}</h2>
            <p className="text-sm text-[#50688C]">
              {data.id_number} · {data.position} · {data.division}
            </p>
          </div>
          {canResign && (
            <Button
              onClick={() => setResignOpen(true)}
              variant="outline"
              className="h-9 gap-1.5 rounded-lg border-[#F2B8B5] bg-white px-3 text-sm font-semibold text-[#B3261E] hover:bg-[#FDECEA]"
            >
              <LogOut size={16} /> Resign
            </Button>
          )}
        </div>
        {(data.left_at || data.exit_type === "contract_ended") && (
          <div className="mt-4 space-y-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] p-3 text-sm text-[#112D4E]">
            <div className="flex flex-wrap items-center gap-2">
              {data.left_at && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isScheduled ? "bg-[#FFF4D6] text-[#8A5A00]" : "bg-[#B3261E] text-white"
                  }`}
                >
                  {isScheduled ? "Scheduled resignation" : "Deactive"}
                </span>
              )}
              {data.exit_type === "contract_ended" && (
                <span className="rounded-full bg-[#DBE2EF] px-2.5 py-0.5 text-xs font-bold text-[#112D4E]">
                  Contract not renewed
                </span>
              )}
            </div>
            {data.left_at && (
              <p>
                <span className="font-semibold">Leave date:</span> {fmt(data.left_at)}
              </p>
            )}
            {data.resign_reason && (
              <p className="break-words">
                <span className="font-semibold">Reason:</span> {data.resign_reason}
              </p>
            )}
          </div>
        )}
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
        <StatCard label="Contract Renewals" value={`${data.renewals_count}x`} />
        <StatCard label="Average Score" value={score(data.average_score)} hint={`from ${data.reviews_count} review${data.reviews_count === 1 ? "" : "s"}`} />
      </div>

      {data.reviews_count > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Safety (average)" value={score(data.safety_score)} />
          <StatCard label="Production (average)" value={score(data.production_score)} />
          <StatCard label="Cost (average)" value={score(data.cost_score)} />
        </div>
      )}

      {/* ============ RIWAYAT PERPANJANGAN ============ */}
      <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
            <h3 className="font-bold text-[#112D4E]">Contract Renewal History</h3>
          </div>
          {isAdmin && (
            <Button
              onClick={() => setRenewOpen(true)}
              className="h-9 gap-1.5 rounded-lg bg-[#112D4E] px-3 text-sm font-semibold text-white hover:bg-[#0B2240]"
            >
              <Plus size={16} /> Renew Contract
            </Button>
          )}
        </div>

        {data.renewals.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#DBE2EF]">
              <Inbox className="h-6 w-6 text-[#3F72AF]" />
            </div>
            <p className="text-sm text-[#50688C]">This contract has not been renewed yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#DBE2EF]">
            {sortedRenewals.map((r, i) => (
              <li key={r.id} className="flex items-center justify-between gap-3 p-4 sm:px-6">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#112D4E]">
                    Renewal #{i + 1}: {fmt(r.previous_end)} → {fmt(r.new_end)}
                  </p>
                  <p className="text-xs text-[#50688C]">
                    Recorded {fmt(r.created_at)}
                    {r.note ? ` · ${r.note}` : ""}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRenewal(r.id)}
                    aria-label="Delete renewal"
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

      <Dialog open={resignOpen} onOpenChange={setResignOpen}>
        <DialogContent className="w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-md">
          <ResignForm name={data.name} saving={saving} onSubmit={resign} onClose={() => setResignOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractDetail;
