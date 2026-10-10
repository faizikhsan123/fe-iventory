import type { Division } from "@/lib/divisions";

export type { Division };

export type Position = "Supervisor" | "Technician" | "Foreman";
export type Status = "active" | "inactive";

export type employes = {
  id: number;
  file : string
  division: Division;
  position: Position;
  ktp_address: string;
  actual_address: string;
  emergency_contact: string;
  status: Status;
  id_number?: string;
  contract_start?: string | null;
  contract_end?: string | null;
  left_at?: string | null;
  contract_renewals?: number;
  latest_performance?: number | null;
  // ukuran APD (bila API list menyertakannya)
  ppe_shoes?: string | null;
  ppe_coverall?: string | null;
  ppe_wearpack?: string | null;
  ppe_respirator?: string | null;
  ppe_vest?: string | null;
  ppe_gloves?: string | null;
  items?: {
    item_name: string;
    qty: number;
    date: string;
    note: string | null;
  }[];
  user: {
    id: number;
    name: string;
    email: string;
    roles : string[],
    permission : string[]
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
  };
  
};

  // export interface EmployeTraining {
  //   id: number;
  //   id_training: string;
  //   name_training: string;
  //   division_training: string;
  //   file: string | null; // path PDF
  // }