import { z } from "zod";

export const GroupsSchema = z.object({
    group_name: z.string().min(4, "Nama terlalu pendek").max(50, "Nama terlalu panjang"),
 
    employes_ids: z.array(z.number()),
  })
 
export type GroupsForm = z.infer<typeof GroupsSchema>;
