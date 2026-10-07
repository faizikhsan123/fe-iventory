import { AlertCircle, Clock, Search, SquarePen, Trash2, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import UsegetGroups from "@/hooks/Group/get";

type TableGroupsProps = {
  refreshKey?: number;
  onEdit?: (id: number) => void;
  onDelete?: (group: { id: number; group_name: string }) => void;
};

const searchClass =
  "h-11 w-full rounded-lg border border-[#9DB2D3] bg-white pl-10 pr-9 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#F9F7F7] sm:text-sm";

const actionBtnClass =
  "h-10 w-10 rounded-lg border border-[#BFCCE3] bg-white p-0 text-[#112D4E] hover:bg-[#DBE2EF] disabled:opacity-50";

const formatTime = (t?: string | null) => (t ? t.slice(0, 5) : "-");

function BadgeJam({ start, end }: { start: string; end: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#DBE2EF] px-2.5 py-0.5 text-xs font-semibold text-[#112D4E] ring-1 ring-inset ring-[#BFCCE3]">
      <Clock size={12} className="text-[#3F72AF]" />
      {formatTime(start)} - {formatTime(end)}
    </span>
  );
}

function BadgeAnggota({ count }: { count: number }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-[#112D4E] ring-1 ring-inset ring-[#3F72AF]">
      <Users size={12} className="text-[#3F72AF]" />
      {count} anggota
    </span>
  );
}

function ListAnggota({ names, max = 4 }: { names: string[]; max?: number }) {
  if (names.length === 0) return <span className="text-sm text-[#7B8FAE]">Belum ada anggota</span>;

  const shown = names.slice(0, max);
  const rest = names.length - shown.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((name, i) => (
        <span
          key={`${name}-${i}`}
          className="rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-2.5 py-0.5 text-xs font-medium text-[#112D4E]"
        >
          {name}
        </span>
      ))}
      {rest > 0 && (
        <span className="rounded-full bg-[#DBE2EF] px-2.5 py-0.5 text-xs font-semibold text-[#50688C]">
          +{rest} lainnya
        </span>
      )}
    </div>
  );
}

const TableGroups = ({ refreshKey = 0, onEdit, onDelete }: TableGroupsProps) => {
  const { data, loading, error, getGroups } = UsegetGroups();

  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");

  const hasActions = Boolean(onEdit || onDelete);

  // fetch awal + fetch ulang tiap refreshKey berubah
  useEffect(() => {
    getGroups();
  }, [getGroups, refreshKey]);

  const getNames = (group: (typeof data)[number]) => (group.employees ?? []).map((e) => e.user?.name ?? "-");

  // search client-side: nama group atau nama anggota
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;

    return data.filter((g) => {
      const inGroup = g.group_name?.toLowerCase().includes(q);
      const inMember = (g.employees ?? []).some((e) => e.user?.name?.toLowerCase().includes(q));
      return inGroup || inMember;
    });
  }, [data, search]);

  const clearSearch = () => {
    setKeyword("");
    setSearch("");
  };

  const renderActions = (id: number, name: string) => (
    <div className="flex items-center gap-2">
      {onEdit && (
        <Button
          size="icon"
          variant="outline"
          className={actionBtnClass}
          aria-label={`Edit ${name}`}
          onClick={() => onEdit(id)}
        >
          <SquarePen size={16} />
        </Button>
      )}
      {onDelete && (
        <Button
          size="icon"
          variant="outline"
          className={`${actionBtnClass} hover:border-[#F2B8B5] hover:bg-[#FDECEA]`}
          aria-label={`Hapus ${name}`}
          onClick={() => onDelete({ id, group_name: name })}
        >
          <Trash2 size={16} className="text-[#B3261E]" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="mt-4 overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
        {/* ================= TOOLBAR ================= */}
        <div className="flex flex-col gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4 md:flex-row md:items-center md:justify-between">
          <form
            className="flex w-full gap-2 md:max-w-lg"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(keyword);
            }}
          >
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF]"
                size={17}
              />
              <Input
                className={searchClass}
                placeholder="Cari group atau anggota..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Hapus pencarian"
                  className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#50688C] transition hover:bg-[#DBE2EF] hover:text-[#112D4E]"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <Button
              className="h-11 rounded-lg bg-[#112D4E] px-5 font-semibold text-white hover:bg-[#0B2240] disabled:opacity-60"
              disabled={loading}
            >
              Cari
            </Button>
          </form>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="divide-y divide-[#DBE2EF]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-3 p-4 sm:px-6">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-[#DBE2EF]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-[#DBE2EF]" />
                  <div className="h-3 w-2/3 rounded bg-[#EBEFF6]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= ERROR ================= */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
            <AlertCircle size={32} className="text-[#B3261E]" />
            <p className="text-sm font-medium text-[#B3261E]">{error}</p>
          </div>
        )}

        {/* ================= KOSONG ================= */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#DBE2EF]">
              <Users size={28} className="text-[#3F72AF]" />
            </div>
            <p className="font-semibold text-[#112D4E]">Group tidak ditemukan</p>
            <p className="text-sm text-[#50688C]">Coba kata kunci lain atau tambah group baru</p>
          </div>
        )}

        {/* ================= DATA ================= */}
        {!loading && !error && filtered.length > 0 && (
          <>
            {/* Mobile: kartu */}
            <ul className="divide-y divide-[#DBE2EF] md:hidden">
              {filtered.map((group, index) => {
                const names = getNames(group);
                return (
                  <li key={group.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#50688C]">#{index + 1}</p>
                        <p className="break-words text-sm font-bold text-[#112D4E]">{group.group_name}</p>
                      </div>
                      <BadgeJam start={group.start_time} end={group.end_time} />
                    </div>

                    <div className="mt-3 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-3">
                      <div className="mb-2">
                        <BadgeAnggota count={names.length} />
                      </div>
                      <ListAnggota names={names} />
                    </div>

                    {hasActions && <div className="mt-3">{renderActions(group.id, group.group_name)}</div>}
                  </li>
                );
              })}
            </ul>

            {/* Tablet & desktop: tabel */}
            <div className="hidden w-full overflow-x-auto md:block">
              <Table className="min-w-[860px]">
                <TableHeader>
                  <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
                    <TableHead className="w-12 px-4 font-bold text-[#112D4E] lg:px-6">No</TableHead>
                    <TableHead className="px-4 font-bold text-[#112D4E]">Nama Group</TableHead>
                    <TableHead className="px-4 font-bold text-[#112D4E]">Jam Kerja</TableHead>
                    <TableHead className="px-4 text-center font-bold text-[#112D4E]">Jumlah</TableHead>
                    <TableHead className="px-4 font-bold text-[#112D4E]">Anggota</TableHead>
                    {hasActions && (
                      <TableHead className="px-4 text-center font-bold text-[#112D4E]">Aksi</TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((group, index) => {
                    const names = getNames(group);
                    return (
                      <TableRow
                        key={group.id}
                        className="border-[#DBE2EF] text-[#112D4E] transition-colors hover:bg-[#F9F7F7]"
                      >
                        <TableCell className="px-4 py-4 text-[#50688C] lg:px-6">{index + 1}</TableCell>
                        <TableCell className="px-4 py-4 font-medium">{group.group_name}</TableCell>
                        <TableCell className="px-4 py-4">
                          <BadgeJam start={group.start_time} end={group.end_time} />
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center font-bold">{names.length}</TableCell>
                        <TableCell className="px-4 py-4">
                          <ListAnggota names={names} />
                        </TableCell>
                        {hasActions && (
                          <TableCell className="px-4 py-4">
                            <div className="flex justify-center">{renderActions(group.id, group.group_name)}</div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TableGroups;