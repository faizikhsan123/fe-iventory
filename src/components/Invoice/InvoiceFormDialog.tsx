import { useState } from "react";
import { Loader2, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CurrencyInput } from "../ui/currency-input";
import FormAlert from "../common/FormAlert";
import { useInvoiceActions, type Invoice, type InvoiceForm } from "@/hooks/Invoice/useInvoice";
import { INVOICE_DIVISIONS } from "@/lib/invoice";
import { fieldBase, inputClass, labelClass, selectClass } from "@/lib/formStyles";

const emptyForm: InvoiceForm = {
  invoice_number: "",
  service_name: "",
  service_date: "",
  division: "",
  client: "",
  amount: "",
  invoice_date: "",
  notes: "",
};

const toForm = (invoice: Invoice | null): InvoiceForm =>
  invoice
    ? {
        invoice_number: invoice.invoice_number ?? "",
        service_name: invoice.service_name,
        service_date: invoice.service_date ?? "",
        division: invoice.division,
        client: invoice.client ?? "",
        amount: invoice.amount != null ? String(invoice.amount) : "",
        invoice_date: invoice.invoice_date ?? "",
        notes: invoice.notes ?? "",
      }
    : emptyForm;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null; // null = tambah
  onSuccess: () => void;
};

// Dipasang di dalam DialogContent: state awal selalu segar dari props tiap dialog dibuka.
function InvoiceFormBody({
  invoice,
  onClose,
  onSuccess,
}: {
  invoice: Invoice | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = invoice !== null;
  const { saving, save } = useInvoiceActions();
  const [form, setForm] = useState<InvoiceForm>(() => toForm(invoice));
  const [error, setError] = useState("");

  const set = <K extends keyof InvoiceForm>(key: K, value: InvoiceForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service_name.trim() || !form.division) {
      setError("Service description and division are required");
      return;
    }
    setError("");
    const err = await save(form, invoice?.id);
    if (err) {
      setError(err);
      return;
    }
    onClose();
    onSuccess();
  };

  return (
    <>
      <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
            <Receipt className="h-5 w-5" />
          </div>
          <div className="min-w-0 text-left">
            <DialogTitle className="text-lg font-extrabold text-[#112D4E]">
              {isEdit ? "Update Invoice" : "Add Invoice"}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-sm text-[#50688C]">Service invoice</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>
                Service Description <span className="text-[#B3261E]">*</span>
              </span>
              <Input
                className={inputClass}
                value={form.service_name}
                onChange={(e) => set("service_name", e.target.value)}
                placeholder="e.g. Routine analyzer service"
                disabled={saving}
              />
            </label>

            <label className="space-y-2">
              <span className={labelClass}>
                Division <span className="text-[#B3261E]">*</span>
              </span>
              <select
                className={selectClass}
                value={form.division}
                onChange={(e) => set("division", e.target.value)}
                disabled={saving}
              >
                <option value="">-- Select Division --</option>
                {/* invoice lama berdivisi Safety tetap bisa tampil agar select tidak kosong */}
                {form.division && !(INVOICE_DIVISIONS as readonly string[]).includes(form.division) && (
                  <option value={form.division}>{form.division} (legacy)</option>
                )}
                {INVOICE_DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className={labelClass}>Invoice No</span>
              <Input
                className={inputClass}
                value={form.invoice_number}
                onChange={(e) => set("invoice_number", e.target.value)}
                placeholder="Can be filled in later"
                disabled={saving}
              />
            </label>

            <label className="space-y-2">
              <span className={labelClass}>Client</span>
              <Input
                className={inputClass}
                value={form.client}
                onChange={(e) => set("client", e.target.value)}
                placeholder="e.g. PT Freeport Indonesia"
                disabled={saving}
              />
            </label>

            <label className="space-y-2">
              <span className={labelClass}>Amount (Rp)</span>
              <CurrencyInput
                className={inputClass}
                value={form.amount}
                onValueChange={(raw) => set("amount", raw)}
                placeholder="0"
                disabled={saving}
              />
            </label>

            <label className="space-y-2">
              <span className={labelClass}>Service Date</span>
              <Input
                type="date"
                className={inputClass}
                value={form.service_date}
                onChange={(e) => set("service_date", e.target.value)}
                disabled={saving}
              />
            </label>

            <label className="space-y-2">
              <span className={labelClass}>Invoice Submitted Date</span>
              <Input
                type="date"
                className={inputClass}
                value={form.invoice_date}
                onChange={(e) => set("invoice_date", e.target.value)}
                disabled={saving}
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>Notes</span>
              <textarea
                className={`min-h-20 py-2 ${fieldBase}`}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                maxLength={2000}
                disabled={saving}
              />
            </label>
          </div>

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
            ) : isEdit ? (
              "Update Invoice"
            ) : (
              "Add Invoice"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

const InvoiceFormDialog = ({ open, onOpenChange, invoice, onSuccess }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-xl">
      <InvoiceFormBody invoice={invoice} onClose={() => onOpenChange(false)} onSuccess={onSuccess} />
    </DialogContent>
  </Dialog>
);

export default InvoiceFormDialog;
