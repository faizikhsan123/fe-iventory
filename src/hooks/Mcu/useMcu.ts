import { useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import { useAsyncData } from "@/hooks/useAsyncData";
import type { PageMeta } from "@/components/common/Pagination";

export type Mcu = {
  id: number;
  employes_id: number;
  employee_name: string | null;
  id_number: string | null;
  division: string | null;
  position: string | null;
  place_name: string;
  mcu_name: string | null;
  mcu_date: string;
  document: string | null;
  summary: string | null;
  allergies: string | null;
  next_mcu_date: string | null;
  is_latest?: boolean;
};

export type McuForm = {
  employes_id: string;
  place_name: string;
  mcu_name: string;
  mcu_date: string;
  next_mcu_date: string;
  allergies: string;
  summary: string;
  document: File | null;
};

export type EmployeeOption = { id: number; id_number: string; name: string };

// ---------- daftar ----------
export const useMcuList = (params: { search: string; page: number }, refreshKey: number) => {
  const { data, loading, error, isFetching } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get("/mcus", {
        params: { per_page: 10, search: params.search || undefined, page: params.page },
        signal,
      });
      return { items: res.data.data as Mcu[], meta: res.data.meta as PageMeta };
    },
    [params.search, params.page, refreshKey],
    { errorMessage: "Gagal mengambil data MCU" },
  );

  return { data: data?.items ?? [], meta: data?.meta ?? null, loading, error, isFetching };
};

// ---------- simpan / hapus ----------
export const useMcuActions = () => {
  const [saving, setSaving] = useState(false);

  // return pesan error kalau gagal, null kalau berhasil
  const save = async (form: McuForm, id?: number): Promise<string | null> => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("employes_id", form.employes_id);
      fd.append("place_name", form.place_name);
      fd.append("mcu_name", form.mcu_name);
      fd.append("mcu_date", form.mcu_date);
      fd.append("next_mcu_date", form.next_mcu_date);
      fd.append("allergies", form.allergies);
      fd.append("summary", form.summary);
      if (form.document) fd.append("document", form.document);

      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (id) {
        fd.append("_method", "PATCH"); // multipart + PATCH harus lewat POST
        await AxiosInstance.post(`/mcus/${id}`, fd, config);
      } else {
        await AxiosInstance.post("/mcus", fd, config);
      }
      return null;
    } catch (e) {
      return getErrorMessage(e, "Gagal menyimpan data MCU");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<string | null> => {
    try {
      await AxiosInstance.delete(`/mcus/${id}`);
      return null;
    } catch (e) {
      return getErrorMessage(e, "Gagal menghapus data MCU");
    }
  };

  return { saving, save, remove };
};

// ---------- pilihan karyawan untuk form ----------
export const useEmployeeOptions = () => {
  const { data } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get("/employes", { params: { per_page: 100 }, signal });
      return (res.data.data as { id: number; id_number: string; user?: { name: string } }[]).map(
        (e): EmployeeOption => ({ id: e.id, id_number: e.id_number, name: e.user?.name ?? "-" }),
      );
    },
    [],
  );

  return data ?? [];
};
