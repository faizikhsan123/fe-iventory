import { Plus, Sparkles } from "lucide-react";

interface SambutanProps {
  paragraf1: string;
  paragraf2: string;
  button?: string;
  onclick?: () => void;
}

const SambutanComponent = ({ paragraf1, paragraf2, button, onclick }: SambutanProps) => {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-xl shadow-indigo-500/20 sm:p-7">
      {/* dekorasi */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Kelola dengan mudah
          </span>
          <h2 className="text-xl font-extrabold leading-tight sm:text-2xl">{paragraf1}</h2>
          <p className="mt-1 max-w-xl text-sm text-indigo-100 sm:text-base">{paragraf2}</p>
        </div>

        {button && (
          <button
            onClick={onclick}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-xl active:translate-y-0 active:scale-95 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {button.replace(/^\+\s*/, "")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SambutanComponent;