import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import { translateServerMessage } from "@/lib/serverMessages";

const DeleteParticipantHooks = () => {
  const [loadingDelete, setLoading] = useState(false);
  const [errorDelete, setError] = useState("");

  const handleDelete = useCallback(async (participantId: number): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      await AxiosInstance.delete(`/participants/${participantId}`);
      return true;
    } catch (e: any) {
      const raw = e?.response?.data?.message;
      setError(raw ? translateServerMessage(String(raw)) : "Failed to delete participant");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadingDelete, errorDelete, handleDelete, setErrorDelete: setError };
};

export default DeleteParticipantHooks;