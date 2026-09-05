import { AxiosInstance } from "@/lib/axios";
import type { SupplierForm } from "@/schemas/supplier";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const useCreateSupplier = () => {
  const [loadingCreate, SetLoadingCreate] = useState(false);
  const [errorCreate, SetErrorCreate] = useState("");

//   parameter diambil dari schema zod 
  const handleCreate = async (payload: SupplierForm, onSuccess?: () => void) => {
    try {
      SetLoadingCreate(true);
      SetErrorCreate("");

      await AxiosInstance.post("/suppliers", {
        name: payload.nama ,
        phone: payload.phone ||undefined,
        email: payload.email ||undefined,
        address: payload.address || undefined,
      });

      MySwal.fire("Berhasil!", "Data supplier berhasil ditambahkan.", "success");
      onSuccess?.();
    } catch (error) {
      SetErrorCreate((error as Error).message);
      MySwal.fire("Gagal!", "Data supplier gagal ditambahkan.", "error");
    } finally {
      SetLoadingCreate(false);
    }
  };

  return {
    loadingCreate,
    errorCreate,
    handleCreate,
  };
};