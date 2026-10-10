import { AxiosInstance } from "@/lib/axios";
import type { EmployeeCreateForm } from "@/schemas/employes";
import { PPE_FIELDS } from "@/schemas/cpd";
import { appendCpd } from "@/hooks/employes/cpd";
import type { employes } from "@/types/employes";
import { isAxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const UseCreateEmployes = () => {
  const MySwal = withReactContent(Swal);

  const [loadingCreate, SetLoadingCreate] = useState(false);
  const [errorCreate, SetErrorCreate] = useState("");
  const [data, Setdata] = useState<employes[]>([]);
  //  const [data, setData] = useState<Items[]>([]);

  const handeCreate = async (payload: EmployeeCreateForm, onsucces?: () => void) => {
    try {
      SetLoadingCreate(true);
      SetErrorCreate("");

      const formData = new FormData();
      if (payload.file) formData.append("file", payload.file);
      formData.append("id_number", payload.id_number);
      formData.append("name", payload.name);
      // formData.append("email", payload.email);
      // formData.append("password", payload.password);
      formData.append("division", payload.division);
      formData.append("position", payload.position);
      if (payload.contract_start) formData.append("contract_start", payload.contract_start);
      if (payload.contract_end) formData.append("contract_end", payload.contract_end);
      if (payload.ktp_address) formData.append("ktp_address", payload.ktp_address);
      if (payload.actual_address) formData.append("actual_address", payload.actual_address);
      if (payload.emergency_contact) formData.append("emergency_contact", payload.emergency_contact);
      for (const { name } of PPE_FIELDS) {
        const value = payload[name];
        if (value) formData.append(name, value);
      }
      appendCpd(formData, payload.cpd);

      // if (payload.brand) formData.append("brand", payload.brand);
      // if (payload.type) formData.append("type", payload.type);
      // if (payload.min_stock) formData.append("min_stock", String(payload.min_stock));
      // if (payload.price) formData.append("price", String(payload.price));
      // if (payload.size) formData.append("size", payload.size);
      // formData.append("unit", payload.unit);
      // if (payload.description) formData.append("description", payload.description);

      const response = await AxiosInstance.post("/employes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Setdata(response.data.data);

      // await AxiosInstance.post("/employes", {
      //   name: payload.name,
      //   email: payload.email,
      //   password: payload.password,
      //   division: payload.division,
      //   position: payload.position,
      // });

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
    data,
    loadingCreate,
    errorCreate,
    handeCreate,
  };
};

export default UseCreateEmployes;
