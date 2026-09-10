import { z } from "zod";

export const itemsSchema = z.object({
  file: z
    .instanceof(File)
    .optional()
    .nullable(),

  name: z.string().min(1).max(50),

  category: z.enum(["apd", "tools"]),

  brand: z.string().min(1).max(20),

  type: z.string().max(20).optional().or(z.literal("")),

  min_stock: z.coerce.number().optional().nullable(),

  size: z.enum(["s", "m", "l", "xl", "xxl", "universal"]),

  unit: z.enum(["pcs", "set", "unit", "pair"]),

  description: z.string().max(200).optional().or(z.literal("")),
});

export type ItemsCreate = z.infer<typeof itemsSchema>;