import { Eye, Search, SquarePen, Trash2, Users, CheckCircle2,  PackageCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// import { useSupplier } from "@/hooks/suppliers/getSupplier";
// import { useDeleteSupplier } from "@/hooks/suppliers/deleteSupplier";
import useGetEmployes from "@/hooks/employes/getEmployes";
import { useDeleteEmployes } from "@/hooks/employes/deleteEmployes";
import type { employes } from "@/types/employes";
import UpdateEmployes from "./UpdateEmployes";

// ambil inisial 2 huruf dari nama karyawan buat avatar
const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const isActive = (status: string) => status?.toLowerCase() === "active";

const TableEmployes = () => {
  const { error, loading, data, getEmployesButton } = useGetEmployes();

  const { errorDelete, handleDelete, loadingDelete } = useDeleteEmployes();

  useEffect(() => {
    // buat controller untuk cancel request kalau user pindah halaman sebelum request selesai
    // const controller = new AbortController();
    getEmployesButton();
    // return () => {
    //   controller.abort();
    // };
  }, []);

  // artinya ini tuoenya  types employes atau null dana isi nilai awalnya null
  const [stateUpdate, SetUpdate] = useState<employes | null>(null);

  const [search, setSearch] = useState("");

  // TODO: kalau BE udah support query search, pindahin filter ini ke getEmployesButton(params)
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (employes) =>
        employes.user.name.toLowerCase().includes(q) ||
        employes.division.toLowerCase().includes(q) ||
        employes.position.toLowerCase().includes(q)
    );
  }, [data, search]);

  const summary = useMemo(() => {
    const active = data.filter((employes) => isActive(employes.status)).length;
    const punyaPinjaman = data.filter((employes) => Number(employes.given_items_count) > 0).length;
    return { total: data.length, active, punyaPinjaman };
  }, [data]);

  const stats = [
    { icon: Users, iconClass: "bg-blue-50 text-blue-600", value: summary.total, label: "Total Karyawan" },
    { icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-600", value: summary.active, label: "Active" },
    { icon: PackageCheck, iconClass: "bg-violet-50 text-violet-600", value: summary.punyaPinjaman, label: "Memiliki Pinjaman" },
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

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, divisi, jabatan..."
              className="pl-9"
            />
          </div>
        </div>

        {errorDelete && <p className="px-4 pt-3 text-sm text-red-500">{errorDelete}</p>}

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>KARYAWAN</TableHead>
              <TableHead>DIVISI</TableHead>
              <TableHead>JABATAN</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>BARANG DIPINJAM</TableHead>
              <TableHead>AKSI</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-red-500">
                  Gagal mengambil data karyawan.
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Belum ada data karyawan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((employes) => {
                const itemCount = Number(employes.given_items_count);
                const active = isActive(employes.status);
                const cuti = employes.status?.toLowerCase() === "cuti";

                return (
                  <TableRow key={employes.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                          {getInitials(employes.user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{employes.user.name}</p>
                          <p className="truncate text-xs text-slate-400">{employes.user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {employes.division}
                      </span>
                    </TableCell>

                    <TableCell className="text-slate-700">{employes.position}</TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          active
                            ? "bg-emerald-50 text-emerald-700"
                            : cuti
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {employes.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      {itemCount < 1 ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <span className="font-medium text-violet-600">{itemCount} item</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          // onClick={() => SetUpdate(employes)}
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-slate-500"
                          disabled={loadingDelete}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={() => SetUpdate(employes)}
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-slate-500"
                          disabled={loadingDelete}
                        >
                          <SquarePen className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={() => handleDelete(employes.id, () => getEmployesButton())}
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* modal edit karyawan, kebuka kalau ada data yang lagi dipilih */}
      <UpdateEmployes
        onSuccess={() => getEmployesButton()}
        open={!!stateUpdate} // true kalau stateUpdate ada isinya
        employes={stateUpdate} // data yang mau ditampilin di form
        onOpenChange={(open) => !open && SetUpdate(null)} // pas ditutup, reset ke null
      />
    </div>
  );
};

export default TableEmployes;