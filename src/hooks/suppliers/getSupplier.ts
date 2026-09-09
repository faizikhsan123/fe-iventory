import { AxiosInstance } from "@/lib/axios";
import type { Supplier } from "@/types/supplier";
import { useState } from "react";

export const useSupplier = () => {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // tiap get pasang signal untuk bisa di cancel kalau user pindah halaman sebelum request selesai
  const getSupplier = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await AxiosInstance.get("suppliers");
      setData(response.data.data);
    } catch (err) {
      setError((err as Error).message);
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
