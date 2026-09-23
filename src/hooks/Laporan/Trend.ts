// hooks/Laporan/trend.ts
import { AxiosInstance } from "@/lib/axios";
import { useCallback, useState } from "react";

export interface TrendItem {
  bulan: string; // format "2026-08"
  stock_masuk: number;
  stock_keluar: number;
}

const useStockTrend = () => {
  const [data, setData] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGet = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await AxiosInstance.get("/stock-history/trend");
      setData(response.data.data);
    } catch (err) {
      setError("Gagal mengambil data tren stok");
    }
    setLoading(false);
  }, []);

  return { data, loading, error, handleGet };
};

export default useStockTrend;   