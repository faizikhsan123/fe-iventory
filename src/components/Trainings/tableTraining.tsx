import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Eye, Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import UseGetTrainings from "@/hooks/Training/get";
import type { Training } from "@/types/Training";

type Props = {
  refreshKey: number;
  onEdit: (training: Training) => void;
  onDelete: (training: Training) => void;
};

const TableTraining = ({ refreshKey, onEdit, onDelete }: Props) => {
  const navigate = useNavigate();
  const { data, loading, error, getTrainings } = UseGetTrainings();
  const [q, setQ] = useState("");

  useEffect(() => {
    getTrainings();
  }, [getTrainings, refreshKey]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return data;
    return data.filter((t) =>
      `${t.id_training} ${t.name_training} ${t.division_training} ${t.by}`.toLowerCase().includes(k),
    );
  }, [data, q]);

  return (
    <div className="space-y-3 p-4 sm:p-6">
      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3F72AF]"
          size={15}
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari training..."
          className="h-11 w-full rounded-lg border border-[#BFCCE3] bg-white pl-9 text-sm text-[#112D4E] outline-none focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF]"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#BFCCE3] bg-white">
        <Table>
          <TableHeader className="bg-[#DBE2EF]">
            <TableRow>
              <TableHead className="font-bold text-[#112D4E]">ID Training</TableHead>
              <TableHead className="font-bold text-[#112D4E]">Nama Training</TableHead>
              <TableHead className="font-bold text-[#112D4E]">Divisi</TableHead>
              <TableHead className="font-bold text-[#112D4E]">By</TableHead>
              {/* <TableHead className="font-bold text-[#112D4E]">Tanggal</TableHead> */}
              <TableHead className="text-right font-bold text-[#112D4E]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-[#50688C]">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-[#7B8FAE]">
                  Belum ada data training
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id} className="hover:bg-[#F9F7F7]">
                  <TableCell className="font-semibold text-[#112D4E]">{t.id_training}</TableCell>
                  <TableCell className="text-[#112D4E]">{t.name_training}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-[#DBE2EF] px-2.5 py-1 text-xs font-semibold text-[#112D4E]">
                      {t.division_training}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#50688C]">{t.by}</TableCell>
                  {/* <TableCell className="whitespace-nowrap text-[#50688C]">{t.date}</TableCell> */}
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title="Detail & peserta"
                        onClick={() => navigate(`/trainings/${t.id}`)}
                        className="text-[#112D4E] hover:bg-[#DBE2EF]"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title="Edit"
                        onClick={() => onEdit(t)}
                        className="text-[#3F72AF] hover:bg-[#DBE2EF]"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title="Hapus"
                        onClick={() => onDelete(t)}
                        className="text-[#B3261E] hover:bg-[#FDECEA]"
                      >
                        <Trash2 size={16} />
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

export default TableTraining;