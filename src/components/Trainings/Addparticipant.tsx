import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, Search, Users } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import useGetEmployes from "@/hooks/employes/getEmployes";
import AddParticipantsHooks from "@/hooks/Trainingparticipant/create";

type Props = {
  open: boolean;
  trainingId: number;
  existingIds: number[]; // employes_id yang sudah jadi peserta
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const initials = (name?: string | null) => (name ? name.trim().slice(0, 2).toUpperCase() : "?");

const AddParticipants = ({ open, trainingId, existingIds, onOpenChange, onSuccess }: Props) => {
  const { loadingAdd, errorAdd, handleAdd, setErrorAdd } = AddParticipantsHooks();
  const { getEmployesButton, data } = useGetEmployes();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (open) {
      getEmployesButton();
      setErrorAdd("");
    } else {
      setSelected([]);
      setQ("");
      setDate("");
    }
  }, [open, getEmployesButton, setErrorAdd]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return data;
    return data.filter((e) =>
      `${e.user?.name ?? ""} ${e.division ?? ""} ${e.position ?? ""}`.toLowerCase().includes(k),
    );
  }, [data, q]);

  const selectable = filtered.filter((e) => !existingIds.includes(e.id));
  const allSelected = selectable.length > 0 && selectable.every((e) => selected.includes(e.id));

  const toggle = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  const toggleAll = () => {
    const ids = selectable.map((e) => e.id);
    setSelected((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids])),
    );
  };

  const submit = async () => {
    if (selected.length === 0 || !date) return;
    const ok = await handleAdd(trainingId, selected, date);
    if (ok) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 shadow-[0_10px_30px_rgb(17,45,78,0.18)] sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Tambah Peserta</DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-[#50688C]">
                Pilih karyawan yang ikut training ini
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {/* Tanggal pelaksanaan */}
          <div className="space-y-2">
            <Label htmlFor="participant_date" className="text-sm font-semibold text-[#112D4E]">
              Tanggal Pelaksanaan <span className="text-[#B3261E]">*</span>
            </Label>
            <Input
              id="participant_date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loadingAdd}
              className="h-11 w-full rounded-lg border border-[#BFCCE3] bg-white text-sm text-[#112D4E] outline-none focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF]"
            />
            <p className="text-xs text-[#50688C]">
              Berlaku untuk semua yang dipilih, bisa diubah per orang nanti
            </p>
          </div>

          {/* Search + pilih semua */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3F72AF]"
                size={15}
              />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari karyawan..."
                disabled={loadingAdd}
                className="h-10 w-full rounded-lg border border-[#BFCCE3] bg-white pl-9 text-sm text-[#112D4E] outline-none focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF]"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={toggleAll}
              disabled={loadingAdd || selectable.length === 0}
              className="h-10 shrink-0 rounded-lg border-[#BFCCE3] bg-white px-3 text-xs font-semibold text-[#112D4E] hover:bg-[#DBE2EF]"
            >
              {allSelected ? "Hapus semua" : "Pilih semua"}
            </Button>
            <span className="shrink-0 rounded-full bg-[#112D4E] px-2.5 py-1 text-xs font-semibold text-white">
              {selected.length} dipilih
            </span>
          </div>

          {/* List karyawan */}
          <div className="max-h-72 divide-y divide-[#EBEFF6] overflow-y-auto rounded-lg border border-[#BFCCE3]">
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-[#7B8FAE]">Karyawan tidak ditemukan</p>
            )}

            {filtered.map((employee) => {
              const already = existingIds.includes(employee.id);
              const checked = already || selected.includes(employee.id);
              return (
                <label
                  key={employee.id}
                  htmlFor={`participant-${employee.id}`}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                    already
                      ? "cursor-not-allowed bg-[#F9F7F7] opacity-60"
                      : checked
                        ? "cursor-pointer bg-[#DBE2EF]/60"
                        : "cursor-pointer hover:bg-[#F9F7F7]"
                  }`}
                >
                  <Checkbox
                    id={`participant-${employee.id}`}
                    checked={checked}
                    onCheckedChange={() => !already && toggle(employee.id)}
                    disabled={loadingAdd || already}
                  />
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#112D4E] text-xs font-bold text-white">
                    {initials(employee.user?.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#112D4E]">
                      {employee.user?.name ?? "-"}
                    </p>
                    <p className="truncate text-xs text-[#50688C]">
                      {employee.division ?? "-"} · {employee.position ?? "-"}
                    </p>
                  </div>
                  {already && (
                    <span className="shrink-0 rounded-full bg-[#DBE2EF] px-2 py-0.5 text-[10px] font-semibold text-[#112D4E]">
                      Sudah peserta
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {errorAdd && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{errorAdd}</span>
            </div>
          )}
        </div>

        <DialogFooter className="m-0 shrink-0 flex-col-reverse gap-2 rounded-none border-t border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:flex-row sm:justify-end sm:gap-2 sm:px-6">
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={loadingAdd}
                className="h-11 w-full rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF] sm:w-auto"
              >
                Batal
              </Button>
            }
          />
          <Button
            type="button"
            onClick={submit}
            disabled={loadingAdd || selected.length === 0 || !date}
            className="h-11 w-full gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240] disabled:opacity-60 sm:w-auto"
          >
            {loadingAdd ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              `Tambah ${selected.length || ""} Peserta`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddParticipants;