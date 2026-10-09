import { AxiosInstance } from "@/lib/axios";
import type { GroupsForm } from "@/schemas/Group";
import { useCallback, useState } from "react";



const CreateGroupsHooks = () => {
  const [loadingCreate, setLoading] = useState(false);
  const [errorCreate, setError] = useState("");

  const handleCreate = useCallback(async (data: GroupsForm): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      await AxiosInstance.post("/groups", {
        name_group: data.group_name,
        employes_ids: data.employes_ids,
      });
      return true;
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null;
      setError(firstError ?? e?.response?.data?.message ?? "Gagal membuat group");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadingCreate, errorCreate, handleCreate };
};

export default CreateGroupsHooks;