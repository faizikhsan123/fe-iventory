import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useEffect } from "react";
import UsegetItems from "@/hooks/items/getItems";
import useGetEmployes from "@/hooks/employes/getEmployes";
import { useForm, useFieldArray } from "react-hook-form";
import { StockOutSchema } from "@/schemas/StockOut";
import type { StockOut } from "@/schemas/StockOut";

import { zodResolver } from "@hookform/resolvers/zod";
import useSubmitStockKeluar from "@/hooks/StokKeluar/submit2hooks";

const selectClassName =
  "flex h-9 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

const StockKeluar = () => {
  const { data: items, loading: loadingItems, getItems } = UsegetItems();
  const { data: employees, loading: loadingEmployees, getEmployesButton } = useGetEmployes();
  const { submit, submitting, error, result } = useSubmitStockKeluar();

  const form = useForm<StockOut>({
    resolver: zodResolver(StockOutSchema),
    defaultValues: {
      employes_id: "",
      note: "",
      items: [{ items_id: "", qty: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleCreate = async (data: StockOut) => {
    const res = await submit(data);
    if (res) {
      form.reset({
        employes_id: "",
        note: "",
        items: [{ items_id: "", qty: undefined }],
      });
    }
  };

  useEffect(() => {
    getItems();
    getEmployesButton();
  }, []);

  const watchedEmployeeId = form.watch("employes_id");
  const watchedItems = form.watch("items");

  const selectedEmployee = employees.find((employee) => employee.id.toString() === watchedEmployeeId);

  const watchedDate = form.watch("date");

  const formattedDate = watchedDate
    ? new Date(watchedDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom kiri */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pilih Karyawan */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-slate-900">Pilih Karyawan</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Karyawan <span className="text-red-500">*</span>
                </Label>
                <select
                  id="employes_id"
                  className={selectClassName}
                  disabled={submitting}
                  {...form.register("employes_id")}
                >
                  <option value="">{loadingEmployees ? "Memuat karyawan" : "-- Pilih karyawan --"}</option>
                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id.toString()}
                    >
                      {employee.user.name} — {employee.division}
                    </option>
                  ))}
                </select>
                <span className="text-red-500 text-sm">{form.formState.errors.employes_id?.message}</span>
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

            {selectedEmployee && (
              <div className="self-end rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="font-semibold text-slate-900">{selectedEmployee.user.name}</p>
                <p className="text-sm text-slate-500">
                  {selectedEmployee.division} · {selectedEmployee.position}
                </p>
              </div>
            )}
          </div>

          {/* Daftar Barang */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Daftar Barang</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-blue-600 hover:text-blue-700"
                onClick={() => append({ items_id: "", qty: 0 })}
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
                          disabled={submitting}
                          {...form.register(`items.${index}.items_id`)}
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
                          {form.formState.errors.items?.[index]?.items_id?.message}
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
              placeholder="Keperluan peminjaman / pemberian barang..."
              rows={4}
              className="bg-white min-h-[100px]"
            />
            <span className="text-red-500 text-sm">{form.formState.errors.note?.message}</span>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-slate-900">Ringkasan Transaksi</h2>

          <div className="space-y-4 rounded-lg bg-slate-50 p-4 text-sm">
            <div>
              <p className="text-slate-500">No. Transaksi</p>
              <p className="font-semibold text-blue-600">{result?.transaction_number ?? "Akan dibuat otomatis"}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Karyawan</span>
              <span className="font-semibold text-slate-900">{selectedEmployee?.user.name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total Item</span>
              <span className="font-semibold text-slate-900">{watchedItems?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tanggal</span>
              <span className="font-semibold text-slate-900">{formattedDate}</span>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-4 space-y-2">
            <Button
              disabled={submitting}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={form.handleSubmit(handleCreate)}
            >
              <Check className="h-4 w-4" />
              {submitting ? "Menyimpan..." : "Submit Transaksi"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockKeluar;