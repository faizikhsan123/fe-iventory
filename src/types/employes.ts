export type Division = "I&C-PMR" | "I&C-ER" | "Gas Analyzer";

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
  given_items_count: number;
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