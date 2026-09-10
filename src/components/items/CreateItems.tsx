"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, Upload, Eye, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { Label } from "../ui/label";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

const CreateItems = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    namaBarang: "",
    kategori: "",
    brand: "",
    tipeModel: "",
    ukuran: "",
    satuan: "PCS",
    deskripsi: "",
    lokasiSimpan: "",
    hargaPerolehan: "",
    statusBarang: "Active",
    minimumStok: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handlePreview = () => {
    console.log("Preview data:", form);
  };

  const handleSubmit = () => {
    console.log("Simpan barang:", form);
  };

  const navigation = useNavigate();

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
              <h2 className="mb-4 text-sm font-semibold text-slate-900">Foto Barang</h2>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={handleBrowseClick}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50/30"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Klik untuk upload foto</p>
                      <p className="mt-1 text-xs text-slate-400">PNG, JPG max. 5MB</p>
                    </div>
                    <span className="mt-1 rounded-lg bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600">
                      Browse File
                    </span>
                  </>
                )}
              </button>
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
                  // {...form.register("password")}
                  type="text"
                  id="nama"
                  placeholder="Safety Glases"
                  // disabled={loadingCreate}
                />
                {/* <span className="text-red-500 text-sm">{form.formState.errors.password?.message}</span> */}
              </Field>

              {/* Kategori & Brand */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="category">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  {/* <Controller
                    // control={form.control}
                    name="division"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        // disabled={loadingCreate}
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
                  /> */}
                  {/* <span className="text-red-500 text-sm">{form.formState.errors.division?.message}</span> */}
                </Field>

                <div>
                  <Field>
                    <Label htmlFor="password">
                      Brand / Merk <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      // {...form.register("password")}
                      type="text"
                      id="brand"
                      placeholder="Tekiro"
                      // disabled={loadingCreate}
                    />
                    {/* <span className="text-red-500 text-sm">{form.formState.errors.password?.message}</span> */}
                  </Field>
                </div>
              </div>

              {/* Tipe/Model & Ukuran */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Field>
                    <Label htmlFor="type">Tipe / Merk</Label>
                    <Input
                      // {...form.register("password")}
                      type="text"
                      id="type"
                      placeholder="....."
                      // disabled={loadingCreate}
                    />
                    {/* <span className="text-red-500 text-sm">{form.formState.errors.password?.message}</span> */}
                  </Field>
                </div>
                <div>
                  <Field>
                    <Label htmlFor="size">
                      Size <span className="text-red-500">*</span>
                    </Label>
                  </Field>
                </div>
              </div>

              {/* Satuan */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Field>
                    <Label htmlFor="unit">
                      Satuan <span className="text-red-500">*</span>
                    </Label>
                  </Field>
                </div>

                <div>
                  <Field>
                    <Label htmlFor="min_stock">Min Stock</Label>
                    <Input
                      // {...form.register("password")}
                      type="number"
                      id="min_stock"
                      placeholder="0"
                      // disabled={loadingCreate}
                    />
                    {/* <span className="text-red-500 text-sm">{form.formState.errors.password?.message}</span> */}
                  </Field>
                  <p className="mt-1.5 text-xs text-blue-600">Sistem akan notif jika stok ≤ nilai ini</p>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <Field>
                  <Label htmlFor="description">Deskripsi Barang</Label>
                  <Textarea
                    // {...form.register("password")}

                    id="description"
                    placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, repellat."
                    // disabled={loadingCreate}
                  />
                  {/* <span className="text-red-500 text-sm">{form.formState.errors.password?.message}</span> */}
                </Field>
              </div>

              {/* Lokasi Simpan & Harga Perolehan */}
              {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Lokasi Simpan</label>
                  <input
                    type="text"
                    name="lokasiSimpan"
                    value={form.lokasiSimpan}
                    onChange={handleChange}
                    placeholder="e.g. Gudang A - Rak 3B"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Harga Perolehan</label>
                  <input
                    type="text"
                    name="hargaPerolehan"
                    value={form.hargaPerolehan}
                    onChange={handleChange}
                    placeholder="Rp 0"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div> */}

              {/* Actions */}
              <div className="mt-1 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                  Simpan Barang
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
