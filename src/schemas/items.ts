import { z } from "zod";
import { ITEM_CATEGORY_VALUES } from "@/lib/itemCategory";

export const itemsSchema = z.object({
  file: z.instanceof(File).optional().nullable(),

  name: z.string("Must be 1 to 50 characters").min(1).max(50),

  category: z.enum(ITEM_CATEGORY_VALUES, {
    message: "Select a category",
  }),

  brand: z.string("Must be 1 to 50 characters").min(1).max(50).optional().or(z.literal("")),

  type: z.string("Maximum 50 characters").max(50).optional().or(z.literal("")),

  min_stock: z.coerce.number("Enter a whole number").optional().nullable(),

  part_number: z.string().max(50).optional().or(z.literal("")),

  // size: z.enum(["s", "m", "l", "xl", "xxl", "universal"], {
  //   message : "Select one of the available units"
  // }),

  unit: z.enum(["pcs", "set", "unit", "pair", "others"], {
    message: "Select one of the available units",
  }),

  price: z.coerce.number().optional(),

  description: z.string("Maximum 200 characters").max(200).optional().or(z.literal("")),
});

export type ItemsCreate = z.infer<typeof itemsSchema>;
