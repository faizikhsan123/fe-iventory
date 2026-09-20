import { AxiosInstance } from "@/lib/axios";
import type { Activity } from "@/types/Activity";
import { useCallback, useState } from "react";

type Params = {
  search?: string;
  page?: number;
  per_page?: number;
  type?: string;
  detai?: string;
};

type Meta = {
  last_page: number;
  current_page: number;
  per_page: number;
  total: number;
};

const useActivity = () => {
  const [loading, Setloading] = useState(false);
  const [error, Seterror] = useState("");
  const [data, SetData] = useState<Activity[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);

  const handleGet = useCallback(async (params: Params = {}) => {
    try {
      Seterror("");
      Setloading(true);

      const response = await AxiosInstance.get("/activities", {
        params,
      });
      SetData(response.data.data);
      setMeta(response.data.meta);
      return response.data.data;
    } catch (error) {
      Seterror((error as Error).message);
      return null;
    } finally {
      Setloading(false);
    }
  }, []);
  return {
    data,
    meta,
    error,
    loading,
    handleGet,
  };
};

export default useActivity;
