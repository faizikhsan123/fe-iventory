import { AxiosInstance } from "@/lib/axios";
import type { EmployeeCreateForm } from "@/schemas/employes";
import { isAxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const UseCreateEmployes = () => {
  const MySwal = withReactContent(Swal);

  const [loadingCreate, SetLoadingCreate] = useState(false);
  const [errorCreate, SetErrorCreate] = useState("");

  const handeCreate = async (payload: EmployeeCreateForm, onsucces?: () => void) => {
    try {
      SetLoadingCreate(true);
      SetErrorCreate("");

      await AxiosInstance.post("/employes", {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        division: payload.division,
        position: payload.position,
      });

      MySwal.fire("Berhasil!", "Data karyawan berhasil ditambahkan.", "success");
      onsucces?.();
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
    handeCreate,
  };
};

export default UseCreateEmployes;
