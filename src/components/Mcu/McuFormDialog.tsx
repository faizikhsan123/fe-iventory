import { useState } from "react";
import { Loader2, Stethoscope } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FormAlert from "../common/FormAlert";
import { STORAGE_URL } from "@/lib/axios";
import {
  MCU_DOC_MAX_BYTES,
  MCU_DOC_TYPES,
  useEmployeeOptions,
  useMcuActions,
  type Mcu,
  type McuForm,
} from "@/hooks/Mcu/useMcu";
import { fileClass, inputClass, labelClass, selectClass, textareaClass } from "@/lib/formStyles";

const emptyForm: McuForm = {
  employes_id: "",
  place_name: "",
  mcu_name: "",
  mcu_date: "",
  next_mcu_date: "",
  allergies: "",
  summary: "",
  document: null,
  document_2: null,
  remove_document: false,
  remove_document_2: false,
};

const toForm = (mcu: Mcu | null): McuForm =>
  mcu
    ? {
        employes_id: String(mcu.employes_id),
        place_name: mcu.place_name,
        mcu_name: mcu.mcu_name ?? "",
        mcu_date: mcu.mcu_date,
        next_mcu_date: mcu.next_mcu_date ?? "",
        allergies: mcu.allergies ?? "",
        summary: mcu.summary ?? "",
        document: null,
        document_2: null,
        remove_document: false,
        remove_document_2: false,
      }
    : emptyForm;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mcu: Mcu | null; // null = tambah, ada isi = edit
  onSuccess: () => void;
};

// Satu slot dokumen: link file lama, opsi hapus, dan input file baru (opsional).
function DocField({
  label,
  current,
  file,
  remove,
  disabled,
  onFile,
  onRemove,
}: {
  label: string;
  current: string | null;
  file: File | null;
  remove: boolean;
  disabled: boolean;
  onFile: (file: File | null) => void;
  onRemove: (remove: boolean) => void;
}) {
  return (
    <div className="space-y-2 sm:col-span-2">
      <label className="block space-y-2">
        <span className={labelClass}>{label}</span>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className={fileClass}
          disabled={disabled}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <p className="text-xs text-[#50688C]">
        PDF / JPG / PNG, maksimal 5 MB, opsional.
        {current && (
          <>
            {" "}
            File saat ini:{" "}
            <a
              href={`${STORAGE_URL}${current}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#3F72AF] underline"
            >
              lihat
            </a>
            {file ? ". Akan diganti file baru." : ". Pilih file baru untuk mengganti."}
          </>
        )}
      </p>
      {current && !file && (
        <label className="flex min-h-9 cursor-pointer items-center gap-2 text-sm text-[#112D4E]">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#B3261E]"
            checked={remove}
            disabled={disabled}
            onChange={(e) => onRemove(e.target.checked)}
          />
          Hapus file saat ini
        </label>
      )}
    </div>
  );
}

// Form dipasang di dalam DialogContent: terpasang saat dialog dibuka, sehingga state awal
// selalu segar dari props (tanpa effect untuk reset).
function McuFormBody({ mcu, onClose, onSuccess }: { mcu: Mcu | null; onClose: () => void; onSuccess: () => void }) {
  const isEdit = mcu !== null;
  const employees = useEmployeeOptions();
  const { saving, save } = useMcuActions();
  const [form, setForm] = useState<McuForm>(() => toForm(mcu));
  const [error, setError] = useState("");

  const set = <K extends keyof McuForm>(key: K, value: McuForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employes_id || !form.place_name.trim() || !form.mcu_date) {
      setError("Karyawan, nama tempat, dan tanggal MCU wajib diisi");
      return;
    }
    for (const file of [form.document, form.document_2]) {
      if (!file) continue;
      if (!MCU_DOC_TYPES.includes(file.type)) {
        setError("Dokumen harus berupa PDF, JPG, atau PNG");
        return;
      }
      if (file.size > MCU_DOC_MAX_BYTES) {
        setError("Ukuran dokumen maksimal 5 MB");
        return;
      }
    }
    if (form.next_mcu_date && form.next_mcu_date < form.mcu_date) {
      setError("Tanggal MCU berikutnya tidak boleh sebelum tanggal MCU");
      return;
    }
    setError("");
    const err = await save(form, mcu?.id);
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
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="min-w-0 text-left">
            <DialogTitle className="text-lg font-extrabold text-[#112D4E]">
              {isEdit ? "Update Data MCU" : "Tambah Data MCU"}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-sm text-[#50688C]">Medical check up karyawan</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>
                Karyawan <span className="text-[#B3261E]">*</span>
              </span>
              <select
                className={selectClass}
                value={form.employes_id}
                onChange={(e) => set("employes_id", e.target.value)}
                disabled={saving}
              >
                <option value="">-- Pilih Karyawan --</option>
                {employees.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.id_number})
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className={labelClass}>
                Nama Tempat <span className="text-[#B3261E]">*</span>
              </span>
              <Input
                className={inputClass}
                value={form.place_name}
                onChange={(e) => set("place_name", e.target.value)}
                placeholder="Klinik / rumah sakit"
                disabled={saving}
              />
            </label>

            <label className="space-y-2">
              <span className={labelClass}>MCU</span>
              <Input
                className={inputClass}
                value={form.mcu_name}
                onChange={(e) => set("mcu_name", e.target.value)}
                placeholder="Contoh: MCU Tahunan"
                disabled={saving}
              />
            </label>

            <label className="space-y-2">
              <span className={labelClass}>
                Tanggal MCU <span className="text-[#B3261E]">*</span>
              </span>
              <Input
                type="date"
                className={inputClass}
                value={form.mcu_date}
                onChange={(e) => set("mcu_date", e.target.value)}
                disabled={saving}
              />
            </label>

            <label className="space-y-2">
              <span className={labelClass}>MCU Selanjutnya</span>
              <Input
                type="date"
                className={inputClass}
                value={form.next_mcu_date}
                onChange={(e) => set("next_mcu_date", e.target.value)}
                disabled={saving}
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>Alergi</span>
              <Input
                className={inputClass}
                value={form.allergies}
                onChange={(e) => set("allergies", e.target.value)}
                placeholder="Kosongkan jika tidak ada"
                disabled={saving}
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>Summary Singkat</span>
              <textarea
                className={textareaClass}
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
                placeholder="Ringkasan hasil MCU"
                maxLength={2000}
                disabled={saving}
              />
            </label>

            <DocField
              label="Dokumen Pendukung 1"
              current={mcu?.document ?? null}
              file={form.document}
              remove={form.remove_document}
              disabled={saving}
              onFile={(f) => setForm((p) => ({ ...p, document: f, remove_document: f ? false : p.remove_document }))}
              onRemove={(v) => set("remove_document", v)}
            />

            <DocField
              label="Dokumen Pendukung 2"
              current={mcu?.document_2 ?? null}
              file={form.document_2}
              remove={form.remove_document_2}
              disabled={saving}
              onFile={(f) =>
                setForm((p) => ({ ...p, document_2: f, remove_document_2: f ? false : p.remove_document_2 }))
              }
              onRemove={(v) => set("remove_document_2", v)}
            />
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
              "Update MCU"
            ) : (
              "Tambah MCU"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

const McuFormDialog = ({ open, onOpenChange, mcu, onSuccess }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className={`flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-2xl`}
    >
      <McuFormBody mcu={mcu} onClose={() => onOpenChange(false)} onSuccess={onSuccess} />
    </DialogContent>
  </Dialog>
);

export default McuFormDialog;
