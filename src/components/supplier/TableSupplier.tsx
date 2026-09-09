import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useSupplier } from "@/hooks/suppliers/getSupplier";
import { useDeleteSupplier } from "@/hooks/suppliers/deleteSupplier";
import { EditSupplier } from "./UpdateSupplier";
import type { Supplier } from "@/types/supplier";
import { Search, SquarePen, Trash2 } from "lucide-react";

const TableSupplier = () => {
  const { error, loading, data, getSupplier } = useSupplier();
  const { errorDelete, handleDelete, loadingDelete } = useDeleteSupplier();

  // simpan supplier yang lagi diedit, null berarti dialog tertutup
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    // buat controller untuk cancel request kalau user pindah halaman sebelum request selesai

    getSupplier();

    // return () => {
    //   controller.abort();
    // };
  }, []);

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            type="text"
            placeholder="Cari nama Supplier, Telepon, Alamat..."
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
          {loading ? (
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
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-slate-500"
              >
                Belum ada data supplier.
              </TableCell>
            </TableRow>
          ) : (
            data.map((supplier, index) => (
              <TableRow key={supplier.id}>
                <TableCell className="text-slate-500">{index + 1}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{supplier.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-slate-500">{supplier.phone}</TableCell>
                <TableCell className="text-blue-600">{supplier.email}</TableCell>
                <TableCell className="text-slate-500">{supplier.address}</TableCell>
                <TableCell className="text-slate-500">{supplier.status}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      // buka dialog edit dengan data supplier ini
                      onClick={() => setEditSupplier(supplier,)}
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
