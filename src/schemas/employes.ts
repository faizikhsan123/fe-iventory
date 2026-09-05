import { z } from "zod";

export const employeeCreateSchema = z.object({
  name: z.string().min(4, "Nama terlalu pendek").max(20, "nama terlalu panjang"),
  email: z.email("Format email tidak valid").max(50, "email terlalu panjang"),
  password: z.string().min(8, "password terlalu sedikit").max(50, "password terlalu panjang"),
  division: z.enum(["INC-PMR", "INC-ER", "GA"], {
    message: "Division wajib dipilih",
  }),
  position: z.enum(["Supervisor", "Technician", "Foreman"], {
    message: "Position wajib dipilih",
  }),
});

export type EmployeeCreateForm = z.infer<typeof employeeCreateSchema>;

// export const employeeEditSchema = z.object({
//   nama: z.string().min(4, "Nama terlalu pendek").max(20, "nama terlalu panjang"),
//   email: z.email("Format email tidak valid").max(50, "email terlalu panjang"),
//   password: z
//     .string()
//     .min(8, "password terlalu sedikit")
//     .max(50, "password terlalu panjang")
//     // kosongin aja kalau nggak mau ganti password
//     .optional()
//     .or(z.literal("")),
//   division: z.enum(["INC-PMR", "INC-ER", "GA"], {
//     message: "Division wajib dipilih",
//   }),
//   position: z.enum(["Supervisor", "Technician", "Foreman"], {
//     message: "Position wajib dipilih",
//   }),
//   status: z.enum(["active", "inactive"], {
//     message: "Status wajib dipilih",
//   }),
// });

// export type EmployeeEditForm = z.infer<typeof employeeEditSchema>;