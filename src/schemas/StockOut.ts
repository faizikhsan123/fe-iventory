import { z } from "zod";

export const StockOutItemSchema = z.object({
  items_id: z.string("Barang wajib dipilih").min(1, "Barang wajib dipilih"),
  qty: z.number("Masukkan angka bulat").min(1, "Qty minimal 1"),
});

export const StockOutSchema = z.object({
  date: z.string().min(1),
  employes_id: z.string("Karyawan wajib dipilih").min(1, "Karyawan wajib dipilih"),
  note: z.string("Maksimal 200 karakter").max(200).optional().or(z.literal("")),
  items: z.array(StockOutItemSchema).min(1, "Minimal 1 barang harus ditambahkan"),
});

export type StockOutItem = z.infer<typeof StockOutItemSchema>;
export type StockOut = z.infer<typeof StockOutSchema>;
