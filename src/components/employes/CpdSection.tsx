import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdCard, Loader2, SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import FormAlert from "../common/FormAlert";
import { CpdFields } from "./PpeCpdFields";
import { cpdToForm, useSaveCpd, type Cpd } from "@/hooks/employes/cpd";
import { CPD_FIELDS, cpdSchema, type CpdForm } from "@/schemas/cpd";
import { formatTanggalIndo } from "@/lib/tanggal";

type Props = {
  employeId: number;
  cpd?: Cpd | null;
  canEdit: boolean;
  onSaved: () => void;
};

// nik_ktp & npwp hanya tampil bila API mengirim key-nya (non-admin tidak menerimanya)
const visibleFields = (cpd?: Cpd | null) =>
  CPD_FIELDS.filter((f) => !("sensitive" in f && f.sensitive) || (cpd != null && f.name in cpd));

function CpdEditForm({ employeId, cpd, onCancel, onSaved }: Omit<Props, "canEdit"> & { onCancel: () => void }) {
  const form = useForm<CpdForm>({ resolver: zodResolver(cpdSchema), defaultValues: cpdToForm(cpd) });
  const { saving, save } = useSaveCpd();
  const [error, setError] = useState("");

  const submit = form.handleSubmit(async (values) => {
    setError("");
    // form edit hanya dibuka admin, jadi semua field CPD (termasuk NIK/NPWP) boleh dikirim
    const err = await save(employeId, values, CPD_FIELDS.map((f) => f.name as string));
    if (err) {
      setError(err);
      return;
    }
    onSaved();
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={submit} className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CpdFields prefix="" disabled={saving} />
        </div>
        <FormAlert message={error} />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={onCancel}
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
              "Simpan CPD"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

const CpdSection = ({ employeId, cpd, canEdit, onSaved }: Props) => {
  const [editing, setEditing] = useState(false);
  const fields = visibleFields(cpd);
  const hasData = cpd != null && fields.some((f) => cpd[f.name]);

  return (
    <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex items-center justify-between gap-2.5 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
          <h3 className="font-bold text-[#112D4E]">Data CPD</h3>
        </div>
        {canEdit && !editing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditing(true)}
            className="h-9 gap-1.5 rounded-lg border-[#BFCCE3] bg-white px-3 text-sm font-semibold text-[#112D4E] hover:bg-[#F9F7F7]"
          >
            <SquarePen size={14} /> Edit CPD
          </Button>
        )}
      </div>

      {editing ? (
        <CpdEditForm
          employeId={employeId}
          cpd={cpd}
          onCancel={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            onSaved();
          }}
        />
      ) : !hasData ? (
        <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#DBE2EF]">
            <IdCard className="h-6 w-6 text-[#3F72AF]" />
          </div>
          <p className="text-sm text-[#50688C]">Data CPD belum diisi</p>
        </div>
      ) : (
        <dl className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {fields.map((f) => {
            const raw = cpd?.[f.name];
            const value = raw ? (f.name === "date_of_birth" ? formatTanggalIndo(raw) : raw) : "-";
            return (
              <div
                key={f.name}
                className={`rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-3 ${"wide" in f && f.wide ? "sm:col-span-2 lg:col-span-3" : ""}`}
              >
                <dt className="text-xs text-[#50688C]">{f.label}</dt>
                <dd className="mt-0.5 break-words text-sm font-bold text-[#112D4E]">{value}</dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
};

export default CpdSection;
