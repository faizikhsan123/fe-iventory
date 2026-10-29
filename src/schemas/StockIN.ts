import { z } from "zod";

export const StockMasukSchema = z.object({
  supplier_id: z.string("Supplier is required").min(1, "Supplier is required"),
  date: z.string().min(1, "Date is required"),
  note: z.string("Maksimal 200 karakter").max(200).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        item_id: z.string("Item is required").min(1, "Item is required"),
        qty: z.number("Enter a whole number").min(1, "Minimum quantity is 1"),
        unit: z.enum(["pcs", "set", "pair", "unit","others"], {
          message: "Select a unit",
        }),
      })
    )
    .min(1, "At least 1 item is required"),
});

export type StockMasuk = z.infer<typeof StockMasukSchema>;