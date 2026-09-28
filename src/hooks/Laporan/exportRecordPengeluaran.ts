// hooks/Laporan/useExport.ts
import { AxiosInstance } from "@/lib/axios";
import { useState } from "react";

const useExport = () => {
  // state buat disable tombol pas lagi download
  const [loadingExport, setLoadingExport] = useState(false);

  // endpoint & filename dikirim dari luar, jadi 1 hook bisa dipakai buat semua tab
  const handleExport = async (
    endpoint: string, // contoh: "/items/export-ranking"
    filename: string, // nama file hasil download
    params?: { start?: string; end?: string } // filter tanggal (opsional)
  ) => {
    try {
      setLoadingExport(true);

      // minta file ke backend, blob = data file mentah (bukan JSON)
      const response = await AxiosInstance.get(endpoint, {
        params,
        responseType: "blob",
      });

      // bikin URL sementara dari file yang diterima
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // bikin link <a> tak terlihat, klik otomatis buat trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      // bersihin URL sementara biar gak numpuk di memori
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Gagal export:", error);
    } finally {
      setLoadingExport(false);
    }
  };

  return { loadingExport, handleExport };
};

export default useExport;