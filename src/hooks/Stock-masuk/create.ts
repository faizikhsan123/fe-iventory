import { AxiosInstance } from "@/lib/axios";
import type { StockMasuk } from "@/schemas/StockIN";
import type { StockIN } from "@/types/StockIN";
import { isAxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Usecreate = () => {
  const [loadingStockMasuk, SetloadingStockMasuk] = useState(false);
  const [errorStockMasuk, SeterrorStockMasuk] = useState("");
  const [StockIn, SetStockIn] = useState<StockIN[] | null>(null);

  const MySwal = withReactContent(Swal);

  const handleStockIn = async (payload: StockMasuk) => {
    try {
      SetloadingStockMasuk(true);
      SeterrorStockMasuk("");

      const response = await AxiosInstance.post("/stock-history/in", {
        supplier_id: payload.supplier_id,
        date: payload.date,
        note: payload.note ?? undefined,
        items: payload.items,
      });

      SetStockIn(response.data.data);
      MySwal.fire("Berhasil!", "Data Barang  berhasil ditambahkan.", "success");
      return response.data.data;
    } catch (error) {
      let message = "Terjadi Kesalahan Coba lagi";

      if (isAxiosError(error)) {
        console.log("validation error response");

        const data = error.response?.data;
        if (data.errors) {
          message = Object.values(data.errors).flat().join(", ");
        } else if (data.message) {
          message = data.message;
        }
      }
      SeterrorStockMasuk(message);
      MySwal.fire("Gagal!", message, "error");
      return null;
    } finally {
      SetloadingStockMasuk(false);
    }
  };
  return {
    loadingStockMasuk,
    errorStockMasuk,
    StockIn,
    handleStockIn,
  };
};

export default Usecreate;