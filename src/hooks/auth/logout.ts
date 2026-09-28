// hooks/auth/useLogout.ts
import { AxiosInstance } from "@/lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export const UseLogout = () => {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);

      // minta backend hapus token & catat aktivitas logout
      await AxiosInstance.post("/logout");
    } catch (error) {
      // gagal (misal token sudah expired) gak masalah, tetap lanjut logout di FE
      console.log("Logout ke server gagal:", error);
    } finally {
      // bersihin data login di browser, dijalanin walau request di atas gagal
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setLoadingLogout(false);
      navigate("/login");
    }
  };

  return { loadingLogout, handleLogout };
};