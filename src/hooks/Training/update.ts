import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import type { TrainingForm } from "@/schemas/Training";

const UpdateTrainingHooks = () => {
  const [loadingUpdate, setLoading] = useState(false);
  const [errorUpdate, setError] = useState("");

  const handleUpdate = useCallback(async (id: number, data: TrainingForm): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      await AxiosInstance.put(`/trainings/${id}`, data);
      return true;
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null;
      setError(firstError ?? e?.response?.data?.message ?? "Gagal mengubah training");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadingUpdate, errorUpdate, handleUpdate, setErrorUpdate: setError };
};

export default UpdateTrainingHooks;