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
import { X } from "lucide-react";

type CreateEmployesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const CreateEmployes = ({ open, onOpenChange, onSuccess }: CreateEmployesProps) => {
  const { errorCreate, handeCreate, loadingCreate } = UseCreateEmployes();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const handleRemoveImage = () => {
    form.setValue("file", null, { shouldValidate: true });
    setPreviewImage(null);
  };

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

            <Field>
              <FieldLabel htmlFor="picture">Foto</FieldLabel>
              <Controller
                control={form.control}
                name="file"
                render={({ field: { onChange, onBlur, name, ref } }) => (
                  <Input
                    id="picture"
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    disabled={loadingCreate}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;

                      // langsung generate object URL dari file yang dipilih,
                      // gak perlu useEffect terpisah + watch()
                      if (file) {
                        const objectUrl = URL.createObjectURL(file);
                        setPreviewImage(objectUrl);
                      } else {
                        setPreviewImage(null);
                      }

                      onChange(file);
                    }}
                  />
                )}
              />
              <FieldDescription>Pilih gambar untuk diunggah.</FieldDescription>
              <span className="text-red-500 text-sm">{form.formState.errors.file?.message as string}</span>
            </Field>
          </div>
        </FieldGroup>

        <div className="relative mb-3 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50">
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
                disabled={loadingCreate}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              {/* <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div> */}
              <p className="text-xs text-slate-400">Belum ada gambar dipilih</p>
            </div>
          )}
        </div>
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
