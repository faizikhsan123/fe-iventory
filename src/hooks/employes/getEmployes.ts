import { AxiosInstance } from "@/lib/axios";
import type { employes } from "@/types/employes";
import { useState } from "react";

type GetEmployesResponse = {
  status: string;
  message: string;
  data: employes[];
};

const useGetEmployes = () => {
  const [loading, SetLoading] = useState(false);
  const [error, SetError] = useState("");
  const [data, setData] = useState<employes[]>([]);

  const getEmployesButton = async () => {
    try {
      SetLoading(true);
      SetError("");
      const response = await AxiosInstance.get<GetEmployesResponse>("/employes");
      setData(response.data.data);
    } catch (err) {
      SetError((err as Error).message);
    } finally {
      SetLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    getEmployesButton,
  };
};

export default useGetEmployes;