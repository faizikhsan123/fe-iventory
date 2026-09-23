// hooks/Laporan/categoryDistribution.ts
import { AxiosInstance } from "@/lib/axios";
import { useCallback, useState } from "react";

export interface CategoryItem {
  category: string; // "apd" atau "tools"
  total: number;
  percentage: number;
}

const useCategoryDistribution = () => {
  const [data, setData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGet = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await AxiosInstance.get("/stock-history/category-distribution");
      setData(response.data.data);
    } catch (err) {
      setError("Gagal mengambil data distribusi kategori");
    }
    setLoading(false);
  }, []);

  return { data, loading, error, handleGet };
};

export default useCategoryDistribution;