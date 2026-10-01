// TableItems.tsx
import { AlertCircle, ChevronLeft, ChevronRight, Eye, Package, Search, SquarePen, Trash2, X } from "lucide-react";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import UsegetItems from "@/hooks/items/getItems";
import UseDelete from "@/hooks/items/DeleteItems";
import { STORAGE_URL } from "@/lib/axios";
import { useNavigate } from "react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/auth/useAuth";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, border #BFCCE3, border toolbar #9DB2D3,
           muted #50688C, placeholder #7B8FAE
  semantik: merah #B3261E (bg #FDECEA, border #F2B8B5) stok habis, hapus, error
            amber #8A5A00 (bg #FFF4DB, border #F2C96B) stok menipis
*/

// Select solid putih. text-base di HP biar iOS tidak auto-zoom.
const selectClassName =
  "flex h-11 w-full items-center rounded-lg border border-[#9DB2D3] bg-white px-3 text-base text-[#112D4E] outline-none transition hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#F9F7F7] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm md:w-[190px]";

const searchClass =
  "h-11 w-full rounded-lg border border-[#9DB2D3] bg-white pl-10 pr-9 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#F9F7F7] sm:text-sm";

const pageBtnClass =
  "h-10 w-10 rounded-lg border border-[#BFCCE3] bg-white p-0 text-[#112D4E] hover:bg-[#DBE2EF] disabled:opacity-50";

const actionBtnClass =
  "h-10 w-10 rounded-lg border border-[#BFCCE3] bg-white p-0 text-[#112D4E] hover:bg-[#DBE2EF] disabled:opacity-50";

const STATUS_STYLE: Record<string, string> = {
  available: "bg-[#DBE2EF] text-[#112D4E] ring-[#BFCCE3]",
  low_stock: "bg-[#FFF4DB] text-[#8A5A00] ring-[#F2C96B]",
  out_of_stock: "bg-[#FDECEA] text-[#B3261E] ring-[#F2B8B5]",
};

const STATUS_DOT: Record<string, string> = {
  available: "bg-[#3F72AF]",
  low_stock: "bg-[#F2A900]",
  out_of_stock: "bg-[#B3261E]",
};

const STATUS_LABEL: Record<string, string> = {
  available: "Tersedia",
  low_stock: "Stok Menipis",
  out_of_stock: "Stok Habis",
};

const CATEGORY_STYLE: Record<string, string> = {
  apd: "bg-[#DBE2EF] text-[#112D4E] ring-[#BFCCE3]",
  tools: "bg-white text-[#112D4E] ring-[#3F72AF]",
};

// function badge status
function getStockStatus(current: number, min: number): string {
  if (current === 0) return "out_of_stock";
  if (current <= min) return "low_stock";
  return "available";
}

function BadgeKategori({ value }: { value?: string | null }) {
  if (!value) return <span className="text-[#7B8FAE]">-</span>;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${
        CATEGORY_STYLE[value.toLowerCase()] ?? "bg-[#F9F7F7] text-[#50688C] ring-[#DBE2EF]"
      }`}
    >
      {value}
    </span>
  );
}

function BadgeStatus({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLE[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

function Thumb({ file, name, className = "h-12 w-12" }: { file?: string | null; name?: string | null; className?: string }) {
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] ${className}`}
    >
      {file ? (
        <img
          className="h-full w-full object-cover"
          src={`${STORAGE_URL}${file}`}
          alt={name ?? "Item image"}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <Package className="h-5 w-5 text-[#9DB2D3]" />
      )}
    </div>
  );
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

  // kalau yang dihapus item terakhir di halaman (dan bukan halaman 1), mundur 1 halaman
  const onDelete = (id: number) => {
    handleDelete(id, () => {
      if (data.length === 1 && page > 1) {
        Setpage(page - 1); // useEffect otomatis fetch
      } else {
        refresh();
      }
    });
  };

  const clearSearch = () => {
    Setkeyword("");
    Setsearch("");
    Setpage(1);
  };

  const lastPage = meta?.last_page ?? 1;

  // untuk no dimulai dari halaman yg uda terlwati contoh lagi buka halamn 3 maka 2 halaman sebelumnya uda terlwati kan
  // berarti 3 -1  = 2 kali 10  maka 20
  // maka dibawah 20 + 1 sampai seterusnya
  const startNumber = (page - 1) * $perPage;

  const { user } = useAuth();

  const isAdmin = user?.roles?.includes("admin");

  // tombol aksi (dipakai di kartu mobile & tabel)
  const renderActions = (id: number, name?: string | null): ReactNode => (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        className={actionBtnClass}
        aria-label={`Lihat ${name ?? "barang"}`}
        onClick={() => navigate(`/items/${id}`)}
      >
        <Eye size={16} />
      </Button>

      {isAdmin && (
        <>
          <Button
            onClick={() => navigate(`/update-items/${id}`)}
            size="icon"
            variant="outline"
            className={actionBtnClass}
            aria-label={`Edit ${name ?? "barang"}`}
            disabled={deleteloading}
          >
            <SquarePen size={16} />
          </Button>

          <Button
            onClick={() => onDelete(id)}
            size="icon"
            variant="outline"
            className={`${actionBtnClass} hover:border-[#F2B8B5] hover:bg-[#FDECEA]`}
            aria-label={`Hapus ${name ?? "barang"}`}
            disabled={deleteloading}
          >
            <Trash2 size={16} className="text-[#B3261E]" />
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="mt-4 overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
        {/* ================= TOOLBAR ================= */}
        <div className="flex flex-col gap-3 border-b border-[#BFCCE3] bg-[#DBE2EF] p-4 md:flex-row md:items-center md:justify-between">
          <form
            className="flex w-full gap-2 md:max-w-lg"
            onSubmit={(e) => {
              e.preventDefault();

              Setpage(1);
              // masukkan ke search nilai dari keyword
              Setsearch(keyword);
            }}
          >
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF]"
                size={17}
              />

              <Input
                className={searchClass}
                placeholder="Cari barang..."
                value={keyword}
                onChange={(e) => Setkeyword(e.target.value)}
              />

              {keyword && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Hapus pencarian"
                  className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#50688C] transition hover:bg-[#DBE2EF] hover:text-[#112D4E]"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <Button
              className="h-11 rounded-lg bg-[#112D4E] px-5 font-semibold text-white hover:bg-[#0B2240] disabled:opacity-60"
              disabled={loading}
            >
              Cari
            </Button>
          </form>

          <select
            className={selectClassName}
            value={status}
            onChange={(e) => {
              Setstatus(e.target.value);
              Setpage(1);
            }}
            aria-label="Filter kategori"
          >
            <option value="all">Semua Kategori</option>

            <option value="apd">APD</option>

            <option value="tools">TOOLS</option>
          </select>
        </div>

        {errodelete && (
          <div
            role="alert"
            className="mx-4 mt-4 flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 break-words">{errodelete}</span>
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="divide-y divide-[#DBE2EF]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-3 p-4 sm:px-6">
                <div className="h-12 w-12 shrink-0 rounded-lg bg-[#DBE2EF]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-[#DBE2EF]" />
                  <div className="h-3 w-2/3 rounded bg-[#EBEFF6]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= ERROR ================= */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
            <AlertCircle size={32} className="text-[#B3261E]" />
            <p className="text-sm font-medium text-[#B3261E]">Gagal mengambil data barang.</p>
          </div>
        )}

        {/* ================= KOSONG ================= */}
        {!loading && !error && data.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#DBE2EF]">
              <Search size={28} className="text-[#3F72AF]" />
            </div>
            <p className="font-semibold text-[#112D4E]">Barang tidak ditemukan</p>
            <p className="text-sm text-[#50688C]">Coba gunakan kata kunci lain</p>
          </div>
        )}

        {/* ================= DATA ================= */}
        {!loading && !error && data.length > 0 && (
          <>
            {/* Mobile: kartu */}
            <ul className="divide-y divide-[#DBE2EF] md:hidden">
              {data.map((items, index) => {
                const stockStatus = getStockStatus(items.current_stock, items.min_stock);
                return (
                  <li key={items.id} className="p-4">
                    <div className="flex gap-3">
                      <Thumb file={items.file} name={items.name} className="h-14 w-14" />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-[#50688C]">#{startNumber + index + 1}</p>
                            <p className="break-words text-sm font-bold text-[#112D4E]">{items.name}</p>
                          </div>
                          <BadgeStatus status={stockStatus} />
                        </div>

                        <p className="mt-0.5 break-words text-xs text-[#50688C]">
                          {[items.brand, items.type].filter(Boolean).join(" · ") || "-"}
                        </p>
                        <div className="mt-1.5">
                          <BadgeKategori value={items.category} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] p-3">
                      <div>
                        <p className="text-xs text-[#50688C]">Stok sekarang</p>
                        <p className="font-bold text-[#112D4E]">{items.current_stock} unit</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#50688C]">Min stok</p>
                        <p className="font-semibold text-[#112D4E]">{items.min_stock} unit</p>
                      </div>
                    </div>

                    <div className="mt-3">{renderActions(items.id, items.name)}</div>
                  </li>
                );
              })}
            </ul>

            {/* Tablet & desktop: tabel */}
            <div className="hidden w-full overflow-x-auto md:block">
              <Table className="min-w-[960px]">
                <TableHeader>
                  <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
                    <TableHead className="w-12 px-4 font-bold text-[#112D4E] lg:px-6">No</TableHead>
                    <TableHead className="px-4 font-bold text-[#112D4E]">Foto</TableHead>
                    <TableHead className="px-4 font-bold text-[#112D4E]">Nama Barang</TableHead>
                    <TableHead className="px-4 font-bold text-[#112D4E]">Type</TableHead>
                    <TableHead className="px-4 font-bold text-[#112D4E]">Kategori</TableHead>
                    <TableHead className="px-4 font-bold text-[#112D4E]">Merk</TableHead>
                    <TableHead className="px-4 text-center font-bold text-[#112D4E]">Min Stok</TableHead>
                    <TableHead className="px-4 text-center font-bold text-[#112D4E]">Stok Sekarang</TableHead>
                    <TableHead className="px-4 font-bold text-[#112D4E]">Status</TableHead>
                    <TableHead className="px-4 text-center font-bold text-[#112D4E]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((items, index) => {
                    const stockStatus = getStockStatus(items.current_stock, items.min_stock);
                    return (
                      <TableRow
                        key={items.id}
                        className="border-[#DBE2EF] text-[#112D4E] transition-colors hover:bg-[#F9F7F7]"
                      >
                        <TableCell className="px-4 py-4 text-[#50688C] lg:px-6">{startNumber + index + 1}</TableCell>
                        <TableCell className="px-4 py-4">
                          <Thumb file={items.file} name={items.name} className="h-10 w-10" />
                        </TableCell>
                        <TableCell className="px-4 py-4 font-medium">{items.name}</TableCell>
                        <TableCell className="px-4 py-4 text-[#50688C]">{items.type ?? "-"}</TableCell>
                        <TableCell className="px-4 py-4">
                          <BadgeKategori value={items.category} />
                        </TableCell>
                        <TableCell className="px-4 py-4 text-[#50688C]">{items.brand ?? "-"}</TableCell>
                        <TableCell className="px-4 py-4 text-center text-[#50688C]">{items.min_stock} unit</TableCell>
                        <TableCell className="px-4 py-4 text-center font-bold">{items.current_stock} unit</TableCell>
                        <TableCell className="px-4 py-4">
                          <BadgeStatus status={stockStatus} />
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex justify-center">{renderActions(items.id, items.name)}</div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* ================= PAGINATION ================= */}
            <div className="flex items-center justify-between gap-3 border-t border-[#DBE2EF] bg-[#F9F7F7] p-4">
              <span className="text-sm text-[#50688C]">
                Halaman <b className="text-[#112D4E]">{page}</b> dari <b className="text-[#112D4E]">{lastPage}</b>
              </span>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className={pageBtnClass}
                  aria-label="Halaman sebelumnya"
                  // disable ketika page kurang dari 1 sama dengan 1 dan loading
                  disabled={page <= 1 || loading}
                  onClick={() => Setpage(page - 1)}
                >
                  <ChevronLeft size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className={pageBtnClass}
                  aria-label="Halaman berikutnya"
                  disabled={page >= lastPage || loading}
                  onClick={() => Setpage(page + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TableItems;