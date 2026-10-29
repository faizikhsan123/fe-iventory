import { AxiosInstance } from "@/lib/axios";

import type { Items } from "@/types/items";
import { useCallback, useState } from "react";

type Params = {
  search?: string;
  page?: number;
  per_page?: number;
  category?: string;
};

type Meta = {
  per_page: number;
  last_page: number;
  current_page: number;
  total: number;
};

const UsegetItems = () => {
  const [error, SetError] = useState("");
  const [loading, Setloading] = useState(false);
  const [data, setData] = useState<Items[]>([]);
  const [meta, Setmeta] = useState<Meta | null>(null);

  const getItems = useCallback(async (params: Params = {}) => {
    try {
      SetError("");
      Setloading(true);

      const response = await AxiosInstance.get("/items", {
        params,
      });

      setData(response.data.data);
      Setmeta(response.data.meta);
    } catch {
      SetError("Failed to load items");
    } finally {
      Setloading(false);
    }
  }, []);

  // Memuat SEMUA barang (semua halaman, 100 per request = batas maksimum backend).
  // Dipakai pilihan barang di form stok masuk/keluar agar tidak terpotong 10 data.
  const getAllItems = useCallback(async () => {
    try {
      SetError("");
      Setloading(true);

      const all: Items[] = [];
      const seen = new Set<number>();
      let page = 1;
      let lastPage = 1;
      do {
        const response = await AxiosInstance.get("/items", {
          params: { page, per_page: 100 },
        });
        for (const it of response.data.data as Items[]) {
          if (!seen.has(it.id)) {
            seen.add(it.id);
            all.push(it);
          }
        }
        lastPage = response.data.meta?.last_page ?? 1;
        page += 1;
      } while (page <= lastPage);

      all.sort((a, b) => a.name.localeCompare(b.name, "id"));
      setData(all);
    } catch {
      SetError("Failed to load items");
    } finally {
      Setloading(false);
    }
  }, []);

  return {
    getAllItems,
    error,
    loading,
    data,
    meta,
    getItems,
  };
};

export default UsegetItems;
