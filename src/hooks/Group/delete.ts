import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";

const DeleteGroupsHooks = () => {
  const [loadingDelete, setLoading] = useState(false);
  const [errorDelete, setError] = useState("");

  const handleDelete = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      await AxiosInstance.delete(`/groups/${id}`);
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal menghapus group");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadingDelete, errorDelete, handleDelete, setErrorDelete: setError };
};

export default DeleteGroupsHooks;