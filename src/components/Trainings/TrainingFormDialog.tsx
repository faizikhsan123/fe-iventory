import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, GraduationCap, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DIVISIONS, TrainingSchema, type TrainingForm } from "@/schemas/Training";
import type { Training } from "@/types/Training";
import CreateTrainingHooks from "@/hooks/Training/create";
import UpdateTrainingHooks from "@/hooks/Training/update";

type Props = {
  open: boolean;
  training: Training | null; // null = mode tambah
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const fieldBase =
  "w-full rounded-lg border border-[#BFCCE3] bg-white px-3 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF] disabled:cursor-not-allowed disabled:bg-[#DBE2EF] disabled:opacity-70 sm:text-sm";

const inputClassName = `h-11 ${fieldBase}`;
const labelClassName = "text-sm font-semibold text-[#112D4E]";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs font-medium text-[#B3261E] sm:text-sm">{message}</p> : null;

const emptyValues: TrainingForm = {
  id_training: "",
  division_training: "Gas Analyzer",
  name_training: "",
  created_by: "",
//   date: "",
};

const TrainingFormDialog = ({ open, training, onOpenChange, onSuccess }: Props) => {
  const isEdit = training !== null;

  const { loadingCreate, errorCreate, handleCreate, setErrorCreate } = CreateTrainingHooks();
  const { loadingUpdate, errorUpdate, handleUpdate, setErrorUpdate } = UpdateTrainingHooks();

  const loading = loadingCreate || loadingUpdate;
  const error = isEdit ? errorUpdate : errorCreate;

  const form = useForm<TrainingForm>({
    resolver: zodResolver(TrainingSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    setErrorCreate("");
    setErrorUpdate("");
    form.reset(
      training
        ? {
            id_training: training.id_training,
            division_training: training.division_training,
            name_training: training.name_training,
            created_by: training.created_by,
            // date: training.date_raw,
          }
        : emptyValues,
    );
  }, [open, training, form, setErrorCreate, setErrorUpdate]);

  const handlesubmit = async (values: TrainingForm) => {
    const ok = isEdit ? await handleUpdate(training.id, values) : await handleCreate(values);
    if (ok) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 shadow-[0_10px_30px_rgb(17,45,78,0.18)] sm:max-w-xl">
        <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg font-extrabold text-[#112D4E]">
                {isEdit ? "Edit Training" : "Tambah Training Baru"}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-[#50688C]">
                Isi data training dengan lengkap
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handlesubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="gap-2">
                <Label htmlFor="id_training" className={labelClassName}>
                  ID Training <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("id_training")}
                  id="id_training"
                  placeholder="Contoh: TRN-001"
                  className={inputClassName}
                  disabled={loading}
                />
                <FieldError message={form.formState.errors.id_training?.message} />
              </Field>

              <Field className="gap-2">
                <Label htmlFor="division_training" className={labelClassName}>
                  Divisi <span className="text-[#B3261E]">*</span>
                </Label>
                <select
                  {...form.register("division_training")}
                  id="division_training"
                  className={`h-11 ${fieldBase}`}
                  disabled={loading}
                >
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <FieldError message={form.formState.errors.division_training?.message} />
              </Field>

              <Field className="gap-2">
                <Label htmlFor="name_training" className={labelClassName}>
                  Nama Training <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("name_training")}
                  id="name_training"
                  placeholder="Contoh: Basic Gas Analyzer"
                  className={inputClassName}
                  disabled={loading}
                />
                <FieldError message={form.formState.errors.name_training?.message} />
              </Field>

              <Field className="gap-2">
                <Label htmlFor="created_by" className={labelClassName}>
                  Dibuat Oleh <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("created_by")}
                  id="created_by"
                  placeholder="Nama pembuat"
                  className={inputClassName}
                  disabled={loading}
                />
                <FieldError message={form.formState.errors.created_by?.message} />
              </Field>
{/* 
              <Field className="gap-2">
                <Label htmlFor="date" className={labelClassName}>
                  Tanggal <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("date")}
                  type="date"
                  id="date"
                  className={inputClassName}
                  disabled={loading}
                />
                <FieldError message={form.formState.errors.date?.message} />
              </Field> */}
            </FieldGroup>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">{error}</span>
              </div>
            )}
          </div>

          <DialogFooter className="m-0 shrink-0 flex-col-reverse gap-2 rounded-none border-t border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:flex-row sm:justify-end sm:gap-2 sm:px-6">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="h-11 w-full rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF] sm:w-auto"
                >
                  Batal
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240] disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Training"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingFormDialog;