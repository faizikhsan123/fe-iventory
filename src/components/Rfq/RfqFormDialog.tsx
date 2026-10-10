import { useId, useState, type ReactNode } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FormAlert from "../common/FormAlert";
import { useRfqActions, type Rfq, type RfqForm, type RfqOptions } from "@/hooks/Rfq/useRfq";
import { RFQ_STATUSES } from "@/lib/rfq";
import { inputClass, labelClass, selectClass, textareaClass } from "@/lib/formStyles";

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (): RfqForm => ({
  enquiry_no: "",
  rfq_date: today(),
  type: "",
  source: "",
  area: "",
  opportunity_name: "",
  description: "",
  customer_ref: "",
  quote_no: "",
  customer: "",
  contact_name: "",
  contact_phone: "",
  supplier: "",
  has_supplier_quote: false,
  has_brochure: false,
  has_drawing: false,
  status: "pending",
  priority_code: "",
  po_received: false,
  po_number: "",
  current_pic: "",
  action_plan: "",
  deadline: "",
  amount: "",
});

const toForm = (rfq: Rfq | null): RfqForm =>
  rfq
    ? {
        enquiry_no: rfq.enquiry_no,
        rfq_date: rfq.rfq_date,
        type: rfq.type ?? "",
        source: rfq.source ?? "",
        area: rfq.area ?? "",
        opportunity_name: rfq.opportunity_name,
        description: rfq.description ?? "",
        customer_ref: rfq.customer_ref ?? "",
        quote_no: rfq.quote_no ?? "",
        customer: rfq.customer,
        contact_name: rfq.contact_name ?? "",
        contact_phone: rfq.contact_phone ?? "",
        supplier: rfq.supplier ?? "",
        has_supplier_quote: rfq.has_supplier_quote,
        has_brochure: rfq.has_brochure,
        has_drawing: rfq.has_drawing,
        status: rfq.status,
        priority_code: rfq.priority_code,
        po_received: rfq.po_received,
        po_number: rfq.po_number ?? "",
        current_pic: rfq.current_pic ?? "",
        action_plan: rfq.action_plan ?? "",
        deadline: rfq.deadline ?? "",
        amount: rfq.amount != null ? String(rfq.amount) : "",
      }
    : emptyForm();

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <fieldset className="space-y-4 rounded-lg border border-[#DBE2EF] p-4">
    <legend className="px-2 text-xs font-bold uppercase tracking-wide text-[#3F72AF]">{title}</legend>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  </fieldset>
);

const Field = ({
  label,
  required,
  span2,
  children,
}: {
  label: string;
  required?: boolean;
  span2?: boolean;
  children: ReactNode;
}) => (
  <label className={`space-y-2 ${span2 ? "sm:col-span-2" : ""}`}>
    <span className={labelClass}>
      {label} {required && <span className="text-[#B3261E]">*</span>}
    </span>
    {children}
  </label>
);

const Check = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#112D4E]">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-[#BFCCE3] accent-[#112D4E]"
    />
    {label}
  </label>
);

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: Rfq | null; // null = tambah
  options: RfqOptions;
  onSuccess: () => void;
};

// Dipasang di dalam DialogContent: state awal selalu segar dari props tiap dialog dibuka.
function RfqFormBody({
  rfq,
  options,
  onClose,
  onSuccess,
}: {
  rfq: Rfq | null;
  options: RfqOptions;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = rfq !== null;
  const listId = useId();
  const { saving, save } = useRfqActions();
  const [form, setForm] = useState<RfqForm>(() => toForm(rfq));
  const [error, setError] = useState("");

  const set = <K extends keyof RfqForm>(key: K, value: RfqForm[K]) => setForm((f) => ({ ...f, [key]: value }));
  const text = (key: keyof RfqForm, placeholder?: string, list?: string) => (
    <Input
      className={inputClass}
      value={form[key] as string}
      onChange={(e) => set(key, e.target.value as RfqForm[typeof key])}
      placeholder={placeholder}
      list={list ? `${listId}-${list}` : undefined}
      disabled={saving}
    />
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rfq_date || !form.opportunity_name.trim() || !form.customer.trim() || !form.priority_code) {
      setError("Tanggal, opportunity, customer, dan prioritas wajib diisi");
      return;
    }
    setError("");
    const err = await save(form, rfq?.id);
    if (err) {
      setError(err);
      return;
    }
    onClose();
    onSuccess();
  };

  const datalist = (name: string, values: string[]) => (
    <datalist id={`${listId}-${name}`}>
      {values.map((v) => (
        <option key={v} value={v} />
      ))}
    </datalist>
  );

  return (
    <>
      <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div className="min-w-0 text-left">
            <DialogTitle className="text-lg font-extrabold text-[#112D4E]">{isEdit ? "Update RFQ" : "Tambah RFQ"}</DialogTitle>
            <DialogDescription className="mt-0.5 text-sm text-[#50688C]">Request for quotation</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {datalist("type", options.types)}
          {datalist("source", options.sources)}
          {datalist("area", options.areas)}
          {datalist("customer", options.customers)}
          {datalist("pic", options.pics)}

          <Section title="Enquiry">
            <Field label="Tanggal" required>
              <Input
                type="date"
                className={inputClass}
                value={form.rfq_date}
                onChange={(e) => set("rfq_date", e.target.value)}
                disabled={saving}
              />
            </Field>
            <Field label="Enquiry No.">{text("enquiry_no", isEdit ? "" : "Kosongkan = otomatis (RFQ20240112-001)")}</Field>
            <Field label="Type">{text("type", "Contoh: Dust Collector", "type")}</Field>
            <Field label="Source">{text("source", undefined, "source")}</Field>
            <Field label="Area" span2>
              {text("area", "Contoh: Tembagapura", "area")}
            </Field>
          </Section>

          <Section title="Opportunity">
            <Field label="Opportunity Name" required span2>
              {text("opportunity_name", "Contoh: Dust Collector at EI Building")}
            </Field>
            <Field label="Description Project" span2>
              <textarea
                className={textareaClass}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                maxLength={3000}
                disabled={saving}
              />
            </Field>
            <Field label="Customer Ref#">{text("customer_ref")}</Field>
            <Field label="Quote#">{text("quote_no")}</Field>
          </Section>

          <Section title="Customer & Supplier">
            <Field label="Customer" required span2>
              {text("customer", "Contoh: PT Radimatra Mitra Utama", "customer")}
            </Field>
            <Field label="Contact Person">{text("contact_name")}</Field>
            <Field label="Phone No.">{text("contact_phone")}</Field>
            <Field label="Supplier" span2>
              {text("supplier")}
            </Field>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:col-span-2">
              <span className={labelClass}>Customer Inquiry:</span>
              <Check label="Supplier Quote" checked={form.has_supplier_quote} onChange={(v) => set("has_supplier_quote", v)} />
              <Check label="Brochure" checked={form.has_brochure} onChange={(v) => set("has_brochure", v)} />
              <Check label="Drawing" checked={form.has_drawing} onChange={(v) => set("has_drawing", v)} />
            </div>
          </Section>

          <Section title="Status & Order">
            <Field label="Priority Code" required span2>
              <select
                className={selectClass}
                value={form.priority_code}
                onChange={(e) => set("priority_code", e.target.value)}
                disabled={saving}
              >
                <option value="">-- Pilih Prioritas --</option>
                {options.priorities.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.guide}
                    {p.pic ? ` (${p.pic})` : ""}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status" required>
              <select
                className={selectClass}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                disabled={saving}
              >
                {RFQ_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Current PIC">{text("current_pic", undefined, "pic")}</Field>
            <div className="sm:col-span-2">
              <Check label="Received Order (PO diterima)" checked={form.po_received} onChange={(v) => set("po_received", v)} />
            </div>
            {form.po_received && <Field label="PO#">{text("po_number")}</Field>}
          </Section>

          <Section title="Rencana">
            <Field label="Action Plan" span2>
              <textarea
                className={textareaClass}
                value={form.action_plan}
                onChange={(e) => set("action_plan", e.target.value)}
                maxLength={3000}
                disabled={saving}
              />
            </Field>
            <Field label="Deadline">
              <Input
                type="date"
                className={inputClass}
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                disabled={saving}
              />
            </Field>
            <Field label="Amount (Rp)">
              <Input
                type="number"
                min={0}
                inputMode="numeric"
                className={inputClass}
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0"
                disabled={saving}
              />
            </Field>
          </Section>

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
            ) : isEdit ? (
              "Update RFQ"
            ) : (
              "Tambah RFQ"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

const RfqFormDialog = ({ open, onOpenChange, rfq, options, onSuccess }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-3xl">
      <RfqFormBody rfq={rfq} options={options} onClose={() => onOpenChange(false)} onSuccess={onSuccess} />
    </DialogContent>
  </Dialog>
);

export default RfqFormDialog;
