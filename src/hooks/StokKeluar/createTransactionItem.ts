import { AxiosInstance } from "@/lib/axios";
import { useState } from "react";

type CreateTransactionItemPayload = {
  transactions_id: number;
  items_id: number;
  qty: number;
  date: string;
};

const useCreateTransactionItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, SetError] = useState("");

  const postTransactionItem = async (payload: CreateTransactionItemPayload) => {
    try {
      setLoading(true);
      SetError("");
      const response = await AxiosInstance.post("/transaction-items", payload);
      return response.data.data;
    } catch (err) {
      const message = (err as any)?.response?.data?.message || "Gagal menyimpan barang";
      SetError(message);
      throw new Error(message); // lempar, bawa message asli
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, postTransactionItem };
};

export default useCreateTransactionItem;
