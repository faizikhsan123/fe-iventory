import { useEffect } from "react";
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
import { useEditSupplier } from "@/hooks/suppliers/EditSupplier";
import type { Supplier } from "@/types/supplier";

type EditSupplierProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier; // data supplier yang lagi diedit, diambil dari sini bukan dari form
  onSuccess?: () => void;
};

export function EditSupplier({ open, onOpenChange, supplier, onSuccess }: EditSupplierProps) {
  const { errorUpdate, handleUpdate, loadingUpdate } = useEditSupplier();
  const form = useForm<SupplierForm>({
    resolver: zodResolver(supplierSchema),
  });

  // ambil value lama
  useEffect(() => {
    form.reset({
      nama: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
    });
  }, [supplier]);

  //   data ini diambil dari validasi zod
  const onSubmit = async (data: SupplierForm) => {
    // terus jalankan handleUpdate dari hooks yg menerima param dari zod
    handleUpdate(supplier.id, data, () => {
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>Lengkapi informasi supplier di bawah</DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <Label htmlFor="nama">
              Nama Supplier / Perusahaan <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              {...form.register("nama")}
              id="nama"
              placeholder="Tokopedia"
              disabled={loadingUpdate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.nama?.message}</span>
          </Field>

          <Field>
            <Label htmlFor="phone">No. Telepon</Label>
            <Input
              type="text"
              {...form.register("phone")}
              id="phone"
              placeholder="0812-3456-7890"
              disabled={loadingUpdate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.phone?.message}</span>
          </Field>

          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              {...form.register("email")}
              id="email"
              placeholder="kontak@supplier.com"
              disabled={loadingUpdate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.email?.message}</span>
          </Field>

          <Field>
            <Label htmlFor="address">Alamat</Label>
            <Input
              type="text"
              {...form.register("address")}
              id="address"
              placeholder="Keputih Gg 2 A No 8"
              disabled={loadingUpdate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.address?.message}</span>
          </Field>
        </FieldGroup>

        {errorUpdate && <p className="text-red-500 text-sm mt-2">{errorUpdate}</p>}

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={loadingUpdate}
              >
                Batal
              </Button>
            }
          />
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loadingUpdate}
          >
            {loadingUpdate ? "Menyimpan..." : "Ubah Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
