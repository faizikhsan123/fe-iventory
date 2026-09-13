import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { useEffect } from "react";
import UsegetItems from "@/hooks/items/getItems";
import { useSupplier } from "@/hooks/suppliers/getSupplier";
const TambahStock = () => {
  const { data, loading, getItems } = UsegetItems();
  const { dataSUpplier, getSupplier, loadingSupplier } = useSupplier();

  useEffect(() => {
    getItems();
    getSupplier();
  }, []);
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
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loading ? "Memuat Barang0" : "--- Pilih Barang ---"} />
                </SelectTrigger>
                <SelectContent>
                  {data.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pilih Supplier */}
            <div className="space-y-2">
              <Label>
                Pilih Supplier <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingSupplier ? "Memuat Supplier" : "Pilih Supplier"} />
                </SelectTrigger>
                <SelectContent>
                  {dataSUpplier
                    .filter((supplier) => supplier.status === "active")
                    .map((supplier) => (
                      <SelectItem
                        key={supplier.id}
                        value={supplier.name}
                      >{supplier.name}</SelectItem>
                    ))}
                  {/* {dataSUpplier.map((supplier) => (
                    <SelectItem
                      key={supplier.id}
                      value={supplier.name}
                    >
                      {supplier.name}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>

            {/* Jumlah Diterima & Satuan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Jumlah Diterima <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Satuan</Label>
                <Input placeholder="PCS" />
              </div>
            </div>

            {/* No. Surat Jalan & Tanggal Penerimaan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Penerimaan</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea
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
              <span className="text-slate-500">No. Dokumen</span>
              <span className="font-semibold text-slate-900">STK-2026-7931</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tanggal</span>
              <span className="font-semibold text-slate-900">04 Agustus 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Barang</span>
              <span className="text-slate-400">—</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Qty Diterima</span>
              <span className="text-slate-400">—</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Stok Setelah</span>
              <span className="text-slate-400">—</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
              <Check className="h-4 w-4" />
              Simpan Penerimaan
            </Button>
            <Button
              variant="outline"
              className="w-full text-slate-600"
              // onClick={() => navigate(-1)}
            >
              Batal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahStock;
