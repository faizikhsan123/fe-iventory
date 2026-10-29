import { AxiosInstance } from "@/lib/axios";
import { isAxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { translateServerMessage } from "@/lib/serverMessages";

const UseDelete = () => {
  const [deleteloading, Setdeleteloading] = useState(false);
  const [errodelete, Seterrordelete] = useState("");

  const MySwal = withReactContent(Swal);

  // onSuccess dipanggil HANYA kalau delete berhasil
  const handleDelete = async (id: number, onSuccess?: () => void) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete?",
      text: "Deleted data cannot be recovered!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    // kalau user klik Batal atau tutup dialog, stop di sini
    if (!result.isConfirmed) return;

    try {
      Setdeleteloading(true);
      Seterrordelete("");

      await AxiosInstance.delete(`/items/${id}`);
      MySwal.fire("Deleted!", "Data deleted successfully.", "success");
      onSuccess?.();
    } catch (error) {
      let message = "Something went wrong, please try again.";

      if (isAxiosError(error)) {
        console.log("Validation error response:", error.response?.data);

        const data = error.response?.data;

        if (data?.errors) {
          message = (Object.values(data.errors).flat() as unknown[]).map((m) => translateServerMessage(String(m))).join(", ");
        } else if (data?.message) {
          message = translateServerMessage(data.message);
        }
      }

      Seterrordelete(message);
      MySwal.fire("Failed!", message, "error");
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