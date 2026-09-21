import { AxiosInstance } from "@/lib/axios";
import { useState } from "react";

// Struktur ini ngikutin persis apa yang dikirim StockHistoryResource dari backend.
// Kalau field di backend berubah, sesuaikan di sini juga.

interface Supplier {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  status: string;
}

interface Item {
  id: string;
  part_number: string;
  name: string;
  category: string;
  brand: string;
  type: string;
  size: string;
  unit: string;
  min_stock: string;
  current_stock: string;
  status: string;
  description: string;
  supplier_id: Supplier;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export interface StockHistoryItem {
  qty: number;
  type: string;
  note: string | null;
  date: string;
  user_id: User;
  item_id: Item;
}

export const usePenerimaanStok = () => {
  const [dataPenerimaanStok, setData] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPenerimaanStok = async () => {
    try {
      setLoading(true);
      setError("");
      // filter type=in dilakukan di FE dulu (lihat komponen tabel),
      // karena belum jelas apakah endpoint stock-history support query ?type=in.
      // Kalau backend sudah support, tinggal pindahin filter ke params di sini.
      const response = await AxiosInstance.get("/stock-history");
      setData(response.data.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    dataPenerimaanStok,
    loading,
    error,
    getPenerimaanStok,
  };
};