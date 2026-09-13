import { AxiosInstance } from "@/lib/axios";
import type { StockIN } from "@/types/StockIN";

import { useState } from "react";

export const useStockhistory = () => {
  const [dataStockHistory, setData] = useState<StockIN[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // tiap get pasang signal untuk bisa di cancel kalau user pindah halaman sebelum request selesai
  const getStockHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await AxiosInstance.get("stock-history");
      setData(response.data.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    dataStockHistory,
    loading,
    error,
    getStockHistory,
  };
};
