import { AxiosInstance } from "@/lib/axios";
import { useState } from "react";

export type StockOnHandRow = {
  id: number;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  stock_value: number;
};

export type StockOnHandMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const useGetStockOnHand = () => {
  const [data, setData] = useState<StockOnHandRow[]>([]);
  const [totalNilai, setTotalNilai] = useState(0);
  const [meta, setMeta] = useState<StockOnHandMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getStockOnHand = async (params?: {
    search?: string;
    category?: string;
    page?: number;
    per_page?: number;
  }) => {
    try {
      setLoading(true);
      setError("");
      const res = await AxiosInstance.get("/items/stock-on-hand", { params });
      setData(res.data.data);
      setTotalNilai(res.data.total_nilai);
      setMeta(res.data.meta);
    } catch {
      setError("Gagal memuat stock on hand");
    } finally {
      setLoading(false);
    }
  };

  return { data, totalNilai, meta, loading, error, getStockOnHand };
};

export default useGetStockOnHand;