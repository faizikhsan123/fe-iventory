import { useEffect, useState } from "react";
import useGetStockOnHand from "./items/getStockOnHand";
import { ITEM_CATEGORIES, categoryLabel } from "@/lib/itemCategory";


const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const fieldClass =
  "h-11 rounded-lg border border-[#BFCCE3] bg-white px-3 text-base text-[#112D4E] outline-none transition focus:border-[#3F72AF] focus:ring-4 focus:ring-[#DBE2EF] sm:text-sm";

const StockOnHandTab = () => {
  const { data, totalNilai, meta, loading, error, getStockOnHand } = useGetStockOnHand();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // reset ke halaman 1 kalau filter berubah
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(() => getStockOnHand({ search, category, page, per_page: 20 }), 400);
    return () => clearTimeout(t);
  }, [search, category, page]);

  return (
    <div className="space-y-4">
      {/* Ringkasan */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-4">
          <p className="text-sm text-[#50688C]">Total Items</p>
          <p className="text-xl font-bold text-[#112D4E]">{(meta?.total ?? 0).toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-4">
          <p className="text-sm text-[#50688C]">Total Stock Value</p>
          <p className="text-xl font-bold text-[#112D4E]">{rupiah(totalNilai)}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className={`${fieldClass} w-full`}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${fieldClass} sm:w-48`}>
          <option value="">All categories</option>
          {ITEM_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-[#B3261E]">{error}</p>}

      {/* Tabel */}
      <div className="overflow-x-auto rounded-lg border border-[#DBE2EF] bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="bg-[#DBE2EF] text-[#112D4E]">
              <th className="px-4 py-3 font-semibold">Item Name</th>
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Current Stock</th>
              <th className="px-4 py-3 text-right font-semibold">Stock Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DBE2EF]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-[#50688C]">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-[#50688C]">
                  No data
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="text-[#112D4E] transition-colors hover:bg-[#F9F7F7]">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-3 py-3 text-[#50688C]">{categoryLabel(row.category)}</td>
                  <td className="px-3 py-3 font-semibold">{`${row.current_stock.toLocaleString("id-ID")} ${row.unit}`}</td>
                  <td className="px-4 py-3 text-right font-bold">{rupiah(row.stock_value)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="h-10 rounded-lg border border-[#BFCCE3] bg-white px-4 text-sm font-semibold text-[#112D4E] disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-[#50688C]">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <button
            type="button"
            disabled={page >= meta.last_page || loading}
            onClick={() => setPage((p) => p + 1)}
            className="h-10 rounded-lg border border-[#BFCCE3] bg-white px-4 text-sm font-semibold text-[#112D4E] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StockOnHandTab;