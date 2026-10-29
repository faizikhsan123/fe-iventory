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
      setError("Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Memuat SEMUA supplier (semua halaman, 100 per request = batas maksimum backend).
  // Dipakai pilihan supplier di form stok masuk agar tidak terpotong 10 data.
  const getAllSuppliers = useCallback(async (params: { status?: string } = {}) => {
    try {
      setLoading(true);
      setError("");

      const all: Supplier[] = [];
      const seen = new Set<number>();
      let page = 1;
      let lastPage = 1;
      do {
        const response = await AxiosInstance.get("/suppliers", {
          params: { ...params, page, per_page: 100 },
        });
        for (const s of response.data.data as Supplier[]) {
          if (!seen.has(s.id)) {
            seen.add(s.id);
            all.push(s);
          }
        }
        lastPage = response.data.meta?.last_page ?? 1;
        page += 1;
      } while (page <= lastPage);

      all.sort((a, b) => a.name.localeCompare(b.name, "id"));
      setData(all);
    } catch {
      setError("Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAllSuppliers,
    dataSUpplier,
    loadingSupplier,
    error,
    meta,
    getSupplier,
  };
};
