import { useState } from "react";
import axios from "axios";
import { AxiosInstance } from "@/lib/axios";
import { translateServerMessage } from "@/lib/serverMessages";

export type QuantityTarget =
  | { kind: "transaction-item"; id: number }
  | { kind: "stock-history"; id: number };

export interface QuantityResult {
  id: number;
  item_id: number;
  item_name: string;
  old_qty: number;
  new_qty: number;
  delta: number;
  current_stock: number;
}

function endpointFor(target: QuantityTarget) {
  return target.kind === "transaction-item"
    ? `/transaction-items/${target.id}/quantity`
    : `/stock-history/${target.id}/quantity`;
}

function extractError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    const first = data?.errors?.quantity?.[0];
    if (first) return translateServerMessage(first);
    if (data?.message) return translateServerMessage(data.message);
    if (err.response?.status === 403) return "You are not allowed to edit this quantity";
    if (err.response?.status === 404) return "Record not found";
  }
  return "Failed to update quantity";
}

// Never throws: resolves with { result } on success or { error } on failure.
export function useUpdateQuantity() {
  const [saving, setSaving] = useState(false);

  const updateQuantity = async (
    target: QuantityTarget,
    quantity: number,
  ): Promise<{ result?: QuantityResult; error?: string }> => {
    setSaving(true);
    try {
      const res = await AxiosInstance.patch(endpointFor(target), { quantity });
      return { result: res.data.data as QuantityResult };
    } catch (err) {
      return { error: extractError(err) };
    } finally {
      setSaving(false);
    }
  };

  return { saving, updateQuantity };
}
