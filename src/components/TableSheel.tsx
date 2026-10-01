import type { ReactNode } from "react";

interface TableShellProps {
  children: ReactNode;
}

const TableShell = ({ children }: TableShellProps) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#DBE2EF] bg-white shadow-[0_2px_10px_rgb(17,45,78,0.06)] sm:rounded-xl">
      <div className="w-full overflow-x-auto overscroll-x-contain">
        <table
          className="min-w-[640px] w-full text-left
            [&_thead]:bg-[#DBE2EF] [&_thead]:text-[#112D4E]
            [&_tbody]:divide-y [&_tbody]:divide-[#DBE2EF] [&_tbody]:text-[#112D4E]
            [&_tbody_tr:hover]:bg-[#F9F7F7]"
        >
          {children}
        </table>
      </div>
    </div>
  );
};

export default TableShell;