import { AxiosInstance } from "@/lib/axios";
import type { Cpd } from "@/hooks/employes/cpd";
import type { PpeSizes } from "@/schemas/cpd";
import { useCallback, useState } from "react";

interface EmployeInfo {
  id: number;
  name: string;
  division: string;
  position: string;
  status: string;
  group_name: string | null;
  contract_renewals: number;
  contract_start: string | null;
  contract_end: string | null;
  file : string
  ktp_address: string;
  actual_address: string;
  emergency_contact: string;
  ppe_sizes?: PpeSizes | null;
  cpd?: Cpd | null;
}

export interface EmployeTraining {
  participant_id: number;
  training_id: number;
  id_training: string;
  name_training: string;
  division_training: string;
  by: string | null;
  date: string | null;
  notes: string | null;
  file: string | null;
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

import type { Mcu } from "@/hooks/Mcu/useMcu";

interface EmployeDetailData {
  mcus: Mcu[];
  trainings?: EmployeTraining[];
  cpd?: Cpd | null;
  ppe_sizes?: PpeSizes | null;
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