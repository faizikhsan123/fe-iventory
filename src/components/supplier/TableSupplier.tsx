import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Search, SquarePen, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import { useSupplier } from "@/hooks/suppliers/getSupplier";

import { useDeleteSupplier } from "@/hooks/suppliers/deleteSupplier";

import { EditSupplier } from "./UpdateSupplier";

import type { Supplier } from "@/types/supplier";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const TableSupplier = () => {
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

  // use effct dijalankan dengan ebebrapa parameter
  useEffect(() => {
    getSupplier({
      search,

      status: status === "all" ? "" : status,

      page,

      per_page: perPage,
    });
  }, [search, status, page, getSupplier]);

  //Mengambil ulang data supplier setelah aksi tertentu seperti delete atau update.
  const refresh = () => {
    getSupplier({
      search,

      status: status === "all" ? "" : status,

      page,

      per_page: perPage,
    });
  };

  //loading ketika loading get dan delete
  const loading = loadingSupplier || loadingDelete;

  //Mengambil ulang data supplier setelah aksi tertentu seperti delete atau update.
  const lastPage = meta?.last_page ?? 1;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
              placeholder="Cari supplier..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <Button disabled={loading}>Cari</Button>
        </form>

        {/* Filter Status */}

        <Select
          value={status}
          onValueChange={(value) => {
            if (value) {
              setStatus(value);

              setPage(1);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>

            <SelectItem value="active">Active</SelectItem>

            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="px-6">No</TableHead>

              <TableHead className="px-6">Nama</TableHead>

              <TableHead className="px-6">Telepon</TableHead>

              <TableHead className="px-6">Email</TableHead>

              <TableHead className="px-6">Status</TableHead>

              <TableHead className="px-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loadingSupplier && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-gray-500"
                >
                  Memuat data supplier...
                </TableCell>
              </TableRow>
            )}

            {error && !loadingSupplier && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            )}

            {/* jika data supplier panjangnya 0 */}

            {!loadingSupplier && !error && dataSUpplier.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search
                      size={32}
                      className="text-gray-300"
                    />

                    <p className="font-medium text-gray-600">Supplier tidak ditemukan</p>

                    <p className="text-sm text-gray-400">Coba gunakan kata kunci lain</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* jika data supplier lebih dari 0 maka dimapping */}

            {!loadingSupplier &&
              !error &&
              dataSUpplier.length > 0 &&
              dataSUpplier.map((supplier, index) => (
                <TableRow
                  key={supplier.id}
                  className="hover:bg-slate-50"
                >
                  <TableCell className="px-6 py-4">{(page - 1) * perPage + index + 1}</TableCell>

                  <TableCell className="px-6 py-4 font-medium">{supplier.name}</TableCell>

                  <TableCell className="px-6 py-4">{supplier.phone ?? "-"}</TableCell>

                  <TableCell className="px-6 py-4">{supplier.email ?? "-"}</TableCell>

                  <TableCell className="px-6 py-4">
                    <span
                      className={
                        supplier.status === "active"
                          ? "inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                          : "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      }
                    >
                      {supplier.status}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setEditSupplier(supplier)}
                      >
                        <SquarePen size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        disabled={loading}
                        onClick={() => handleDelete(supplier.id, refresh)}
                      >
                        <Trash2
                          size={16}
                          className="text-red-500"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}

      {dataSUpplier.length > 0 && (
        <div className="flex items-center justify-between border-t bg-slate-50 p-4">
          <span className="text-sm text-gray-500">
            Halaman {page} dari {lastPage}
          </span>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              // disable ketika page kurang dari 1 sama dengan 1 dan loading

              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={16} />
            </Button>

            <Button
              size="icon"
              variant="outline"
              disabled={page >= lastPage || loading}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* kondnisi edit */}

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
