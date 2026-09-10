import { AxiosInstance } from "@/lib/axios";
import { isAxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const UseDelete = () => {
  const [deleteloading, Setdeleteloading] = useState(false);
  const [errodelete, Seterrordelete] = useState("");

  const MySwal = withReactContent(Swal);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin mau hapus?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    // kalau user klik Batal atau tutup dialog, stop di sini
    if (!result.isConfirmed) return;
    try {
      Setdeleteloading(true);
      Seterrordelete("");

      await AxiosInstance.delete(`/items/${id}`);
      MySwal.fire("Terhapus!", "Data berhasil dihapus.", "success");
    } catch (error) {
      let message = "Terjadi kesalahan, coba lagi.";

      if (isAxiosError(error)) {
        console.log("Validation error response:", error.response?.data);

        const data = error.response?.data;

        if (data?.errors) {
          message = Object.values(data.errors).flat().join(", ");
        } else if (data?.message) {
          message = data.message;
        }
      }

      Seterrordelete(message); // sesuaikan nama function-nya
      MySwal.fire("Gagal!", message, "error");
    } finally {
      Setdeleteloading(false);
    }
  };
  return {
    deleteloading,
    errodelete,
    handleDelete,
  };
};

export default UseDelete;
