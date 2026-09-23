// hooks/Laporan/lowStock.ts
import { AxiosInstance } from "@/lib/axios";
import { useCallback, useState } from "react";

export interface LowStockItem {
  id: string;
  part_number: string;
  name: string;
  category: string;
  unit: string;
  current_stock: string;
  min_stock: string;
  status: string;
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface GetParams {
  search?: string;
  page?: number;
  per_page?: number;
}

const useLowStock = () => {
  const [data, setData] = useState<LowStockItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGet = useCallback(async (params: GetParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await AxiosInstance.get("/items/low-stock", {
        params: {
          search: params.search || undefined,
          page: params.page || 1,
          per_page: params.per_page || 10,
        },
      });

      setData(response.data.data);
      setMeta(response.data.meta ?? null);
    } catch (err) {
      setError("Gagal mengambil data stok kritis");
    }

    setLoading(false);
  }, []);

  return { data, error, handleGet, loading, meta };
};

export default useLowStock;