import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import type { Training } from "@/types/Training";
import { translateServerMessage } from "@/lib/serverMessages";

const UseGetTrainings = () => {
  const [data, setData] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTrainings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosInstance.get("/trainings");
      setData(res.data.data);
    } catch (e: any) {
      const raw = e?.response?.data?.message;
      setError(raw ? translateServerMessage(String(raw)) : "Failed to load training data");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getTrainings };
};

export default UseGetTrainings;