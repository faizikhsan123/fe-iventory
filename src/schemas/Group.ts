import { z } from "zod";

export const GroupsSchema = z.object({
    group_name: z.string().min(4, "Nama terlalu pendek").max(50, "Nama terlalu panjang"),
    start_time: z.string().min(1, "Jam mulai wajib diisi"),
    end_time: z.string().min(1, "Jam selesai wajib diisi"),
    employes_ids: z.array(z.number()),
  })
  .refine((v) => !v.start_time || !v.end_time || v.end_time > v.start_time, {
    message: "Jam selesai harus lebih besar dari jam mulai",
    path: ["end_time"],
  });

export type GroupsForm = z.infer<typeof GroupsSchema>;
