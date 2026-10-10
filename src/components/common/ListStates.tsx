import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export const ListSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="divide-y divide-[#DBE2EF]" aria-busy="true">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex animate-pulse items-center gap-3 p-4 sm:px-6">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-[#DBE2EF]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-[#DBE2EF]" />
          <div className="h-3 w-2/3 rounded bg-[#EBEFF6]" />
        </div>
      </div>
    ))}
  </div>
);

export const ListError = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
    <AlertCircle size={32} className="text-[#B3261E]" />
    <p className="text-sm font-medium text-[#B3261E]">{message}</p>
  </div>
);

export const ListEmpty = ({ icon, title, hint }: { icon: ReactNode; title: string; hint?: string }) => (
  <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
    <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#DBE2EF] text-[#3F72AF]">{icon}</div>
    <p className="font-semibold text-[#112D4E]">{title}</p>
    {hint && <p className="text-sm text-[#50688C]">{hint}</p>}
  </div>
);
