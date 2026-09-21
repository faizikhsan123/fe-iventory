import { AxiosInstance } from "@/lib/axios";
import type { TopBorrowed } from "@/types/Topborrow";


import { useState } from "react";

export const useTopBorrowed = () => {
  const [dataTopBorrowed, setData] = useState<TopBorrowed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTopBorrowed = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await AxiosInstance.get("items/top-borrowed", {
        params: { start, end },
      });
      setData(response.data.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return {
    dataTopBorrowed,
    loading,
    error,
    getTopBorrowed,
  };
};