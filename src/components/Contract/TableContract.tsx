import { memo, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, FileClock } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import { ListEmpty, ListError, ListSkeleton } from "../common/ListStates";
import { useContractList, type ContractSummary } from "@/hooks/Contract/useContract";
import { formatTanggalIndo } from "@/lib/tanggal";
import { expiringBadgeClass, expiringLabel, expiringTextClass, isExpiring } from "@/lib/contract";
import { iconButtonClass } from "@/lib/formStyles";

const fmt = (d: string | null) => (d ? formatTanggalIndo(d) : "-");
const score = (n: number | null) => (n != null ? n.toFixed(2) : "-");

const th = "px-4 text-center font-bold text-[#112D4E]";
const td = "px-4 py-4 text-center";

const ExpiryCell = ({ date }: { date: string | null }) => {
  const label = expiringLabel(date);
  return (
    <>
      <span className={isExpiring(date) ? expiringTextClass : ""}>{fmt(date)}</span>
      {label && (
        <div className="mt-1">
          <span className={expiringBadgeClass}>{label}</span>
        </div>
      )}
    </>
  );
};

const DetailButton = ({ name, onClick }: { name: string; onClick: () => void }) => (
  <Button size="icon" variant="outline" aria-label={`Detail ${name}`} onClick={onClick} className={iconButtonClass}>
    <Eye size={16} />
  </Button>
);

// memo: baris tidak dirender ulang saat state tabel lain (mis. isFetching) berubah
const ContractRow = memo(function ContractRow({
  contract: c,
  number,
  onDetail,
}: {
  contract: ContractSummary;
  number: number;
  onDetail: (id: number) => void;
}) {
  return (
    <TableRow
      className={`border-[#DBE2EF] text-[#112D4E] transition-colors ${
        isExpiring(c.contract_end) ? "bg-[#FDECEA] hover:bg-[#FBE0DD]" : "hover:bg-[#F9F7F7]"
      }`}
    >
      <TableCell className={`${td} text-[#50688C]`}>{number}</TableCell>
      <TableCell className={td}>
        <p className="font-medium">{c.name}</p>
        <p className="text-xs text-[#50688C]">
          {c.id_number} · {c.division} · {c.position}
        </p>
      </TableCell>
      <TableCell className={td}>{fmt(c.contract_start)}</TableCell>
      <TableCell className={td}>
        <ExpiryCell date={c.contract_end} />
      </TableCell>
      <TableCell className={`${td} font-bold`}>{c.renewals_count}x</TableCell>
      <TableCell className={`${td} font-bold`}>{c.reviews_count}x</TableCell>
      <TableCell className={`${td} font-bold`}>{score(c.average_score)}</TableCell>
      <TableCell className={td}>
        <div className="flex justify-center">
          <DetailButton name={c.name} onClick={() => onDetail(c.id)} />
        </div>
      </TableCell>
    </TableRow>
  );
});

const TableContract = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, isFetching } = useContractList({ search, page });

  const goDetail = (id: number) => navigate(`/contracts/${id}`);
  const offset = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 10);

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="flex flex-col gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          placeholder="Cari nama atau ID karyawan..."
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
        <ListEmpty icon={<FileClock size={28} />} title="Data contract tidak ditemukan" hint="Coba kata kunci lain" />
      )}

      {!loading && !error && data.length > 0 && (
        <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
          {/* Mobile: kartu */}
          <ul className="divide-y divide-[#DBE2EF] md:hidden">
            {data.map((c) => (
              <li key={c.id} className={`p-4 ${isExpiring(c.contract_end) ? "bg-[#FDECEA]" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-[#112D4E]">{c.name}</p>
                    <p className="text-xs text-[#50688C]">
                      {c.id_number} · {c.division} · {c.position}
                    </p>
                  </div>
                  <DetailButton name={c.name} onClick={() => goDetail(c.id)} />
                </div>
                <p className="mt-2 text-xs text-[#50688C]">
                  Join {fmt(c.contract_start)} · Exp{" "}
                  <span className={isExpiring(c.contract_end) ? expiringTextClass : ""}>{fmt(c.contract_end)}</span>
                  {expiringLabel(c.contract_end) && (
                    <span className={`${expiringBadgeClass} ml-1.5`}>{expiringLabel(c.contract_end)}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-[#50688C]">
                  Perpanjangan {c.renewals_count}x · Review {c.reviews_count}x · Avg {score(c.average_score)}
                </p>
              </li>
            ))}
          </ul>

          {/* Tablet & desktop: tabel */}
          <div className="hidden w-full overflow-x-auto md:block">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
                  <TableHead className={`${th} w-12`}>No</TableHead>
                  <TableHead className={th}>Karyawan</TableHead>
                  <TableHead className={th}>Contract Joined</TableHead>
                  <TableHead className={th}>Contract Expired</TableHead>
                  <TableHead className={th}>Perpanjangan</TableHead>
                  <TableHead className={th}>Performance Review</TableHead>
                  <TableHead className={th}>Average Score</TableHead>
                  <TableHead className={th}>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((c, i) => (
                  <ContractRow key={c.id} contract={c} number={offset + i + 1} onDetail={goDetail} />
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination meta={meta} unit="karyawan" onChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default TableContract;
