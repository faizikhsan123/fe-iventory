import type { employes } from "./employes";

export type Group = {
  id: number;
  group_name: string;
  employees?: employes[];
  created_at?: string;
  updated_at?: string;
};