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

type CreateSupplierProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateSupplier({ open, onOpenChange }: CreateSupplierProps) {
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
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tambah Supplier Baru</DialogTitle>
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
              disabled={loadingCreate}
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
              disabled={loadingCreate}
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
              disabled={loadingCreate}
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
              disabled={loadingCreate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.address?.message}</span>
          </Field>
        </FieldGroup>

        {errorCreate && <p className="text-red-500 text-sm mt-2">{errorCreate}</p>}

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={loadingCreate}
              >
                Batal
              </Button>
            }
          />
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loadingCreate}
          >
            {loadingCreate ? "Menyimpan..." : "Tambah Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
