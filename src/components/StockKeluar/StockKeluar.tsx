// StockKeluar.tsx
import { AlertCircle, CalendarDays, Check, CheckCircle2, Loader2, Plus, Trash2, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useEffect, type ReactNode } from "react";
import UsegetItems from "@/hooks/items/getItems";
import useGetEmployes from "@/hooks/employes/getEmployes";
import { useForm, useFieldArray } from "react-hook-form";
import { StockOutSchema } from "@/schemas/StockOut";
import type { StockOut } from "@/schemas/StockOut";

import { zodResolver } from "@hookform/resolvers/zod";
import useSubmitStockKeluar from "@/hooks/StokKeluar/submit2hooks";

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

// ============================================================

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
  const watchedDate = form.watch("date");

  const selectedEmployee = employees.find((employee) => employee.id.toString() === watchedEmployeeId);

  const formattedDate = watchedDate
    ? new Date(watchedDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const totalQty = (watchedItems ?? []).reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);

  const inisial = (selectedEmployee?.user.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      {/* ================= KOLOM KIRI ================= */}
      <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
        {/* Pilih Karyawan */}
        <Card title="Pilih Karyawan">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employes_id" className={labelClassName}>
                Karyawan <span className="text-[#B3261E]">*</span>
              </Label>
              <select
                id="employes_id"
                className={selectClassName}
                disabled={submitting}
                {...form.register("employes_id")}
              >
                <option value="">{loadingEmployees ? "Memuat karyawan..." : "-- Pilih karyawan --"}</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id.toString()}>
                    {employee.user.name} ({employee.division})
                  </option>
                ))}
              </select>
              <FieldError message={form.formState.errors.employes_id?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className={labelClassName}>
                Tanggal Pengeluaran <span className="text-[#B3261E]">*</span>
              </Label>
              <Input id="date" type="date" className={inputClassName} {...form.register("date")} />
              <FieldError message={form.formState.errors.date?.message} />
            </div>
          </div>

          {selectedEmployee && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#BFCCE3] bg-[#F9F7F7] p-3 sm:p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#112D4E] text-sm font-bold text-white">
                {inisial || <User className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#112D4E]">{selectedEmployee.user.name}</p>
                <p className="truncate text-sm text-[#50688C]">
                  {selectedEmployee.division}, {selectedEmployee.position}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Daftar Barang */}
        <Card title="Daftar Barang">
          {/* header kolom (hanya tablet ke atas) */}
          <div className="mb-1 hidden grid-cols-[2rem_1fr_7rem_2.5rem] gap-3 border-b border-[#DBE2EF] pb-2 text-sm font-semibold text-[#112D4E] sm:grid">
            <span>No</span>
            <span>Barang</span>
            <span>Qty</span>
            <span />
          </div>

          <div className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-[#DBE2EF]">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative grid grid-cols-1 gap-3 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] px-3 pb-3 pt-11 sm:grid-cols-[2rem_1fr_7rem_2.5rem] sm:items-start sm:rounded-none sm:border-0 sm:bg-white sm:px-0 sm:pb-3 sm:pt-3"
              >
                {/* label nomor: mobile di pojok kartu, tablet+ di kolom No */}
                <p className="absolute left-3 top-3 text-sm font-bold text-[#112D4E] sm:hidden">
                  Barang {index + 1}
                </p>
                <span className="hidden pt-3 text-sm text-[#50688C] sm:block">{index + 1}</span>

                <div className="min-w-0">
                  <select
                    className={selectClassName}
                    disabled={submitting}
                    {...form.register(`items.${index}.items_id`)}
                  >
                    <option value="">{loadingItems ? "Memuat barang..." : "-- Pilih barang --"}</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id.toString()}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <FieldError message={form.formState.errors.items?.[index]?.items_id?.message} />
                </div>

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
            onClick={() => append({ items_id: "", qty: 0 })}
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
            placeholder="Keperluan peminjaman / pemberian barang..."
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
            <div>
              <p className="text-[#50688C]">No. Transaksi</p>
              <p
                className={`flex items-center gap-1.5 break-all font-bold ${
                  result?.transaction_number ? "text-[#112D4E]" : "text-[#3F72AF]"
                }`}
              >
                {result?.transaction_number && <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3F72AF]" />}
                {result?.transaction_number ?? "Dibuat otomatis"}
              </p>
            </div>
            <Row label="Karyawan" value={selectedEmployee?.user.name ?? "—"} />
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

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{error}</span>
            </div>
          )}

          <Button
            disabled={submitting}
            className="mt-4 h-12 w-full gap-2 rounded-lg bg-[#112D4E] text-base font-bold text-white transition hover:bg-[#0B2240] active:scale-[0.99] disabled:opacity-60 sm:text-sm"
            onClick={form.handleSubmit(handleCreate)}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Simpan transaksi
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockKeluar;