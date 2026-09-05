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
import { Controller, useForm } from "react-hook-form";
import { employeeCreateSchema, type EmployeeCreateForm } from "@/schemas/employes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import UseCreateEmployes from "@/hooks/employes/createEmployes";

type CreateEmployesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess : () => void
};

const CreateEmployes = ({ open, onOpenChange, onSuccess }: CreateEmployesProps) => {
  const { errorCreate, handeCreate, loadingCreate } = UseCreateEmployes();
  


  const form = useForm<EmployeeCreateForm>({
    resolver: zodResolver(employeeCreateSchema),
  });

  const handleButton = async (data: EmployeeCreateForm, ) => {
    handeCreate(data, () => {
      form.reset();
      onOpenChange(false);
      onSuccess?.()
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
              <Controller
                control={form.control}
                name="division"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loadingCreate}
                  >
                    <SelectTrigger
                      id="division"
                      className="w-full"
                    >
                      <SelectValue placeholder="-- Select Division --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GA">GA</SelectItem>
                      <SelectItem value="INC-PMR">INC-PMR</SelectItem>
                      <SelectItem value="INC-ER">INC-ER</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <span className="text-red-500 text-sm">{form.formState.errors.division?.message}</span>
            </Field>

            <Field>
              <Label htmlFor="position">
                Position <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={form.control}
                name="position"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loadingCreate}
                  >
                    <SelectTrigger
                      id="position"
                      className="w-full"
                    >
                      <SelectValue placeholder="-- Select Position --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Technician">Technician</SelectItem>
                      <SelectItem value="Foreman">Foreman</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
            onClick={form.handleSubmit(handleButton, )}
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