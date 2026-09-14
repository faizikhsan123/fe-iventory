import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { useEffect } from "react";
import UsegetItems from "@/hooks/items/getItems";
import { useSupplier } from "@/hooks/suppliers/getSupplier";
import { Controller, useForm } from "react-hook-form";
import { StockMasukSchema } from "@/schemas/StockIN";
import type { StockMasuk } from "@/schemas/StockIN";

import { zodResolver } from "@hookform/resolvers/zod";
import Usecreate from "@/hooks/Stock-masuk/create";

const TambahStock = () => {
  const { data, loading, getItems } = UsegetItems();
  const { dataSUpplier, getSupplier, loadingSupplier } = useSupplier();
  const { errorStockMasuk, handleStockIn, loadingStockMasuk } = Usecreate();

  const handleCreate = async (data: StockMasuk) => {
    try {
      await handleStockIn(data);
      form.reset({
        item_id: "",
        supplier_id: "",
        qty: undefined,
        unit: undefined,
        date: "",
        note: "",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const form = useForm<StockMasuk>({
    resolver: zodResolver(StockMasukSchema),
  });

  // fetch sekali aja pas mount
  useEffect(() => {
    getItems();
    getSupplier();
  }, []);

  // log terpisah, ikut tiap kali data berubah
  useEffect(() => {
    console.log("items data updated:", data);
  }, [data]);

  useEffect(() => {
    console.log("supplier data updated:", dataSUpplier);
  }, [dataSUpplier]);

  // sync unit setiap item_id berubah
  const selectedItemId = form.watch("item_id");

  useEffect(() => {
    if (!selectedItemId) return;

    const selectedItem = data.find((item) => item.id.toString() === selectedItemId);

    if (selectedItem) {
      form.setValue("unit", selectedItem.unit);
    }
  }, [selectedItemId, data]);

  const watchedItemId = form.watch("item_id");
  const watchedQty = form.watch("qty");
  const watchedDate = form.watch("date");
  const watchedSupplier = form.watch("supplier_id");

  const selectedItem = data.find((item) => item.id.toString() === watchedItemId);

  const selectedSupplier = data.find((supplier) => supplier.id.toString() === watchedSupplier);

  const formattedDate = watchedDate
    ? new Date(watchedDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const stokSetelah = selectedItem && watchedQty ? selectedItem.current_stock + Number(watchedQty) : "—";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-6 mt-3 font-semibold text-slate-900">Form Penerimaan Barang</h2>

          <div className="space-y-5">
            {/* Pilih Barang */}
            <div className="space-y-2">
              <Label>
                Pilih Barang <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={form.control}
                name="item_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loadingStockMasuk}
                  >
                    <SelectTrigger
                      id="item_id"
                      className="w-full"
                    >
                      <SelectValue placeholder={loading ? "Memuat barang" : "-- Pilih barang --"} />
                    </SelectTrigger>
                    <SelectContent>
                      {data.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <span className="text-red-500 text-sm">{form.formState.errors.item_id?.message}</span>
            </div>

            {/* Pilih Supplier */}
            <div className="space-y-2">
              <Label>
                Pilih Supplier <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loadingStockMasuk}
                  >
                    <SelectTrigger
                      id="supplier_id"
                      className="w-full"
                    >
                      <SelectValue placeholder={loadingSupplier ? "Memuat Supplier" : "-- Pilih Supplier --"} />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSUpplier
                        .filter((supplier) => supplier.status === "active")
                        .map((supplier) => (
                          <SelectItem
                            key={supplier.id}
                            value={supplier.id.toString()}
                          >
                            {supplier.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <span className="text-red-500 text-sm">{form.formState.errors.supplier_id?.message}</span>
            </div>

            {/* Jumlah Diterima & Satuan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Jumlah Diterima <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...form.register("qty", {
                    setValueAs: (value) => (value === "" ? null : Number(value)),
                  })}
                  type="number"
                  placeholder="0"
                />
                <span className="text-red-500 text-sm">{form.formState.errors.qty?.message}</span>
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  type="text"
                  readOnly
                  {...form.register("unit")}
                />
                <span className="text-red-500 text-sm">{form.formState.errors.unit?.message}</span>
                {/* <Controller
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loadingStockMasuk}
                    >
                      <SelectTrigger
                        id="unit"
                        className="w-full"
                      >
                        <SelectValue placeholder="-- Pilih satuan --" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map((unit) => (
                          <SelectItem
                            key={unit}
                            value={unit}
                          >
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                /> */}
                <span className="text-red-500 text-sm">{form.formState.errors.unit?.message}</span>
              </div>
            </div>

            {/* No. Surat Jalan & Tanggal Penerimaan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Tanggal Penerimaan <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  {...form.register("date")}
                />
                <span className="text-red-500 text-sm">{form.formState.errors.date?.message}</span>
                <span className="text-red-500 text-sm">{form.formState.errors.date?.message}</span>
              </div>
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea
                  {...form.register("note")}
                  placeholder="Catatan tambahan tentang penerimaan barang ini..."
                  rows={4}
                />
              </div>
            </div>

            {/* Catatan */}
            <div className="space-y-2"></div>
          </div>
        </div>

        {/* Ringkasan Card */}
        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-slate-900">Ringkasan</h2>
          <div className="space-y-3 rounded-lg bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tanggal</span>
              <span className="font-semibold text-slate-900">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Barang</span>
              <span className="font-semibold text-slate-900">{selectedItem?.name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Supplier</span>
              <span className="font-semibold text-slate-900">{selectedSupplier?.name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Qty Diterima</span>
              <span className="font-semibold text-slate-900">{watchedQty ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Stok Setelah</span>
              <span className="font-semibold text-slate-900">{stokSetelah}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Button
              disabled={loadingStockMasuk}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={form.handleSubmit(handleCreate)}
            >
              <Check className="h-4 w-4" />
              Simpan Penerimaan
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-red-200 text-2xl text-center">{errorStockMasuk}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahStock;
