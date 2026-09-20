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
import { useForm } from "react-hook-form";
import { employeeCreateSchema, type EmployeeCreateForm } from "@/schemas/employes";
import { zodResolver } from "@hookform/resolvers/zod";

import UseCreateEmployes from "@/hooks/employes/createEmployes";

type CreateEmployesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const CreateEmployes = ({ open, onOpenChange, onSuccess }: CreateEmployesProps) => {
  const { errorCreate, handeCreate, loadingCreate } = UseCreateEmployes();

  const form = useForm<EmployeeCreateForm>({
    resolver: zodResolver(employeeCreateSchema),
  });

  const handleButton = async (data: EmployeeCreateForm) => {
    handeCreate(data, () => {
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
          <DialogTitle>Tambah Karyawan Baru</DialogTitle>
          <DialogDescription>Lengkapi data karyawan di bawah</DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <Label htmlFor="nama">
              Nama Karyawan <span className="text-red-500">*</span>
            </Label>
            <Input
              {...form.register("name")}
              type="text"
              id="nama"
              placeholder="Nama lengkap karyawan"
              disabled={loadingCreate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.name?.message}</span>
          </Field>

          <Field>
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              {...form.register("email")}
              id="email"
              placeholder="nama@perusahaan.com"
              disabled={loadingCreate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.email?.message}</span>
          </Field>

          <Field>
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              {...form.register("password")}
              type="password"
              id="password"
              placeholder="••••••••"
              disabled={loadingCreate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.password?.message}</span>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label htmlFor="division">
                Division <span className="text-red-500">*</span>
              </Label>
              <select
                id="division"
                {...form.register("division")}
              >
                <option value="">-- Pilih Divisi --</option>
                <option value="GA">GA</option>
                <option value="INC-PMR">INC-PMR</option>
                <option value="INC-ER">INC-ER</option>
              </select>

              <span className="text-red-500 text-sm">{form.formState.errors.division?.message}</span>
            </Field>

            <Field>
              <Label htmlFor="position">
                Position <span className="text-red-500">*</span>
              </Label>
              <select
                id="position"
                {...form.register("position")}
              >
                <option value="">-- Pilih Posisi --</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Technician">Technician</option>
                <option value="Foreman">Foreman</option>
              </select>

              <span className="text-red-500 text-sm">{form.formState.errors.position?.message}</span>
            </Field>
          </div>
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
            onClick={form.handleSubmit(handleButton)}
            type="button"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loadingCreate}
          >
            {loadingCreate ? "Menyimpan..." : "Tambah Karyawan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployes;
