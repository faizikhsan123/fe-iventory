// CreateEmployes.tsx
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
import { employeeCreateSchema, type EmployeeCreateForm } from "@/schemas/employes";
import { zodResolver } from "@hookform/resolvers/zod";

import UseCreateEmployes from "@/hooks/employes/createEmployes";
import { useState } from "react";
import { AlertCircle, ImagePlus, Loader2, UserPlus, X } from "lucide-react";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border input #BFCCE3, muted #50688C, placeholder #7B8FAE
*/

type CreateEmployesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
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

const CreateEmployes = ({ open, onOpenChange, onSuccess }: CreateEmployesProps) => {
  const { errorCreate, handeCreate, loadingCreate } = UseCreateEmployes();

  const form = useForm<EmployeeCreateForm>({
    resolver: zodResolver(employeeCreateSchema),
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // const [showPassword, setShowPassword] = useState(false);
  // key untuk mengosongkan <input type="file"> secara visual
  const [fileKey, setFileKey] = useState(0);

  const handleRemoveImage = () => {
    form.setValue("file", null, { shouldValidate: true });
    setPreviewImage(null);
    setFileKey((k) => k + 1);
  };

  const handleButton = async (data: EmployeeCreateForm) => {
    handeCreate(data, () => {
      form.reset();
      setPreviewImage(null);
      setFileKey((k) => k + 1);
      onOpenChange(false);
      onSuccess?.();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 shadow-[0_10px_30px_rgb(17,45,78,0.18)] sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Tambah Karyawan Baru</DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-[#50688C]">
                Lengkapi data karyawan di bawah
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleButton)} className="flex min-h-0 flex-1 flex-col">
          {/* Isi form (scroll sendiri kalau layar pendek) */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="gap-2 sm:col-span-2">
                <Label htmlFor="nama" className={labelClassName}>
                  Nama Karyawan <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("name")}
                  type="text"
                  id="nama"
                  placeholder="Nama lengkap karyawan"
                  className={inputClassName}
                  disabled={loadingCreate}
                />
                <FieldError message={form.formState.errors.name?.message} />
              </Field>

              {/* <Field className="gap-2">
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
                  disabled={loadingCreate}
                />
                <FieldError message={form.formState.errors.email?.message} />
              </Field>

              <Field className="gap-2">
                <Label htmlFor="password" className={labelClassName}>
                  Password <span className="text-[#B3261E]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    className={`${inputClassName} pr-12`}
                    disabled={loadingCreate}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-[#50688C] transition hover:text-[#112D4E]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError message={form.formState.errors.password?.message} />
              </Field> */}

              <Field className="gap-2">
                <Label htmlFor="division" className={labelClassName}>
                  Division <span className="text-[#B3261E]">*</span>
                </Label>
                <select
                  id="division"
                  className={selectClassName}
                  disabled={loadingCreate}
                  {...form.register("division")}
                >
                  <option value="">-- Pilih Divisi --</option>
                  <option value="GA">GA</option>
                  <option value="INC-PMR">INC-PMR</option>
                  <option value="INC-ER">INC-ER</option>
                </select>
                <FieldError message={form.formState.errors.division?.message} />
              </Field>

              <Field className="gap-2">
                <Label htmlFor="position" className={labelClassName}>
                  Position <span className="text-[#B3261E]">*</span>
                </Label>
                <select          
                  id="position"
                  className={selectClassName}
                  disabled={loadingCreate}
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

              <Field className="gap-2 sm:col-span-2">
                <FieldLabel htmlFor="picture" className={labelClassName}>
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
                      disabled={loadingCreate}
                      className={fileClassName}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setPreviewImage(file ? URL.createObjectURL(file) : null);
                        onChange(file);
                      }}
                    />
                  )}
                />
                <FieldDescription className="text-xs text-[#50688C]">
                  Pilih gambar untuk diunggah (PNG/JPG).
                </FieldDescription>
                <FieldError message={form.formState.errors.file?.message as string} />
              </Field>
            </FieldGroup>

            {/* Preview */}
            <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#9DB2D3] bg-[#F9F7F7] sm:h-48">
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Preview" className="h-full w-full object-contain" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loadingCreate}
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
                "Tambah Karyawan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployes;