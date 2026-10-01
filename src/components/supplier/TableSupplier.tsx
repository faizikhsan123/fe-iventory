// TableSupplier.tsx
import { useEffect, useState, type ReactNode } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { AlertCircle, ChevronLeft, ChevronRight, Mail, MapPin, Phone, Search, SquarePen, Trash2, User, X } from "lucide-react";

import { useSupplier } from "@/hooks/suppliers/getSupplier";

import { useDeleteSupplier } from "@/hooks/suppliers/deleteSupplier";

import { EditSupplier } from "./UpdateSupplier";

import type { Supplier } from "@/types/supplier";
import { useAuth } from "@/hooks/auth/useAuth";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border #BFCCE3, border toolbar #9DB2D3,
           muted #50688C, placeholder #7B8FAE
  semantik: merah #B3261E (bg #FDECEA, border #F2B8B5) khusus hapus & error
*/

// Select solid putih. text-base di HP biar iOS tidak auto-zoom.
const selectClassName =
  "flex h-11 w-full items-center rounded-lg border border-[#9DB2D3] bg-white px-3 text-base text-[#112D4E] outline-none transition hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#F9F7F7] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm md:w-[190px]";

const searchClass =
  "h-11 w-full rounded-lg border border-[#9DB2D3] bg-white pl-10 pr-9 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#F9F7F7] sm:text-sm";

const pageBtnClass =
  "h-10 w-10 rounded-lg border border-[#BFCCE3] bg-white p-0 text-[#112D4E] hover:bg-[#DBE2EF] disabled:opacity-50";

const actionBtnClass =
  "h-10 w-10 rounded-lg border border-[#BFCCE3] bg-white p-0 text-[#112D4E] hover:bg-[#DBE2EF] disabled:opacity-50";

const STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  inactive: "Tidak Aktif",
};

// style badge spesialis
const SPESIALIS_STYLE: Record<string, string> = {
  apd: "bg-[#DBE2EF] text-[#112D4E] ring-[#BFCCE3]",
  tools: "bg-white text-[#112D4E] ring-[#3F72AF]",
};

function BadgeSpesialis({ value }: { value?: string | null }) {
  if (!value) return <span className="text-[#7B8FAE]">-</span>;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${
        SPESIALIS_STYLE[value.toLowerCase()] ?? "bg-[#F9F7F7] text-[#50688C] ring-[#DBE2EF]"
      }`}
    >
      {value}
    </span>
  );
}

function BadgeStatus({ status }: { status: string }) {
  const aktif = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        aktif ? "bg-[#112D4E] text-white" : "bg-[#F9F7F7] text-[#50688C] ring-1 ring-inset ring-[#BFCCE3]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${aktif ? "bg-[#8FB0DC]" : "bg-[#9DB2D3]"}`} />
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

type TableSupplierProps = {
  // naik setiap kali ada create sukses dari parent -> tabel refetch
  refreshKey?: number;
};

const TableSupplier = ({ refreshKey = 0 }: TableSupplierProps) => {
  const { dataSUpplier, meta, loadingSupplier, error, getSupplier } = useSupplier();

  const { handleDelete, loadingDelete } = useDeleteSupplier();

  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  // state keyword untuk menampung nilai dari si inputan user
  const [keyword, setKeyword] = useState("");

  //State search menyimpan keyword yang sudah dikonfirmasi untuk dikirim ke API.
  const [search, setSearch] = useState("");

  // state utuk halaman nilai default 1
  const [page, setPage] = useState(1);

  // state utuk halaman status
  const [status, setStatus] = useState("all");

  // satu halaman 10 item
  const perPage = 10;

  const { user } = useAuth();

  const isAdmin = user?.roles?.includes("admin");

  // fetch ulang kalau filter/page berubah ATAU refreshKey dari parent naik
  useEffect(() => {
    getSupplier({
      search,

      status: status === "all" ? "" : status,

      page,

      per_page: perPage,
    });
  }, [search, status, page, getSupplier, refreshKey]);

  //Mengambil ulang data supplier setelah aksi tertentu seperti delete atau update.
  const refresh = () => {
    getSupplier({
      search,

      status: status === "all" ? "" : status,

      page,

      per_page: perPage,
    });
  };

  // kalau yang dihapus item terakhir di halaman (dan bukan halaman 1), mundur 1 halaman
  const onDelete = (id: number) => {
    handleDelete(id, () => {
      if (dataSUpplier.length === 1 && page > 1) {
        setPage(page - 1); // useEffect otomatis fetch
      } else {
        refresh();
      }
    });
  };

  const clearSearch = () => {
    setKeyword("");
    setSearch("");
    setPage(1);
  };

  //loading ketika loading get dan delete
  const loading = loadingSupplier || loadingDelete;

  const lastPage = meta?.last_page ?? 1;

  // tombol aksi (dipakai di kartu mobile & tabel)
  const renderActions = (supplier: Supplier): ReactNode => (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant="outline"
        className={actionBtnClass}
        aria-label={`Edit ${supplier.name}`}
        onClick={() => setEditSupplier(supplier)}
      >
        <SquarePen size={16} />
      </Button>

      <Button
        size="icon"
        variant="outline"
        className={`${actionBtnClass} hover:border-[#F2B8B5] hover:bg-[#FDECEA]`}
        aria-label={`Hapus ${supplier.name}`}
        disabled={loading}
        onClick={() => onDelete(supplier.id)}
      >
        <Trash2 size={16} className="text-[#B3261E]" />
      </Button>
    </div>
  );

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      {/* ================= SEARCH + FILTER ================= */}
      <div className="flex flex-col gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <form
          className="flex w-full gap-2 md:max-w-lg"
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
              placeholder="Cari supplier..."
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

        {/* Filter Status */}
        <select
          className={selectClassName}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter status"
        >
          <option value="all">Semua Status</option>

          <option value="active">Aktif</option>

          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {/* ================= LOADING ================= */}
      {loadingSupplier && (
        <div className="divide-y divide-[#DBE2EF]">
          {Array.from({ length: 5 }).map((_, i) => (
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
      {error && !loadingSupplier && (
        <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
          <AlertCircle size={32} className="text-[#B3261E]" />
          <p className="text-sm font-medium text-[#B3261E]">{error}</p>
        </div>
      )}

      {/* ================= KOSONG ================= */}
      {!loadingSupplier && !error && dataSUpplier.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#DBE2EF]">
            <Search size={28} className="text-[#3F72AF]" />
          </div>
          <p className="font-semibold text-[#112D4E]">Supplier tidak ditemukan</p>
          <p className="text-sm text-[#50688C]">Coba gunakan kata kunci lain</p>
        </div>
      )}

      {/* ================= DATA ================= */}
      {!loadingSupplier && !error && dataSUpplier.length > 0 && (
        <>
          {/* Mobile: kartu */}
          <ul className="divide-y divide-[#DBE2EF] md:hidden">
            {dataSUpplier.map((supplier, index) => (
              <li key={supplier.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#50688C]">#{(page - 1) * perPage + index + 1}</p>
                    <p className="break-words text-base font-bold text-[#112D4E]">{supplier.name}</p>
                  </div>
                  <BadgeStatus status={supplier.status} />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <BadgeSpesialis value={supplier.spesialis} />
                </div>

                <dl className="mt-3 space-y-1.5 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                    <dd className="min-w-0 break-words text-[#112D4E]">{supplier.pic ?? "-"}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                    <dd className="min-w-0 break-words text-[#112D4E]">{supplier.phone ?? "-"}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                    <dd className="min-w-0 break-all text-[#112D4E]">{supplier.email ?? "-"}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                    <dd className="min-w-0 break-words text-[#112D4E]">{supplier.address ?? "-"}</dd>
                  </div>
                </dl>

                {isAdmin && <div className="mt-3">{renderActions(supplier)}</div>}
              </li>
            ))}
          </ul>

          {/* Tablet & desktop: tabel */}
          <div className="hidden w-full overflow-x-auto md:block">
            <Table className="min-w-[960px]">
              <TableHeader>
                <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">No</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Nama</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">PIC</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Spesialis</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Telepon</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Email</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Alamat</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Status</TableHead>
                  <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">{isAdmin ? "AKSI" : null}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dataSUpplier.map((supplier, index) => (
                  <TableRow
                    key={supplier.id}
                    className="border-[#DBE2EF] text-[#112D4E] transition-colors hover:bg-[#F9F7F7]"
                  >
                    <TableCell className="px-4 py-4 text-[#50688C] lg:px-6">
                      {(page - 1) * perPage + index + 1}
                    </TableCell>

                    <TableCell className="px-4 py-4 font-medium lg:px-6">{supplier.name}</TableCell>

                    <TableCell className="px-4 py-4 lg:px-6">{supplier.pic ?? "-"}</TableCell>

                    <TableCell className="px-4 py-4 lg:px-6">
                      <BadgeSpesialis value={supplier.spesialis} />
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-4 py-4 lg:px-6">{supplier.phone ?? "-"}</TableCell>

                    <TableCell className="px-4 py-4 text-[#50688C] lg:px-6">{supplier.email ?? "-"}</TableCell>

                    <TableCell className="max-w-[220px] whitespace-normal break-words px-4 py-4 text-[#50688C] lg:px-6">
                      {supplier.address ?? "-"}
                    </TableCell>

                    <TableCell className="px-4 py-4 lg:px-6">
                      <BadgeStatus status={supplier.status} />
                    </TableCell>

                    {isAdmin && <TableCell className="px-4 py-4 lg:px-6">{renderActions(supplier)}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="flex items-center justify-between gap-3 border-t border-[#DBE2EF] bg-[#F9F7F7] p-4">
            <span className="text-sm text-[#50688C]">
              Halaman <b className="text-[#112D4E]">{page}</b> dari <b className="text-[#112D4E]">{lastPage}</b>
            </span>

            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className={pageBtnClass}
                aria-label="Halaman sebelumnya"
                disabled={page <= 1 || loading}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
              </Button>

              <Button
                size="icon"
                variant="outline"
                className={pageBtnClass}
                aria-label="Halaman berikutnya"
                disabled={page >= lastPage || loading}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* kondisi edit */}

      <EditSupplier
        open={!!editSupplier}
        supplier={editSupplier}
        onOpenChange={() => setEditSupplier(null)}
        onSuccess={refresh}
      />
    </div>
  );
};

export default TableSupplier;