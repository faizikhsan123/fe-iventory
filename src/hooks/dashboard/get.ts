import { AxiosInstance } from "@/lib/axios";
import { useCallback, useState } from "react";

interface Summary {
  total_barang: number;
  current_stock: number;
  barang_keluar: number;
  barang_masuk: number;
  out_of_stock: number;
}

interface AktivitasStok {
  date: string;
  part_number: string;
  name: string;
  type: string;
  qty: number;
  user_name: string;
  unit: string;
}

interface TransaksiTerbaru {
  transaction_number: string;
  employe_name: string;
  barang: string;
  date: string;
}

interface KontrakBerakhir {
  id: number;
  name: string;
  id_number: string;
  division: string;
  position: string;
  group_name: string | null;
  contract_end: string;
  days_left: number;
}

interface McuBerikutnya {
  id: number;
  employes_id: number;
  name: string;
  id_number: string;
  division: string;
  position: string;
  group_name: string | null;
  place_name: string;
  next_mcu_date: string;
  days_left: number;
}

interface DashboardData {
  summary: Summary;
  aktivitas_stok: AktivitasStok[];
  transaksi_terbaru: TransaksiTerbaru[];
  kontrak_berakhir: KontrakBerakhir[];
  mcu_berikutnya: McuBerikutnya[];
}

const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGet = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await AxiosInstance.get("/dashboard/summary");
      setData(response.data.data);
    } catch (err) {
      setError("Gagal mengambil data dashboard");
    }

    setLoading(false);
  }, []);

  return { data, error, loading, handleGet };
};

export default useDashboard;