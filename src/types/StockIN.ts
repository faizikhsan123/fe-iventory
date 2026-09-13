export type Category = "apd" | "tools";
export type Size = "s" | "m" | "l" | "xl" | "xxl" | "universal";
export type Unit = "unit" | "pair" | "pcs" | "set";
export type Status = "available" | "low_stock" | "out_of_stock";

export type StatusSupplier = "active" | "inactive";

export type StockIN = {
  id: number;
  type: string;
  note: string;
  user_id: {
    id: number;
    name: string;
    email: string;
    password: string;
  };
  items_id: {
    id: number;
    part_number: string;
    name: string;
    file: string;
    category: Category;
    brand: string;
    type: string;
    size: Size;
    unit: Unit;
    min_stock: number;
    current_stock: number;
    status: Status;
    description: string;
  };
  supplier_id: {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    status: Status;
  };
};
