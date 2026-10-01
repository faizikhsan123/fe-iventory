import { Plus } from "lucide-react";

interface SambutanProps {
  paragraf1: string;
  paragraf2: string;
  button?: string;
  onclick?: () => void;
}

const SambutanComponent = ({
  paragraf1,
  paragraf2,
  button,
  onclick,
}: SambutanProps) => {
  return (
    <section
      className="relative mb-5 overflow-hidden rounded-lg bg-[#112D4E] sm:mb-6 sm:rounded-xl"
      style={{
        backgroundImage:
          "linear-gradient(to right, #1B3F68 1px, transparent 1px), linear-gradient(to bottom, #1B3F68 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }}
    >
      <div className="relative flex flex-col gap-5 p-5 pb-6 sm:p-7 sm:pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
            {paragraf1}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#DBE2EF] sm:text-base">
            {paragraf2}
          </p>
        </div>

        {button && (
          <button
            onClick={onclick}
            type="button"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#F9F7F7] px-5 text-sm font-extrabold text-[#112D4E] outline-none transition hover:bg-[#DBE2EF] focus-visible:ring-4 focus-visible:ring-[#9DB2D3] active:scale-[0.98] sm:w-auto lg:min-w-[150px]"
          >
            <Plus className="h-4 w-4" />
            {button.replace(/^\+\s*/, "")}
          </button>
        )}
      </div>

      {/* Pita palet */}
      <div className="absolute inset-x-0 bottom-0 flex h-1.5" aria-hidden="true">
        <span className="h-full flex-[4] bg-[#F9F7F7]" />
        <span className="h-full flex-[3] bg-[#DBE2EF]" />
        <span className="h-full flex-[2] bg-[#3F72AF]" />
      </div>
    </section>
  );
};

export default SambutanComponent;