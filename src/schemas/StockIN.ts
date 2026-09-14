import { z } from "zod";

export const StockMasukSchema = z.object({
  qty: z.number("Masukkan Angka Bulat"),
  note: z.string("Maksimal 200 karakter").max(200).optional().or(z.literal("")),
  item_id: z.string("Barang Wajib Dipilih").min(1, "Barang wajib dipilih"),
  supplier_id: z.string("Supplier Wajib Dipilih").min(1, "Supplier wajib dipilih"),
  unit: z.enum(["pcs", "set", "pair", "unit"], {
    message: "Pilih Satuan",
  }),
  date: z.string().min(1,),
});

export type StockMasuk = z.infer<typeof StockMasukSchema>;
