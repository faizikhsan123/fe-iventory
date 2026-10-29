import { AxiosInstance } from "@/lib/axios";
import { isAxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { translateServerMessage } from "@/lib/serverMessages";

const MySwal = withReactContent(Swal);

export const useDeleteEmployes = () => {
  const [loadingDelete, SetLoading] = useState(false);
  const [errorDelete, SetError] = useState("");

  // terima parameter onDelete sebagai callback function yang akan dipanggil setelah data berhasil dihapus
  const handleDelete = async (id: number, onDelete?: () => void) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete?",
      text: "Deleted data cannot be restored!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    // kalau user klik Batal atau tutup dialog, stop di sini
    if (!result.isConfirmed) return;

    try {
      SetLoading(true);
      SetError("");
      await AxiosInstance.delete(`/employes/${id}`);

      MySwal.fire("Deleted!", "Data deleted successfully.", "success");
      onDelete?.(); // panggil callback onDelete kalau ada
    } catch (error) {
    // kita kasi error generic dulu
            let message = "Something went wrong, please try again.";
      
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
                message = (Object.values(data.errors).flat() as unknown[]).map((m) => translateServerMessage(String(m))).join(", ");
                //// "Email sudah dipakai, Password kurang panjang"
                // digabung jadi satu string, dipisah koma
              } else if (data?.message) {
                //Kadang server nggak kirim error per-field, cuma kirim satu pesan doang, misal:
                message = translateServerMessage(data.message);
                //Kalau kayak gini, ya langsung pake message itu aja.
              }
            }
      
            SetError(message);
            MySwal.fire("Failed!", message, "error");
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
