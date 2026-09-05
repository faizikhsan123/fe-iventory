import { z } from "zod";

export const supplierSchema = z.object({
  nama: z
    .string()
    .min(4, "Nama terlalu pendek")
    .max(50, "Nama terlalu panjang"),
  phone: z
    .string()
    .min(8, "Nomor telepon terlalu pendek")
    .max(15, "Nomor telepon terlalu panjang")
    // biar bisa optional dan kalo ada isinya ada validasinya
    .optional()
    .or(z.literal("")),
  email: z.email("Format email tidak valid").optional().or(z.literal("")),
  address: z
    .string()
    .min(3, "Alamat terlalu pendek")
    .max(200, "Alamat terlalu panjang")
    .optional()
    .or(z.literal("")),
});

export type SupplierForm = z.infer<typeof supplierSchema>;