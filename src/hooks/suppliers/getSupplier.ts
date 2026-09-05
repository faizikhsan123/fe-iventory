import { AxiosInstance } from "@/lib/axios";
import type { Supplier } from "@/types/supplier";
import { useState } from "react";

export const useSupplier = () => {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // tiap get pasang signal untuk bisa di cancel kalau user pindah halaman sebelum request selesai
  const getSupplier = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");
      const response = await AxiosInstance.get("suppliers", { signal });
      setData(response.data.data);
    } catch (error: any) {
      // request yang dibatalkan (misal karena StrictMode atau user pindah halaman)
      // bukan error beneran, jadi diabaikan aja, jangan ditampilkan ke user
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        return;
      }

      if (error.response?.status === 404) {
        setError("Data not found");
      } else if (error.response?.status === 403) {
        setError("Access denied");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    getSupplier,
  };
};