import { z } from "zod";

export const itemsSchema = z.object({
  file: z
    .instanceof(File)
    .optional()
    .nullable(),

  name: z.string("Minimal 1 karakter dan 50 karakter").min(1).max(50),

  category: z.enum(["apd", "tools"], {
    message : "Pilih antara apd dan tools"
  }),

  brand: z.string("Minimal 1 karakter dan 20 karakter").min(1).max(20),

  type: z.string("maksimal 20 karakter").max(20).optional().or(z.literal("")),

  min_stock: z.number("Masukkan Angka Bulat").optional().nullable(),

  size: z.enum(["s", "m", "l", "xl", "xxl", "universal"], {
    message : "Pilih diantara satu kategori yang tersedia"
  }),

  unit: z.enum(["pcs", "set", "unit", "pair"], {
     message : "Pilih diantara satu kategori yang tersedia"
  }),

  description: z.string("Maksimal 200 karakter").max(200).optional().or(z.literal("")),
});

export type ItemsCreate = z.infer<typeof itemsSchema>;