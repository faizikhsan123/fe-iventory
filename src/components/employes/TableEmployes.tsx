// TableEmployes.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ChevronLeft, ChevronRight, Eye, Search, SquarePen, Trash2, X } from "lucide-react";
import { DIVISIONS } from "@/lib/divisions";
import useGetEmployes from "@/hooks/employes/getEmployes";
import { useDeleteEmployes } from "@/hooks/employes/deleteEmployes";
import UpdateEmployes from "./UpdateEmployes";
import type { employes } from "@/types/employes";
import { expiringBadgeClass, expiringLabel, isExpiring } from "@/lib/contract";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/auth/useAuth";
import { STORAGE_URL } from "@/lib/axios";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border #BFCCE3, border toolbar #9DB2D3,
           muted #50688C, placeholder #7B8FAE
  semantik: merah #B3261E (bg #FDECEA, border #F2B8B5) hapus & error
            amber #8A5A00 (bg #FFF4DB, border #F2C96B) status cuti
*/

// Select solid putih. text-base di HP biar iOS tidak auto-zoom.
const selectClassName =
  "flex h-11 w-full items-center rounded-lg border border-[#9DB2D3] bg-white px-3 text-base text-[#112D4E] outline-none transition hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#F9F7F7] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm lg:w-44";

const searchClass =
  "h-11 w-full rounded-lg border border-[#9DB2D3] bg-white pl-10 pr-9 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#F9F7F7] sm:text-sm";

const actionBtnClass =
  "h-10 w-10 rounded-lg border border-[#BFCCE3] bg-white p-0 text-[#112D4E] hover:bg-[#DBE2EF] disabled:opacity-50";

const pageBtnClass =
  "h-10 rounded-lg border border-[#BFCCE3] bg-white px-3 text-[#112D4E] hover:bg-[#DBE2EF] disabled:opacity-50";

const statusBadge = (status?: string) => {
  const s = status?.toLowerCase();
  if (s === "active") return "bg-[#112D4E] text-white ring-[#112D4E]";
  if (s === "cuti") return "bg-[#FFF4DB] text-[#8A5A00] ring-[#F2C96B]";
  return "bg-[#F9F7F7] text-[#50688C] ring-[#BFCCE3]";
};

function Avatar({ name, file }: { name: string; file?: string | null }) {
  const inisial = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return file ? (
    <img
      src={`${STORAGE_URL}${file}`}
      alt={name}
      className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#DBE2EF]"
    />
  ) : (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#112D4E] text-sm font-bold text-white">
      {inisial}
    </div>
  );
}

type TableEmployesProps = {
  // naik setiap kali ada create sukses dari parent -> tabel refetch
  refreshKey?: number;
};

const TableEmployes = ({ refreshKey = 0 }: TableEmployesProps) => {
  const { data, meta, loading, error, getEmployesButton } = useGetEmployes();
  const { errorDelete, handleDelete, loadingDelete } = useDeleteEmployes();

  const [stateUpdate, setStateUpdate] = useState<employes | null>(null);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [division, setDivision] = useState("all");
  const [position, setPosition] = useState("all");

  const perPage = 10;
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("admin");

  const params = () => ({
    search,
    division: division === "all" ? "" : division,
    position: position === "all" ? "" : position,
    page,
    per_page: perPage,
  });

  // fetch ulang kalau filter/page berubah ATAU refreshKey dari parent naik
  useEffect(() => {
    getEmployesButton(params());
  }, [search, division, page, getEmployesButton, position, refreshKey]);

  const refresh = () => getEmployesButton(params());

  // kalau yang dihapus item terakhir di halaman (dan bukan halaman 1), mundur 1 halaman
  const onDelete = (id: number) => {
    handleDelete(id, () => {
      if (data.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refresh();
      }
    });
  };

  const isLoading = loading || loadingDelete;
  const lastPage = meta?.last_page ?? 1;

  const clearSearch = () => {
    setKeyword("");
    setSearch("");
    setPage(1);
  };

  const renderAksi = (emp: employes) => (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        className={actionBtnClass}
        aria-label="Lihat detail"
        onClick={() => navigate(`/employes/${emp.id}`)}
      >
        <Eye size={16} />
      </Button>

      {isAdmin && (
        <>
          <Button
            size="icon"
            variant="outline"
            className={actionBtnClass}
            aria-label="Edit karyawan"
            onClick={() => setStateUpdate(emp)}
          >
            <SquarePen size={16} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={`${actionBtnClass} hover:border-[#F2B8B5] hover:bg-[#FDECEA]`}
            aria-label="Hapus karyawan"
            disabled={isLoading}
            onClick={() => onDelete(emp.id)}
          >
            <Trash2 size={16} className="text-[#B3261E]" />
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      {/* ================= TOOLBAR ================= */}
      <div className="flex flex-col gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          className="flex w-full gap-2 lg:max-w-lg"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
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
              placeholder="Cari nama, divisi, jabatan..."
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
            disabled={isLoading}
            className="h-11 rounded-lg bg-[#112D4E] px-5 font-semibold text-white hover:bg-[#0B2240] disabled:opacity-60"
          >
            Cari
          </Button>
        </form>

        <div className="grid grid-cols-2 gap-2 lg:flex">
          <select
            className={selectClassName}
            value={division}
            aria-label="Filter divisi"
            onChange={(e) => {
              setDivision(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Semua Divisi</option>
            {DIVISIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            className={selectClassName}
            value={position}
            aria-label="Filter posisi"
            onChange={(e) => {
              setPosition(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Semua Position</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Foreman">Foreman</option>
            <option value="Technician">Technician</option>
            <option value="Safety">Safety</option>
          </select>
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="divide-y divide-[#DBE2EF]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-3 p-4 sm:px-6">
              <div className="h-11 w-11 shrink-0 rounded-full bg-[#DBE2EF]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-[#DBE2EF]" />
                <div className="h-3 w-1/2 rounded bg-[#EBEFF6]" />
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
      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#DBE2EF]">
            <Search size={28} className="text-[#3F72AF]" />
          </div>
          <p className="font-semibold text-[#112D4E]">Karyawan tidak ditemukan</p>
          <p className="text-sm text-[#50688C]">Coba gunakan kata kunci lain</p>
        </div>
      )}

      {/* ================= DATA ================= */}
      {!loading && !error && data.length > 0 && (
        <>
          {/* Mobile: kartu */}
          <ul className="divide-y divide-[#DBE2EF] md:hidden">
            {data.map((emp) => (
              <li key={emp.id} className={`p-4 ${isExpiring(emp.contract_end) ? "bg-[#FDECEA]" : ""}`}>
                <div className="flex items-start gap-3">
                  <Avatar name={emp.user.name} file={emp.file} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="break-words text-sm font-bold text-[#112D4E]">{emp.user.name}</p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${statusBadge(emp.status)}`}
                      >
                        {emp.status}
                      </span>
                    </div>
                    <p className="truncate text-xs text-[#50688C]">{emp.user.email}</p>
                    {expiringLabel(emp.contract_end) && (
                      <span className={`${expiringBadgeClass} mt-1`}>Kontrak {expiringLabel(emp.contract_end)}</span>
                    )}
                    <p className="mt-1 text-sm text-[#112D4E]">
                      {emp.position} · {emp.division}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] px-3 py-2">
                  {renderAksi(emp)}
                </div>
              </li>
            ))}
          </ul>

          {/* Tablet & desktop: tabel */}
          <div className="hidden w-full overflow-x-auto md:block">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">No</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Karyawan</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Divisi</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Posisi</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Status</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((emp, index) => (
                  <TableRow
                    key={emp.id}
                    className={`border-[#DBE2EF] text-[#112D4E] transition-colors ${isExpiring(emp.contract_end) ? "bg-[#FDECEA] hover:bg-[#FBE0DD]" : "hover:bg-[#F9F7F7]"}`}
                  >
                    <TableCell className="px-4 py-4 text-[#50688C] lg:px-6">
                      {(page - 1) * perPage + index + 1}
                    </TableCell>

                    <TableCell className="px-4 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.user.name} file={emp.file} />
                        <div className="min-w-0">
                          <p className="font-semibold">{emp.user.name}</p>
                          <p className="truncate text-xs text-[#50688C]">{emp.user.email}</p>
                          {expiringLabel(emp.contract_end) && (
                            <span className={`${expiringBadgeClass} mt-1`}>Kontrak {expiringLabel(emp.contract_end)}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-4 lg:px-6">{emp.division}</TableCell>
                    <TableCell className="px-4 py-4 lg:px-6">{emp.position}</TableCell>

                    <TableCell className="px-4 py-4 lg:px-6">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${statusBadge(emp.status)}`}
                      >
                        {emp.status}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-4 lg:px-6">{renderAksi(emp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {errorDelete && (
            <div
              role="alert"
              className="mx-4 mb-4 flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{errorDelete}</span>
            </div>
          )}

          {/* ================= PAGINATION ================= */}
          <div className="flex items-center justify-between gap-3 border-t border-[#DBE2EF] bg-[#F9F7F7] p-4">
            <span className="text-sm text-[#50688C]">
              Hal. <b className="text-[#112D4E]">{page}</b> dari <b className="text-[#112D4E]">{lastPage}</b>
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className={pageBtnClass}
                disabled={page <= 1 || isLoading}
                onClick={() => setPage(page - 1)}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>
              <Button
                variant="outline"
                className={pageBtnClass}
                disabled={page >= lastPage || isLoading}
                onClick={() => setPage(page + 1)}
                aria-label="Halaman berikutnya"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ================= EDIT ================= */}
      <UpdateEmployes
        open={!!stateUpdate}
        employes={stateUpdate}
        onOpenChange={(open) => !open && setStateUpdate(null)}
        onSuccess={refresh}
      />
    </div>
  );
};

export default TableEmployes;