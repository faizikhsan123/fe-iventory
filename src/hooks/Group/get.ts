import { useCallback, useState } from "react";
import  { AxiosInstance } from "@/lib/axios";
import type { Group } from "@/types/Group";
import { translateServerMessage } from "@/lib/serverMessages";


const UsegetGroups = () => {
  const [data, setData] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosInstance.get("/groups");
      setData(res.data.data );
    } catch (e: any) {
      const raw = e?.response?.data?.message;
      setError(raw ? translateServerMessage(String(raw)) : "Failed to load group data");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getGroups };
};

export default UsegetGroups;