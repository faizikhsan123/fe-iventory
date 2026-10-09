import { z } from "zod";

export const DIVISIONS = ["Gas Analyzer", "I&C-PMR", "I&C-ER", "Safety"] as const;

export const TrainingSchema = z.object({
  id_training: z.string().min(1, "ID training wajib diisi").max(255, "ID terlalu panjang"),
  division_training: z.enum(DIVISIONS),
  name_training: z.string().min(1, "Nama training wajib diisi").max(255, "Nama terlalu panjang"),
  by: z.string().min(1, "Pembuat wajib diisi").max(30, "Maksimal 30 karakter"),
//   date: z.string().min(1, "Tanggal wajib diisi"),
});

export type TrainingForm = z.infer<typeof TrainingSchema>;