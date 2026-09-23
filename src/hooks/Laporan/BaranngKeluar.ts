// hooks/Transaction/get.ts
import { AxiosInstance } from "@/lib/axios";
import { useCallback, useState } from "react";

export interface TransactionData {
  id: number;
  transaction_number: string;
  date: string;
  note: string | null;
  employe_name: string | null;
  division: string | null;
  position: string | null;
  barang: string;
  total_qty: number;
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
  start?: string;
  end?: string;
}

const useTransaction = () => {
  const [data, setData] = useState<TransactionData[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGet = useCallback(async (params: GetParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await AxiosInstance.get("/transactions", {
        params: {
          search: params.search || undefined,
          page: params.page || 1,
          per_page: params.per_page || 10,
          start: params.start || undefined,
          end: params.end || undefined,
        },
      });

      setData(response.data.data);
      setMeta(response.data.meta ?? null);
    } catch (err) {
      setError("Gagal mengambil data barang keluar");
    }

    setLoading(false);
  }, []);

  return { data, error, handleGet, loading, meta };
};

export default useTransaction;