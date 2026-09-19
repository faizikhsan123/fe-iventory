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
      SetError("gagal mengambil data items");
    } finally {
      Setloading(false);
    }
  }, []);

  return {
    error,
    loading,
    data,
    meta,
    getItems,
  };
};

export default UsegetItems;
