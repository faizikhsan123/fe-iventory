// TambahStock.tsx
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useEffect } from "react";
import UsegetItems from "@/hooks/items/getItems";
import { useSupplier } from "@/hooks/suppliers/getSupplier";
import { useForm, useFieldArray } from "react-hook-form";
import { StockMasukSchema } from "@/schemas/StockIN";
import type { StockMasuk } from "@/schemas/StockIN";

import { zodResolver } from "@hookform/resolvers/zod";
import Usecreate from "@/hooks/Stock-masuk/create";

const selectClassName =
  "flex h-9 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom kiri */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pilih Supplier */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">Pilih Supplier</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Supplier <span className="text-red-500">*</span>
                </Label>
                <select
                  id="supplier_id"
                  className={selectClassName}
                  disabled={loadingStockMasuk}
                  {...form.register("supplier_id")}
                >
                  <option value="">{loadingSupplier ? "Memuat supplier" : "-- Pilih supplier --"}</option>
                  {suppliers
                    .filter((supplier) => supplier.status === "active")
                    .map((supplier) => (
                      <option
                        key={supplier.id}
                        value={supplier.id.toString()}
                      >
                        {supplier.name}
                      </option>
                    ))}
                </select>
                <span className="text-red-500 text-sm">{form.formState.errors.supplier_id?.message}</span>
              </div>

              <div className="space-y-2">
                <Label>
                  Tanggal Penerimaan <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  {...form.register("date")}
                />
                <span className="text-red-500 text-sm">{form.formState.errors.date?.message}</span>
              </div>
            </div>
          </div>

          {/* Daftar Barang */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Daftar Barang</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-blue-600 hover:text-blue-700"
                onClick={() =>
                  append({
                    item_id: "",
                    qty: undefined as unknown as number,
                    unit: undefined as unknown as StockMasuk["items"][number]["unit"],
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Tambah Baris
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
                    <th className="w-8 py-2 font-medium">No</th>
                    <th className="py-2 font-medium">Barang</th>
                    <th className="w-24 py-2 font-medium">Qty</th>
                    <th className="w-24 py-2 font-medium">Unit</th>
                    <th className="w-8 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr
                      key={field.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-3 align-top text-slate-500">{index + 1}</td>
                      <td className="py-3 pr-3 align-top">
                        <select
                          className={selectClassName}
                          disabled={loadingStockMasuk}
                          value={watchedItems?.[index]?.item_id ?? ""}
                          onChange={(e) => handleItemChange(index, e.target.value)}
                        >
                          <option value="">{loadingItems ? "Memuat barang" : "-- Pilih barang --"}</option>
                          {items.map((item) => (
                            <option
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.items?.[index]?.item_id?.message}
                        </span>
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <Input
                          placeholder="0"
                          type="number"
                          min={1}
                          {...form.register(`items.${index}.qty`, {
                            setValueAs: (value) => (value === "" ? undefined : Number(value)),
                          })}
                        />
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.items?.[index]?.qty?.message}
                        </span>
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <Input
                          type="text"
                          readOnly
                          {...form.register(`items.${index}.unit`)}
                        />
                        <span className="text-red-500 text-sm">
                          {form.formState.errors.items?.[index]?.unit?.message}
                        </span>
                      </td>
                      <td className="py-3 align-top">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className="text-red-500 text-sm">{form.formState.errors.items?.message as string}</span>
            </div>
          </div>

          {/* Catatan */}
          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea
              cols={3}
              {...form.register("note")}
              placeholder="Catatan tambahan tentang penerimaan barang ini..."
              rows={4}
              className="bg-white min-h-[100px]"
            />
            <span className="text-red-500 text-sm">{form.formState.errors.note?.message}</span>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Ringkasan Transaksi</h2>

          <div className="space-y-4 rounded-lg bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Supplier</span>
              <span className="font-semibold text-slate-900">{selectedSupplier?.name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total Item</span>
              <span className="font-semibold text-slate-900">{watchedItems?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total Qty</span>
              <span className="font-semibold text-slate-900">{totalQty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tanggal</span>
              <span className="font-semibold text-slate-900">{formattedDate}</span>
            </div>
          </div>

          {errorStockMasuk && <p className="mt-3 text-sm text-red-500">{errorStockMasuk}</p>}

          <div className="mt-4 space-y-2">
            <Button
              disabled={loadingStockMasuk}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={form.handleSubmit(handleCreate)}
            >
              <Check className="h-4 w-4" />
              {loadingStockMasuk ? "Menyimpan..." : "Simpan Penerimaan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahStock;