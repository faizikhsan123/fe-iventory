import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Search, SquarePen, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import useGetEmployes from "@/hooks/employes/getEmployes";

import { useDeleteEmployes } from "@/hooks/employes/deleteEmployes";

import UpdateEmployes from "./UpdateEmployes";

import type { employes } from "@/types/employes";
import {  useNavigate } from "react-router";

const selectClassName =
  "flex h-9 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:w-[180px]";

const TableEmployes = () => {
  const { data, meta, loading, error, getEmployesButton } = useGetEmployes();

  const { errorDelete, handleDelete, loadingDelete } = useDeleteEmployes();

  const [stateUpdate, setStateUpdate] = useState<employes | null>(null);

  // state keyword untuk menampung nilai dari si inputan user
  const [keyword, setKeyword] = useState("");

  //State search menyimpan keyword yang sudah dikonfirmasi untuk dikirim ke API.
  const [search, setSearch] = useState("");

  // state utuk halaman nilai default 1
  const [page, setPage] = useState(1);

  // state utuk filter divisi
  const [division, setDivision] = useState("all");

  // state utuk halaman status
  const [position, setPosition] = useState("all");

  // satu halaman 10 item
  const perPage = 10;

  const navigate = useNavigate()

  // use effect dijalankan dengan beberapa parameter
  useEffect(() => {
    getEmployesButton({
      search,

      division: division === "all" ? "" : division,
      position: position === "all" ? "" : position,

      page,

      per_page: perPage,
    });
  }, [search, division, page, getEmployesButton, position]);

  //Mengambil ulang data employes setelah aksi tertentu seperti delete atau update.
  const refresh = () => {
    getEmployesButton({
      search,

      division: division === "all" ? "" : division,
      position: position === "all" ? "" : position,

      page,

      per_page: perPage,
    });
  };

  //loading ketika loading get dan delete
  const isLoading = loading || loadingDelete;

  const lastPage = meta?.last_page ?? 1;

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* SEARCH + FILTER */}

      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}

        <form
          className="flex w-full max-w-lg gap-2"
          onSubmit={(e) => {
            e.preventDefault();

            setPage(1);

            setSearch(keyword);
          }}
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />

            <Input
              className="pl-10"
              placeholder="Cari nama, divisi, jabatan..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <Button className="bg-blue-600" disabled={isLoading}>Cari</Button>
        </form>

        {/* Filter Divisi */}

        <select
          className={selectClassName}
          value={division}
          onChange={(e) => {
            setDivision(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Semua Divisi</option>

          {/* TODO: sesuaikan value dengan divisi yang ada di BE */}
          <option value="GA">GA</option>

          <option value="INC-PMR">INC - PMR</option>

          <option value="INC-ER">INC - ER</option>
        </select>

        {/* posiition */}
        <select
          className={selectClassName}
          value={position}
          onChange={(e) => {
            setPosition(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Semua Position</option>

          {/* TODO: sesuaikan value dengan divisi yang ada di BE */}
          <option value="Supervisor">Supervisor</option>

          <option value="Foreman">Foreman</option>

          <option value="Technician">Technician</option>
        </select>
      </div>

      {/* TABLE */}

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="px-6">No</TableHead>

              <TableHead className="px-6">Karyawan</TableHead>

              <TableHead className="px-6">Divisi</TableHead>

              <TableHead className="px-6">Jabatan</TableHead>

              <TableHead className="px-6">Status</TableHead>

              <TableHead className="px-6">Barang Dipinjam</TableHead>

              <TableHead className="px-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-gray-500"
                >
                  Memuat data karyawan...
                </TableCell>
              </TableRow>
            )}

            {error && !loading && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            )}

            {/* jika data employes panjangnya 0 */}

            {!loading && !error && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search
                      size={32}
                      className="text-gray-300"
                    />

                    <p className="font-medium text-gray-600">Karyawan tidak ditemukan</p>

                    <p className="text-sm text-gray-400">Coba gunakan kata kunci lain</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* jika data employes lebih dari 0 maka dimapping */}

            {!loading &&
              !error &&
              data.length > 0 &&
              data.map((employes, index) => {
                const itemCount = Number(employes.given_items_count);
                const isActive = employes.status?.toLowerCase() === "active";
                const isCuti = employes.status?.toLowerCase() === "cuti";

                return (
                  <TableRow
                    key={employes.id}
                    className="hover:bg-slate-50"
                  >
                    <TableCell className="px-6 py-4">{(page - 1) * perPage + index + 1}</TableCell>

                    <TableCell className="px-6 py-4 font-medium">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{employes.user.name}</p>
                        <p className="truncate text-xs text-slate-400">{employes.user.email}</p>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">{employes.division}</TableCell>

                    <TableCell className="px-6 py-4">{employes.position}</TableCell>

                    <TableCell className="px-6 py-4">
                      <span
                        className={
                          isActive
                            ? "inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                            : isCuti
                              ? "inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
                              : "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        }
                      >
                        {employes.status}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      {itemCount < 1 ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <span className="font-medium text-violet-600">{itemCount} item</span>
                      )}
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setStateUpdate(employes)}
                        >
                          <SquarePen size={16} />
                        </Button>

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => navigate(`/employes/${employes.id}`)}
                        >
                          <SquarePen size={16} />
                        </Button>

                        <Button
                          size="icon"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => handleDelete(employes.id, refresh)}
                        >
                          <Trash2
                            size={16}
                            className="text-red-500"
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {errorDelete && <p className="px-6 py-2 text-sm text-red-500">{errorDelete}</p>}

      {/* PAGINATION */}

      {data.length > 0 && (
        <div className="flex items-center justify-between border-t bg-slate-50 p-4">
          <span className="text-sm text-gray-500">
            Halaman {page} dari {lastPage}
          </span>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              // disable ketika page kurang dari sama dengan 1 dan loading
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={16} />
            </Button>

            <Button
              size="icon"
              variant="outline"
              disabled={page >= lastPage || isLoading}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* kondisi edit */}

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
