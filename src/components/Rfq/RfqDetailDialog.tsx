import { useState } from "react";
import { Check, Loader2, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FormAlert from "../common/FormAlert";
import { PriorityBadge, StatusBadge } from "./RfqBadges";
import { useRfqActions, useRfqDetail, type Rfq, type RfqOptions } from "@/hooks/Rfq/useRfq";
import { formatTanggalIndo } from "@/lib/tanggal";
import { rupiah } from "@/lib/invoice";
import { compactInputClass, textareaClass } from "@/lib/formStyles";

const today = () => new Date().toISOString().slice(0, 10);
const fmt = (d?: string | null) => (d ? formatTanggalIndo(d) : "-");

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-3">
      <dt className="text-xs text-[#50688C]">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-bold text-[#112D4E]">{value || "-"}</dd>
    </div>
  );
}

function Flag({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        on ? "bg-[#112D4E] text-white ring-[#112D4E]" : "bg-[#F9F7F7] text-[#7B8FAE] ring-[#BFCCE3]"
      }`}
    >
      {on ? <Check size={12} /> : <X size={12} />}
      {label}
    </span>
  );
}

// Form tambah catatan progres (+ opsional ganti prioritas). Di-key dengan jumlah catatan agar reset setelah simpan.
function UpdateForm({
  rfq,
  options,
  onAdded,
}: {
  rfq: Rfq;
  options: RfqOptions;
  onAdded: () => void;
}) {
  const { saving, addUpdate } = useRfqActions();
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState(rfq.priority_code);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError("Catatan progres wajib diisi");
      return;
    }
    const err = await addUpdate(rfq.id, {
      update_date: date,
      note: note.trim(),
      priority_code: priority !== rfq.priority_code ? priority : undefined,
    });
    if (err) setError(err);
    else onAdded();
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-[#BFCCE3] p-4">
      <p className="text-sm font-bold text-[#112D4E]">Tambah Progres</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input type="date" className={compactInputClass} value={date} onChange={(e) => setDate(e.target.value)} disabled={saving} />
        <select className={compactInputClass} value={priority} onChange={(e) => setPriority(e.target.value)} disabled={saving}>
          {options.priorities.map((p) => (
            <option key={p.code} value={p.code}>
              {p.code} — {p.guide}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className={textareaClass}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Contoh: Need confirmation for technical data"
        maxLength={1000}
        disabled={saving}
      />
      <FormAlert message={error} />
      <Button
        type="submit"
        disabled={saving}
        className="h-10 gap-2 rounded-lg bg-[#112D4E] px-4 font-bold text-white hover:bg-[#0B2240]"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
          </>
        ) : (
          "Simpan Progres"
        )}
      </Button>
    </form>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfqId: number | null;
  options: RfqOptions;
  canEdit: boolean;
  onChanged: () => void;
};

function DetailBody({ rfqId, options, canEdit, onChanged }: Omit<Props, "open" | "onOpenChange">) {
  const { rfq, loading, error, reload } = useRfqDetail(rfqId);
  const { removeUpdate } = useRfqActions();

  const refresh = () => {
    reload();
    onChanged();
  };

  const handleDeleteUpdate = async (id: number) => {
    const ok = await Swal.fire({
      title: "Hapus catatan progres ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!ok.isConfirmed) return;
    const err = await removeUpdate(id);
    if (err) Swal.fire("Gagal!", err, "error");
    else refresh();
  };

  return (
    <>
      <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
        <DialogTitle className="break-words text-lg font-extrabold text-[#112D4E]">
          {rfq?.opportunity_name ?? "Detail RFQ"}
        </DialogTitle>
        <DialogDescription className="text-sm text-[#50688C]">{rfq?.enquiry_no ?? "Memuat..."}</DialogDescription>
      </DialogHeader>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
        {loading && <div className="h-40 animate-pulse rounded-lg bg-[#F9F7F7]" />}

        {rfq && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge code={rfq.priority_code} />
              <span className="text-sm text-[#112D4E]">
                {rfq.priority_guide}
                {rfq.priority_pic ? ` · PIC ${rfq.priority_pic}` : ""}
              </span>
              <StatusBadge status={rfq.status} />
            </div>

            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              <Info label="Tanggal" value={fmt(rfq.rfq_date)} />
              <Info label="Type" value={rfq.type ?? ""} />
              <Info label="Source" value={rfq.source ?? ""} />
              <Info label="Area" value={rfq.area ?? ""} />
              <Info label="Customer" value={rfq.customer} />
              <Info label="Contact Person" value={[rfq.contact_name, rfq.contact_phone].filter(Boolean).join(" · ")} />
              <Info label="Supplier" value={rfq.supplier ?? ""} />
              <Info label="Customer Ref#" value={rfq.customer_ref ?? ""} />
              <Info label="Quote#" value={rfq.quote_no ?? ""} />
              <Info label="PO#" value={rfq.po_received ? rfq.po_number || "Diterima" : "Belum"} />
              <Info label="Current PIC" value={rfq.current_pic ?? ""} />
              <Info label="Deadline" value={fmt(rfq.deadline)} />
              <Info label="Amount" value={rfq.amount != null ? rupiah(rfq.amount) : ""} />
            </dl>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#50688C]">Customer Inquiry:</span>
              <Flag label="Supplier Quote" on={rfq.has_supplier_quote} />
              <Flag label="Brochure" on={rfq.has_brochure} />
              <Flag label="Drawing" on={rfq.has_drawing} />
              <Flag label="Received Order" on={rfq.po_received} />
            </div>

            {rfq.description && (
              <div>
                <p className="mb-1 text-xs font-semibold text-[#50688C]">Description Project</p>
                <p className="whitespace-pre-line text-sm text-[#112D4E]">{rfq.description}</p>
              </div>
            )}

            {rfq.action_plan && (
              <div>
                <p className="mb-1 text-xs font-semibold text-[#50688C]">Action Plan</p>
                <p className="whitespace-pre-line text-sm text-[#112D4E]">{rfq.action_plan}</p>
              </div>
            )}

            {canEdit && <UpdateForm key={`${rfq.id}-${rfq.updates?.length ?? 0}`} rfq={rfq} options={options} onAdded={refresh} />}

            <div>
              <p className="mb-2 text-sm font-bold text-[#112D4E]">Riwayat Progres</p>
              {(rfq.updates ?? []).length === 0 ? (
                <p className="rounded-lg border border-dashed border-[#BFCCE3] px-4 py-6 text-center text-sm text-[#50688C]">
                  Belum ada catatan progres
                </p>
              ) : (
                <ol className="space-y-0 border-l-2 border-[#DBE2EF] pl-4">
                  {rfq.updates!.map((u) => (
                    <li key={u.id} className="relative pb-4 last:pb-0">
                      <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-[#3F72AF] ring-2 ring-white" />
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#50688C]">
                            {fmt(u.update_date)}
                            {u.priority_code ? ` · ${u.priority_code}` : ""}
                            {u.user ? ` · ${u.user}` : ""}
                          </p>
                          <p className="whitespace-pre-line text-sm text-[#112D4E]">{u.note}</p>
                        </div>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUpdate(u.id)}
                            aria-label="Hapus catatan progres"
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#BFCCE3] bg-white hover:border-[#F2B8B5] hover:bg-[#FDECEA]"
                          >
                            <Trash2 size={14} className="text-[#B3261E]" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </>
        )}

        <FormAlert message={error} />
      </div>
    </>
  );
}

const RfqDetailDialog = ({ open, onOpenChange, rfqId, options, canEdit, onChanged }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-3xl">
      <DetailBody rfqId={rfqId} options={options} canEdit={canEdit} onChanged={onChanged} />
    </DialogContent>
  </Dialog>
);

export default RfqDetailDialog;
