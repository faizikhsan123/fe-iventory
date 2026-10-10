import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FormAlert from "../common/FormAlert";
import InvoiceStepper from "./InvoiceStepper";
import { useInvoiceActions, useInvoiceDetail, type Invoice } from "@/hooks/Invoice/useInvoice";
import { INVOICE_STATUSES, rupiah, statusLabel } from "@/lib/invoice";
import { formatTanggalIndo } from "@/lib/tanggal";
import { compactInputClass } from "@/lib/formStyles";

const today = () => new Date().toISOString().slice(0, 10);

// Form ubah status. Di-key dengan status invoice, jadi otomatis reset setelah status berganti.
function StatusForm({ invoice, onUpdated }: { invoice: Invoice; onUpdated: () => void }) {
  const { saving, updateStatus } = useInvoiceActions();
  const [status, setStatus] = useState(invoice.status);
  const [statusDate, setStatusDate] = useState(today);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === invoice.status) {
      setError("Pilih tahapan yang berbeda dari status saat ini");
      return;
    }
    const err = await updateStatus(invoice.id, { status, status_date: statusDate, note: note.trim() || undefined });
    if (err) setError(err);
    else onUpdated();
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-[#BFCCE3] p-4">
      <p className="text-sm font-bold text-[#112D4E]">Update Status</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select className={compactInputClass} value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving}>
          {INVOICE_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label} — {s.hint}
            </option>
          ))}
        </select>
        <Input
          type="date"
          className={compactInputClass}
          value={statusDate}
          onChange={(e) => setStatusDate(e.target.value)}
          disabled={saving}
        />
        <Input
          className={`${compactInputClass} sm:col-span-2`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Catatan (opsional)"
          maxLength={255}
          disabled={saving}
        />
      </div>
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
          "Simpan Status"
        )}
      </Button>
    </form>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: number | null;
  canEdit: boolean;
  onChanged: () => void;
};

function DetailBody({ invoiceId, canEdit, onChanged }: Omit<Props, "open" | "onOpenChange">) {
  const { invoice, loading, error, reload } = useInvoiceDetail(invoiceId);

  const handleUpdated = () => {
    reload();
    onChanged();
  };

  return (
    <>
      <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
        <DialogTitle className="break-words text-lg font-extrabold text-[#112D4E]">
          {invoice?.service_name ?? "Detail Invoice"}
        </DialogTitle>
        <DialogDescription className="text-sm text-[#50688C]">
          {invoice ? `${invoice.division}${invoice.invoice_number ? ` · ${invoice.invoice_number}` : ""}` : "Memuat..."}
        </DialogDescription>
      </DialogHeader>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
        {loading && <div className="h-40 animate-pulse rounded-lg bg-[#F9F7F7]" />}

        {invoice && (
          <>
            <InvoiceStepper status={invoice.status} />

            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Status", statusLabel(invoice.status)],
                ["Client", invoice.client || "-"],
                ["Nilai", rupiah(invoice.amount)],
                ["Tanggal Jasa", invoice.service_date ? formatTanggalIndo(invoice.service_date) : "-"],
                ["Tanggal invoice submit", invoice.invoice_date ? formatTanggalIndo(invoice.invoice_date) : "-"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-3">
                  <dt className="text-xs text-[#50688C]">{k}</dt>
                  <dd className="mt-0.5 break-words font-bold text-[#112D4E]">{v}</dd>
                </div>
              ))}
            </dl>

            {invoice.service_description && (
              <div>
                <p className="mb-1 text-xs font-semibold text-[#50688C]">Deskripsi Jasa</p>
                <p className="whitespace-pre-line break-words text-sm text-[#112D4E]">{invoice.service_description}</p>
              </div>
            )}

            {invoice.notes && <p className="whitespace-pre-line text-sm text-[#112D4E]">{invoice.notes}</p>}

            {canEdit && <StatusForm key={invoice.status} invoice={invoice} onUpdated={handleUpdated} />}

            <div>
              <p className="mb-2 text-sm font-bold text-[#112D4E]">Riwayat Status</p>
              <ol className="space-y-0 border-l-2 border-[#DBE2EF] pl-4">
                {[...(invoice.logs ?? [])].reverse().map((l) => (
                  <li key={l.id} className="relative pb-4 last:pb-0">
                    <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-[#3F72AF] ring-2 ring-white" />
                    <p className="text-sm font-semibold text-[#112D4E]">{statusLabel(l.status)}</p>
                    <p className="text-xs text-[#50688C]">
                      {formatTanggalIndo(l.status_date)}
                      {l.user?.name ? ` · ${l.user.name}` : ""}
                      {l.note ? ` · ${l.note}` : ""}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}

        <FormAlert message={error} />
      </div>
    </>
  );
}

const InvoiceDetailDialog = ({ open, onOpenChange, invoiceId, canEdit, onChanged }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-2xl">
      <DetailBody invoiceId={invoiceId} canEdit={canEdit} onChanged={onChanged} />
    </DialogContent>
  </Dialog>
);

export default InvoiceDetailDialog;
