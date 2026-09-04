import { AxiosInstance } from "@/lib/axios";
import type { Supplier } from "@/types/supplier";
import { useState } from "react";

export const useSupplier = () => {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSupplier = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await AxiosInstance.get("suppliers");
      setData(response.data.data);
    } catch (error: any) {
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
