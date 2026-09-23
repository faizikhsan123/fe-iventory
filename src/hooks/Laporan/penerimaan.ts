import { AxiosInstance } from "@/lib/axios";
import { useState } from "react";

interface Supplier {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  status: string;
}

interface Item {
  id: string;
  part_number: string;
  name: string;
  category: string;
  brand: string;
  type: string;
  size: string;
  unit: string;
  min_stock: string;
  current_stock: string;
  status: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export interface StockHistoryItem {
  qty: number;
  type: string;
  note: string | null;
  date: string;
  user_id: User;
  item_id: Item;
  supplier_id: Supplier;
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface GetParams {
  start?: string;
  end?: string;
  page?: number;
  per_page?: number;
}

export const usePenerimaanStok = () => {
  const [dataPenerimaanStok, setData] = useState<StockHistoryItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPenerimaanStok = async (params: GetParams = {}) => {
    try {
      setLoading(true);
      setError("");
      const response = await AxiosInstance.get("/stock-history", {
        params: {
          start: params.start || undefined,
          end: params.end || undefined,
          page: params.page || 1,
          per_page: params.per_page || 10,
        },
      });
      setData(response.data.data);
      setMeta(response.data.meta ?? null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    dataPenerimaanStok,
    meta,
    loading,
    error,
    getPenerimaanStok,
  };
};