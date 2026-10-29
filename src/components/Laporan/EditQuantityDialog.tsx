import { useState } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import FormAlert from "../common/FormAlert";
import { compactInputClass } from "@/lib/formStyles";
import { useUpdateQuantity, type QuantityTarget } from "@/hooks/Laporan/updateQuantity";

export interface EditQuantityState {
  target: QuantityTarget;
  itemName: string;
  currentQty: number;
  unit?: string;
  // "out" = stock out (higher qty lowers stock), "in" = stock in (higher qty raises stock)
  type: "in" | "out";
}

interface Props {
  state: EditQuantityState | null;
  onClose: () => void;
  onSaved: () => void;
}

const MAX_QTY = 1_000_000;

function impactText(type: "in" | "out", current: number, next: number): string | null {
  if (next === current) return null;
  const diff = Math.abs(next - current);
  const stockUp = type === "in" ? next > current : next < current;
  return `Stock will ${stockUp ? "increase" : "decrease"} by ${diff}`;
}

function Form({ state, onClose, onSaved }: { state: EditQuantityState; onClose: () => void; onSaved: () => void }) {
  const [value, setValue] = useState(String(state.currentQty));
  const [error, setError] = useState("");
  const { saving, updateQuantity } = useUpdateQuantity();

  const parsed = /^\d+$/.test(value.trim()) ? Number(value) : null;
  const valid = parsed !== null && parsed >= 1 && parsed <= MAX_QTY;
  const impact = valid ? impactText(state.type, state.currentQty, parsed) : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setError(`Quantity must be a whole number between 1 and ${MAX_QTY.toLocaleString("en-US")}`);
      return;
    }
    setError("");
    const { result, error: serverError } = await updateQuantity(state.target, parsed);
    if (serverError || !result) {
      setError(serverError ?? "Failed to update quantity");
      return;
    }
    onClose();
    onSaved();
    Swal.fire({
      icon: "success",
      title: result.delta === 0 ? "Quantity unchanged" : "Quantity updated",
      text: `Current stock: ${result.current_stock}`,
      timer: 1800,
      showConfirmButton: false,
    });
  };

  return (
    <>
      <DialogHeader className="border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
        <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Edit Quantity</DialogTitle>
        <DialogDescription className="break-words text-sm text-[#50688C]">{state.itemName}</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4 p-4 sm:p-6" noValidate>
        <p className="text-sm text-[#50688C]">
          Current quantity:{" "}
          <b className="text-[#112D4E]">
            {state.currentQty} {state.unit ?? ""}
          </b>
        </p>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-[#112D4E]">New quantity *</span>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_QTY}
            step={1}
            autoFocus
            className={compactInputClass}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            aria-invalid={!valid}
          />
        </label>

        {impact && (
          <p
            className="rounded-lg border border-[#BFCCE3] bg-[#F9F7F7] px-3 py-2 text-sm font-medium text-[#112D4E]"
            aria-live="polite"
          >
            {impact}
          </p>
        )}

        <FormAlert message={error} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={onClose}
            className="h-11 rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving || !valid}
            className="h-11 gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

export default function EditQuantityDialog({ state, onClose, onSaved }: Props) {
  return (
    <Dialog open={!!state} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-md">
        {state && (
          <Form key={`${state.target.kind}-${state.target.id}`} state={state} onClose={onClose} onSaved={onSaved} />
        )}
      </DialogContent>
    </Dialog>
  );
}
