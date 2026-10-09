import { AxiosInstance } from "@/lib/axios";
import type { GroupsForm } from "@/schemas/Group";
import { useCallback, useState } from "react";

const UpdateGroupsHooks = () => {
  const [loadingUpdate, setLoading] = useState(false);
  const [errorUpdate, setError] = useState("");

  const handleUpdate = useCallback(async (id: number, data: GroupsForm): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      await AxiosInstance.put(`/groups/${id}`, {
        name_group: data.group_name,
        employes_ids: data.employes_ids,
      });
      return true;
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null;
      setError(firstError ?? e?.response?.data?.message ?? "Gagal mengubah group");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadingUpdate, errorUpdate, handleUpdate };
};

export default UpdateGroupsHooks;