import { useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import { useAsyncData } from "@/hooks/useAsyncData";
import type { PageMeta } from "@/components/common/Pagination";

export type ContractSummary = {
  id: number;
  id_number: string;
  name: string;
  division: string;
  position: string;
  status: string;
  contract_start: string | null;
  contract_end: string | null;
  renewals_count: number;
  reviews_count: number;
  average_score: number | null;
  left_at?: string | null;
  resign_reason?: string | null;
  exit_type?: "resigned" | "contract_ended" | null;
};

export type ContractRenewal = {
  id: number;
  previous_end: string | null;
  new_end: string;
  note: string | null;
  created_at: string;
};

export type ContractDetail = ContractSummary & {
  safety_score: number | null;
  production_score: number | null;
  cost_score: number | null;
  renewals: ContractRenewal[];
};

// ---------- daftar ----------
export const useContractList = (params: { search: string; page: number }) => {
  const { data, loading, error, isFetching } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get("/contracts", {
        params: { per_page: 10, search: params.search || undefined, page: params.page },
        signal,
      });
      return { items: res.data.data as ContractSummary[], meta: res.data.meta as PageMeta };
    },
    [params.search, params.page],
    { errorMessage: "Failed to load contract data" },
  );

  return { data: data?.items ?? [], meta: data?.meta ?? null, loading, error, isFetching };
};

// ---------- detail + perpanjangan ----------
export const useContractDetail = (id?: string) => {
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get(`/contracts/${id}`, { signal });
      return res.data.data as ContractDetail;
    },
    [id],
    { enabled: Boolean(id), errorMessage: "Failed to load contract details" },
  );

  // return pesan error kalau gagal, null kalau berhasil
  const addRenewal = async (payload: { new_end: string; note?: string }): Promise<string | null> => {
    setSaving(true);
    try {
      await AxiosInstance.post(`/contracts/${id}/renewals`, payload);
      reload();
      return null;
    } catch (e) {
      return getErrorMessage(e, "Failed to renew contract");
    } finally {
      setSaving(false);
    }
  };

  const deleteRenewal = async (renewalId: number): Promise<string | null> => {
    try {
      await AxiosInstance.delete(`/contract-renewals/${renewalId}`);
      reload();
      return null;
    } catch (e) {
      return getErrorMessage(e, "Failed to delete renewal");
    }
  };

  const resign = async (payload: { resign_date: string; reason: string }): Promise<string | null> => {
    setSaving(true);
    try {
      await AxiosInstance.post(`/contracts/${id}/resign`, payload);
      reload();
      return null;
    } catch (e) {
      return getErrorMessage(e, "Failed to process resignation");
    } finally {
      setSaving(false);
    }
  };

  return { data, loading, error, saving, reload, addRenewal, deleteRenewal, resign };
};
