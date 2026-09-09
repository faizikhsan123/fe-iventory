import { AxiosInstance } from "@/lib/axios";

import type { Items } from "@/types/items";
import { useState } from "react";

const UsegetItems = () => {
  const [error, SetError] = useState("");
  const [loading, Setloading] = useState(false);
  const [data, setData] = useState<Items[]>([]);

  const getItems = async () => {
    try {
      SetError("");
      Setloading(true);

      const response = await AxiosInstance.get("/items");

      setData(response.data.data);
    } catch (error) {
      SetError((error as Error).message);
    } finally {
      Setloading(false);
    }
  };
  return {
    error,
    loading,
    data,
    getItems,
  };
};

export default UsegetItems;
