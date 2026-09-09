import { AxiosInstance } from "@/lib/axios";
import { isAxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const useDeleteSupplier = () => {
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
      await AxiosInstance.delete(`/suppliers/${id}`);

      MySwal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      onDelete?.(); // panggil callback onDelete kalau ada
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
        
              SetError(message);
              MySwal.fire("Gagal!", message, "error");
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
