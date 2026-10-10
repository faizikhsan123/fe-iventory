import { useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import { useAsyncData } from "@/hooks/useAsyncData";

export type PerformanceReview = {
  id: number;
  project: string | null;
  period_start: string;
  period_end: string;
  reviewer_name: string;
  reviewer_title: string | null;
  review_date: string;
  scores: { safety: number[]; production: number[]; cost: number[] };
  safety_avg: number;
  production_avg: number;
  cost_avg: number;
  overall_avg: number;
};

export type PerformanceReviewPayload = {
  project?: string;
  period_start: string;
  period_end: string;
  reviewer_name: string;
  reviewer_title?: string;
  review_date: string;
  scores: PerformanceReview["scores"];
};

const usePerformanceReview = (employeId?: string | number) => {
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get(`/employes/${employeId}/performance-reviews`, { signal });
      return res.data.data as PerformanceReview[];
    },
    [employeId],
    { enabled: Boolean(employeId), errorMessage: "Gagal mengambil performance review" },
  );

  // return pesan error kalau gagal, null kalau berhasil
  const createReview = async (payload: PerformanceReviewPayload): Promise<string | null> => {
    setSaving(true);
    try {
      await AxiosInstance.post(`/employes/${employeId}/performance-reviews`, payload);
      reload();
      return null;
    } catch (e) {
      return getErrorMessage(e, "Gagal menyimpan performance review");
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (id: number): Promise<string | null> => {
    try {
      await AxiosInstance.delete(`/performance-reviews/${id}`);
      reload();
      return null;
    } catch (e) {
      return getErrorMessage(e, "Gagal menghapus performance review");
    }
  };

  return { data: data ?? [], loading, error, saving, createReview, deleteReview };
};

export default usePerformanceReview;
