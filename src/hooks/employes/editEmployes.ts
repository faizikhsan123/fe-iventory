import { AxiosInstance } from "@/lib/axios";
import type { EmployeeEditForm } from "@/schemas/employes";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isAxiosError } from "axios";

const UseeditEmployes = () => {
  const [loadingupdate, Setloadingupdate] = useState(false);
  const [errorupdate, SetErrorupdate] = useState("");

  const Myswal = withReactContent(Swal);

  const handleUpdate = async (id: number, payload: EmployeeEditForm, onSucces?: () => void) => {
    try {
      Setloadingupdate(true);
      SetErrorupdate("");

      await AxiosInstance.patch(`/employes/${id}`, {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        division: payload.division,
        position: payload.position,
        status: payload.status,
      });
      Myswal.fire("Berhasil!", "Data supplier berhasil dirubah.", "success");
      onSucces?.();
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

      SetErrorupdate(message);
      Myswal.fire("Gagal!", message, "error");
    } finally {
      Setloadingupdate(false);
    }
  };

  return {
    loadingupdate,
    errorupdate,
    handleUpdate,
  };
};

export default UseeditEmployes;
