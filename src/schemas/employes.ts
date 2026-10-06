import { z } from "zod";

export const employeeCreateSchema = z.object({
  name: z.string().min(4, "Nama terlalu pendek").max(50, "nama terlalu panjang"),
  id_number: z.string().min(4, "ID Number terlalu pendek").max(50, "ID Number terlalu panjang"),
  file: z.instanceof(File).optional().nullable(),
  // email: z.email("Format email tidak valid").max(50, "email terlalu panjang"),
  // password: z.string().min(8, "password terlalu sedikit").max(50, "password terlalu panjang"),
  division: z.enum(["I&C-PMR", "I&C-ER", "Gas Analyzer"], {
    message: "Division wajib dipilih",
  }),
  position: z.enum(["Supervisor", "Technician", "Foreman", "Safety"], {
    message: "Position wajib dipilih",
  }),
  ktp_address: z.string().min(10, "Alamat KTP terlalu pendek").max(200, "Alamat KTP terlalu panjang").optional().or(z.literal("")),
  actual_address: z.string().min(10, "Alamat Domisili terlalu pendek").max(200, "Alamat Domisili terlalu panjang").optional().or(z.literal("")),
  emergency_contact: z.string().min(10, "Kontak darurat terlalu pendek").max(20, "Kontak darurat terlalu panjang").optional().or(z.literal("")),
});

export type EmployeeCreateForm = z.infer<typeof employeeCreateSchema>;



export const employeeEditSchema = z.object({
 id_number: z.string().min(4, "ID Number terlalu pendek").max(50, "ID Number terlalu panjang"),
  name: z.string().min(4, "Nama terlalu pendek").max(20, "nama terlalu panjang"),
  file: z.instanceof(File).optional().nullable(),
  // email: z.email("Format email tidak valid").max(50, "email terlalu panjang"),
  // password: z
  //   .string()
  //   .min(8, "password terlalu sedikit")
  //   .max(50, "password terlalu panjang")
  //   // kosongin aja kalau nggak mau ganti password
  //   .optional()
  //   .or(z.literal("")),
  division: z.enum(["I&C-PMR", "I&C-ER", "Gas Analyzer"], {
    message: "Division wajib dipilih",
  }),
  position: z.enum(["Supervisor", "Technician", "Foreman", "Safety"], {
    message: "Position wajib dipilih",
  }),
  status: z.enum(["active", "inactive"], {
    message: "Status wajib dipilih",
  }),
  ktp_address: z.string().min(10, "Alamat KTP terlalu pendek").max(200, "Alamat KTP terlalu panjang").optional().or(z.literal("")),
  actual_address: z.string().min(10, "Alamat Domisili terlalu pendek").max(200, "Alamat Domisili terlalu panjang").optional().or(z.literal("")),
  emergency_contact: z.string().min(10, "Kontak darurat terlalu pendek").max(20, "Kontak darurat terlalu panjang").optional().or(z.literal("")),
});

export type EmployeeEditForm = z.infer<typeof employeeEditSchema>;
