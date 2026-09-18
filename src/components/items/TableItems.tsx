import { Boxes, CheckCircle2, AlertTriangle, XCircle, Eye, Search, SquarePen, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import UsegetItems from "@/hooks/items/getItems";
import { useEffect, useMemo, useState } from "react";
import UseDelete from "@/hooks/items/DeleteItems";
import { STORAGE_URL } from "@/lib/axios";
import { useNavigate } from "react-router";
import { cn } from "cn";

const STATUS_STYLE: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700",
  low_stock: "bg-amber-50 text-amber-700",
  out_of_stock: "bg-red-50 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

const CATEGORY_STYLE: Record<string, string> = {
  apd: "bg-blue-50 text-blue-700",
  tools: "bg-purple-50 text-purple-700",
};

// function badge status
function getStockStatus(current: number, min: number): string {
  if (current === 0) return "out_of_stock";
  if (current <= min) return "low_stock";
  return "available";
}

const TableItems = () => {
  const { error, loading, data, getItems } = UsegetItems();
  const { deleteloading, errodelete, handleDelete } = UseDelete();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getItems();
  }, []);

  const summary = useMemo(() => {
    const available = data.filter((items) => items.status === "available").length;
    const lowStock = data.filter((items) => items.status === "low_stock").length;
    const outOfStock = data.filter((items) => items.status === "out_of_stock").length;
    return { total: data.length, available, lowStock, outOfStock };
  }, [data]);

  const stats = [
    { icon: Boxes, iconClass: "bg-blue-50 text-blue-600", value: summary.total, label: "Total Item" },
    { icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-600", value: summary.available, label: "Available" },
    { icon: AlertTriangle, iconClass: "bg-amber-50 text-amber-600", value: summary.lowStock, label: "Low Stock" },
    { icon: XCircle, iconClass: "bg-red-50 text-red-600", value: summary.outOfStock, label: "Out of Stock" },
  ];

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="flex flex-wrap gap-4 my-4">
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

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari part number, nama barang..."
              className="pl-9"
            />
          </div>

          {/* <Button variant="outline" className="gap-2 text-slate-600">
            <Download className="h-4 w-4" />
            Export
          </Button> */}
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
              <TableHead className="text-center">Min Stok</TableHead>
              <TableHead className="text-center">Stok Sekarang</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">AKSI</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-slate-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-red-500"
                >
                  Gagal mengambil data barang.
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-slate-500"
                >
                  Belum ada data barang.
                </TableCell>
              </TableRow>
            ) : (
              data.map((items, index) => (
                <TableRow key={items.id}>
                  <TableCell className="text-slate-500">{index + 1}</TableCell>

                  <TableCell>
                    <div className="h-9 w-9 overflow-hidden rounded-lg bg-slate-100">
                      {items.file ? (
                        <img
                          className="h-full w-full object-cover"
                          src={`${STORAGE_URL}${items.file}`}
                          alt={items.name ?? "Item image"}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-blue-600">{items.part_number}</TableCell>
                  <TableCell className="font-medium text-slate-900">{items.name}</TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-transform: capitalize ${
                        CATEGORY_STYLE[items.category] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {items.category}
                    </span>
                  </TableCell>

                  <TableCell className="text-slate-500">{items.brand}</TableCell>

                  <TableCell className="text-center text-slate-500">{items.min_stock} unit</TableCell>
                  <TableCell className="text-center font-semibold text-slate-800">{items.current_stock} unit</TableCell>

                  <TableCell>
                    {(() => {
                      const status = getStockStatus(items.current_stock, items.min_stock);
                      return (
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", STATUS_STYLE[status])}>
                          {STATUS_LABEL[status]}
                        </span>
                      );
                    })()}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-slate-500"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => navigate(`/update-items/${items.id}`)}
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-slate-500"
                        disabled={deleteloading}
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
    </div>
  );
};

export default TableItems;
