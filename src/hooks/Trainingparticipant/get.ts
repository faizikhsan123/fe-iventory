import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import type { TrainingParticipant } from "@/types/TrainingParticipant";

const UseGetParticipants = () => {
  const [data, setData] = useState<TrainingParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getParticipants = useCallback(async (trainingId: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosInstance.get(`/trainings/${trainingId}/participants`);
      setData(res.data.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal mengambil data peserta");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getParticipants };
};

export default UseGetParticipants;