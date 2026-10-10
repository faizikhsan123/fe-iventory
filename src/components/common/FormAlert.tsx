import { AlertCircle } from "lucide-react";

const FormAlert = ({ message }: { message?: string }) =>
  message ? (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="min-w-0 break-words">{message}</span>
    </div>
  ) : null;

export default FormAlert;
