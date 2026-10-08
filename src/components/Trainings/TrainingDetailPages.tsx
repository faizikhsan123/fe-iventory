import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ExternalLink, Loader2, Pencil, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { TrainingParticipant } from "@/types/TrainingParticipant";
import ViewParticipantFileHooks from "@/hooks/Trainingparticipant/view";
import UseShowTraining from "@/hooks/Training/show";
import UseGetParticipants from "@/hooks/Trainingparticipant/get";
import AddParticipants from "./Addparticipant";
import EditParticipant from "./UploadParticipantFile";
import DeleteParticipant from "./DeleteParticipant";


const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div className="min-w-0">
    <p className="text-xs font-semibold uppercase tracking-wide text-[#50688C]">{label}</p>
    <p className="mt-0.5 truncate text-sm font-semibold text-[#112D4E]">{value ?? "-"}</p>
  </div>
);

const TrainingDetailPages = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: training, loading: loadingTraining, error: errorTraining, getTraining } = UseShowTraining();
  const { data: participants, loading, error, getParticipants } = UseGetParticipants();
  const { loadingView, errorView, handleView } = ViewParticipantFileHooks();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TrainingParticipant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrainingParticipant | null>(null);

  const refresh = () => {
    if (id) getParticipants(id);
  };

  useEffect(() => {
    if (!id) return;
    getTraining(id);
    getParticipants(id);
  }, [id, getTraining, getParticipants]);

  if (!id) return null;

  return (
    <div>
      <Navbar title="Detail Training" />

      <SambutanComponent
        paragraf1={training?.name_training ?? "Detail Training"}
        paragraf2="Kelola peserta dan file pendukung"
        button="+ Tambah Peserta"
        onclick={() => setIsAddOpen(true)}
      />

      <div className="space-y-4 p-4 sm:p-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/trainings")}
          className="h-10 gap-2 rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF]"
        >
          <ArrowLeft size={16} /> Kembali
        </Button>

        {/* Info training */}
        <div className="rounded-xl border border-[#BFCCE3] bg-white p-4 sm:p-5">
          {loadingTraining ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#50688C]" />
          ) : errorTraining ? (
            <p className="text-sm text-[#B3261E]">{errorTraining}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoItem label="ID Training" value={training?.id_training} />
              <InfoItem label="Nama" value={training?.name_training} />
              <InfoItem label="Divisi" value={training?.division_training} />
              <InfoItem label="Dibuat Oleh" value={training?.created_by} />
            </div>
          )}
        </div>

        {/* Tabel peserta */}
        <h2 className="text-base font-bold text-[#112D4E]">Peserta ({participants.length})</h2>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {errorView && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorView}</span>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-[#BFCCE3] bg-white">
          <Table>
            <TableHeader className="bg-[#DBE2EF]">
              <TableRow>
                <TableHead className="font-bold text-[#112D4E]">Nama</TableHead>
                <TableHead className="font-bold text-[#112D4E]">Divisi</TableHead>
                <TableHead className="font-bold text-[#112D4E]">Jabatan</TableHead>
                <TableHead className="font-bold text-[#112D4E]">Tanggal</TableHead>
                <TableHead className="font-bold text-[#112D4E]">File</TableHead>
                <TableHead className="font-bold text-[#112D4E]">Catatan</TableHead>
                <TableHead className="text-right font-bold text-[#112D4E]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-[#50688C]">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : participants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-[#7B8FAE]">
                    Belum ada peserta
                  </TableCell>
                </TableRow>
              ) : (
                participants.map((p) => (
                  <TableRow key={p.id} className="hover:bg-[#F9F7F7]">
                    <TableCell className="font-semibold text-[#112D4E]">{p.name ?? "-"}</TableCell>
                    <TableCell className="text-[#50688C]">{p.division ?? "-"}</TableCell>
                    <TableCell className="text-[#50688C]">{p.position ?? "-"}</TableCell>
                    <TableCell className="whitespace-nowrap text-[#50688C]">{p.date ?? "-"}</TableCell>
                    <TableCell>
                      {p.file ? (
                        <button
                          type="button"
                          onClick={() => handleView(p.id)}
                          disabled={loadingView}
                          className="inline-flex items-center gap-1 rounded-full bg-[#DBE2EF] px-2.5 py-1 text-xs font-semibold text-[#112D4E] hover:bg-[#BFCCE3] disabled:opacity-60"
                        >
                          Lihat <ExternalLink size={12} />
                        </button>
                      ) : (
                        <span className="rounded-full bg-[#FDECEA] px-2.5 py-1 text-xs font-semibold text-[#B3261E]">
                          Belum upload
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-[#50688C]">{p.notes ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          title="Edit tanggal / file / catatan"
                          onClick={() => setEditTarget(p)}
                          className="text-[#3F72AF] hover:bg-[#DBE2EF]"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          title="Hapus peserta"
                          onClick={() => setDeleteTarget(p)}
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

      <AddParticipants
        open={isAddOpen}
        trainingId={Number(id)}
        existingIds={participants.map((p) => p.employes_id)}
        onOpenChange={setIsAddOpen}
        onSuccess={refresh}
      />

      <EditParticipant
        open={editTarget !== null}
        participant={editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
        onSuccess={refresh}
      />

      <DeleteParticipant
        open={deleteTarget !== null}
        participant={deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onSuccess={refresh}
      />
    </div>
  );
};

export default TrainingDetailPages;