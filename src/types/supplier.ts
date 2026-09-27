export type Status = "active" | "inactive";

export type Supplier = {
  id: number;
  name: string;
  pic : string,
  spesialis : string
  phone: string | undefined;
  email: string | undefined;
  address: string | undefined;
  status: Status
};
