import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { GroupsSchema, type GroupsForm } from "@/schemas/Group";
import UpdateGroupsHooks from "@/hooks/Group/update";
import UseGetGroupDetail from "@/hooks/Group/show";
import useGetEmployes from "@/hooks/employes/getEmployes";

type UpdateGroupsProps = {
  open: boolean;
  groupId: number | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const fieldBase =
  "w-full rounded-lg border border-[#BFCCE3] bg-white px-3 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF] disabled:cursor-not-allowed disabled:bg-[#DBE2EF] disabled:opacity-70 sm:text-sm";

const inputClassName = `h-11 ${fieldBase}`;
const labelClassName = "text-sm font-semibold text-[#112D4E]";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs font-medium text-[#B3261E] sm:text-sm">{message}</p> : null;

const emptyValues: GroupsForm = {
  group_name: "",
  employes_ids: [],
};

const UpdateGroups = ({ open, groupId, onOpenChange, onSuccess }: UpdateGroupsProps) => {
  const { loadingUpdate, errorUpdate, handleUpdate } = UpdateGroupsHooks();
  const { loadingDetail, errorDetail, getGroup } = UseGetGroupDetail();
  const { getEmployesButton, data } = useGetEmployes();

  const form = useForm<GroupsForm>({
    resolver: zodResolver(GroupsSchema),
    defaultValues: emptyValues,
  });

  // ambil karyawan + detail group waktu dialog dibuka, terus prefill
  useEffect(() => {
    if (!open || !groupId) {
      form.reset(emptyValues);
      return;
    }

    getEmployesButton();

    getGroup(groupId).then((g) => {
      if (!g) return;
      form.reset({
        group_name: g.group_name,
      
        employes_ids: (g.employees ?? []).map((e) => e.id),
      });
    });
  }, [open, groupId, form, getGroup, getEmployesButton]);

  const handlesubmit = async (values: GroupsForm) => {
    if (!groupId) return;
    const ok = await handleUpdate(groupId, values);
    if (ok) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const busy = loadingUpdate || loadingDetail;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 shadow-[0_10px_30px_rgb(17,45,78,0.18)] sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Edit Group</DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-[#50688C]">
                Ubah data group di bawah
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handlesubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
            {loadingDetail && (
              <div className="flex items-center gap-2 text-sm text-[#50688C]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat data group...
              </div>
            )}

            {errorDetail && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">{errorDetail}</span>
              </div>
            )}

            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="gap-2 sm:col-span-2">
                <Label htmlFor="nama" className={labelClassName}>
                  Nama Group <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("group_name")}
                  type="text"
                  id="nama"
                  placeholder="Nama Group"
                  className={inputClassName}
                  disabled={busy}
                />
                <FieldError message={form.formState.errors.group_name?.message} />
              </Field>

              {/* <Field className="gap-2">
                <Label htmlFor="start_time" className={labelClassName}>
                  Waktu Mulai <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("start_time")}
                  type="time"
                  id="start_time"
                  className={inputClassName}
                  disabled={busy}
                />
                <FieldError message={form.formState.errors.start_time?.message} />
              </Field> */}

              {/* <Field className="gap-2">
                <Label htmlFor="end_time" className={labelClassName}>
                  Waktu Selesai <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("end_time")}
                  type="time"
                  id="end_time"
                  className={inputClassName}
                  disabled={busy}
                />
                <FieldError message={form.formState.errors.end_time?.message} />
              </Field> */}
            </FieldGroup> 

            <FieldSet>
              <FieldLegend variant="label">Pilih Karyawan yang akan terlibat</FieldLegend>

              <Controller
                control={form.control}
                name="employes_ids"
                render={({ field }) => {
                  const selected = field.value ?? [];

                  const toggle = (id: number) =>
                    field.onChange(
                      selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id],
                    );

                  return (
                    <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-[#BFCCE3] p-2">
                      {data.length === 0 && (
                        <p className="py-4 text-center text-sm text-[#7B8FAE]">Belum ada karyawan</p>
                      )}

                      {data.map((employee) => (
                        <div
                          key={employee.id}
                          className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-[#F9F7F7]"
                        >
                          <Checkbox
                            id={`employee-${employee.id}`}
                            checked={selected.includes(employee.id)}
                            onCheckedChange={() => toggle(employee.id)}
                            disabled={busy}
                          />
                          <FieldLabel
                            htmlFor={`employee-${employee.id}`}
                            className="flex-1 cursor-pointer font-normal"
                          >
                            {employee.user?.name ?? "-"} - {employee.division ?? "-"} -{" "}
                            {employee.position ?? "-"}
                          </FieldLabel>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />

              <p className="text-xs text-[#50688C]">
                {form.watch("employes_ids").length} karyawan dipilih
              </p>
            </FieldSet>

            {errorUpdate && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">{errorUpdate}</span>
              </div>
            )}
          </div>

          <DialogFooter className="m-0 shrink-0 flex-col-reverse gap-2 rounded-none border-t border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:flex-row sm:justify-end sm:gap-2 sm:px-6">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingUpdate}
                  className="h-11 w-full rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF] sm:w-auto"
                >
                  Batal
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={busy}
              className="h-11 w-full gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240] disabled:opacity-60 sm:w-auto"
            >
              {loadingUpdate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGroups;