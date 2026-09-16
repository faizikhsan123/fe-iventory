export type Division = "INC-PMR" | "INC-ER" | "GA";
export type Position = "Supervisor" | "Technician" | "Foreman";
export type Status = "active" | "inactive";

export type employes = {
  id: number;
  division: Division;
  position: Position;
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
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
  };
};