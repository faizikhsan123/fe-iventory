import type { ReactNode } from "react";

const TableShell = ({ children }: { children: ReactNode }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
    <div className="overflow-x-auto">{children}</div>
  </div>
);

export default TableShell;