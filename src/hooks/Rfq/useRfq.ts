import { useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import { useAsyncData } from "@/hooks/useAsyncData";
import type { PageMeta } from "@/components/common/Pagination";

export type RfqUpdateItem = {
  id: number;
  update_date: string;
  note: string;
  priority_code: string | null;
  user: string | null;
};

export type Rfq = {
  id: number;
  enquiry_no: string;
  rfq_date: string;
  type: string | null;
  source: string | null;
  area: string | null;
  opportunity_name: string;
  description: string | null;
  customer_ref: string | null;
  quote_no: string | null;
  customer: string;
  contact_name: string | null;
  contact_phone: string | null;
  supplier: string | null;
  has_supplier_quote: boolean;
  has_brochure: boolean;
  has_drawing: boolean;
  status: string;
  priority_code: string;
  priority_guide: string | null;
  priority_pic: string | null;
  po_received: boolean;
  po_number: string | null;
  current_pic: string | null;
  action_plan: string | null;
  deadline: string | null;
  amount: number | null;
  latest_update?: { update_date: string; note: string } | null;
  updates?: RfqUpdateItem[];
};

export type RfqSummary = {
  by_priority_group: Record<string, number>;
  by_status: Record<string, number>;
};

export type RfqOptions = {
  priorities: { code: string; guide: string; pic: string | null }[];
  statuses: string[];
  types: string[];
  sources: string[];
  areas: string[];
  customers: string[];
  pics: string[];
};

export type RfqForm = {
  enquiry_no: string;
  rfq_date: string;
  type: string;
  source: string;
  area: string;
  opportunity_name: string;
  description: string;
  customer_ref: string;
  quote_no: string;
  customer: string;
  contact_name: string;
  contact_phone: string;
  supplier: string;
  has_supplier_quote: boolean;
  has_brochure: boolean;
  has_drawing: boolean;
  status: string;
  priority_code: string;
  po_received: boolean;
  po_number: string;
  current_pic: string;
  action_plan: string;
  deadline: string;
  amount: string;
};

export type RfqFilters = { search: string; priority: string; status: string; type: string; page: number };

const EMPTY_OPTIONS: RfqOptions = { priorities: [], statuses: [], types: [], sources: [], areas: [], customers: [], pics: [] };

// ---------- daftar ----------
export const useRfqList = (filters: RfqFilters, refreshKey: number) => {
  const { data, loading, error, isFetching } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get("/rfqs", {
        params: {
          per_page: 10,
          search: filters.search || undefined,
          priority: filters.priority || undefined,
          status: filters.status || undefined,
          type: filters.type || undefined,
          page: filters.page,
        },
        signal,
      });
      return {
        items: res.data.data as Rfq[],
        meta: res.data.meta as PageMeta,
        summary: res.data.summary as RfqSummary,
      };
    },
    [filters.search, filters.priority, filters.status, filters.type, filters.page, refreshKey],
    { errorMessage: "Gagal mengambil data RFQ" },
  );

  return { data: data?.items ?? [], meta: data?.meta ?? null, summary: data?.summary ?? null, loading, error, isFetching };
};

// ---------- pilihan form/filter (prioritas dari backend + saran isian dari data yang ada) ----------
export const useRfqOptions = (refreshKey: number): RfqOptions => {
  const { data } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get("/rfqs/options", { signal });
      return res.data.data as RfqOptions;
    },
    [refreshKey],
  );
  return data ?? EMPTY_OPTIONS;
};

// ---------- detail (dialog) ----------
export const useRfqDetail = (id: number | null) => {
  const { data, loading, error, reload } = useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get(`/rfqs/${id}`, { signal });
      return res.data.data as Rfq;
    },
    [id],
    { enabled: id !== null, errorMessage: "Gagal mengambil detail RFQ" },
  );
  return { rfq: data, loading, error, reload };
};

// ---------- aksi (return pesan error kalau gagal, null kalau berhasil) ----------
const nullable = (v: string) => v.trim() || null;

const toPayload = (f: RfqForm) => ({
  enquiry_no: nullable(f.enquiry_no),
  rfq_date: f.rfq_date,
  type: nullable(f.type),
  source: nullable(f.source),
  area: nullable(f.area),
  opportunity_name: f.opportunity_name.trim(),
  description: nullable(f.description),
  customer_ref: nullable(f.customer_ref),
  quote_no: nullable(f.quote_no),
  customer: f.customer.trim(),
  contact_name: nullable(f.contact_name),
  contact_phone: nullable(f.contact_phone),
  supplier: nullable(f.supplier),
  has_supplier_quote: f.has_supplier_quote,
  has_brochure: f.has_brochure,
  has_drawing: f.has_drawing,
  status: f.status,
  priority_code: f.priority_code,
  po_received: f.po_received,
  po_number: nullable(f.po_number),
  current_pic: nullable(f.current_pic),
  action_plan: nullable(f.action_plan),
  deadline: f.deadline || null,
  amount: f.amount === "" ? null : Number(f.amount),
});

export const useRfqActions = () => {
  const [saving, setSaving] = useState(false);

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

  const save = (form: RfqForm, id?: number) =>
    run(
      () => (id ? AxiosInstance.put(`/rfqs/${id}`, toPayload(form)) : AxiosInstance.post("/rfqs", toPayload(form))),
      "Gagal menyimpan RFQ",
    );

  const addUpdate = (id: number, body: { update_date: string; note: string; priority_code?: string }) =>
    run(() => AxiosInstance.post(`/rfqs/${id}/updates`, body), "Gagal menambah progres");

  const remove = async (id: number): Promise<string | null> => {
    try {
      await AxiosInstance.delete(`/rfqs/${id}`);
      return null;
    } catch (e) {
      return getErrorMessage(e, "Gagal menghapus RFQ");
    }
  };

  const removeUpdate = async (updateId: number): Promise<string | null> => {
    try {
      await AxiosInstance.delete(`/rfq-updates/${updateId}`);
      return null;
    } catch (e) {
      return getErrorMessage(e, "Gagal menghapus progres");
    }
  };

  return { saving, save, remove, addUpdate, removeUpdate };
};
