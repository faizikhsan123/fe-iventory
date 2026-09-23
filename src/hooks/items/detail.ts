// hooks/items/getDetail.ts
import { AxiosInstance } from "@/lib/axios";
import { useCallback, useState } from "react";

// info dasar barang, strukturnya ngikutin ItemsResourcec dari backend
interface ItemInfo {
  id: string;
  file : string
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
}

// ringkasan angka buat panel statistik
interface Statistik {
  total_diberikan: number;
  tanggal_terakhir_masuk: string | null;
}

// satu baris riwayat stok (gabungan in & out)
interface RiwayatStok {
  date: string;
  type: string;
  qty: number;
  note: string | null;
  user_name: string;
  supplier_name: string | null; // null kalau type-nya 'out', karena gak ada supplier
}

// satu baris riwayat pemberian barang ke karyawan
interface RiwayatPemberian {
  transaction_number: string;
  date: string;
  qty: number;
  employe_name: string;
  note: string | null;
}

// bungkus semua interface di atas jadi 1 bentuk response lengkap
interface DetailBarangData {
  item: ItemInfo;
  statistik: Statistik;
  riwayat_stok: RiwayatStok[];
  riwayat_pemberian: RiwayatPemberian[];
}

const useItemDetail = () => {
  const [data, setData] = useState<DetailBarangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handleGet nerima itemId, soalnya endpoint-nya /items/{item}/detail
  // dibungkus useCallback biar gak bikin function baru tiap render
  // (penting kalau dipanggil di dalam useEffect)
  const handleGet = useCallback(async (itemId: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await AxiosInstance.get(`/items/${itemId}/detail`);
      setData(response.data.data);
    } catch (err) {
      setError("Gagal mengambil detail barang");
    }

    setLoading(false);
  }, []);

  return { data, error, loading, handleGet };
};

export default useItemDetail;