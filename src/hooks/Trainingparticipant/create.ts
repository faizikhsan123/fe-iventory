import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import { translateServerMessage } from "@/lib/serverMessages";

const AddParticipantsHooks = () => {
  const [loadingAdd, setLoading] = useState(false);
  const [errorAdd, setError] = useState("");

  const handleAdd = useCallback(
    async (trainingId: number, employesIds: number[], date: string): Promise<boolean> => {
      setLoading(true);
      setError("");
      try {
        await AxiosInstance.post(`/trainings/${trainingId}/participants`, {
          employes_ids: employesIds,
          date,
        });
        return true;
      } catch (e: any) {
        const errors = e?.response?.data?.errors;
        const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null;
        const raw = firstError ?? e?.response?.data?.message;
        setError(raw ? translateServerMessage(String(raw)) : "Failed to add participant");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loadingAdd, errorAdd, handleAdd, setErrorAdd: setError };
};

export default AddParticipantsHooks;