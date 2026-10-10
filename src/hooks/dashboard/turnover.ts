import { AxiosInstance } from "@/lib/axios";
import { useAsyncData } from "@/hooks/useAsyncData";

export type TurnoverSummary = {
  headcount_start: number;
  headcount_end: number;
  average_headcount: number;
  joined: number;
  left: number;
  turnover_rate: number;
};

export type TurnoverMonth = {
  month: number;
  future: boolean;
  left: number;
  joined: number;
  headcount_end: number | null;
  turnover_rate: number | null;
};

export type TurnoverLeftEmployee = {
  id: number;
  name: string;
  division: string;
  position: string;
  left_at: string;
};

export type TurnoverData = {
  period: { year: number; month: number | null; label: string };
  summary: TurnoverSummary;
  monthly: TurnoverMonth[];
  left_employees: TurnoverLeftEmployee[];
  years: number[];
};

const useTurnover = (year: number, month: number | null) =>
  useAsyncData(
    async (signal) => {
      const res = await AxiosInstance.get("/dashboard/turnover", {
        params: { year, ...(month ? { month } : {}) },
        signal,
      });
      return res.data.data as TurnoverData;
    },
    [year, month],
    { errorMessage: "Gagal mengambil data turn over rate" },
  );

export default useTurnover;
