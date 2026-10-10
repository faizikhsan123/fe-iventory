import { useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import { useAsyncData } from "@/hooks/useAsyncData";
import type { PageMeta } from "@/components/common/Pagination";

export type InvoiceLog = {
  id: number;
  status: string;
  status_date: string;
  note: string | null;
  user?: { id: number; name: string } | null;
};

export type Invoice = {
  id: number;
  invoice_number: string | null;
  title: string;
  division: string;
  client: string | null;
  amount: number | null;
  status: string;
  invoice_date: string | null;
  notes: string | null;
  logs?: InvoiceLog[];
};

export type InvoiceSummary = {
  by_status: Record<string, number>;
  by_division: Record<string, number>;
};

export type InvoiceForm = {
  invoice_number: string;
  title: string;
  division: string;
  client: string;
  amount: string;
  invoice_date: string;
  notes: string;
};

export type InvoiceFilters = { search: string; division: string; status: string; page: number };

// ---------- daftar ----------
export const useInvoiceList = (filters: InvoiceFilters, refreshKey: number) => {
  const { data, loading, error, isFetching } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get("/invoices", {
        params: {
          per_page: 10,
          search: filters.search || undefined,
          division: filters.division || undefined,
          status: filters.status || undefined,
          page: filters.page,
        },
        signal,
      });
      return {
        items: res.data.data as Invoice[],
        meta: res.data.meta as PageMeta,
        summary: res.data.summary as InvoiceSummary,
      };
    },
    [filters.search, filters.division, filters.status, filters.page, refreshKey],
    { errorMessage: "Gagal mengambil data invoice" },
  );

  return {
    data: data?.items ?? [],
    meta: data?.meta ?? null,
    summary: data?.summary ?? null,
    loading,
    error,
    isFetching,
  };
};

// ---------- detail (dialog) ----------
export const useInvoiceDetail = (id: number | null) => {
  const { data, loading, error, reload } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get(`/invoices/${id}`, { signal });
      return res.data.data as Invoice;
    },
    [id],
    { enabled: id !== null, errorMessage: "Gagal mengambil detail invoice" },
  );

  return { invoice: data, loading, error, reload };
};

// ---------- aksi (semua return pesan error kalau gagal, null kalau berhasil) ----------
export const useInvoiceActions = () => {
  const [saving, setSaving] = useState(false);

  const toPayload = (f: InvoiceForm) => ({
    invoice_number: f.invoice_number.trim() || null,
    title: f.title.trim(),
    division: f.division,
    client: f.client.trim() || null,
    amount: f.amount === "" ? null : Number(f.amount),
    invoice_date: f.invoice_date || null,
    notes: f.notes.trim() || null,
  });

  const run = async (action: () => Promise<unknown>, fallback: string): Promise<string | null> => {
    setSaving(true);
    try {
      await action();
      return null;
    } catch (e) {
      return getErrorMessage(e, fallback);
    } finally {
      setSaving(false);
    }
  };

  const save = (f: InvoiceForm, id?: number) =>
    run(
      () => (id ? AxiosInstance.put(`/invoices/${id}`, toPayload(f)) : AxiosInstance.post("/invoices", toPayload(f))),
      "Gagal menyimpan invoice",
    );

  const updateStatus = (id: number, body: { status: string; status_date: string; note?: string }) =>
    run(() => AxiosInstance.post(`/invoices/${id}/status`, body), "Gagal mengubah status invoice");

  const remove = async (id: number): Promise<string | null> => {
    try {
      await AxiosInstance.delete(`/invoices/${id}`);
      return null;
    } catch (e) {
      return getErrorMessage(e, "Gagal menghapus invoice");
    }
  };

  return { saving, save, remove, updateStatus };
};
