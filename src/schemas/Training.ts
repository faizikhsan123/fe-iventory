import { z } from "zod";

import { DIVISIONS } from "@/lib/divisions";

export { DIVISIONS };

export const TrainingSchema = z.object({
  id_training: z.string().min(1, "Training ID is required").max(255, "ID is too long"),
  division_training: z.enum(DIVISIONS),
  name_training: z.string().min(1, "Training name is required").max(255, "Name is too long"),
  by: z.string().min(1, "Created by is required").max(30, "Maximum 30 characters"),
//   date: z.string().min(1, "Tanggal wajib diisi"),
});

export type TrainingForm = z.infer<typeof TrainingSchema>;