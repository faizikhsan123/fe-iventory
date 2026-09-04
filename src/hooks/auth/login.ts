import { AxiosInstance } from "@/lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export const UseLogin = () => {
  const [error, SetError] = useState("");
  const [loading, SetLoading] = useState(false);
  const navigate = useNavigate();
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  const HandleLogin = async (payload1: string, payload2: string) => {
    try {
      SetLoading(true);
      SetError("");
      // coba login
      const response = await AxiosInstance.post("login", {
        email: payload1,
        password: payload2,
      });

      console.log("RESPONSE LOGIN:", response.data);
      const token = response.data.token;
      console.log("TOKEN YANG DISIMPAN:", token);
      localStorage.setItem("token", token);
      // redirect ke halaman dashboard
      navigate("/");
      //   jika login berhasil, maka reset state email dan password
      SetEmail("");
      SetPassword("");
    } catch (error: any) {
      if (error.response.status === 401) {
        SetError("email atau password salah");
      } else if (error.response.status === 403) {
        SetError("anda tidak memiliki akses");
      } else {
        SetError(error.message);
      }
    } finally {
      SetLoading(false);
    }
  };

  return {
    error,
    loading,
    HandleLogin,
    email,
    SetEmail,
    password,
    SetPassword,
  };
};
