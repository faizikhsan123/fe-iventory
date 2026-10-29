import { AxiosInstance } from "@/lib/axios";
import { useState } from "react";
import { translateServerMessage } from "@/lib/serverMessages";

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
      const raw = (err as any)?.response?.data?.message;
      const message = raw ? translateServerMessage(String(raw)) : "Failed to save item";
      SetError(message);
      throw new Error(message); // rethrow carrying the message
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, postTransactionItem };
};

export default useCreateTransactionItem;
