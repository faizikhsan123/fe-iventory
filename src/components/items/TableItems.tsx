import { Eye, Search, SquarePen, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import UsegetItems from "@/hooks/items/getItems";
import { useEffect } from "react";
import UseDelete from "@/hooks/items/DeleteItems";
import { STORAGE_URL } from "@/lib/axios";

const TableItems = () => {
  const { error, loading, data, getItems } = UsegetItems();
  const { deleteloading, errodelete, handleDelete } = UseDelete();

  useEffect(() => {
    getItems();
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
            placeholder="Cari nama barang"
            className="pl-9"
          />
        </div>
      </div>

      {errodelete && <p className="px-4 pt-3 text-sm text-red-500">{errodelete}</p>}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-12">No</TableHead>

            <TableHead>Foto</TableHead>
            <TableHead>Part Number</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Merk</TableHead>
            {/* <TableHead>Type</TableHead>
            <TableHead>Ukuran</TableHead> */}
            <TableHead>Min Stok</TableHead>
            <TableHead>Stok Sekarang</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead>Deskripsi</TableHead> */}
            <TableHead className="text-center">AKSI</TableHead>
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
                Gagal mengambil data karyawan.
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-slate-500"
              >
                Belum ada data karyawan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((items, index) => (
              <TableRow key={items.id}>
                <TableCell className="text-slate-500">{index + 1}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* gambar */}
                    <div>
                      {items.file ? (
                        <img
                          className="h-full w-full object-cover"
                          src={`${STORAGE_URL}${items.file}`}
                          alt={items.name ?? "Item image"}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{items.part_number}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-slate-500">{items.name}</TableCell>
                <TableCell className="text-slate-600">{items.category}</TableCell>
                <TableCell className="text-slate-500">{items.brand}</TableCell>

                <TableCell className="text-slate-500 text-center">{items.min_stock}</TableCell>
                <TableCell className="text-slate-500 text-center">{items.current_stock}</TableCell>
                <TableCell className="text-slate-500">{items.status}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                    //   onClick={() => SetUpdate(items)}
                    //   size="icon"
                    //   variant="outline"
                    //   className="h-8 w-8 text-slate-500"
                    //   disabled={loadingDelete}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                    //   onClick={() => SetUpdate(employes)}
                    //   size="icon"
                    //   variant="outline"
                    //   className="h-8 w-8 text-slate-500"
                    //   disabled={loadingDelete}
                    >
                      <SquarePen className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => handleDelete(items.id)}
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                      disabled={deleteloading}
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

export default TableItems;
