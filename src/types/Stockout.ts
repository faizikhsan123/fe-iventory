// types/Transaction.ts
export type Division = "INC-PMR" | "INC-ER" | "GA";
export type Position = "Supervisor" | "Technician" | "Foreman";
export type EmployeeStatus = "active" | "inactive";

export type TransactionResult = {
  id: number;
  transaction_number: string;
  date: string;
  note: string | null;
  employes: {
    id: string;
    division: Division;
    position: Position;
    status: EmployeeStatus;
    given_items_count: number;
  };
  user_id: {
    id: number;
    name: string;
    email: string;
  };
};
