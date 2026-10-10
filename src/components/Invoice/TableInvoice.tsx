import { memo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Receipt, SquarePen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import { ListEmpty, ListError, ListSkeleton } from "../common/ListStates";
import InvoiceStepper from "./InvoiceStepper";
import { useInvoiceList, type Invoice, type InvoiceFilters } from "@/hooks/Invoice/useInvoice";
import { INVOICE_DIVISIONS, INVOICE_STATUSES, rupiah, statusBadgeClass, statusLabel, type SortDirection } from "@/lib/invoice";
import { formatTanggalIndo } from "@/lib/tanggal";
import { dangerIconButtonClass, iconButtonClass } from "@/lib/formStyles";

type Props = {
  refreshKey?: number;
  onDetail: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
};

// siklus klik header: urut naik -> turun -> tanpa urutan
const nextSort = (s: SortDirection | ""): SortDirection | "" => (s === "" ? "asc" : s === "asc" ? "desc" : "");

function SortIcon({ sort }: { sort: SortDirection | "" }) {
  if (sort === "asc") return <ArrowUp size={14} aria-hidden="true" />;
  if (sort === "desc") return <ArrowDown size={14} aria-hidden="true" />;
  return <ArrowUpDown size={14} className="opacity-50" aria-hidden="true" />;
}

const sortLabel = (s: SortDirection | "") =>
  s === "asc" ? "Urut status: tahap awal dulu" : s === "desc" ? "Urut status: tahap akhir dulu" : "Urutkan berdasarkan status";

const th = "px-4 text-center font-bold text-[#112D4E]";
const td = "px-4 py-4 text-center align-middle";

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusBadgeClass[status] ?? ""}`}
    >
      {statusLabel(status)}
    </span>
  );
}

function Actions({ invoice, onDetail, onEdit, onDelete }: { invoice: Invoice } & Omit<Props, "refreshKey">) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="icon"
        variant="outline"
        className={iconButtonClass}
        aria-label={`Detail ${invoice.service_name}`}
        onClick={() => onDetail(invoice)}
      >
        <Eye size={16} />
      </Button>
      {onEdit && (
        <Button
          size="icon"
          variant="outline"
          className={iconButtonClass}
          aria-label={`Edit ${invoice.service_name}`}
          onClick={() => onEdit(invoice)}
        >
          <SquarePen size={16} />
        </Button>
      )}
      {onDelete && (
        <Button
          size="icon"
          variant="outline"
          className={dangerIconButtonClass}
          aria-label={`Hapus ${invoice.service_name}`}
          onClick={() => onDelete(invoice)}
        >
          <Trash2 size={16} className="text-[#B3261E]" />
        </Button>
      )}
    </div>
  );
}

const InvoiceRow = memo(function InvoiceRow({
  invoice: inv,
  number,
  onDetail,
  onEdit,
  onDelete,
}: { invoice: Invoice; number: number } & Omit<Props, "refreshKey">) {
  return (
    <TableRow className="border-[#DBE2EF] text-[#112D4E] transition-colors hover:bg-[#F9F7F7]">
      <TableCell className={`${td} text-[#50688C]`}>{number}</TableCell>
      <TableCell className={td}>{inv.invoice_number || "-"}</TableCell>
      <TableCell className={`${td} max-w-60 whitespace-normal break-words font-medium`}>{inv.service_name}
        {inv.service_date && (
          <span className="block text-xs font-normal text-[#50688C]">{formatTanggalIndo(inv.service_date)}</span>
        )}
      </TableCell>
      <TableCell className={td}>{inv.division}</TableCell>
      <TableCell className={td}>{inv.client || "-"}</TableCell>
      <TableCell className={`${td} whitespace-nowrap`}>{rupiah(inv.amount)}</TableCell>
      <TableCell className={`${td} whitespace-nowrap`}>
        {inv.invoice_date ? formatTanggalIndo(inv.invoice_date) : "-"}
      </TableCell>
      <TableCell className={td}>
        <div className="flex flex-col items-center gap-2">
          <InvoiceStepper status={inv.status} compact />
          <StatusBadge status={inv.status} />
        </div>
      </TableCell>
      <TableCell className={td}>
        <Actions invoice={inv} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
});

const TableInvoice = ({ refreshKey = 0, onDetail, onEdit, onDelete }: Props) => {
  const [filters, setFilters] = useState<InvoiceFilters>({ search: "", division: "", status: "", sort_status: "", page: 1 });
  const { data, meta, summary, loading, error, isFetching } = useInvoiceList(filters, refreshKey);
  const offset = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 10);

  // setiap filter berubah, kembali ke halaman 1
  const patch = (p: Partial<typeof filters>) => setFilters((f) => ({ ...f, ...p, page: 1 }));

  return (
    <div className="space-y-4">
      {/* Ringkasan per tahapan (klik untuk filter) */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {INVOICE_STATUSES.map((s) => {
          const active = filters.status === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => patch({ status: active ? "" : s.value })}
              aria-pressed={active}
              className={`rounded-lg border p-4 text-left shadow-[0_2px_10px_rgb(17,45,78,0.06)] transition sm:rounded-xl ${
                active ? "border-[#112D4E] bg-[#DBE2EF]" : "border-[#DBE2EF] bg-white hover:bg-[#F9F7F7]"
              }`}
            >
              <p className="text-2xl font-extrabold tabular-nums leading-none text-[#112D4E]">
                {summary?.by_status?.[s.value] ?? 0}
              </p>
              <p className="mt-1.5 text-xs font-semibold text-[#112D4E]">{s.label}</p>
              <p className="text-xs text-[#50688C]">{s.hint}</p>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
        <div className="space-y-3 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter divisi">
            {["", ...INVOICE_DIVISIONS].map((d) => (
              <button
                key={d || "all"}
                type="button"
                onClick={() => patch({ division: d })}
                aria-pressed={filters.division === d}
                className={`h-9 rounded-lg px-4 text-sm font-semibold transition ${
                  filters.division === d
                    ? "bg-[#112D4E] text-white"
                    : "border border-[#BFCCE3] bg-white text-[#112D4E] hover:bg-[#F9F7F7]"
                }`}
              >
                {d || "Semua"}
                {d && summary?.by_division ? ` (${summary.by_division[d] ?? 0})` : ""}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => patch({ sort_status: nextSort(filters.sort_status) })}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#BFCCE3] bg-white px-4 text-sm font-semibold text-[#112D4E] hover:bg-[#F9F7F7] md:hidden"
          >
            <SortIcon sort={filters.sort_status} /> {sortLabel(filters.sort_status)}
          </button>

          <SearchBar
            placeholder="Cari no. invoice, jasa, atau client..."
            busy={isFetching}
            onSearch={(search) => patch({ search })}
          />
        </div>

        {loading && <ListSkeleton />}
        {error && <ListError message={error} />}

        {!loading && !error && data.length === 0 && (
          <ListEmpty
            icon={<Receipt size={28} />}
            title="Invoice tidak ditemukan"
            hint="Ubah filter atau tambah invoice baru"
          />
        )}

        {!loading && !error && data.length > 0 && (
          <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {/* Mobile: kartu */}
            <ul className="divide-y divide-[#DBE2EF] md:hidden">
              {data.map((inv) => (
                <li key={inv.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold text-[#112D4E]">{inv.service_name}</p>
                      <p className="text-xs text-[#50688C]">
                        {inv.division}
                        {inv.invoice_number ? ` · ${inv.invoice_number}` : ""}
                        {inv.client ? ` · ${inv.client}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="mt-3">
                    <InvoiceStepper status={inv.status} compact />
                  </div>
                  <p className="mt-2 text-xs text-[#50688C]">
                    {rupiah(inv.amount)}
                    {inv.service_date ? ` · Jasa ${formatTanggalIndo(inv.service_date)}` : ""}
                    {inv.invoice_date ? ` · Submit ${formatTanggalIndo(inv.invoice_date)}` : ""}
                  </p>
                  <div className="mt-3 flex">
                    <Actions invoice={inv} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                </li>
              ))}
            </ul>

            {/* Tablet & desktop: tabel */}
            <div className="hidden w-full overflow-x-auto md:block">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
                    <TableHead className={`${th} w-12`}>No</TableHead>
                    <TableHead className={th}>No. Invoice</TableHead>
                    <TableHead className={th}>Jasa</TableHead>
                    <TableHead className={th}>Divisi</TableHead>
                    <TableHead className={th}>Client</TableHead>
                    <TableHead className={th}>Nilai</TableHead>
                    <TableHead className={th}>Tgl Invoice Submit</TableHead>
                    <TableHead
                      className={th}
                      aria-sort={
                        filters.sort_status === "asc" ? "ascending" : filters.sort_status === "desc" ? "descending" : "none"
                      }
                    >
                      <button
                        type="button"
                        onClick={() => patch({ sort_status: nextSort(filters.sort_status) })}
                        title={sortLabel(filters.sort_status)}
                        className="inline-flex items-center gap-1.5 rounded px-1 font-bold hover:text-[#3F72AF] focus-visible:outline-2 focus-visible:outline-[#3F72AF]"
                      >
                        Status <SortIcon sort={filters.sort_status} />
                      </button>
                    </TableHead>
                    <TableHead className={th}>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((inv, i) => (
                    <InvoiceRow
                      key={inv.id}
                      invoice={inv}
                      number={offset + i + 1}
                      onDetail={onDetail}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination meta={meta} unit="invoice" onChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableInvoice;
