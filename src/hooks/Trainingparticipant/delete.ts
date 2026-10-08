import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";

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
      setError(e?.response?.data?.message ?? "Gagal menghapus peserta");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadingDelete, errorDelete, handleDelete, setErrorDelete: setError };
};

export default DeleteParticipantHooks;