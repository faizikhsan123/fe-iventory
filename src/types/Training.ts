export type Training = {
  id: number;
  id_training: string;
  division_training: "Gas Analyzer" | "I&C-PMR" | "I&C-ER" | "Safety";
  name_training: string;
  created_by: string;
  participants_count?: number;
};