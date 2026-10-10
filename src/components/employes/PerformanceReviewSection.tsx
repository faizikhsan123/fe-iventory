import { memo, useState } from "react";
import { ChevronDown, Inbox, Loader2, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FormAlert from "../common/FormAlert";
import { useAuth } from "@/hooks/auth/useAuth";
import { formatTanggalIndo } from "@/lib/tanggal";
import { KRA, KRA_KEYS, SCORE_REFERENCE, average, type KraKey } from "@/lib/kra";
import { compactInputClass } from "@/lib/formStyles";
import usePerformanceReview, {
  type PerformanceReview,
  type PerformanceReviewPayload,
} from "@/hooks/PerformanceReview/usePerformanceReview";

const labelClass = "text-sm font-semibold text-[#112D4E]";
const avgText = (n: number) => n.toFixed(2);

type Scores = Record<KraKey, number[]>;

const emptyScores = (): Scores => ({
  safety: Array(KRA.safety.items.length).fill(0),
  production: Array(KRA.production.items.length).fill(0),
  cost: Array(KRA.cost.items.length).fill(0),
});

// ============================================================
// FORM (dipasang di dalam DialogContent: state awal segar tiap dialog dibuka)
// ============================================================
function ReviewFormBody({
  defaultProject,
  saving,
  onSubmit,
  onClose,
}: {
  defaultProject: string;
  saving: boolean;
  onSubmit: (payload: PerformanceReviewPayload) => Promise<string | null>;
  onClose: () => void;
}) {
  const [project, setProject] = useState(defaultProject);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerTitle, setReviewerTitle] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [scores, setScores] = useState<Scores>(emptyScores);
  const [error, setError] = useState("");

  const setScore = (key: KraKey, i: number, value: number) =>
    setScores((s) => ({ ...s, [key]: s[key].map((v, idx) => (idx === i ? value : v)) }));

  const avgOf = (key: KraKey) => (scores[key].every((v) => v > 0) ? average(scores[key]) : null);
  const allAvg = KRA_KEYS.map(avgOf);
  const overall = allAvg.every((v) => v !== null) ? average(allAvg as number[]) : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodStart || !periodEnd || !reviewerName.trim() || !reviewDate) {
      setError("Periode, nama reviewer, dan tanggal review wajib diisi");
      return;
    }
    if (KRA_KEYS.some((k) => scores[k].some((v) => v < 1))) {
      setError("Semua nilai KRA wajib diisi (1-5)");
      return;
    }
    setError("");
    const err = await onSubmit({
      project: project.trim() || undefined,
      period_start: periodStart,
      period_end: periodEnd,
      reviewer_name: reviewerName.trim(),
      reviewer_title: reviewerTitle.trim() || undefined,
      review_date: reviewDate,
      scores,
    });
    if (err) setError(err);
    else onClose();
  };

  return (
    <>
      <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
        <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Tambah Performance Review</DialogTitle>
        <DialogDescription className="text-sm text-[#50688C]">
          Skala:{" "}
          {Object.entries(SCORE_REFERENCE)
            .map(([n, t]) => `${n} = ${t}`)
            .join(" · ")}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className={labelClass}>Project</span>
              <Input
                className={compactInputClass}
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="I&C Maintenance at PMR"
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Periode Mulai *</span>
              <Input type="date" className={compactInputClass} value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Periode Selesai *</span>
              <Input type="date" className={compactInputClass} value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Nama Reviewer *</span>
              <Input
                className={compactInputClass}
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Nama penilai"
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Jabatan Reviewer</span>
              <Input
                className={compactInputClass}
                value={reviewerTitle}
                onChange={(e) => setReviewerTitle(e.target.value)}
                placeholder="SPV / Lead SPV"
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Tanggal Review *</span>
              <Input type="date" className={compactInputClass} value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
            </label>
          </div>

          {KRA_KEYS.map((key) => {
            const avg = avgOf(key);
            return (
              <div key={key} className="overflow-hidden rounded-lg border border-[#DBE2EF]">
                <div className="flex items-center justify-between bg-[#DBE2EF] px-4 py-2.5">
                  <h4 className="text-sm font-bold uppercase text-[#112D4E]">{KRA[key].label}</h4>
                  <span className="text-xs font-semibold text-[#50688C]">Average: {avg !== null ? avgText(avg) : "-"}</span>
                </div>
                <ul className="divide-y divide-[#EBEFF6]">
                  {KRA[key].items.map((item, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-4 py-2">
                      <span className="min-w-0 text-sm text-[#112D4E]">
                        <span className="mr-2 text-[#50688C]">{i + 1}.</span>
                        {item}
                      </span>
                      <select
                        aria-label={`${KRA[key].label} ${i + 1}`}
                        value={scores[key][i]}
                        onChange={(e) => setScore(key, i, Number(e.target.value))}
                        className="h-9 w-20 shrink-0 rounded-lg border border-[#BFCCE3] bg-white px-2 text-center text-sm text-[#112D4E]"
                      >
                        <option value={0}>-</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <p className="text-right text-sm font-bold text-[#112D4E]">
            Overall Average: {overall !== null ? avgText(overall) : "-"}
          </p>

          <FormAlert message={error} />
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:flex-row sm:justify-end sm:px-6">
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
              "Simpan Review"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

// ============================================================
// SATU REVIEW (bisa dibuka untuk lihat nilai per KRA)
// ============================================================
const ReviewItem = memo(function ReviewItem({
  review,
  isAdmin,
  onDelete,
}: {
  review: PerformanceReview;
  isAdmin: boolean;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const avgs: [string, number][] = [
    ["Safety", review.safety_avg],
    ["Production", review.production_avg],
    ["Cost", review.cost_avg],
  ];

  return (
    <li className="p-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#112D4E]">
            {formatTanggalIndo(review.period_start)} - {formatTanggalIndo(review.period_end)}
          </p>
          <p className="text-xs text-[#50688C]">
            {review.reviewer_name}
            {review.reviewer_title ? ` (${review.reviewer_title})` : ""} · {formatTanggalIndo(review.review_date)}
            {review.project ? ` · ${review.project}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {avgs.map(([label, v]) => (
            <span
              key={label}
              className="rounded-full bg-[#F9F7F7] px-2.5 py-0.5 text-xs font-semibold text-[#112D4E] ring-1 ring-inset ring-[#BFCCE3]"
            >
              {label} {avgText(v)}
            </span>
          ))}
          <span className="rounded-full bg-[#112D4E] px-3 py-0.5 text-xs font-bold text-white">
            Total {avgText(review.overall_avg)}
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Lihat detail nilai"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#BFCCE3] bg-white text-[#112D4E] hover:bg-[#DBE2EF]"
          >
            <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => onDelete(review.id)}
              aria-label="Hapus review"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#BFCCE3] bg-white hover:border-[#F2B8B5] hover:bg-[#FDECEA]"
            >
              <Trash2 size={16} className="text-[#B3261E]" />
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          {KRA_KEYS.map((key) => (
            <div key={key} className="overflow-hidden rounded-lg border border-[#DBE2EF]">
              <p className="bg-[#DBE2EF] px-4 py-2 text-xs font-bold uppercase text-[#112D4E]">{KRA[key].label}</p>
              <ul className="divide-y divide-[#EBEFF6]">
                {KRA[key].items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 px-4 py-1.5 text-sm text-[#112D4E]">
                    <span>
                      <span className="mr-2 text-[#50688C]">{i + 1}.</span>
                      {item}
                    </span>
                    <span className="font-bold">{review.scores[key][i]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </li>
  );
});

// ============================================================
// SECTION (dipakai di halaman detail contract)
// ============================================================
const PerformanceReviewSection = ({
  employeId,
  defaultProject = "",
  onChange,
}: {
  employeId: string;
  defaultProject?: string;
  onChange?: () => void;
}) => {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.roles?.includes("admin"));
  const { data, loading, error, saving, createReview, deleteReview } = usePerformanceReview(employeId);
  const [formOpen, setFormOpen] = useState(false);

  const handleDelete = async (id: number) => {
    const ok = await Swal.fire({
      title: "Hapus review ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!ok.isConfirmed) return;
    const err = await deleteReview(id);
    if (err) Swal.fire("Gagal!", err, "error");
    else onChange?.();
  };

  const handleCreate = async (payload: PerformanceReviewPayload) => {
    const err = await createReview(payload);
    if (!err) onChange?.();
    return err;
  };

  return (
    <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex items-center justify-between gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
          <h3 className="font-bold text-[#112D4E]">Performance Review</h3>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setFormOpen(true)}
            className="h-9 gap-1.5 rounded-lg bg-[#112D4E] px-3 text-sm font-semibold text-white hover:bg-[#0B2240]"
          >
            <Plus size={16} /> Tambah Review
          </Button>
        )}
      </div>

      {loading && <div className="h-24 animate-pulse bg-[#F9F7F7]" />}

      {error && <p className="px-4 py-8 text-center text-sm font-medium text-[#B3261E]">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#DBE2EF]">
            <Inbox className="h-6 w-6 text-[#3F72AF]" />
          </div>
          <p className="text-sm text-[#50688C]">Belum ada performance review untuk karyawan ini</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <ul className="divide-y divide-[#DBE2EF]">
          {data.map((r) => (
            <ReviewItem key={r.id} review={r} isAdmin={isAdmin} onDelete={handleDelete} />
          ))}
        </ul>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-3xl">
          <ReviewFormBody
            defaultProject={defaultProject}
            saving={saving}
            onSubmit={handleCreate}
            onClose={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PerformanceReviewSection;
