export type Status = "active" | "inactive";

export type Supplier = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: Status
};
