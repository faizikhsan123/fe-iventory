import { AxiosInstance } from "@/lib/axios";
import { useCallback, useState } from "react";

interface EmployeInfo {
  id: number;
  name: string;
  division: string;
  position: string;
  status: string;
}

interface Statistik {
  total_barang_diterima: number;
}

interface RiwayatDiberikan {
  transaction_number: string;
  date: string;
  barang: string;
  qty: number;
  note: string | null;
}

interface EmployeDetailData {
  employe: EmployeInfo;
  statistik: Statistik;
  riwayat_diberikan: RiwayatDiberikan[];
}

const useEmployeDetail = () => {
  const [data, setData] = useState<EmployeDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGet = useCallback(async (employeId: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await AxiosInstance.get(`/employes/${employeId}/detail`);
      setData(response.data.data);
    } catch (err) {
      setError("Gagal mengambil detail karyawan");
    }

    setLoading(false);
  }, []);

  return { data, error, loading, handleGet };
};

export default useEmployeDetail;