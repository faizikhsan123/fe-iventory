import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import type { TrainingForm } from "@/schemas/Training";
import { translateServerMessage } from "@/lib/serverMessages";

const CreateTrainingHooks = () => {
  const [loadingCreate, setLoading] = useState(false);
  const [errorCreate, setError] = useState("");

  const handleCreate = useCallback(async (data: TrainingForm): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      await AxiosInstance.post("/trainings", data);
      return true;
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null;
      const raw = firstError ?? e?.response?.data?.message;
      setError(raw ? translateServerMessage(String(raw)) : "Failed to create training");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadingCreate, errorCreate, handleCreate, setErrorCreate: setError };
};

export default CreateTrainingHooks;