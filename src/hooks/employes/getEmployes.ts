import { AxiosInstance } from "@/lib/axios";
import type { employes } from "@/types/employes";
import { useCallback, useRef, useState } from "react";

type Params = {
  search?: string;
  page?: number;
  per_page?: number;
  division?: string;
  position? : string;
  status?: string;
  all?: boolean;
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number; 
  total: number;
};

const useGetEmployes = () => {
  const [data, setData] = useState<employes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const requestId = useRef(0);

  const getEmployesButton = useCallback(async ({ all = false, ...params }: Params = {}) => {
    const currentRequest = ++requestId.current;
    try {
      setLoading(true);
      setError("");
      setData([]);
      setMeta(null);

      const response = await AxiosInstance.get("/employes", {
        params: all ? { ...params, page: 1, per_page: 100 } : params,
      });

      const employees: employes[] = [...response.data.data];
      if (currentRequest !== requestId.current) return;
      if (all) {
        // The API caps each page at 100; increasing per_page alone loses employees.
        for (let page = 2; page <= response.data.meta.last_page; page++) {
          const next = await AxiosInstance.get("/employes", {
            params: { ...params, page, per_page: 100 },
          });
          if (currentRequest !== requestId.current) return;
          employees.push(...next.data.data);
        }
      }

      setData(employees);
      setMeta(all ? null : response.data.meta);
    } catch {
      if (currentRequest === requestId.current) setError("Failed to load employee data.");
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  // Memuat SEMUA karyawan (semua halaman, 100 per request = batas maksimum backend),
  // tanpa duplikat dan urut nama. Untuk pilihan karyawan di form; tabel tetap pakai getEmployesButton.
  const getAllEmployes = useCallback(async (params: Omit<Params, "all" | "page" | "per_page"> = {}) => {
    const currentRequest = ++requestId.current;
    try {
      setLoading(true);
      setError("");
      setMeta(null);

      const all: employes[] = [];
      const seen = new Set<number>();
      let page = 1;
      let lastPage = 1;
      do {
        const response = await AxiosInstance.get("/employes", {
          params: { ...params, page, per_page: 100 },
        });
        if (currentRequest !== requestId.current) return;
        for (const emp of response.data.data as employes[]) {
          if (!seen.has(emp.id)) {
            seen.add(emp.id);
            all.push(emp);
          }
        }
        lastPage = response.data.meta?.last_page ?? 1;
        page += 1;
      } while (page <= lastPage);

      all.sort((a, b) => (a.user?.name ?? "").localeCompare(b.user?.name ?? "", "en"));
      setData(all);
    } catch {
      if (currentRequest === requestId.current) setError("Failed to load employee data.");
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    meta,
    getEmployesButton,
    getAllEmployes,
  };
};

export default useGetEmployes;
