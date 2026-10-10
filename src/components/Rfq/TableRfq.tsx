import { memo, useState } from "react";
import { ClipboardList, Eye, SquarePen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import { ListEmpty, ListError, ListSkeleton } from "../common/ListStates";
import { PriorityBadge, StatusBadge } from "./RfqBadges";
import { useRfqList, type Rfq, type RfqOptions } from "@/hooks/Rfq/useRfq";
import { PRIORITY_GROUPS, RFQ_STATUSES, isRfqDue, monthYear, priorityGroupLabel } from "@/lib/rfq";
import { formatTanggalIndo } from "@/lib/tanggal";
import { rupiah } from "@/lib/invoice";
import { expiringBadgeClass, expiringLabel, expiringTextClass } from "@/lib/contract";
import { dangerIconButtonClass, iconButtonClass, selectClass } from "@/lib/formStyles";

type Handlers = {
  onDetail: (rfq: Rfq) => void;
  onEdit?: (rfq: Rfq) => void;
  onDelete?: (rfq: Rfq) => void;
};

type Props = Handlers & { refreshKey?: number; options: RfqOptions };

const th = "px-3 text-center font-bold text-[#112D4E]";
const td = "px-3 py-4 text-center align-middle";

function Actions({ rfq, onDetail, onEdit, onDelete }: { rfq: Rfq } & Handlers) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button size="icon" variant="outline" className={iconButtonClass} aria-label={`Detail ${rfq.enquiry_no}`} onClick={() => onDetail(rfq)}>
        <Eye size={16} />
      </Button>
      {onEdit && (
        <Button size="icon" variant="outline" className={iconButtonClass} aria-label={`Edit ${rfq.enquiry_no}`} onClick={() => onEdit(rfq)}>
          <SquarePen size={16} />
        </Button>
      )}
      {onDelete && (
        <Button size="icon" variant="outline" className={dangerIconButtonClass} aria-label={`Hapus ${rfq.enquiry_no}`} onClick={() => onDelete(rfq)}>
          <Trash2 size={16} className="text-[#B3261E]" />
        </Button>
      )}
    </div>
  );
}

function Deadline({ rfq }: { rfq: Rfq }) {
  const due = isRfqDue(rfq.status, rfq.deadline);
  const label = due ? expiringLabel(rfq.deadline) : null;
  return (
    <>
      <span className={due ? expiringTextClass : ""}>{monthYear(rfq.deadline)}</span>
      {label && (
        <div className="mt-1">
          <span className={expiringBadgeClass}>{label}</span>
        </div>
      )}
    </>
  );
}

const RfqRow = memo(function RfqRow({
  rfq,
  number,
  onDetail,
  onEdit,
  onDelete,
}: { rfq: Rfq; number: number } & Handlers) {
  const due = isRfqDue(rfq.status, rfq.deadline);
  return (
    <TableRow
      className={`border-[#DBE2EF] text-[#112D4E] transition-colors ${due ? "bg-[#FDECEA] hover:bg-[#FBE0DD]" : "hover:bg-[#F9F7F7]"}`}
    >
      <TableCell className={`${td} text-[#50688C]`}>{number}</TableCell>
      <TableCell className={`${td} whitespace-nowrap`}>{formatTanggalIndo(rfq.rfq_date)}</TableCell>
      <TableCell className={`${td} whitespace-nowrap font-semibold`}>{rfq.enquiry_no}</TableCell>
      <TableCell className={td}>{rfq.type || "-"}</TableCell>
      <TableCell className={td}>{rfq.area || "-"}</TableCell>
      <TableCell className={`${td} max-w-60 whitespace-normal break-words`}>
        <p className="font-medium">{rfq.opportunity_name}</p>
        <p className="text-xs text-[#50688C]">{rfq.customer}</p>
      </TableCell>
      <TableCell className={td}>{rfq.contact_name || "-"}</TableCell>
      <TableCell className={td}>
        <PriorityBadge code={rfq.priority_code} />
        <p className="mt-1 max-w-40 whitespace-normal text-xs text-[#50688C]">
          {rfq.priority_guide}
          {rfq.priority_pic ? ` · ${rfq.priority_pic}` : ""}
        </p>
      </TableCell>
      <TableCell className={td}>
        <StatusBadge status={rfq.status} />
      </TableCell>
      <TableCell className={td}>
        {rfq.po_received ? <span className="font-bold">Y{rfq.po_number ? ` · ${rfq.po_number}` : ""}</span> : "N"}
      </TableCell>
      <TableCell className={td}>{rfq.current_pic || "-"}</TableCell>
      <TableCell className={`${td} max-w-64 whitespace-normal break-words text-left text-sm`}>
        {rfq.latest_update ? (
          <>
            <span className="font-semibold">{formatTanggalIndo(rfq.latest_update.update_date)}: </span>
            {rfq.latest_update.note}
          </>
        ) : (
          <span className="text-[#7B8FAE]">-</span>
        )}
      </TableCell>
      <TableCell className={`${td} whitespace-nowrap`}>
        <Deadline rfq={rfq} />
      </TableCell>
      <TableCell className={`${td} whitespace-nowrap`}>{rfq.amount != null ? rupiah(rfq.amount) : "-"}</TableCell>
      <TableCell className={td}>
        <Actions rfq={rfq} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
});

const TableRfq = ({ refreshKey = 0, options, onDetail, onEdit, onDelete }: Props) => {
  const [filters, setFilters] = useState({ search: "", priority: "", status: "", type: "", page: 1 });
  const { data, meta, summary, loading, error, isFetching } = useRfqList(filters, refreshKey);
  const offset = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 10);

  // setiap filter berubah, kembali ke halaman 1
  const patch = (p: Partial<typeof filters>) => setFilters((f) => ({ ...f, ...p, page: 1 }));

  return (
    <div className="space-y-4">
      {/* Ringkasan per grup prioritas (klik untuk filter) */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PRIORITY_GROUPS.map((g) => {
          const active = filters.priority === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => patch({ priority: active ? "" : g })}
              aria-pressed={active}
              className={`rounded-lg border p-4 text-left shadow-[0_2px_10px_rgb(17,45,78,0.06)] transition sm:rounded-xl ${
                active ? "border-[#112D4E] bg-[#DBE2EF]" : "border-[#DBE2EF] bg-white hover:bg-[#F9F7F7]"
              }`}
            >
              <p className="text-2xl font-extrabold tabular-nums leading-none text-[#112D4E]">
                {summary?.by_priority_group?.[g] ?? 0}
              </p>
              <p className="mt-1.5 text-xs font-semibold text-[#112D4E]">{priorityGroupLabel[g]}</p>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
        <div className="flex flex-col gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar
            placeholder="Cari enquiry no, opportunity, customer, area..."
            busy={isFetching}
            onSearch={(search) => patch({ search })}
          />
          <div className="flex gap-2">
            <select
              aria-label="Filter status"
              className={`${selectClass} h-11`}
              value={filters.status}
              onChange={(e) => patch({ status: e.target.value })}
            >
              <option value="">Semua status</option>
              {RFQ_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter type"
              className={`${selectClass} h-11`}
              value={filters.type}
              onChange={(e) => patch({ type: e.target.value })}
            >
              <option value="">Semua type</option>
              {options.types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <ListSkeleton />}
        {error && <ListError message={error} />}

        {!loading && !error && data.length === 0 && (
          <ListEmpty
            icon={<ClipboardList size={28} />}
            title="RFQ tidak ditemukan"
            hint="Ubah filter atau tambah RFQ baru"
          />
        )}

        {!loading && !error && data.length > 0 && (
          <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {/* Mobile: kartu */}
            <ul className="divide-y divide-[#DBE2EF] lg:hidden">
              {data.map((r) => (
                <li key={r.id} className={`p-4 ${isRfqDue(r.status, r.deadline) ? "bg-[#FDECEA]" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#3F72AF]">{r.enquiry_no}</p>
                      <p className="break-words text-sm font-bold text-[#112D4E]">{r.opportunity_name}</p>
                      <p className="text-xs text-[#50688C]">
                        {r.customer}
                        {r.area ? ` · ${r.area}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <PriorityBadge code={r.priority_code} />
                    <span className="text-xs text-[#50688C]">
                      {r.priority_guide}
                      {r.priority_pic ? ` · ${r.priority_pic}` : ""}
                    </span>
                  </div>
                  {r.latest_update && (
                    <p className="mt-2 text-xs text-[#112D4E]">
                      <b>{formatTanggalIndo(r.latest_update.update_date)}:</b> {r.latest_update.note}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[#50688C]">
                    PO {r.po_received ? `Y${r.po_number ? ` · ${r.po_number}` : ""}` : "N"} · PIC {r.current_pic || "-"} · Deadline{" "}
                    <Deadline rfq={r} /> · {r.amount != null ? rupiah(r.amount) : "-"}
                  </p>
                  <div className="mt-3 flex">
                    <Actions rfq={r} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop: tabel (mirip log RFQ di spreadsheet) */}
            <div className="hidden w-full overflow-x-auto lg:block">
              <Table className="min-w-[1700px]">
                <TableHeader>
                  <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
                    <TableHead className={`${th} w-12`}>No</TableHead>
                    <TableHead className={th}>Date</TableHead>
                    <TableHead className={th}>Enquiry No.</TableHead>
                    <TableHead className={th}>Type</TableHead>
                    <TableHead className={th}>Area</TableHead>
                    <TableHead className={th}>Opportunity</TableHead>
                    <TableHead className={th}>Contact</TableHead>
                    <TableHead className={th}>Priority</TableHead>
                    <TableHead className={th}>Status</TableHead>
                    <TableHead className={th}>PO</TableHead>
                    <TableHead className={th}>Current PIC</TableHead>
                    <TableHead className={th}>Progres Terakhir</TableHead>
                    <TableHead className={th}>Deadline</TableHead>
                    <TableHead className={th}>Amount</TableHead>
                    <TableHead className={th}>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((r, i) => (
                    <RfqRow key={r.id} rfq={r} number={offset + i + 1} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination meta={meta} unit="RFQ" onChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableRfq;
