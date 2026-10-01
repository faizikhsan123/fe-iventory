// TambahStock.tsx
import { AlertCircle, CalendarDays, Check, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useEffect, type ReactNode } from "react";
import UsegetItems from "@/hooks/items/getItems";
import { useSupplier } from "@/hooks/suppliers/getSupplier";
import { useForm, useFieldArray } from "react-hook-form";
import { StockMasukSchema } from "@/schemas/StockIN";
import type { StockMasuk } from "@/schemas/StockIN";

import { zodResolver } from "@hookform/resolvers/zod";
import Usecreate from "@/hooks/Stock-masuk/create";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border input #BFCCE3, muted #50688C,
           placeholder #7B8FAE, redup di navy #9DB2D3
*/

// Semua field solid putih (tidak transparan). text-base di HP biar iOS tidak auto-zoom.
const fieldBase =
  "w-full rounded-lg border border-[#BFCCE3] bg-white px-3 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF] disabled:cursor-not-allowed disabled:bg-[#DBE2EF] disabled:opacity-70 sm:text-sm";

const selectClassName = `flex h-11 items-center ${fieldBase}`;
const inputClassName = `h-11 ${fieldBase}`;
const areaClassName = `min-h-[110px] py-3 ${fieldBase}`;
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

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[#50688C]">{label}</span>
    <span className="min-w-0 truncate text-right font-semibold text-[#112D4E]">{value}</span>
  </div>
);

const defaultFormValues: StockMasuk = {
  supplier_id: "",
  date: "",
  note: "",
  items: [
    {
      item_id: "",
      qty: undefined as unknown as number,
      unit: undefined as unknown as StockMasuk["items"][number]["unit"],
    },
  ],
};

// ============================================================

const TambahStock = () => {
  const { data: items, loading: loadingItems, getItems } = UsegetItems();
  const { dataSUpplier: suppliers, getSupplier, loadingSupplier } = useSupplier();
  const { errorStockMasuk, handleStockIn, loadingStockMasuk } = Usecreate();

  const form = useForm<StockMasuk>({
    resolver: zodResolver(StockMasukSchema),
    defaultValues: defaultFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleCreate = async (data: StockMasuk) => {
    const res = await handleStockIn(data);
    if (res) {
      form.reset(defaultFormValues);
    }
  };

  useEffect(() => {
    getItems();
    getSupplier();
  }, []);

  const watchedSupplierId = form.watch("supplier_id");
  const watchedItems = form.watch("items");
  const watchedDate = form.watch("date");

  const selectedSupplier = suppliers.find((supplier) => supplier.id.toString() === watchedSupplierId);

  const formattedDate = watchedDate
    ? new Date(watchedDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  // sync unit otomatis tiap baris ketika item dipilih
  const handleItemChange = (index: number, itemId: string) => {
    form.setValue(`items.${index}.item_id`, itemId);
    const selectedItem = items.find((item) => item.id.toString() === itemId);
    if (selectedItem) {
      form.setValue(`items.${index}.unit`, selectedItem.unit as StockMasuk["items"][number]["unit"]);
    }
  };

  const totalQty = watchedItems?.reduce((sum, line) => sum + (Number(line?.qty) || 0), 0) ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      {/* ================= KOLOM KIRI ================= */}
      <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
        {/* Pilih Supplier */}
        <Card title="Pilih Supplier">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier_id" className={labelClassName}>
                Supplier <span className="text-[#B3261E]">*</span>
              </Label>
              <select
                id="supplier_id"
                className={selectClassName}
                disabled={loadingStockMasuk}
                {...form.register("supplier_id")}
              >
                <option value="">{loadingSupplier ? "Memuat supplier..." : "-- Pilih supplier --"}</option>
                {suppliers
                  .filter((supplier) => supplier.status === "active")
                  .map((supplier) => (
                    <option key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </option>
                  ))}
              </select>
              <FieldError message={form.formState.errors.supplier_id?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className={labelClassName}>
                Tanggal Penerimaan <span className="text-[#B3261E]">*</span>
              </Label>
              <Input id="date" type="date" className={inputClassName} {...form.register("date")} />
              <FieldError message={form.formState.errors.date?.message} />
            </div>
          </div>
        </Card>

        {/* Daftar Barang */}
        <Card title="Daftar Barang">
          {/* header kolom (hanya tablet ke atas) */}
          <div className="mb-1 hidden grid-cols-[2rem_1fr_6rem_6rem_2.5rem] gap-3 border-b border-[#DBE2EF] pb-2 text-sm font-semibold text-[#112D4E] sm:grid">
            <span>No</span>
            <span>Barang</span>
            <span>Qty</span>
            <span>Unit</span>
            <span />
          </div>

          <div className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-[#DBE2EF]">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative grid grid-cols-2 gap-3 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] px-3 pb-3 pt-11 sm:grid-cols-[2rem_1fr_6rem_6rem_2.5rem] sm:items-start sm:rounded-none sm:border-0 sm:bg-white sm:px-0 sm:pb-3 sm:pt-3"
              >
                {/* label nomor: mobile di pojok kartu, tablet+ di kolom No */}
                <p className="absolute left-3 top-3 text-sm font-bold text-[#112D4E] sm:hidden">
                  Barang {index + 1}
                </p>
                <span className="hidden pt-3 text-sm text-[#50688C] sm:block">{index + 1}</span>

                {/* Barang */}
                <div className="col-span-2 min-w-0 sm:col-span-1">
                  <select
                    className={selectClassName}
                    disabled={loadingStockMasuk}
                    value={watchedItems?.[index]?.item_id ?? ""}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                  >
                    <option value="">{loadingItems ? "Memuat barang..." : "-- Pilih barang --"}</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id.toString()}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <FieldError message={form.formState.errors.items?.[index]?.item_id?.message} />
                </div>

                {/* Qty */}
                <div className="min-w-0">
                  <Input
                    placeholder="Qty"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    className={inputClassName}
                    {...form.register(`items.${index}.qty`, {
                      setValueAs: (value) => (value === "" ? undefined : Number(value)),
                    })}
                  />
                  <FieldError message={form.formState.errors.items?.[index]?.qty?.message} />
                </div>

                {/* Unit (otomatis dari barang) */}
                <div className="min-w-0">
                  <Input
                    type="text"
                    readOnly
                    placeholder="Unit"
                    className={`${inputClassName} cursor-not-allowed !bg-[#DBE2EF] text-[#50688C]`}
                    {...form.register(`items.${index}.unit`)}
                  />
                  <FieldError message={form.formState.errors.items?.[index]?.unit?.message} />
                </div>

                {/* Hapus */}
                <div className="absolute right-2 top-1.5 sm:static">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Hapus barang ${index + 1}`}
                      className="grid h-10 w-10 place-items-center rounded-lg text-[#50688C] transition hover:bg-[#FDECEA] hover:text-[#B3261E] active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <FieldError message={form.formState.errors.items?.message as string} />

          <button
            type="button"
            onClick={() =>
              append({
                item_id: "",
                qty: undefined as unknown as number,
                unit: undefined as unknown as StockMasuk["items"][number]["unit"],
              })
            }
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#9DB2D3] bg-white text-sm font-semibold text-[#112D4E] transition hover:border-[#3F72AF] hover:bg-[#F9F7F7] active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            Tambah baris
          </button>
        </Card>

        {/* Catatan */}
        <Card title="Catatan">
          <Textarea
            {...form.register("note")}
            placeholder="Catatan tambahan tentang penerimaan barang ini..."
            rows={4}
            className={areaClassName}
          />
          <FieldError message={form.formState.errors.note?.message} />
        </Card>
      </div>

      {/* ================= RINGKASAN ================= */}
      <div className="h-fit min-w-0 overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl lg:sticky lg:top-6">
        <div className="bg-[#112D4E] px-4 py-4 text-white sm:px-6">
          <h2 className="font-bold">Ringkasan Transaksi</h2>
          <p className="mt-0.5 text-xs text-[#9DB2D3]">Periksa kembali sebelum menyimpan</p>
        </div>
        <div className="h-1 w-full bg-[#3F72AF]" />

        <div className="p-4 sm:p-6">
          <div className="space-y-3.5 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-4 text-sm">
            <Row label="Supplier" value={selectedSupplier?.name ?? "—"} />
            <Row
              label="Tanggal"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[#3F72AF]" />
                  {formattedDate}
                </span>
              }
            />
            <Row label="Total Item" value={watchedItems?.length ?? 0} />
            <Row label="Total Qty" value={totalQty.toLocaleString("id-ID")} />
          </div>

          {errorStockMasuk && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{errorStockMasuk}</span>
            </div>
          )}

          <Button
            disabled={loadingStockMasuk}
            className="mt-4 h-12 w-full gap-2 rounded-lg bg-[#112D4E] text-base font-bold text-white transition hover:bg-[#0B2240] active:scale-[0.99] disabled:opacity-60 sm:text-sm"
            onClick={form.handleSubmit(handleCreate)}
          >
            {loadingStockMasuk ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Simpan penerimaan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TambahStock;