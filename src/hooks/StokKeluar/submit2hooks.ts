import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useCreateTransactionItem from "./createTransactionItem";
import type { StockOut } from "@/schemas/StockOut";
import useCreateTransaction from "./create";
import type { TransactionResult } from "@/types/Stockout";

const MySwal = withReactContent(Swal);

const useSubmitStockKeluar = () => {
  const { postTransaction } = useCreateTransaction();
  const { postTransactionItem } = useCreateTransactionItem();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TransactionResult | null>(null);

  const submit = async (values: StockOut) => {
    setSubmitting(true);
    setError("");

    let transaction: TransactionResult;

    // step 1: bikin header transaksi
    try {
      transaction = await postTransaction({
        employes_id: values.employes_id,
        note: values.note,
        date: values.date,
      });
    } catch (err) {
      const message = (err as Error).message || "Gagal membuat transaksi";
      setError(message);
      MySwal.fire("Gagal!", message, "error");
      setSubmitting(false);
      return null;
    }

    // step 2: loop submit tiap baris barang
    try {
      for (const item of values.items) {
        await postTransactionItem({
          transactions_id: transaction.id,
          items_id: item.items_id,
          qty: item.qty,
          date: transaction.date,
        }); 
      }
    } catch (err) {
      const message = (err as Error).message || "Gagal menyimpan salah satu barang";
      setError(message);
      MySwal.fire("Gagal!", message, "error");
      setSubmitting(false);
      return null;
    }

    setResult(transaction);
    MySwal.fire("Berhasil!", "Transaksi barang keluar berhasil disimpan.", "success");
    setSubmitting(false);
    return transaction;
  };

  return { submit, submitting, error, result };
};

export default useSubmitStockKeluar;