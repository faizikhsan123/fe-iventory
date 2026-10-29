import { useCallback, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import type { Group } from "@/types/Group";
import { translateServerMessage } from "@/lib/serverMessages";

const UseGetGroupDetail = () => {
  const [group, setGroup] = useState<Group | null>(null);
  const [loadingDetail, setLoading] = useState(false);
  const [errorDetail, setError] = useState("");

  const getGroup = useCallback(async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await AxiosInstance.get(`/groups/${id}`);
      setGroup(res.data.data);
      return res.data.data as Group;
    } catch (e: any) {
      const raw = e?.response?.data?.message;
      setError(raw ? translateServerMessage(String(raw)) : "Failed to load group details");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { group, loadingDetail, errorDetail, getGroup };
};

export default UseGetGroupDetail;