import { LogOut, User } from "lucide-react";

type NavbarProps = {
  title: string;
};

const Navbar = ({ title }: NavbarProps) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
      <h1 className="text-xl font-bold text-black shrink-0">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-black leading-tight">Budi Santoso</p>
            <p className="text-xs text-slate-400">Admin Inventory</p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
