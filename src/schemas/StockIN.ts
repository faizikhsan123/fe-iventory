import { z } from "zod";

export const StockMasukSchema = z.object({
  supplier_id: z.string("Supplier Wajib Dipilih").min(1, "Supplier wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  note: z.string("Maksimal 200 karakter").max(200).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        item_id: z.string("Barang Wajib Dipilih").min(1, "Barang wajib dipilih"),
        qty: z.number("Masukkan Angka Bulat").min(1, "Qty minimal 1"),
        unit: z.enum(["pcs", "set", "pair", "unit"], {
          message: "Pilih Satuan",
        }),
      })
    )
    .min(1, "Minimal 1 barang"),
});

export type StockMasuk = z.infer<typeof StockMasukSchema>;