import { useFormContext, type UseFormRegisterReturn } from "react-hook-form";
import { Field } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CPD_FIELDS, PPE_FIELDS, type CpdForm, type PpeFieldName } from "@/schemas/cpd";
import { inputClass, labelClass, selectClass } from "@/lib/formStyles";
import { CPD_SELECT_OPTIONS, cpdOptionLabel } from "@/lib/cpdOptions";

// Form induk (Create/Update/edit CPD di detail) membungkus ini dengan <FormProvider>.
type Values = { cpd?: CpdForm } & Partial<Record<PpeFieldName, string | null>> & Record<string, unknown>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs font-medium text-[#B3261E] sm:text-sm">{message}</p> : null;

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2.5 sm:col-span-2">
    <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
    <h3 className="text-sm font-bold text-[#112D4E]">{children}</h3>
  </div>
);

// PPE Sizes: ppe_shoes ... ppe_gloves
export function PpeFields({ disabled }: { disabled?: boolean }) {
  const { register, formState } = useFormContext<Values>();
  return (
    <>
      <SectionTitle>PPE Sizes</SectionTitle>
      {PPE_FIELDS.map((f) => (
        <Field key={f.name} className="gap-2">
          <Label htmlFor={f.name} className={labelClass}>
            {f.label}
          </Label>
          <Input
            {...register(f.name)}
            id={f.name}
            maxLength={30}
            className={inputClass}
            disabled={disabled}
            placeholder="Example: 42 / L"
          />
          <FieldError message={formState.errors[f.name]?.message as string | undefined} />
        </Field>
      ))}
    </>
  );
}

type CpdFieldsProps = {
  disabled?: boolean;
  // nama field dalam form: "cpd." (Create) atau "" (form CPD mandiri)
  prefix?: string;
  // nik_ktp & npwp hanya dirender kalau true (non-admin tidak menerima key-nya)
  showSensitive?: boolean;
};

// Dropdown native. Nilai tersimpan yang tidak ada di daftar (data lama) ditampilkan
// sebagai opsi tambahan "<nilai> (old)" supaya tidak hilang diam-diam.
function CpdSelect({
  id,
  options,
  current,
  disabled,
  registration,
}: {
  id: string;
  options: readonly string[];
  current: unknown;
  disabled?: boolean;
  registration: UseFormRegisterReturn;
}) {
  const legacy = typeof current === "string" && current !== "" && !options.includes(current) ? current : null;
  return (
    <select id={id} className={selectClass} disabled={disabled} {...registration}>
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {cpdOptionLabel(o)}
        </option>
      ))}
      {legacy && <option value={legacy}>{cpdOptionLabel(legacy)} (old)</option>}
    </select>
  );
}

export function CpdFields({ disabled, prefix = "cpd.", showSensitive = true }: CpdFieldsProps) {
  const { register, formState, watch } = useFormContext<Values>();
  const errors = (prefix ? formState.errors.cpd : formState.errors) as
    | Record<string, { message?: string } | undefined>
    | undefined;

  return (
    <>
      {CPD_FIELDS.filter((f) => showSensitive || !("sensitive" in f && f.sensitive)).map((f) => {
        const id = `${prefix}${f.name}`.replace(".", "_");
        const wide = "wide" in f && f.wide;
        return (
          <Field key={f.name} className={`gap-2 ${wide ? "sm:col-span-2" : ""}`}>
            <Label htmlFor={id} className={labelClass}>
              {f.label}
            </Label>
            {"select" in f && f.select ? (
              <CpdSelect
                id={id}
                options={CPD_SELECT_OPTIONS[f.name] ?? []}
                current={watch(`${prefix}${f.name}` as never) as unknown}
                disabled={disabled}
                registration={register(`${prefix}${f.name}` as never)}
              />
            ) : (
              <Input
                {...register(`${prefix}${f.name}` as never)}
                id={id}
                type={"type" in f ? f.type : "text"}
                inputMode={"inputMode" in f ? (f.inputMode as "numeric" | "tel") : undefined}
                maxLength={"max" in f ? f.max : undefined}
                className={inputClass}
                disabled={disabled}
              />
            )}
            <FieldError message={errors?.[f.name]?.message} />
          </Field>
        );
      })}
    </>
  );
}
