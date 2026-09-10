import { AxiosInstance } from "@/lib/axios";
import type { ItemsCreate } from "@/schemas/items";
import type { Items } from "@/types/items";
import { isAxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const usecreateItems = () => {
  const Myswal = withReactContent(Swal);
  const [loadingCreate, Setloadingcreate] = useState(false);
  const [errorCreate, Seterrorcreate] = useState("");
  const [data, setData] = useState<Items[]>([]);

  const handleCreate = async (payload: ItemsCreate) => {
    try {
      Setloadingcreate(true);
      Seterrorcreate("");

    //   pakai form karenga gambar gabisa dikirmi by json harus multi part form data
    // terus  if itu untuk kondisi nullbale

      const formData = new FormData();
      if (payload.file) formData.append("file", payload.file);
      formData.append("name", payload.name);
      formData.append("category", payload.category);
      formData.append("brand", payload.brand);
      if (payload.type) formData.append("type", payload.type);
      if (payload.min_stock) formData.append("min_stock", String(payload.min_stock));
      formData.append("size", payload.size);
      formData.append("unit", payload.unit);
      if (payload.description) formData.append("description", payload.description);

      const response = await AxiosInstance.post("/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData(response.data.data);
      Myswal.fire("Berhasil!", "Data items berhasil ditambahkan.", "success");
    } catch (error) {
      let message = "Terjadi kesalahan coba lagi";

      if (isAxiosError(error)) {
        console.log("Validation error response:", error.response?.data);

        const data = error.response?.data;

        if (data.errors) {
          message = Object.values(data.errors).flat().join(", ");
        } else if (data.message) {
          message = data.message;
        }
      }
      Seterrorcreate(message);
      Myswal.fire("Gagal!", message, "error");
    }finally {
        Setloadingcreate(false)
    }
  };

  return {
    loadingCreate,
    errorCreate,
    data,
    handleCreate,
  };
};

export default usecreateItems;