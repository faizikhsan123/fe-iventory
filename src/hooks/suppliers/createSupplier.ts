import { AxiosInstance } from "@/lib/axios";
import type { SupplierForm } from "@/schemas/supplier";
import { isAxiosError } from "axios";
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
      // kita kasi error generic dulu
              let message = "Terjadi kesalahan, coba lagi.";
        
              if (isAxiosError(error)) {
                // eh error ini beneran gara-gara request ke server
                // log biar kamu bisa lihat struktur asli error dari backend
                console.log("Validation error response:", error.response?.data);
        
                // ambil data error
                const data = error.response?.data;
                //Nah data itu ya ini semua isinya, kita simpen ke satu variabel biar gampang dipake.
        
                // banyak backend Laravel/Express kirim format
                //         {
                //   "message": "Data tidak valid",
                //   "errors": {
                //     "email": ["Email sudah dipakai"],
                //     "password": ["Password kurang panjang"]
                //   }
                // }
        
                if (data?.errors) {
                  //Kalau ada errors (yang isinya per-field kayak contoh di atas), kita gabungin SEMUA pesan errornya jadi satu kalimat panjang dipisah koma. // { email: ["Email sudah dipakai"], password: ["Password kurang panjang"] }
                  message = Object.values(data.errors).flat().join(", ");
                  //// "Email sudah dipakai, Password kurang panjang"
                  // digabung jadi satu string, dipisah koma
                } else if (data?.message) {
                  //Kadang server nggak kirim error per-field, cuma kirim satu pesan doang, misal:
                  message = data.message;
                  //Kalau kayak gini, ya langsung pake message itu aja.
                }
              }
        
              SetErrorCreate(message);
              MySwal.fire("Gagal!", message, "error");
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