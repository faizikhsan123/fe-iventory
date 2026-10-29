import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import type { TrainingParticipant } from "@/types/TrainingParticipant";
import { translateServerMessage } from "@/lib/serverMessages";

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
      const raw = e?.response?.data?.message;
      setError(raw ? translateServerMessage(String(raw)) : "Failed to load participant data");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getParticipants };
};

export default UseGetParticipants;