import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import type { TrainingParticipant } from "@/types/TrainingParticipant";
import UpdateParticipantHooks from "@/hooks/Trainingparticipant/upload";

type Props = {
  open: boolean;
  participant: TrainingParticipant | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["application/pdf", "image/jpeg", "image/png"];

const inputClass =
  "h-11 w-full rounded-lg border border-[#BFCCE3] bg-white text-sm text-[#112D4E] outline-none focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF]";

const EditParticipant = ({ open, participant, onOpenChange, onSuccess }: Props) => {
  const { loadingUpdate, errorUpdate, handleUpdate, setErrorUpdate } = UpdateParticipantHooks();
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (open) {
      setDate(participant?.date_raw ?? "");
      setFile(null);
      setNotes(participant?.notes ?? "");
      setLocalError("");
      setErrorUpdate("");
    }
  }, [open, participant, setErrorUpdate]);

  const onPick = (f: File | null) => {
    setLocalError("");
    if (!f) return setFile(null);
    if (!ALLOWED.includes(f.type)) {
      setFile(null);
      return setLocalError("Format harus PDF, JPG, atau PNG");
    }
    if (f.size > MAX_SIZE) {
      setFile(null);
      return setLocalError("Ukuran file maksimal 5 MB");
    }
    setFile(f);
  };

  const submit = async () => {
    if (!participant) return;
    if (!date) return setLocalError("Tanggal pelaksanaan wajib diisi");

    const ok = await handleUpdate(participant.id, { date, notes: notes.trim(), file });
    if (ok) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const error = localError || errorUpdate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-md">
        <DialogHeader className="border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
              <Pencil className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Edit Data Peserta</DialogTitle>
              <DialogDescription className="mt-0.5 truncate text-sm text-[#50688C]">
                {participant?.name ?? "-"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="edit_date" className="text-sm font-semibold text-[#112D4E]">
              Tanggal Pelaksanaan <span className="text-[#B3261E]">*</span>
            </Label>
            <Input
              id="edit_date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loadingUpdate}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_file" className="text-sm font-semibold text-[#112D4E]">
              File pendukung
            </Label>
            <Input
              id="edit_file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
              disabled={loadingUpdate}
              className={inputClass}
            />
            <p className="text-xs text-[#50688C]">
              {participant?.file
                ? "Sudah ada file. Kosongkan kalau nggak mau diganti."
                : "Belum ada file."}{" "}
              PDF / JPG / PNG, maks 5 MB.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_notes" className="text-sm font-semibold text-[#112D4E]">
              Catatan
            </Label>
            <Input
              id="edit_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opsional"
              maxLength={255}
              disabled={loadingUpdate}
              className={inputClass}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="m-0 flex-col-reverse gap-2 rounded-none border-t border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:flex-row sm:justify-end sm:gap-2 sm:px-6">
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={loadingUpdate}
                className="h-11 w-full rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF] sm:w-auto"
              >
                Batal
              </Button>
            }
          />
          <Button
            type="button"
            onClick={submit}
            disabled={loadingUpdate}
            className="h-11 w-full gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240] disabled:opacity-60 sm:w-auto"
          >
            {loadingUpdate ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditParticipant;