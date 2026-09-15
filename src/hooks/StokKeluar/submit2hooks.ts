import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useCreateTransactionItem from "./createTransactionItem";
import type { StockOut } from "@/schemas/StockOut";
import useCreateTransaction from "./create";
import type { TransactionResult } from "@/types/Stockout";

const MySwal = withReactContent(Swal);

const useSubmitStockKeluar = () => {
  const { postTransaction, error: errorTransaction } = useCreateTransaction();
  const { postTransactionItem, error: errorItem } = useCreateTransactionItem();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TransactionResult | null>(null);

  const submit = async (values: StockOut) => {
    setSubmitting(true);
    setError("");

    // step 1: bikin header transaksi
    const transaction = await postTransaction({
      employes_id: values.employes_id,
      note: values.note,
      date : values.date
    });

    if (!transaction) {
      const message = errorTransaction || "Gagal membuat transaksi";
      setError(message);
      MySwal.fire("Gagal!", message, "error");
      setSubmitting(false);
      return null;
    }

    // step 2: loop submit tiap baris barang
    for (const item of values.items) {
      const itemResult = await postTransactionItem({
        transactions_id: transaction.id, // pastikan ini "transactions_id"
        items_id: item.items_id,
        qty: item.qty,
        date  : transaction.date
      });

      if (!itemResult) {
        const message = errorItem || "Gagal menyimpan salah satu barang";
        setError(message);
        MySwal.fire("Gagal!", message, "error");
        setSubmitting(false);
        return null;
      }
    }

    setResult(transaction);
    MySwal.fire("Berhasil!", "Transaksi barang keluar berhasil disimpan.", "success");
    setSubmitting(false);
    return transaction;
  };

  return { submit, submitting, error, result };
};

export default useSubmitStockKeluar;
