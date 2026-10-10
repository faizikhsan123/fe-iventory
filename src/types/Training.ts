import type { Division } from "@/lib/divisions";

export type Training = {
  id: number;
  id_training: string;
  division_training: Division;
  name_training: string;
  by: string;
  participants_count?: number;
};