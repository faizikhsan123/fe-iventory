import { z } from "zod";

const employeeBaseSchema = {
  id_number: z.string().min(4, "ID Number terlalu pendek").max(20, "ID Number terlalu panjang"),

  name: z.string().min(4, "Nama terlalu pendek").max(50, "Nama terlalu panjang"),

  file: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      "File harus berupa JPG, PNG, atau SVG",
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5 MB")
    .optional()
    .nullable(),

  division: z.enum(["I&C-PMR", "I&C-ER", "Gas Analyzer"], {
    message: "Division wajib dipilih",
  }),

  position: z.enum(["Supervisor", "Technician", "Foreman", "Safety"], {
    message: "Position wajib dipilih",
  }),

  ktp_address: z
    .string()
    .max(200, "Alamat KTP terlalu panjang")
    .refine((value) => value === "" || value.length >= 10, "Alamat KTP minimal 10 karakter")
    .optional()
    .nullable(),

  actual_address: z
    .string()
    .max(200, "Alamat domisili terlalu panjang")
    .refine((value) => value === "" || value.length >= 10, "Alamat domisili minimal 10 karakter")
    .optional()
    .nullable(),

  emergency_contact: z
    .string()
    .max(20, "Kontak darurat terlalu panjang")
    .refine((value) => value === "" || value.length >= 10, "Kontak darurat minimal 10 karakter")
    .optional()
    .nullable(),
};

export const employeeCreateSchema = z.object({
  ...employeeBaseSchema,
});

export type EmployeeCreateForm = z.infer<typeof employeeCreateSchema>;

export const employeeEditSchema = z.object({
  ...employeeBaseSchema,

  status: z.enum(["active", "inactive"], {
    message: "Status wajib dipilih",
  }),
});

export type EmployeeEditForm = z.infer<typeof employeeEditSchema>;
