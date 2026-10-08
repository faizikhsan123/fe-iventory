import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import type { Training } from "@/types/Training";

const UseShowTraining = () => {
  const [data, setData] = useState<Training | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTraining = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosInstance.get(`/trainings/${id}`);
      setData(res.data.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal mengambil detail training");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getTraining };
};

export default UseShowTraining;