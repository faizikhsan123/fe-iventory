import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import type { Training } from "@/types/Training";

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
      setError(e?.response?.data?.message ?? "Gagal mengambil data training");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getTrainings };
};

export default UseGetTrainings;