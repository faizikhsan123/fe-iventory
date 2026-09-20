"use client";
import { ChevronLeft, Check, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { itemsSchema, type ItemsCreate } from "@/schemas/items";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";


import UseUpdateItems from "@/hooks/items/updateitems";
import useGetItemById from "@/hooks/items/getByid";
import { STORAGE_URL } from "@/lib/axios";

const UpdateItems = () => {
  const navigation = useNavigate();
  const { HandleUpdate, updateerror, updateloading } = UseUpdateItems();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<ItemsCreate>({
    resolver: zodResolver(itemsSchema),
  });

  // ambil dari parameter
  const { id } = useParams();

  // ubah format
  const Itemid = Number(id);

  // fetch data lama di sini
  const { item, loadingItem } = useGetItemById(Itemid);

  // nama parameter diganti "formData" biar gak bentrok
  // sama variable lain di scope komponen ini
  const handlebuttonUpdate = async (formData: ItemsCreate) => {
    HandleUpdate(Itemid, formData);
  };

  const handleRemoveImage = () => {
    form.setValue("file", null, { shouldValidate: true });
    setPreviewImage(null);
  };

  // isi ulang form begitu data lama (item) berhasil di-fetch
  useEffect(() => {
    if (!item) return;

    form.reset({
      name: item.name,
      category: item.category,
      brand: item.brand,
      type: item.type ?? undefined,
      size: item.size,
      unit: item.unit,
      min_stock: item.min_stock ?? undefined,
      description: item.description ?? undefined,
    });
  }, [item]);

  // effect terpisah khusus buat preview, biar gampang dibaca
  // dan gak numpuk keduanya di 1 body
  useEffect(() => {
    if (item?.file) {
      setPreviewImage(`${STORAGE_URL}${item.file}`);
    }
  }, [item?.file]);

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
            <h1 className="text-xl font-bold text-slate-900">Rubah Barang</h1>
            <p className="text-sm text-slate-500">Isi form di bawah untuk mengubah barang di inventaris</p>
          </div>
        </div>

        {loadingItem ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            Memuat data barang...
          </div>
        ) : (
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
                        onClick={() => handleRemoveImage()}
                        disabled={updateloading}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <p className="text-xs text-slate-400">Belum ada gambar dipilih</p>
                    </div>
                  )}
                </div>

                <Field>
                  <FieldLabel htmlFor="file">Foto</FieldLabel>
                  <Controller
                    control={form.control}
                    name="file"
                    // karena chosefile itu state dinamis jadi kita perlu ref kan
                    // seperti obx di flutter
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <Input
                        id="file"
                        name={name}
                        ref={ref}
                        onBlur={onBlur}
                        type="file"
                        accept="image/png, image/jpg, image/jpeg"
                        disabled={updateloading}
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;

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
                    disabled={updateloading}
                  />
                  <span className="text-red-500 text-sm">{form.formState.errors.name?.message}</span>
                </Field>

                {/* Kategori & Brand */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <Label htmlFor="category">
                      Kategori <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="category"
                      disabled={updateloading}
                      {...form.register("category")}
                    >
                      <option value=""> -- Pilih Kategori --</option>
                      <option value="apd">APD</option>
                      <option value="tools">Tools</option>
                    </select>
                   
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
                        disabled={updateloading}
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
                        disabled={updateloading}
                      />
                      <span className="text-red-500 text-sm">{form.formState.errors.type?.message}</span>
                    </Field>
                  </div>
                  <div>
                    <Field>
                      <Label htmlFor="size">
                        Size <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="size"
                        disabled={updateloading}
                        {...form.register("size")}
                      >
                        <option value="">--Pilih Ukuran--</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                        <option value="xxl">XXL</option>
                        <option value="universal">Universal</option>
                      </select>
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
                      <select
                        id="unit"
                        disabled={updateloading}
                        {...form.register("unit")}
                      >
                        <option value=""> -- Pilih Satuan --</option>
                        <option value="pcs">PCS</option>
                        <option value="set">SET</option>
                        <option value="unit">UNIT</option>
                        <option value="pair">PAIR</option>
                      </select>
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
                        disabled={updateloading}
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
                      disabled={updateloading}
                    />
                    <span className="text-red-500 text-sm">{form.formState.errors.description?.message}</span>
                  </Field>
                </div>

                {/* Actions */}
                <div className="mt-1 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                  {updateerror && <p className="text-sm text-red-500">{updateerror}</p>}
                  <button
                    type="button"
                    onClick={form.handleSubmit(handlebuttonUpdate)}
                    disabled={updateloading}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    {updateloading ? "Menyimpan..." : "Simpan Barang"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateItems;
