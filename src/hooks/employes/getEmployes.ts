import { AxiosInstance } from "@/lib/axios";
import type { employes } from "@/types/employes";
import { useCallback, useState } from "react";

type Params = {
  search?: string;
  page?: number;
  per_page?: number;
  division?: string;
  position? : string
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number; 
  total: number;
};

const useGetEmployes = () => {
  const [data, setData] = useState<employes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);

  const getEmployesButton = useCallback(async (params: Params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await AxiosInstance.get("/employes", {
        params,
      });

      setData(response.data.data);
      setMeta(response.data.meta);
    } catch {
      setError("Gagal mengambil data karyawan.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    meta,
    getEmployesButton,
  };
};

export default useGetEmployes;
