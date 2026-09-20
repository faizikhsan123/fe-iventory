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

import { zodResolver } from "@hookform/resolvers/zod";
import type { employes } from "@/types/employes";
import { useEffect } from "react";
import UseeditEmployes from "@/hooks/employes/editEmployes";
import { employeeEditSchema, type EmployeeEditForm } from "@/schemas/employes";

type updateEmployesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employes: employes | null;
};

const UpdateEmployes = ({ open, onOpenChange, onSuccess, employes }: updateEmployesProps) => {
  const form = useForm<EmployeeEditForm>({
    resolver: zodResolver(employeeEditSchema),
  });

  const { errorupdate, handleUpdate, loadingupdate } = UseeditEmployes();

  const onSubmit = async (data: EmployeeEditForm) => {
    if (!employes) {
      return;
    }
    handleUpdate(employes.id, data, () => {
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    });
  };

  useEffect(() => {
    if (!employes) return;

    form.reset({
      name: employes.user.name,
      email: employes.user.email,

      division: employes.division,
      position: employes.position,
      status: employes.status,
    });
  }, [employes]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Karyawan </DialogTitle>
          <DialogDescription>update data karyawan di bawah</DialogDescription>
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
              disabled={loadingupdate}
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
              disabled={loadingupdate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.email?.message}</span>
          </Field>

          {/* <Field>
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              {...form.register("password")}
              type="password"
              id="password"
              placeholder="••••••••"
              disabled={loadingupdate}
            />
            <span className="text-red-500 text-sm">{form.formState.errors.password?.message}</span>
          </Field> */}

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

            <Field>
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <select
                id="status"
                {...form.register("status")}
              >
                <option value="">-- Pilih Status --</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <span className="text-red-500 text-sm">{form.formState.errors.status?.message}</span>
            </Field>
          </div>
        </FieldGroup>

        {errorupdate && <p className="text-red-500 text-sm mt-2">{errorupdate}</p>}

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={loadingupdate}
              >
                Batal
              </Button>
            }
          />
          <Button
            onClick={form.handleSubmit(onSubmit)}
            type="button"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loadingupdate}
          >
            {loadingupdate ? "Menyimpan..." : "Update Karyawan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmployes;
