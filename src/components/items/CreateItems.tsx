// CreateItems.tsx
"use client";
import { AlertCircle, Check, ChevronLeft, Image as ImageIcon, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, type ReactNode } from "react";
import { Label } from "../ui/label";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { itemsSchema, type ItemsCreate } from "@/schemas/items";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import UsecreateItems from "@/hooks/items/createItems";

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
const areaClassName = `min-h-[110px] py-3 ${fieldBase}`;
const fileClassName = `h-11 cursor-pointer py-1.5 ${fieldBase} file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#DBE2EF] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#112D4E]`;
const labelClassName = "text-sm font-semibold text-[#112D4E]";

// ---------- kerangka kecil ----------
const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
    <div className="flex items-center gap-2.5 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6 sm:py-4">
      <span className="h-4 w-1 rounded-full bg-[#3F72AF]" aria-hidden="true" />
      <h2 className="font-bold text-[#112D4E]">{title}</h2>
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs font-medium text-[#B3261E] sm:text-sm">{message}</p> : null;

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

  const formatRupiah = (value: string | number) => {
    const number = typeof value === "string" ? value.replace(/\D/g, "") : value;
    if (!number) return "";
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  const [displayPrice, setDisplayPrice] = useState(formatRupiah(form.getValues("price") || ""));

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // buang semua non-digit
    form.setValue("price", rawValue ? Number(rawValue) : 0, {
      shouldValidate: true,
    });
    setDisplayPrice(formatRupiah(rawValue));
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
        <button
          onClick={() => navigation("/items")}
          type="button"
          className="inline-flex h-10 w-fit shrink-0 items-center gap-1 rounded-lg border border-[#BFCCE3] bg-white px-3 text-sm font-semibold text-[#112D4E] transition hover:bg-[#DBE2EF] active:scale-[0.98]"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </button>

        <div className="flex min-w-0 items-stretch gap-3">
          <span className="w-1 shrink-0 rounded-full bg-[#3F72AF]" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-[#112D4E] sm:text-2xl">Tambah Barang Baru</h1>
            <p className="mt-0.5 text-xs leading-5 text-[#50688C] sm:text-sm">
              Isi form di bawah untuk menambahkan barang baru ke inventaris
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* ================= KOLOM KIRI: FOTO ================= */}
        <div className="h-fit min-w-0 lg:col-span-1">
          <Card title="Foto Barang">
            {/* Preview area */}
            <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#9DB2D3] bg-[#F9F7F7]">
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
                    aria-label="Hapus gambar"
                    className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-[#112D4E] text-white transition hover:bg-[#0B2240] disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#DBE2EF]">
                    <ImageIcon className="h-6 w-6 text-[#3F72AF]" />
                  </div>
                  <p className="text-xs text-[#50688C]">Belum ada gambar dipilih</p>
                </div>
              )}
            </div>

            <Field className="gap-2">
              <FieldLabel htmlFor="picture" className={labelClassName}>
                Foto
              </FieldLabel>
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
                    className={fileClassName}
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
              <FieldDescription className="text-xs text-[#50688C]">Pilih gambar untuk diunggah.</FieldDescription>
              <FieldError message={form.formState.errors.file?.message as string} />
            </Field>
          </Card>
        </div>

        {/* ================= KOLOM KANAN: FORM ================= */}
        <div className="min-w-0 lg:col-span-2">
          <Card title="Informasi Barang">
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Nama Barang */}
              <Field className="gap-2">
                <Label htmlFor="nama" className={labelClassName}>
                  Nama Barang <span className="text-[#B3261E]">*</span>
                </Label>
                <Input
                  {...form.register("name")}
                  type="text"
                  id="nama"
                  placeholder="Safety Glases"
                  className={inputClassName}
                  disabled={loadingCreate}
                />
                <FieldError message={form.formState.errors.name?.message} />
              </Field>

              {/* Kategori & Brand */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Field className="gap-2">
                  <Label htmlFor="category" className={labelClassName}>
                    Kategori <span className="text-[#B3261E]">*</span>
                  </Label>
                  <select
                    id="category"
                    className={selectClassName}
                    disabled={loadingCreate}
                    {...form.register("category")}
                  >
                    <option value=""> -- Pilih Kategori --</option>
                    <option value="apd">APD</option>
                    <option value="tools">Tools</option>
                    <option value="others">Others</option>
                  </select>
                  <FieldError message={form.formState.errors.category?.message} />
                </Field>

                <Field className="gap-2">
                  <Label htmlFor="brand" className={labelClassName}>
                    Brand / Merk
                  </Label>
                  <Input
                    {...form.register("brand")}
                    type="text"
                    id="brand"
                    placeholder="Tekiro"
                    className={inputClassName}
                    disabled={loadingCreate}
                  />
                  <FieldError message={form.formState.errors.brand?.message} />
                </Field>
              </div>

              {/* Tipe/Model & Ukuran */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Field className="gap-2">
                  <Label htmlFor="type" className={labelClassName}>
                    Tipe / Model
                  </Label>
                  <Input
                    {...form.register("type")}
                    type="text"
                    id="type"
                    placeholder="Type 3 Model A"
                    className={inputClassName}
                    disabled={loadingCreate}
                  />
                  <FieldError message={form.formState.errors.type?.message} />
                </Field>

                <Field className="gap-2">
                  <Label htmlFor="size" className={labelClassName}>
                    Size
                  </Label>
                  <Input
                    {...form.register("size")}
                    type="text"
                    id="size"
                    placeholder="S,X,40"
                    className={inputClassName}
                    disabled={loadingCreate}
                  />
                  <FieldError message={form.formState.errors.size?.message} />
                </Field>
              </div>

              {/* Satuan & Min Stock */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Field className="gap-2">
                  <Label htmlFor="unit" className={labelClassName}>
                    Unit <span className="text-[#B3261E]">*</span>
                  </Label>
                  <select
                    id="unit"
                    className={selectClassName}
                    disabled={loadingCreate}
                    {...form.register("unit")}
                  >
                    <option value=""> -- Pilih Satuan --</option>
                    <option value="pcs">PCS</option>
                    <option value="set">SET</option>
                    <option value="unit">UNIT</option>
                    <option value="pair">PAIR</option>
                    <option value="others">Others</option>
                  </select>
                  <FieldError message={form.formState.errors.unit?.message} />
                </Field>

                <Field className="gap-2">
                  <Label htmlFor="min_stock" className={labelClassName}>
                    Min Stock
                  </Label>
                  <Input
                    {...form.register("min_stock", {
                      setValueAs: (value) => (value === "" ? null : Number(value)),
                    })}
                    type="number"
                    inputMode="numeric"
                    id="min_stock"
                    placeholder="0"
                    className={inputClassName}
                    disabled={loadingCreate}
                  />
                  <FieldError message={form.formState.errors.min_stock?.message} />
                  <p className="text-xs text-[#3F72AF] sm:text-sm">Sistem akan notifikasi jika stok ≤ nilai ini</p>
                </Field>
              </div>

              {/* Harga */}
              <Field className="gap-2">
                <Label htmlFor="price" className={labelClassName}>
                  Harga Perolehan
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#50688C]">
                    Rp
                  </span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={displayPrice}
                    onChange={handlePriceChange}
                    id="price"
                    placeholder="50.000"
                    className={`${inputClassName} pl-10`}
                    disabled={loadingCreate}
                  />
                </div>
                <FieldError message={form.formState.errors.price?.message} />
              </Field>

              {/* Deskripsi */}
              <Field className="gap-2">
                <Label htmlFor="description" className={labelClassName}>
                  Deskripsi Barang
                </Label>
                <Textarea
                  {...form.register("description")}
                  id="description"
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, repellat."
                  className={areaClassName}
                  disabled={loadingCreate}
                />
                <FieldError message={form.formState.errors.description?.message} />
              </Field>

              {/* Actions */}
              <div className="mt-1 space-y-3 border-t border-[#DBE2EF] pt-5">
                {errorCreate && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="min-w-0 break-words">{errorCreate}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={form.handleSubmit(handlebuttonCreate)}
                    disabled={loadingCreate}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#112D4E] px-6 text-base font-bold text-white outline-none transition hover:bg-[#0B2240] focus-visible:ring-4 focus-visible:ring-[#9DB2D3] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:w-auto sm:text-sm"
                  >
                    {loadingCreate ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Simpan Barang
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateItems;