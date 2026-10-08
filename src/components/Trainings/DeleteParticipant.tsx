import { useEffect } from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

import type { TrainingParticipant } from "@/types/TrainingParticipant";
import DeleteParticipantHooks from "@/hooks/Trainingparticipant/delete";

type Props = {
  open: boolean;
  participant: TrainingParticipant | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const DeleteParticipant = ({ open, participant, onOpenChange, onSuccess }: Props) => {
  const { loadingDelete, errorDelete, handleDelete, setErrorDelete } = DeleteParticipantHooks();

  useEffect(() => {
    if (open) setErrorDelete("");
  }, [open, setErrorDelete]);

  const confirm = async () => {
    if (!participant) return;
    const ok = await handleDelete(participant.id);
    if (ok) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-md">
        <DialogHeader className="border-b border-[#F2B8B5] bg-[#FDECEA] px-4 py-4 pr-12 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#B3261E] text-white">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Hapus Peserta</DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-[#50688C]">
                File pendukungnya ikut terhapus
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 p-4 sm:p-6">
          <p className="text-sm text-[#112D4E]">
            Yakin mau hapus <b>{participant?.name}</b> dari training ini?
          </p>
          {errorDelete && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{errorDelete}</span>
            </div>
          )}
        </div>

        <DialogFooter className="m-0 flex-col-reverse gap-2 rounded-none border-t border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:flex-row sm:justify-end sm:gap-2 sm:px-6">
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={loadingDelete}
                className="h-11 w-full rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF] sm:w-auto"
              >
                Batal
              </Button>
            }
          />
          <Button
            type="button"
            onClick={confirm}
            disabled={loadingDelete}
            className="h-11 w-full gap-2 rounded-lg bg-[#B3261E] px-5 font-bold text-white hover:bg-[#8C1D18] disabled:opacity-60 sm:w-auto"
          >
            {loadingDelete ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteParticipant;