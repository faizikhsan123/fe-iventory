import { AxiosInstance } from "@/lib/axios";
import type { SupplierForm } from "@/schemas/supplier";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const useEditSupplier = () => {
  const [loadingUpdate, SetLoadingUpdate] = useState(false);
  const [errorUpdate, SetErrorUpdate] = useState("");

  const handleUpdate = async (id: number, payload: SupplierForm, onSuccess?: () => void) => {
    try {
      SetLoadingUpdate(true);
      SetErrorUpdate("");

      await AxiosInstance.patch(`/suppliers/${id}`, {
        name: payload.nama,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
      });

      MySwal.fire("Berhasil!", "Data supplier berhasil dirubah.", "success");
      onSuccess?.();
    } catch (error) {
      SetErrorUpdate((error as Error).message);
      MySwal.fire("Gagal!", "Data supplier gagal dirubah.", "error");
    } finally {
      SetLoadingUpdate(false);
    }
  };

  return {
    loadingUpdate,
    errorUpdate,
    handleUpdate,
  };
};