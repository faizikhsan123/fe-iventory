import { z } from "zod";
import { ITEM_CATEGORY_VALUES } from "@/lib/itemCategory";

export const supplierSchema = z.object({
  nama: z.string().min(4, "Name is too short").max(50, "Name is too long"),
  pic: z.string().min(4, "Name is too short").max(50, "Name is too long"),

  spesialis: z.enum(ITEM_CATEGORY_VALUES, {
    message: "Select a category",
  }),

  phone: z
    .string()
    .min(8, "Phone number is too short")
    .max(15, "Phone number is too long")
    // biar bisa optional dan kalo ada isinya ada validasinya
    .optional()
    .or(z.literal("")),
  email: z.email("Invalid email format").optional().or(z.literal("")),
  address: z.string().min(3, "Address is too short").max(200, "Address is too long").optional().or(z.literal("")),
});

export type SupplierForm = z.infer<typeof supplierSchema>;

export const supplierSchemaEdit = z.object({
  nama: z.string().min(4, "Name is too short").max(50, "Name is too long"),
  pic: z.string().min(4, "Name is too short").max(50, "Name is too long"),
  spesialis: z.enum(ITEM_CATEGORY_VALUES, {
    message: "Select a category",
  }),

  phone: z
    .string()
    .min(8, "Phone number is too short")
    .max(15, "Phone number is too long")
    // biar bisa optional dan kalo ada isinya ada validasinya
    .optional()
    .or(z.literal("")),
  email: z.email("Invalid email format").optional().or(z.literal("")),
  address: z.string().min(3, "Address is too short").max(200, "Address is too long").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"], {
    message: "Status is required",
  }),
});

export type SupplierFormEdit = z.infer<typeof supplierSchemaEdit>;
