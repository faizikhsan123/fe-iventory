import { Search, SquarePen, Trash2 } from "lucide-react";
import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useSupplier } from "@/hooks/suppliers/supplier";

const TableLayout = () => {
  const { error, loading, data, getSupplier } = useSupplier();

  useEffect(() => {
    getSupplier();
  }, [data]);

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            type="text"
            placeholder="Cari nama supplier, kontak, alamat..."
            className="pl-9"
          />
        </div>

        {/* Filter */}
        <Select defaultValue="all">
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-12">No</TableHead>
            <TableHead>NAMA SUPPLIER</TableHead>
            <TableHead>NAMA KONTAK</TableHead>
            <TableHead>TELEPON</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>ALAMAT</TableHead>
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
                {/* No */}
                <TableCell className="text-slate-500">{index + 1}</TableCell>

                {/* Supplier */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{supplier.name}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Kontak */}
                {/* <TableCell>{supplier.kontak}</TableCell> */}

                {/* Telepon */}
                <TableCell className="text-slate-500">{supplier.phone}</TableCell>

                {/* Email */}
                <TableCell className="text-blue-600">{supplier.email}</TableCell>

                {/* Alamat */}
                <TableCell className="text-slate-500">{supplier.address}</TableCell>

                {/* Aksi */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 text-slate-500"
                    >
                      <SquarePen className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
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
    </div>
  );
};

export default TableLayout;
