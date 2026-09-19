import {
  // Boxes,
  // CheckCircle2,
  // AlertTriangle,
  // XCircle,
  Eye,
  Search,
  SquarePen,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import UsegetItems from "@/hooks/items/getItems";
// import { useEffect, useMemo, useState } from "react";
import UseDelete from "@/hooks/items/DeleteItems";
import { STORAGE_URL } from "@/lib/axios";
import { useNavigate } from "react-router";
import { cn } from "cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";

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
  const { error, loading, data, getItems, meta } = UsegetItems();
  const { deleteloading, errodelete, handleDelete } = UseDelete();
  const navigate = useNavigate();

  const [keyword, Setkeyword] = useState("");
  const [search, Setsearch] = useState("");
  const [page, Setpage] = useState(1);
  const [status, Setstatus] = useState("all");

  const $perPage = 10;

  useEffect(() => {
    getItems({
      per_page: $perPage,
      page: page,
      category: status === "all" ? "" : status,
      search: search,
    });
    // berubah jika salah satu dari ini berubah
  }, [status, search, page, getItems]);

  // mengambil ulang setelah crud
  const refresh = async () => {
    getItems({
      per_page: $perPage,
      page: page,
      category: status === "all" ? "" : status,
      search: search,
    });
  };

  const onDelete = async (id: number) => {
    await handleDelete(id);
    refresh();
  };

  const lastPage = meta?.last_page ?? 1;

  // untuk no dimulai dari halaman yg uda terlwati contoh lagi buka halamn 3 maka 2 halaman sebelumnya uda terlwati kan
  // berarti 3 -1  = 2 kali 10  maka 20
  // maka dibawah 20 + 1 sampai seterusnya 
  const startNumber = (page - 1) * $perPage

  //  const summary = useMemo(() => {
  //   const available = data.filter((items) => items.status === "available").length;
  //   const lowStock = data.filter((items) => items.status === "low_stock").length;
  //   const outOfStock = meta.filter((items) => meta?.total.items.status === "out_of_stock").length;
  //   return { total: meta?.total ?? data.length, available, lowStock, outOfStock };
  // }, [data, meta]);

  //   const stats = [
  //     { icon: Boxes, iconClass: "bg-blue-50 text-blue-600", value: summary.total, label: "Total Item" },
  //     { icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-600", value: summary.available, label: "Available" },
  //     { icon: AlertTriangle, iconClass: "bg-amber-50 text-amber-600", value: summary.lowStock, label: "Low Stock" },
  //     { icon: XCircle, iconClass: "bg-red-50 text-red-600", value: summary.outOfStock, label: "Out of Stock" },
  //   ];

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      {/* <div className="flex flex-wrap gap-4 my-4">
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
      </div> */}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Toolbar */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
          <form
            className="flex w-full max-w-lg gap-2"
            onSubmit={(e) => {
              e.preventDefault();

              Setpage(1);
              // masukkan ke search nilai dari keyword
              Setsearch(keyword);
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
                onChange={(e) => Setkeyword(e.target.value)}
              />
            </div>

            <Button disabled={loading}>Cari</Button>
          </form>

          <Select
            value={status}
            onValueChange={(value) => {
              if (value) {
                Setstatus(value);
                Setpage(1);
              }
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>

              <SelectItem value="apd">APD</SelectItem>

              <SelectItem value="tools">TOOLS</SelectItem>
            </SelectContent>
          </Select>
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
                  loading...
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
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search
                      size={32}
                      className="text-gray-300"
                    />

                    <p className="font-medium text-gray-600">Barang tidak ditemukan</p>

                    <p className="text-sm text-gray-400">Coba gunakan kata kunci lain</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((items, index) => (
                <TableRow key={items.id}>
                 
                  <TableCell className="px-6 py-4">{startNumber + index  + 1}</TableCell>
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
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
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
                        onClick={() => onDelete(items.id)}
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

        {data.length > 0 && (
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
                onClick={() => Setpage(page - 1)}
              >
                <ChevronLeft size={16} />
              </Button>

              <Button
                size="icon"
                variant="outline"
                disabled={page >= lastPage || loading}
                onClick={() => Setpage(page + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableItems;
