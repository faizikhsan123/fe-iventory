export type Category = "apd" | "tools";
export type Size = "s" | "m" | "l" | "xl" | "xxl" | "universal";
export type Unit = "unit" | "pair" | "pcs" | "set";
export type Status = "available" | "low_stock" | "out_of_stock";

export interface Items {
  id: number;
  part_number: string;
  name: string
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
}