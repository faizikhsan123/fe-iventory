// UpdateEmployes.tsx
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import type { employes } from "@/types/employes";
import { useEffect, useState } from "react";
import UseeditEmployes from "@/hooks/employes/editEmployes";
import { employeeEditSchema, type EmployeeEditForm } from "@/schemas/employes";
import { AlertCircle, ImagePlus, Loader2, UserCog, X } from "lucide-react";
import { STORAGE_URL } from "@/lib/axios";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border input #BFCCE3, muted #50688C, placeholder #7B8FAE
*/

type updateEmployesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employes: employes | null;
};

// Semua field solid putih (tidak transparan). text-base di HP biar iOS tidak auto-zoom.
const fieldBase =
  "w-full rounded-lg border border-[#BFCCE3] bg-white px-3 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF] disabled:cursor-not-allowed disabled:bg-[#DBE2EF] disabled:opacity-70 sm:text-sm";

const inputClassName = `h-11 ${fieldBase}`;
const selectClassName = `flex h-11 items-center ${fieldBase}`;
const fileClassName = `h-11 cursor-pointer py-1.5 ${fieldBase} file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#DBE2EF] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#112D4E]`;
const labelClassName = "text-sm font-semibold text-[#112D4E]";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs font-medium text-[#B3261E] sm:text-sm">{message}</p> : null;

const UpdateEmployes = ({ open, onOpenChange, onSuccess, employes }: updateEmployesProps) => {
  const form = useForm<EmployeeEditForm>({
    resolver: zodResolver(employeeEditSchema),
  });

  const { errorupdate, handleUpdate, loadingupdate } = UseeditEmployes();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState(0);

  const onSubmit = async (data: EmployeeEditForm) => {
    if (!employes) return;
    handleUpdate(employes.id, data, () => {
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    });
  };

  const handleRemoveImage = () => {
    form.setValue("file", null, { shouldValidate: true });
    setPreviewImage(null);
    setFileKey((k) => k + 1);
  };

  // isi form saat karyawan yang diedit berganti
  useEffect(() => {
    if (!employes) return;

    form.reset({
      id_number: employes.id_number,
      name: employes.user.name,
      email: employes.user.email,
      division: employes.division,
      position: employes.position,
      status: employes.status,
      left_at: employes.left_at ?? "",
      contract_start: employes.contract_start ?? "",
      contract_end: employes.contract_end ?? "",
      ktp_address: employes.ktp_address,
      actual_address: employes.actual_address,
      emergency_contact: employes.emergency_contact,
      file: null,
    });
    setFileKey((k) => k + 1);
  }, [employes]);

  // preview mengikuti foto karyawan (kosongkan kalau karyawan tidak punya foto)
  useEffect(() => {
    setPreviewImage(employes?.file ? `${STORAGE_URL}${employes.file}` : null);
  }, [employes?.file, employes?.id]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 shadow-[0_10px_30px_rgb(17,45,78,0.18)] sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#3F72AF] text-white">
              <UserCog className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Update Karyawan</DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-[#50688C]">
                Perbarui data karyawan di bawah
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Isi form (scroll sendiri kalau layar pendek) */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="gap-2 sm:col-span-2">
                <Label
                  htmlFor="nama"
                  className={labelClassName}
                >
                  Nama Karyawan <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("name")}
                  type="text"
                  id="nama"
                  placeholder="Nama lengkap karyawan"
                  className={inputClassName}
                  disabled={loadingupdate}
                />
                <FieldError message={form.formState.errors.name?.message} />
              </Field>
              <Field className="gap-2 sm:col-span-2">
                <Label
                  htmlFor="id_number"
                  className={labelClassName}
                >
                  ID Karyawan <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("id_number")}
                  type="text"
                  id="id_number"
                  placeholder="ID karyawan"
                  className={inputClassName}
                  disabled={loadingupdate}
                />
                <FieldError message={form.formState.errors.id_number?.message} />
              </Field>
              {/* 
              <Field className="gap-2 sm:col-span-2">
                <Label htmlFor="email" className={labelClassName}>
                  Email <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  type="email"
                  inputMode="email"
                  {...form.register("email")}
                  id="email"
                  placeholder="nama@perusahaan.com"
                  className={inputClassName}
                  disabled={loadingupdate}
                />
                <FieldError message={form.formState.errors.email?.message} />
              </Field> */}

              <Field className="gap-2">
                <Label
                  htmlFor="division"
                  className={labelClassName}
                >
                  Division <span className="text-[#B3261E]">*</span>
                </Label>
                <select
                  id="division"
                  className={selectClassName}
                  disabled={loadingupdate}
                  {...form.register("division")}
                >
                  <option value="">-- Pilih Divisi --</option>
                  <option value="I&C-PMR">I&C-PMR</option>
                  <option value="I&C-ER">I&C-ER</option>
                  <option value="Gas Analyzer">Gas Analyzer</option>
                </select>
                <FieldError message={form.formState.errors.division?.message} />
              </Field>

             <Field className="gap-2">
                <Label
                  htmlFor="position"
                  className={labelClassName}
                >
                  Position <span className="text-[#B3261E]">*</span>
                </Label>
                <select
                  id="position"
                  className={selectClassName}
                  disabled={loadingupdate}
                  {...form.register("position")}
                >
                  <option value="">-- Pilih Posisi --</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Technician">Technician</option>
                  <option value="Foreman">Foreman</option>
                  <option value="Safety">Safety</option>
                </select>
                <FieldError message={form.formState.errors.position?.message} />
              </Field>
              <Field className="gap-2">
                <Label htmlFor="contract_start" className={labelClassName}>
                  Contract When Joined
                </Label>
                <Input
                  {...form.register("contract_start")}
                  type="date"
                  id="contract_start"
                  className={inputClassName}
                  disabled={loadingupdate}
                />
                <FieldError message={form.formState.errors.contract_start?.message} />
              </Field>

              <Field className="gap-2">
                <Label htmlFor="contract_end" className={labelClassName}>
                  Contract Expired
                </Label>
                <Input
                  {...form.register("contract_end")}
                  type="date"
                  id="contract_end"
                  className={inputClassName}
                  disabled={loadingupdate}
                />
                <FieldError message={form.formState.errors.contract_end?.message} />
              </Field>

              <Field className="gap-2 ">
                <Label
                  htmlFor="actual_address"
                  className={labelClassName}
                >
                  Alamat Domisili
                </Label>
                <Input
                  {...form.register("actual_address")}
                  type="text"
                  id="actual_address"
                  placeholder="Alamat domisili"
                  className={inputClassName}
                  disabled={loadingupdate}
                />
                <FieldError message={form.formState.errors.actual_address?.message} />
              </Field>



                 <Field className="gap-2 ">
                <Label
                  htmlFor="ktp_address"
                  className={labelClassName}
                >
                  Alamat Sesuai KTP
                </Label>
                <Input
                  {...form.register("ktp_address")}
                  type="text"
                  id="ktp_address"
                  placeholder="Alamat sesuai KTP"
                  className={inputClassName}
                  disabled={loadingupdate}
                />
                <FieldError message={form.formState.errors.ktp_address?.message} />
              </Field>


              
              <Field className="gap-2 ">
                <Label
                  htmlFor="emergency_contact"
                  className={labelClassName}
                >
                  Kontak Darurat
                </Label>
                <Input
                  {...form.register("emergency_contact")}
                  type="text"
                  id="emergency_contact"
                  placeholder="Kontak darurat"
                  className={inputClassName}
                  disabled={loadingupdate}
                />
                <FieldError message={form.formState.errors.emergency_contact?.message} />
              </Field>

            

              <Field className="gap-2">
                <Label
                  htmlFor="status"
                  className={labelClassName}
                >
                  Status <span className="text-[#B3261E]">*</span>
                </Label>
                <select
                  id="status"
                  className={selectClassName}
                  disabled={loadingupdate}
                  {...form.register("status")}
                >
                  <option value="">-- Pilih Status --</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <FieldError message={form.formState.errors.status?.message} />
              </Field>

              {form.watch("status") === "inactive" && (
                <Field className="gap-2">
                  <Label htmlFor="left_at" className={labelClassName}>
                    Tanggal Keluar
                  </Label>
                  <Input
                    {...form.register("left_at")}
                    type="date"
                    id="left_at"
                    className={inputClassName}
                    disabled={loadingupdate}
                  />
                  <FieldDescription className="text-xs text-[#50688C]">
                    Dipakai untuk turn over rate. Kosongkan untuk memakai hari ini.
                  </FieldDescription>
                </Field>
              )}

              <Field className="gap-2">
                <FieldLabel
                  htmlFor="picture"
                  className={labelClassName}
                >
                  Foto
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <Input
                      key={fileKey}
                      id="picture"
                      name={name}
                      ref={ref}
                      onBlur={onBlur}
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      disabled={loadingupdate}
                      className={fileClassName}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setPreviewImage(file ? URL.createObjectURL(file) : null);
                        onChange(file);
                      }}
                    />
                  )}
                />
                <FieldDescription className="text-xs text-[#50688C]">Pilih gambar untuk diunggah.</FieldDescription>
                <FieldError message={form.formState.errors.file?.message as string} />
              </Field>
            </FieldGroup>

            {/* Preview */}
            <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#9DB2D3] bg-[#F9F7F7] sm:h-48">
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loadingupdate}
                    aria-label="Hapus gambar"
                    className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-[#112D4E] text-white transition hover:bg-[#0B2240] active:scale-95 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#DBE2EF]">
                    <ImagePlus className="h-6 w-6 text-[#3F72AF]" />
                  </div>
                  <p className="text-xs text-[#50688C]">Belum ada gambar dipilih</p>
                </div>
              )}
            </div>

            {errorupdate && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">{errorupdate}</span>
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
                  disabled={loadingupdate}
                  className="h-11 w-full rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF] sm:w-auto"
                >
                  Batal
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={loadingupdate}
              className="h-11 w-full gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240] disabled:opacity-60 sm:w-auto"
            >
              {loadingupdate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Update Karyawan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmployes;
