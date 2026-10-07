import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Clock, Loader2, Search, Users, UsersRound } from "lucide-react";
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
import { Checkbox } from "../ui/checkbox";
import { GroupsSchema, type GroupsForm } from "@/schemas/Group";
import CreateGroupsHooks from "@/hooks/Group/create";
import useGetEmployes from "@/hooks/employes/getEmployes";

type CreateGroupsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const fieldBase =
  "w-full rounded-lg border border-[#BFCCE3] bg-white px-3 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF] disabled:cursor-not-allowed disabled:bg-[#DBE2EF] disabled:opacity-70 sm:text-sm";

const inputClassName = `h-11 ${fieldBase}`;
const labelClassName = "text-sm font-semibold text-[#112D4E]";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs font-medium text-[#B3261E] sm:text-sm">{message}</p> : null;

const SectionTitle = ({ icon, title, hint }: { icon: React.ReactNode; title: string; hint?: string }) => (
  <div className="flex items-center gap-2.5">
    <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#DBE2EF] text-[#112D4E]">{icon}</div>
    <div>
      <p className="text-sm font-bold text-[#112D4E]">{title}</p>
      {hint && <p className="text-xs text-[#50688C]">{hint}</p>}
    </div>
  </div>
);

const initials = (name?: string | null) => (name ? name.trim().slice(0, 2).toUpperCase() : "?");

const emptyValues: GroupsForm = {
  group_name: "",
  start_time: "",
  end_time: "",
  employes_ids: [],
};

const CreateGroups = ({ open, onOpenChange, onSuccess }: CreateGroupsProps) => {
  const { loadingCreate, errorCreate, handleCreate } = CreateGroupsHooks();
  const { getEmployesButton, data } = useGetEmployes();
  const [q, setQ] = useState("");

  const form = useForm<GroupsForm>({
    resolver: zodResolver(GroupsSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      getEmployesButton();
    } else {
      form.reset(emptyValues);
      setQ("");
    }
  }, [open, form, getEmployesButton]);

  const filteredEmployes = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return data;
    return data.filter((e) =>
      `${e.user?.name ?? ""} ${e.division ?? ""} ${e.position ?? ""}`.toLowerCase().includes(k),
    );
  }, [data, q]);

  const handlesubmit = async (values: GroupsForm) => {
    const ok = await handleCreate(values);
    if (ok) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const selectedCount = form.watch("employes_ids").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 shadow-[0_10px_30px_rgb(17,45,78,0.18)] sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
              <UsersRound className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Tambah Group Baru</DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-[#50688C]">
                Atur nama, jam kerja, dan anggota group
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handlesubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4 sm:p-6">
            {/* ===== Section 1: info group ===== */}
            <section className="space-y-4">
              <SectionTitle icon={<Clock size={16} />} title="Informasi Group" hint="Nama dan jam kerja" />

              <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field className="gap-2 sm:col-span-2">
                  <Label htmlFor="nama" className={labelClassName}>
                    Nama Group <span className="text-[#B3261E]">*</span>
                  </Label>
                  <Input
                    {...form.register("group_name")}
                    type="text"
                    id="nama"
                    placeholder="Contoh: Shift Pagi"
                    className={inputClassName}
                    disabled={loadingCreate}
                  />
                  <FieldError message={form.formState.errors.group_name?.message} />
                </Field>

                <Field className="gap-2">
                  <Label htmlFor="start_time" className={labelClassName}>
                    Waktu Mulai <span className="text-[#B3261E]">*</span>
                  </Label>
                  <Input
                    {...form.register("start_time")}
                    type="time"
                    id="start_time"
                    className={inputClassName}
                    disabled={loadingCreate}
                  />
                  <FieldError message={form.formState.errors.start_time?.message} />
                </Field>

                <Field className="gap-2">
                  <Label htmlFor="end_time" className={labelClassName}>
                    Waktu Selesai <span className="text-[#B3261E]">*</span>
                  </Label>
                  <Input
                    {...form.register("end_time")}
                    type="time"
                    id="end_time"
                    className={inputClassName}
                    disabled={loadingCreate}
                  />
                  <FieldError message={form.formState.errors.end_time?.message} />
                </Field>
              </FieldGroup>
            </section>

            {/* ===== Section 2: anggota ===== */}
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <SectionTitle icon={<Users size={16} />} title="Anggota Group" hint="Pilih karyawan yang terlibat" />
                <span className="shrink-0 rounded-full bg-[#112D4E] px-2.5 py-0.5 text-xs font-semibold text-white">
                  {selectedCount} dipilih
                </span>
              </div>

              <Controller
                control={form.control}
                name="employes_ids"
                render={({ field }) => {
                  const selected = field.value ?? [];

                  const toggle = (id: number) =>
                    field.onChange(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);

                  const allFilteredSelected =
                    filteredEmployes.length > 0 && filteredEmployes.every((e) => selected.includes(e.id));

                  const toggleAll = () => {
                    const ids = filteredEmployes.map((e) => e.id);
                    field.onChange(
                      allFilteredSelected
                        ? selected.filter((id) => !ids.includes(id))
                        : Array.from(new Set([...selected, ...ids])),
                    );
                  };

                  return (
                    <div className="overflow-hidden rounded-lg border border-[#BFCCE3]">
                      {/* search + pilih semua */}
                      <div className="flex items-center gap-2 border-b border-[#DBE2EF] bg-[#F9F7F7] p-2">
                        <div className="relative flex-1">
                          <Search
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3F72AF]"
                            size={15}
                          />
                          <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Cari karyawan..."
                            className={`${inputClassName} h-10 pl-9`}
                            disabled={loadingCreate}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={toggleAll}
                          disabled={loadingCreate || filteredEmployes.length === 0}
                          className="h-10 shrink-0 rounded-lg border-[#BFCCE3] bg-white px-3 text-xs font-semibold text-[#112D4E] hover:bg-[#DBE2EF]"
                        >
                          {allFilteredSelected ? "Hapus semua" : "Pilih semua"}
                        </Button>
                      </div>

                      {/* list */}
                      <div className="max-h-60 divide-y divide-[#EBEFF6] overflow-y-auto">
                        {filteredEmployes.length === 0 && (
                          <p className="py-8 text-center text-sm text-[#7B8FAE]">Karyawan tidak ditemukan</p>
                        )}

                        {filteredEmployes.map((employee) => {
                          const checked = selected.includes(employee.id);
                          return (
                            <label
                              key={employee.id}
                              htmlFor={`employee-${employee.id}`}
                              className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors ${
                                checked ? "bg-[#DBE2EF]/60" : "hover:bg-[#F9F7F7]"
                              }`}
                            >
                              <Checkbox
                                id={`employee-${employee.id}`}
                                checked={checked}
                                onCheckedChange={() => toggle(employee.id)}
                                disabled={loadingCreate}
                              />
                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#112D4E] text-xs font-bold text-white">
                                {initials(employee.user?.name)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[#112D4E]">
                                  {employee.user?.name ?? "-"}
                                </p>
                                <p className="truncate text-xs text-[#50688C]">
                                  {employee.division ?? "-"} · {employee.position ?? "-"}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                }}
              />
            </section>

            {errorCreate && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">{errorCreate}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="m-0 shrink-0 flex-col-reverse gap-2 rounded-none border-t border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:flex-row sm:justify-end sm:gap-2 sm:px-6">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingCreate}
                  className="h-11 w-full rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF] sm:w-auto"
                >
                  Batal
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={loadingCreate}
              className="h-11 w-full gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240] disabled:opacity-60 sm:w-auto"
            >
              {loadingCreate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Tambah Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroups;