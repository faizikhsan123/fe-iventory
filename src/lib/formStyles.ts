// Kelas Tailwind form yang dipakai bersama (satu sumber, tidak disalin per dialog).
// Field solid putih; text-base di HP supaya iOS tidak auto-zoom.
export const fieldBase =
  "w-full rounded-lg border border-[#BFCCE3] bg-white px-3 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF] disabled:cursor-not-allowed disabled:bg-[#DBE2EF] disabled:opacity-70 sm:text-sm";

export const inputClass = `h-11 ${fieldBase}`;
export const compactInputClass = `h-10 ${fieldBase}`;
export const selectClass = `flex h-11 items-center ${fieldBase}`;
export const textareaClass = `min-h-24 py-2 ${fieldBase}`;
export const fileClass = `h-11 cursor-pointer py-1.5 ${fieldBase} file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#DBE2EF] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#112D4E]`;
export const labelClass = "text-sm font-semibold text-[#112D4E]";

export const searchInputClass =
  "h-11 w-full rounded-lg border border-[#9DB2D3] bg-white pl-10 pr-9 text-base text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#F9F7F7] sm:text-sm";

export const iconButtonClass =
  "h-10 w-10 rounded-lg border border-[#BFCCE3] bg-white p-0 text-[#112D4E] hover:bg-[#DBE2EF] disabled:opacity-50";
export const dangerIconButtonClass = `${iconButtonClass} hover:border-[#F2B8B5] hover:bg-[#FDECEA]`;
