// CreateSupplier.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierSchema, type SupplierForm } from "@/schemas/supplier";
import { useCreateSupplier } from "@/hooks/suppliers/createSupplier";
import { AlertCircle, Loader2 } from "lucide-react";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border input #BFCCE3, muted #50688C, placeholder #7B8FAE
*/

// Semua field solid putih (tidak transparan). text-base di HP biar iOS tidak auto-zoom.
const fieldBase =
  "w-full rounded-lg border border-[#BFCCE3] bg-white px-3 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF] disabled:cursor-not-allowed disabled:bg-[#DBE2EF] disabled:opacity-70 sm:text-sm";

const inputClassName = `h-11 ${fieldBase}`;
const selectClassName = `flex h-11 items-center ${fieldBase}`;
const labelClassName = "text-sm font-semibold text-[#112D4E]";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs font-medium text-[#B3261E] sm:text-sm">{message}</p> : null;

type CreateSupplierProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function CreateSupplier({ open, onOpenChange, onSuccess }: CreateSupplierProps) {
  const { errorCreate, handleCreate, loadingCreate } = useCreateSupplier();
  const form = useForm<SupplierForm>({
    resolver: zodResolver(supplierSchema),
  });

  //   data ini diambil dari validasi zod
  const onSubmit = async (data: SupplierForm) => {
    // terus jalankan handlecreate dari hooks yg menerima param dari zod
    handleCreate(data, () => {
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="flex max-h-[90dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 shadow-[0_10px_30px_rgb(17,45,78,0.18)] sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-9 w-1 shrink-0 rounded-full bg-[#3F72AF]" aria-hidden="true" />
            <div className="min-w-0">
              <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Tambah Supplier Baru</DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-[#50688C]">
                Lengkapi informasi supplier di bawah
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Isi form (scroll sendiri kalau layar pendek) */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field className="gap-2 sm:col-span-2">
              <Label htmlFor="nama" className={labelClassName}>
                Nama Supplier / Perusahaan <span className="text-[#B3261E]">*</span>
              </Label>
              <Input
                type="text"
                {...form.register("nama")}
                id="nama"
                placeholder="Tokopedia"
                className={inputClassName}
                disabled={loadingCreate}
              />
              <FieldError message={form.formState.errors.nama?.message} />
            </Field>

            <Field className="gap-2">
              <Label htmlFor="pic" className={labelClassName}>
                Nama PIC <span className="text-[#B3261E]">*</span>
              </Label>
              <Input
                type="text"
                {...form.register("pic")}
                id="pic"
                placeholder="Budi Jaya"
                className={inputClassName}
                disabled={loadingCreate}
              />
              <FieldError message={form.formState.errors.pic?.message} />
            </Field>

            <Field className="gap-2">
              <Label htmlFor="spesialis" className={labelClassName}>
                Spesialis <span className="text-[#B3261E]">*</span>
              </Label>
              <select
                id="spesialis"
                className={selectClassName}
                disabled={loadingCreate}
                {...form.register("spesialis")}
              >
                <option value=""> -- Pilih Kategori --</option>
                <option value="apd">APD</option>
                <option value="tools">Tools</option>
                <option value="others">Others</option>
              </select>
              <FieldError message={form.formState.errors.spesialis?.message} />
            </Field>

            <Field className="gap-2">
              <Label htmlFor="phone" className={labelClassName}>
                No. Telepon
              </Label>
              <Input
                type="text"
                inputMode="tel"
                {...form.register("phone")}
                id="phone"
                placeholder="0812-3456-7890"
                className={inputClassName}
                disabled={loadingCreate}
              />
              <FieldError message={form.formState.errors.phone?.message} />
            </Field>

            <Field className="gap-2">
              <Label htmlFor="email" className={labelClassName}>
                Email
              </Label>
              <Input
                type="email"
                inputMode="email"
                {...form.register("email")}
                id="email"
                placeholder="kontak@supplier.com"
                className={inputClassName}
                disabled={loadingCreate}
              />
              <FieldError message={form.formState.errors.email?.message} />
            </Field>

            <Field className="gap-2 sm:col-span-2">
              <Label htmlFor="address" className={labelClassName}>
                Alamat
              </Label>
              <Input
                type="text"
                {...form.register("address")}
                id="address"
                placeholder="Keputih Gg 2 A No 8"
                className={inputClassName}
                disabled={loadingCreate}
              />
              <FieldError message={form.formState.errors.address?.message} />
            </Field>
          </FieldGroup>

          {errorCreate && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{errorCreate}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="m-0 shrink-0 flex-col-reverse gap-2 rounded-none border-t border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:flex-row sm:justify-end sm:px-6">
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
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="h-11 w-full gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240] disabled:opacity-60 sm:w-auto"
            disabled={loadingCreate}
          >
            {loadingCreate ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Tambah Supplier"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}