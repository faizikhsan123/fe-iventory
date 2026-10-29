import { z } from "zod";

export const GroupsSchema = z.object({
    group_name: z.string().min(4, "Name is too short").max(50, "Name is too long"),
 
    employes_ids: z.array(z.number()),
  })
 
export type GroupsForm = z.infer<typeof GroupsSchema>;
