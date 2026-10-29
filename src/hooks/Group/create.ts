import { AxiosInstance } from "@/lib/axios";
import type { GroupsForm } from "@/schemas/Group";
import { useCallback, useState } from "react";
import { translateServerMessage } from "@/lib/serverMessages";



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
      const raw = firstError ?? e?.response?.data?.message;
      setError(raw ? translateServerMessage(String(raw)) : "Failed to create group");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadingCreate, errorCreate, handleCreate };
};

export default CreateGroupsHooks;