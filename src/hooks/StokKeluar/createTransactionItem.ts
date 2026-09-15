import { AxiosInstance } from "@/lib/axios";
import { isAxiosError } from "axios";
import { useState } from "react";

const useCreateTransactionItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const postTransactionItem = async (payload: { transactions_id: number; items_id: string; qty: number; date : string }) => {
    try {
      setLoading(true);
      setError("");
      const response = await AxiosInstance.post("/transaction-items", payload);
      return response.data.data;
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
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, postTransactionItem };
};

export default useCreateTransactionItem;