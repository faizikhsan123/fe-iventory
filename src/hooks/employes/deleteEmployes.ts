import { AxiosInstance } from "@/lib/axios";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const useDeleteEmployes = () => {
  const [loadingDelete, SetLoading] = useState(false);
  const [errorDelete, SetError] = useState("");

  // terima parameter onDelete sebagai callback function yang akan dipanggil setelah data berhasil dihapus
  const handleDelete = async (id: number, onDelete?: () => void) => {
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
      SetLoading(true);
      SetError("");
      await AxiosInstance.delete(`/employes/${id}`);

      MySwal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      onDelete?.(); // panggil callback onDelete kalau ada
    } catch (error) {
      SetError((error as Error).message);
      MySwal.fire("Gagal!", "Data gagal dihapus.", "error");
    } finally {
      SetLoading(false);
    }
  };

  return {
    loadingDelete,
    errorDelete,
    handleDelete,
  };
};
