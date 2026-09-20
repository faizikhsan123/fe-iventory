import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import useActivity from "@/hooks/Activity/get";

const selectClassName =
  "flex h-9 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:w-[180px]";

const TableAvtivity = () => {
  // state keyword untuk menampung nilai dari si inputan user
  const [keyword, setKeyword] = useState("");

  //State search menyimpan keyword yang sudah dikonfirmasi untuk dikirim ke API.
  const [search, setSearch] = useState("");

  // state utuk halaman nilai default 1
  const [page, setPage] = useState(1);

  // state utuk halaman status
  const [type, setType] = useState("all");

  // satu halaman 10 item
  const perPage = 10;

  const { data, error, handleGet, loading, meta } = useActivity();
  const CATEGORY_STYLE: Record<string, { bg: string; text: string }> = {
    stockin: { bg: "#f0fdf4", text: "#15803d" },
    stockout: { bg: "#fef2f2", text: "#b91c1c" },
    system: { bg: "#f1f5f9", text: "#334155" },
  };

  const CATEGORY_LABEL: Record<string, string> = {
    stockin: "Barang Masuk",
    stockout: "Barang Keluar",
    system: "Sistem",
  };
  // use effct dijalankan dengan ebebrapa parameter
  useEffect(() => {
    handleGet({
      search,

      type: type === "all" ? "" : type,

      page,

      per_page: perPage,
    });
  }, [search, type, page, handleGet]);

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
              placeholder="Cari Detail Aktifitas"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <Button disabled={loading}>Cari</Button>
        </form>

        {/* Filter Status */}

        <select
          className={selectClassName}
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Semua Aktifitass</option>

          <option value="stockin">barang Masuk</option>
          <option value="stockout">barang keluar</option>

          <option value="system">Sistem</option>
        </select>
      </div>

      {/* TABLE */}

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="px-6">No</TableHead>

              <TableHead className="px-6">Tanggal - Waktu</TableHead>

              <TableHead className="px-6">Nama</TableHead>

              <TableHead className="px-6">Aktifitas</TableHead>

              <TableHead className="px-6">Jenis</TableHead>
              <TableHead className="px-6">Detail</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-gray-500"
                >
                  Memuat data Aktifitas...
                </TableCell>
              </TableRow>
            )}

            {error && !loading && (
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

            {!loading && !error && data.length === 0 && (
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

                    <p className="font-medium text-gray-600">Aktifitas Log tidak ditemukan</p>

                    <p className="text-sm text-gray-400">Coba gunakan kata kunci lain</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* jika data supplier lebih dari 0 maka dimapping */}

            {!loading &&
              !error &&
              data.length > 0 &&
              data.map((activity, index) => (
            

                <TableRow
                  key={activity.id}
                  className="hover:bg-slate-50"
                >
                  <TableCell className="px-6 py-4">{(page - 1) * perPage + index + 1}</TableCell>{" "}
                  <TableCell className="px-6 py-4 font-medium">{activity.date}</TableCell>
                  <TableCell className="px-6 py-4">{activity.user_id?.name ?? "-"}</TableCell>
                  <TableCell className="px-6 py-4">{activity.activity ?? "-"}</TableCell>
                
                
                  <TableCell className="px-6 py-4">
                    {activity.type ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "9999px",
                          padding: "2px 10px",
                          fontSize: "12px",
                          fontWeight: 500,
                          backgroundColor: CATEGORY_STYLE[activity.type]?.bg ?? "#f1f5f9",
                          color: CATEGORY_STYLE[activity.type]?.text ?? "#334155",
                        }}
                      >
                        {CATEGORY_LABEL[activity.type] ?? activity.type}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">{activity.detail ?? "-"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

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
    </div>
  );
};

export default TableAvtivity;
