import type { ItemCategory } from "@/lib/itemCategory";

export type Status = "active" | "inactive";

export type Supplier = {
  id: number;
  name: string;
  pic : string,
  spesialis : ItemCategory
  phone: string | undefined;
  email: string | undefined;
  address: string | undefined;
  status: Status
};
