import { z } from "zod";
import { DIVISIONS } from "@/lib/divisions";
import { cpdSchema, ppeSchemaShape } from "@/schemas/cpd";

const employeeBaseSchema = {
  id_number: z.string().min(4, "ID Number is too short").max(20, "ID Number is too long"),

  name: z.string().min(4, "Name is too short").max(50, "Name is too long"),

  file: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      "File must be a JPG, PNG, or SVG",
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "Maximum file size is 5 MB")
    .optional()
    .nullable(),

  division: z.enum(DIVISIONS, {
    message: "Division is required",
  }),

  position: z.enum(["Supervisor", "Technician", "Foreman", "Safety"], {
    message: "Position is required",
  }),

  contract_start: z.string().optional().nullable(),

  contract_end: z.string().optional().nullable(),


  ktp_address: z
    .string()
    .max(200, "ID card address is too long")
    .refine((value) => value === "" || value.length >= 10, "ID card address must be at least 10 characters")
    .optional()
    .nullable(),

  actual_address: z
    .string()
    .max(200, "Current address is too long")
    .refine((value) => value === "" || value.length >= 10, "Current address must be at least 10 characters")
    .optional()
    .nullable(),

  ...ppeSchemaShape,
};

export const employeeCreateSchema = z
  .object({
    ...employeeBaseSchema,

    // data CPD (opsional), dikirim sebagai cpd[...]
    cpd: cpdSchema.optional(),

    // wajib saat tambah karyawan
    contract_start: z.string().min(1, "Contract When Joined is required"),
    contract_end: z.string().min(1, "Contract Expired is required"),
  })
  .refine((d) => d.contract_end >= d.contract_start, {
    path: ["contract_end"],
    message: "Contract Expired cannot be before Contract When Joined",
  });

export type EmployeeCreateForm = z.infer<typeof employeeCreateSchema>;

export const employeeEditSchema = z.object({
  ...employeeBaseSchema,

  left_at: z.string().optional().nullable(),

  status: z.enum(["active", "inactive"], {
    message: "Status is required",
  }),
});

export type EmployeeEditForm = z.infer<typeof employeeEditSchema>;
