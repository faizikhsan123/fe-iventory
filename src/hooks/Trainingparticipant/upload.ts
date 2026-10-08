import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";

type UpdateParticipantPayload = {
  date: string;
  notes?: string;
  file?: File | null;
};

const UpdateParticipantHooks = () => {
  const [loadingUpdate, setLoading] = useState(false);
  const [errorUpdate, setError] = useState("");

  const handleUpdate = useCallback(
    async (participantId: number, payload: UpdateParticipantPayload): Promise<boolean> => {
      setLoading(true);
      setError("");
      try {
        const fd = new FormData();
        fd.append("date", payload.date);
        fd.append("notes", payload.notes ?? "");
        if (payload.file) fd.append("file", payload.file);

        await AxiosInstance.post(`/participants/${participantId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return true;
      } catch (e: any) {
        const errors = e?.response?.data?.errors;
        const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null;
        setError(firstError ?? e?.response?.data?.message ?? "Gagal mengubah data peserta");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loadingUpdate, errorUpdate, handleUpdate, setErrorUpdate: setError };
};

export default UpdateParticipantHooks;