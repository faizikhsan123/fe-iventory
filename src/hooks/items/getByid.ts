// hooks/items/useGetItemById.ts
import { useEffect, useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import type { Items } from "@/types/items";


const useGetItemById = (id: number) => {
  const [item, setItem] = useState<Items | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);
  const [errorItem, setErrorItem] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        setLoadingItem(true);
        setErrorItem("");
        const response = await AxiosInstance.get(`/items/${id}`);
        setItem(response.data.data);
      } catch (error) {
        setErrorItem("Gagal mengambil data item");
      } finally {
        setLoadingItem(false);
      }
    };

    fetchItem();
  }, [id]);

  return { item, loadingItem, errorItem };
};

export default useGetItemById;