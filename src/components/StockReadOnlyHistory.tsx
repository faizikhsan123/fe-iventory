import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePenerimaanStok } from "@/hooks/Laporan/penerimaan";
import useTransaction from "@/hooks/Laporan/BaranngKeluar";

// Tampilan baca-saja riwayat Barang Masuk / Keluar untuk role non-admin (office).

const fmtDate = (d: string) => {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
};

interface ShellProps {
  title: string;
  loading: boolean;
  error: string;
  empty: boolean;
  page: number;
  lastPage: number;
  onPage: (p: number) => void;
  children: ReactNode;
}

const Shell = ({ title, loading, error, empty, page, lastPage, onPage, children }: ShellProps) => (
  <div className="overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
    <div className="border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-3.5 sm:px-6">
      <h2 className="font-bold text-[#112D4E]">{title}</h2>
    </div>
    {loading ? (
      <div className="flex justify-center p-10" role="status" aria-label="Memuat">
        <Loader2 className="h-5 w-5 animate-spin text-[#50688C]" />
      </div>
    ) : error ? (
      <p role="alert" className="p-6 text-sm text-[#B3261E]">
        {error}
      </p>
    ) : empty ? (
      <p className="p-10 text-center text-sm text-[#50688C]">Belum ada data</p>
    ) : (
      <div className="overflow-x-auto">{children}</div>
    )}
    {lastPage > 1 && (
      <div className="flex items-center justify-between gap-3 border-t border-[#DBE2EF] p-3 text-sm text-[#50688C]">
        <span>
          Halaman {page} dari {lastPage}
        </span>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => onPage(page - 1)}>
            Sebelumnya
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={page >= lastPage || loading} onClick={() => onPage(page + 1)}>
            Berikutnya
          </Button>
        </div>
      </div>
    )}
  </div>
);

export const StockInReadOnly = () => {
  const { dataPenerimaanStok, meta, loading, error, getPenerimaanStok } = usePenerimaanStok();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPenerimaanStok({ page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Shell
      title="Riwayat Barang Masuk"
      loading={loading}
      error={error}
      empty={dataPenerimaanStok.length === 0}
      page={page}
      lastPage={meta?.last_page ?? 1}
      onPage={setPage}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Barang</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Catatan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataPenerimaanStok.map((r, i) => (
            <TableRow key={`${r.date}-${i}`}>
              <TableCell>{fmtDate(r.date)}</TableCell>
              <TableCell>{r.item_id?.name ?? "-"}</TableCell>
              <TableCell>{r.supplier_id?.name ?? "-"}</TableCell>
              <TableCell>{r.qty}</TableCell>
              <TableCell className="max-w-[240px] truncate">{r.note ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Shell>
  );
};

export const StockOutReadOnly = () => {
  const { data, meta, loading, error, handleGet } = useTransaction();
  const [page, setPage] = useState(1);

  useEffect(() => {
    handleGet({ page });
  }, [handleGet, page]);

  return (
    <Shell
      title="Riwayat Barang Keluar"
      loading={loading}
      error={error}
      empty={data.length === 0}
      page={page}
      lastPage={meta?.last_page ?? 1}
      onPage={setPage}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Transaksi</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Karyawan</TableHead>
            <TableHead>Barang</TableHead>
            <TableHead>Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.transaction_number}</TableCell>
              <TableCell>{fmtDate(r.date)}</TableCell>
              <TableCell>{r.employe_name ?? "-"}</TableCell>
              <TableCell className="max-w-[240px] truncate">{r.barang}</TableCell>
              <TableCell>{r.total_qty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Shell>
  );
};
