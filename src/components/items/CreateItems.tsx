"use client";
import { ChevronLeft, Check, Upload, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Label } from "../ui/label";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { itemsSchema, type ItemsCreate } from "@/schemas/items";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import UsecreateItems from "@/hooks/items/createItems";

const CreateItems = () => {
  const navigation = useNavigate();
  const { errorCreate, handleCreate, loadingCreate } = UsecreateItems();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<ItemsCreate>({
    resolver: zodResolver(itemsSchema),
  });

  const handlebuttonCreate = async (data: ItemsCreate) => {
    handleCreate(data);
  };

  const handleRemoveImage = () => {
    form.setValue("file", null, { shouldValidate: true });
    setPreviewImage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigation("/items")}
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tambah Barang Baru</h1>
            <p className="text-sm text-slate-500">Isi form di bawah untuk menambahkan barang baru ke inventaris</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Foto Barang */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              {/* Preview area */}
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-slate-400">Belum ada gambar dipilih</p>
                  </div>
                )}
              </div>

              <Field>
                <FieldLabel htmlFor="picture">Picture</FieldLabel>
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
                <FieldDescription>Select a picture to upload.</FieldDescription>
                <span className="text-red-500 text-sm">{form.formState.errors.file?.message as string}</span>
              </Field>
            </div>
          </div>

          {/* Right column */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-5 text-sm font-semibold text-slate-900">Informasi Barang</h2>

            <div className="flex flex-col gap-5">
              {/* Nama Barang */}
              <Field>
                <Label htmlFor="nama">
                  Nama Barang <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...form.register("name")}
                  type="text"
                  id="nama"
                  placeholder="Safety Glases"
                  disabled={loadingCreate}
                />
                <span className="text-red-500 text-sm">{form.formState.errors.name?.message}</span>
              </Field>

              {/* Kategori & Brand */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="category">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loadingCreate}
                      >
                        <SelectTrigger id="division" className="w-full">
                          <SelectValue placeholder="-- Select Category --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apd">apd</SelectItem>
                          <SelectItem value="tools">tools</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <span className="text-red-500 text-sm">{form.formState.errors.category?.message}</span>
                </Field>

                <div>
                  <Field>
                    <Label htmlFor="brand">
                      Brand / Merk <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...form.register("brand")}
                      type="text"
                      id="brand"
                      placeholder="Tekiro"
                      disabled={loadingCreate}
                    />
                    <span className="text-red-500 text-sm">{form.formState.errors.brand?.message}</span>
                  </Field>
                </div>
              </div>

              {/* Tipe/Model & Ukuran */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Field>
                    <Label htmlFor="type">Tipe / Model </Label>
                    <Input
                      {...form.register("type")}
                      type="text"
                      id="type"
                      placeholder="Type 3 Model A"
                      disabled={loadingCreate}
                    />
                    <span className="text-red-500 text-sm">{form.formState.errors.type?.message}</span>
                  </Field>
                </div>
                <div>
                  <Field>
                    <Label htmlFor="size">
                      Size <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loadingCreate}
                        >
                          <SelectTrigger id="size" className="w-full">
                            <SelectValue placeholder="-- Select Size --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="s">s</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="l">l</SelectItem>
                            <SelectItem value="xl">xl</SelectItem>
                            <SelectItem value="xxl">xxl</SelectItem>
                            <SelectItem value="universal">universal</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <span className="text-red-500 text-sm">{form.formState.errors.size?.message}</span>
                  </Field>
                </div>
              </div>

              {/* Satuan */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Field>
                    <Label htmlFor="unit">
                      Unit <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loadingCreate}
                        >
                          <SelectTrigger id="unit" className="w-full">
                            <SelectValue placeholder="-- Select Unit --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pcs">pcs</SelectItem>
                            <SelectItem value="set">set</SelectItem>
                            <SelectItem value="unit">unit</SelectItem>
                            <SelectItem value="pair">pair</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <span className="text-red-500 text-sm">{form.formState.errors.unit?.message}</span>
                  </Field>
                </div>

                <div>
                  <Field>
                    <Label htmlFor="min_stock">Min Stock</Label>
                    <Input
                      {...form.register("min_stock", {
                        setValueAs: (value) => (value === "" ? null : Number(value)),
                      })}
                      type="number"
                      id="min_stock"
                      placeholder="0"
                      disabled={loadingCreate}
                    />
                    <span className="text-red-500 text-sm">{form.formState.errors.min_stock?.message}</span>
                    <span className="text-blue-600 text-sm">Sistem akan notifikasi jika stok ≤ nilai ini</span>
                  </Field>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <Field>
                  <Label htmlFor="description">Deskripsi Barang</Label>
                  <Textarea
                    {...form.register("description")}
                    id="description"
                    placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, repellat."
                    disabled={loadingCreate}
                  />
                  <span className="text-red-500 text-sm">{form.formState.errors.description?.message}</span>
                </Field>
              </div>

              {/* Actions */}
              <div className="mt-1 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                {errorCreate && <p className="text-sm text-red-500">{errorCreate}</p>}
                <button
                  type="button"
                  onClick={form.handleSubmit(handlebuttonCreate)}
                  disabled={loadingCreate}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {loadingCreate ? "Menyimpan..." : "Simpan Barang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateItems;