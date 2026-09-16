import { AxiosInstance } from "@/lib/axios";
import type { TransactionResult } from "@/types/Stockout";
import { isAxiosError } from "axios";
import { useState } from "react";

const useCreateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TransactionResult | null>(null);

  const postTransaction = async (payload: { employes_id: string; note?: string; date: string }) => {
    try {
      setLoading(true);
      setError("");
      const response = await AxiosInstance.post("/transactions", payload);
      setData(response.data.data);
      return response.data.data as TransactionResult;
    } catch (err) {
      let message = "Terjadi kesalahan, coba lagi";
      if (isAxiosError(err)) {
        const resData = err.response?.data;
        if (resData?.errors) {
          message = Object.values(resData.errors).flat().join(", ");
        } else if (resData?.message) {
          message = resData.message;
        }
      }
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, postTransaction };
};

export default useCreateTransaction;