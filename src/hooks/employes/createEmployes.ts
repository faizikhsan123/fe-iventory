import { AxiosInstance } from "@/lib/axios";
import type { EmployeeCreateForm } from "@/schemas/employes";
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
      SetErrorCreate((error as Error).message);
      MySwal.fire("Gagal!", "Data karyawan gagal ditambahkan.", "error");
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
