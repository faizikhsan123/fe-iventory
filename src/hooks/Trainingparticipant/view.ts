import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";

const ViewParticipantFileHooks = () => {
  const [loadingView, setLoading] = useState(false);
  const [errorView, setError] = useState("");

  const handleView = useCallback(async (participantId: number): Promise<void> => {
    setLoading(true);
    setError("");
    // buka tab dulu biar nggak diblok popup blocker
    const win = window.open("", "_blank");
    try {
      const res = await AxiosInstance.get(`/participants/${participantId}/file`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      if (win) win.location.href = url;
      else window.open(url, "_blank");
    } catch {
      win?.close();
      setError("Gagal membuka file");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadingView, errorView, handleView };
};

export default ViewParticipantFileHooks;