import { memo, useState } from "react";
import { ExternalLink, SquarePen, Stethoscope, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import { ListEmpty, ListError, ListSkeleton } from "../common/ListStates";
import { useMcuList, type Mcu } from "@/hooks/Mcu/useMcu";
import { STORAGE_URL } from "@/lib/axios";
import { formatTanggalIndo } from "@/lib/tanggal";
import { expiringBadgeClass, expiringLabel, expiringTextClass, isExpiring } from "@/lib/contract";
import { dangerIconButtonClass, iconButtonClass } from "@/lib/formStyles";

type Props = {
  refreshKey?: number;
  onEdit?: (mcu: Mcu) => void;
  onDelete?: (mcu: Mcu) => void;
};

const th = "px-4 text-center font-bold text-[#112D4E]";
const td = "px-4 py-4 text-center align-top";

const fmt = (d: string | null) => (d ? formatTanggalIndo(d) : "-");

// hanya MCU terbaru tiap karyawan yang jadwalnya dianggap aktif (penanda merah)
const isDue = (m: Mcu) => m.is_latest !== false && isExpiring(m.next_mcu_date);

// Dua dokumen: tampilkan tiap link yang ada, "-" bila keduanya kosong
function DocLinks({ mcu }: { mcu: Mcu }) {
  const docs = [mcu.document, mcu.document_2].filter((d): d is string => Boolean(d));
  if (docs.length === 0) return <span className="text-[#7B8FAE]">-</span>;
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      {docs.map((d, i) => (
        <a
          key={d}
          href={`${STORAGE_URL}${d}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#3F72AF] underline-offset-2 hover:underline"
        >
          {docs.length > 1 ? `Dokumen ${i + 1}` : "Lihat"} <ExternalLink size={13} />
        </a>
      ))}
    </span>
  );
}

function NextMcu({ mcu }: { mcu: Mcu }) {
  const due = isDue(mcu);
  const label = due ? expiringLabel(mcu.next_mcu_date) : null;
  return (
    <>
      <span className={due ? expiringTextClass : ""}>{fmt(mcu.next_mcu_date)}</span>
      {label && (
        <div className="mt-1">
          <span className={expiringBadgeClass}>{label}</span>
        </div>
      )}
    </>
  );
}

function Actions({ mcu, onEdit, onDelete }: { mcu: Mcu } & Pick<Props, "onEdit" | "onDelete">) {
  return (
    <div className="flex items-center justify-center gap-2">
      {onEdit && (
        <Button
          size="icon"
          variant="outline"
          className={iconButtonClass}
          aria-label={`Edit MCU ${mcu.employee_name}`}
          onClick={() => onEdit(mcu)}
        >
          <SquarePen size={16} />
        </Button>
      )}
      {onDelete && (
        <Button
          size="icon"
          variant="outline"
          className={dangerIconButtonClass}
          aria-label={`Hapus MCU ${mcu.employee_name}`}
          onClick={() => onDelete(mcu)}
        >
          <Trash2 size={16} className="text-[#B3261E]" />
        </Button>
      )}
    </div>
  );
}

const McuRow = memo(function McuRow({
  mcu: m,
  number,
  hasActions,
  onEdit,
  onDelete,
}: { mcu: Mcu; number: number; hasActions: boolean } & Pick<Props, "onEdit" | "onDelete">) {
  return (
    <TableRow
      className={`border-[#DBE2EF] text-[#112D4E] transition-colors ${
        isDue(m) ? "bg-[#FDECEA] hover:bg-[#FBE0DD]" : "hover:bg-[#F9F7F7]"
      }`}
    >
      <TableCell className={`${td} text-[#50688C]`}>{number}</TableCell>
      <TableCell className={td}>
        <p className="font-medium">{m.employee_name}</p>
        <p className="text-xs text-[#50688C]">
          {m.id_number} · {m.position}
        </p>
      </TableCell>
      <TableCell className={td}>{m.place_name}</TableCell>
      <TableCell className={td}>{m.mcu_name || "-"}</TableCell>
      <TableCell className={td}>{fmt(m.mcu_date)}</TableCell>
      <TableCell className={td}>{m.allergies || "-"}</TableCell>
      <TableCell className={`${td} max-w-64 whitespace-normal break-words text-sm`}>{m.summary || "-"}</TableCell>
      <TableCell className={td}>
        <DocLinks mcu={m} />
      </TableCell>
      <TableCell className={td}>
        <NextMcu mcu={m} />
      </TableCell>
      {hasActions && (
        <TableCell className={td}>
          <Actions mcu={m} onEdit={onEdit} onDelete={onDelete} />
        </TableCell>
      )}
    </TableRow>
  );
});

const TableMcu = ({ refreshKey = 0, onEdit, onDelete }: Props) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, isFetching } = useMcuList({ search, page }, refreshKey);
  const hasActions = Boolean(onEdit || onDelete);
  const offset = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 10);

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex flex-col gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          placeholder="Cari karyawan, tempat, atau alergi..."
          busy={isFetching}
          onSearch={(keyword) => {
            setSearch(keyword);
            setPage(1);
          }}
        />
      </div>

      {loading && <ListSkeleton />}
      {error && <ListError message={error} />}

      {!loading && !error && data.length === 0 && (
        <ListEmpty
          icon={<Stethoscope size={28} />}
          title="Data MCU tidak ditemukan"
          hint="Coba kata kunci lain atau tambah data MCU baru"
        />
      )}

      {!loading && !error && data.length > 0 && (
        <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
          {/* Mobile: kartu */}
          <ul className="divide-y divide-[#DBE2EF] md:hidden">
            {data.map((m) => (
              <li key={m.id} className={`p-4 ${isDue(m) ? "bg-[#FDECEA]" : ""}`}>
                <p className="break-words text-sm font-bold text-[#112D4E]">{m.employee_name}</p>
                <p className="text-xs text-[#50688C]">
                  {m.id_number} · {m.division} · {m.position}
                </p>
                <div className="mt-3 space-y-1 text-sm text-[#112D4E]">
                  <p>
                    <b>{m.place_name}</b>
                    {m.mcu_name ? ` · ${m.mcu_name}` : ""}
                  </p>
                  <p className="text-xs text-[#50688C]">Tanggal: {fmt(m.mcu_date)}</p>
                  <p className="text-xs text-[#50688C]">Alergi: {m.allergies || "-"}</p>
                  {m.summary && <p className="text-xs text-[#50688C]">{m.summary}</p>}
                  <p className="text-xs text-[#50688C]">
                    MCU berikutnya: <NextMcu mcu={m} />
                  </p>
                  <p className="text-xs">
                    Dokumen: <DocLinks mcu={m} />
                  </p>
                </div>
                {hasActions && (
                  <div className="mt-3 flex">
                    <Actions mcu={m} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Tablet & desktop: tabel */}
          <div className="hidden w-full overflow-x-auto md:block">
            <Table className="min-w-[1100px]">
              <TableHeader>
                <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
                  <TableHead className={`${th} w-12`}>No</TableHead>
                  <TableHead className={th}>Karyawan</TableHead>
                  <TableHead className={th}>Nama Tempat</TableHead>
                  <TableHead className={th}>MCU</TableHead>
                  <TableHead className={th}>Tanggal</TableHead>
                  <TableHead className={th}>Alergi</TableHead>
                  <TableHead className={th}>Summary</TableHead>
                  <TableHead className={th}>Dokumen</TableHead>
                  <TableHead className={th}>MCU Selanjutnya</TableHead>
                  {hasActions && <TableHead className={th}>Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((m, i) => (
                  <McuRow
                    key={m.id}
                    mcu={m}
                    number={offset + i + 1}
                    hasActions={hasActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination meta={meta} unit="data" onChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default TableMcu;
