import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupplier } from "@/hooks/suppliers/getSupplier";
import { useDeleteSupplier } from "@/hooks/suppliers/deleteSupplier";
import { EditSupplier } from "./UpdateSupplier";
import type { Supplier } from "@/types/supplier";
import { Truck, CheckCircle2, XCircle, Search, SquarePen, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const isActive = (status: string) => status?.toLowerCase() === "active";

const TableSupplier = () => {
  const { error, loadingSupplier, dataSUpplier, getSupplier } = useSupplier();
  const { errorDelete, handleDelete, loadingDelete } = useDeleteSupplier();

  // simpan supplier yang lagi diedit, null berarti dialog tertutup
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // buat controller untuk cancel request kalau user pindah halaman sebelum request selesai

    getSupplier();

    // return () => {
    //   controller.abort();
    // };
  }, []);

  // TODO: kalau BE udah support query search, pindahin filter ini ke getSupplier(params)
  // biar gak filter di client. Untuk sekarang masih local filter dulu.
  const filteredSupplier = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return dataSUpplier;
    return dataSUpplier.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(q) ||
        supplier.phone.toLowerCase().includes(q) ||
        (supplier.address ?? "").toLowerCase().includes(q),
    );
  }, [dataSUpplier, search]);

  // "Kota" di sini numpang dari field address yang udah ada, bukan field kota terpisah
  const summary = useMemo(() => {
    const aktif = dataSUpplier.filter((s) => isActive(s.status)).length;

    return {
      total: dataSUpplier.length,
      aktif,
      tidakAktif: dataSUpplier.length - aktif,
    };
  }, [dataSUpplier]);

  const stats = [
    { icon: Truck, iconClass: "bg-blue-50 text-blue-600", value: summary.total, label: "Total Supplier" },
    { icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-600", value: summary.aktif, label: "Aktif" },
    { icon: XCircle, iconClass: "bg-red-50 text-red-600", value: summary.tidakAktif, label: "Tidak Aktif" },
  ];

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="flex flex-wrap gap-4 my-5">
        {stats.map(({ icon: Icon, iconClass, value, label }) => (
          <div
            key={label}
            className="flex flex-1 min-w-[220px] items-center gap-4 rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none text-slate-900">{value}</p>
              <p className="mt-1.5 text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white my-5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama supplier, telepon, kota..."
              className="pl-9"
            />
          </div>
        </div>

        {errorDelete && <p className="px-4 pt-3 text-sm text-red-500">{errorDelete}</p>}

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-12">No</TableHead>
              <TableHead>NAMA SUPPLIER</TableHead>
              <TableHead>TELEPON</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ALAMAT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>AKSI</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loadingSupplier ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-slate-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-red-500"
                >
                  Gagal mengambil data supplier.
                </TableCell>
              </TableRow>
            ) : filteredSupplier.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-slate-500"
                >
                  Belum ada data supplier.
                </TableCell>
              </TableRow>
            ) : (
              filteredSupplier.map((supplier, index) => (
                <TableRow key={supplier.id}>
                  <TableCell className="text-slate-500">{index + 1}</TableCell>

                  <TableCell className="text-slate-500">{supplier.name}</TableCell>
                  <TableCell className="text-slate-500">{supplier.phone}</TableCell>
                  <TableCell className="text-blue-600">{supplier.email}</TableCell>
                  <TableCell className="text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      {supplier.address}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isActive(supplier.status) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isActive(supplier.status) ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        // buka dialog edit dengan data supplier ini
                        onClick={() => setEditSupplier(supplier)}
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-slate-500"
                        disabled={loadingDelete}
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>
                      <Button
                        // panggil handleDelete dengan parameter id supplier dan callback untuk refresh data setelah delete
                        onClick={() => handleDelete(supplier.id, () => getSupplier())}
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        disabled={loadingDelete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination — placeholder, nanti diganti dari response paginate() Laravel */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <p className="text-sm text-slate-500">
            Menampilkan {filteredSupplier.length} dari {dataSUpplier.length} supplier
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                  page === currentPage ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage >= 2}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* dialog edit, munculnya kalau editSupplier ada isinya */}
      <EditSupplier
        onSuccess={() => getSupplier()} //ketika sukses jalankan get
        open={!!editSupplier} //open ketika nilainya ada
        supplier={editSupplier}
        onOpenChange={(open) => !open && setEditSupplier(null)}
      />
    </div>
  );
};

export default TableSupplier;
