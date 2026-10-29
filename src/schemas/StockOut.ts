import { z } from "zod";

export const StockOutItemSchema = z.object({
  items_id: z.string("Item is required").min(1, "Item is required"),
  qty: z.number("Enter a quantity").min(1, "Minimum quantity is 1"),
});

export const StockOutSchema = z.object({
  date: z.string().min(1, "Date is required"),
  employes_id: z.string("Employee is required").min(1, "Employee is required"),
  note: z.string("Maksimal 200 karakter").max(200).optional().or(z.literal("")),
  items: z.array(StockOutItemSchema).min(1, "At least 1 item must be added"),
});

export type StockOutItem = z.infer<typeof StockOutItemSchema>;
export type StockOut = z.infer<typeof StockOutSchema>;
