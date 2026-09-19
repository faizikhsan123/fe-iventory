import { AxiosInstance } from "@/lib/axios";
import type { Supplier } from "@/types/supplier";
import { useCallback, useState } from "react";

type Params = {
  search?: string;
  page?: number;
  per_page?: number;
  status?: string;
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export const useSupplier = () => {
  const [dataSUpplier, setData] = useState<Supplier[]>([]);
  const [loadingSupplier, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);

  const getSupplier = useCallback(async (params: Params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await AxiosInstance.get("/suppliers", {
        params,
      });

      setData(response.data.data);
      setMeta(response.data.meta);
    } catch {
      setError("Gagal mengambil data supplier.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    dataSUpplier,
    loadingSupplier,
    error,
    meta,
    getSupplier,
  };
};
