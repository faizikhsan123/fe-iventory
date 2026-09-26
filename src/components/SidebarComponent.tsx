// SidebarComponent.tsx
import {
  ActivityIcon,
  ArrowDown,
  ArrowUp,
  BookUser,
  BoxIcon,
  ChartNoAxesColumn,
  CircleUser,
  LayoutDashboard,
  Shield,
  // Undo2,
  UserStar,
} from "lucide-react";
import { Link, useLocation } from "react-router";

const SidebarComponent = () => {
  const { pathname } = useLocation();

  // helper kecil biar gak nulis ternary panjang di tiap <Link>
  const linkClass = (path: string) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
      pathname === path
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div>
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M5 7h14M5 12h14M5 17h10"
          />
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0 border-e border-white/10"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#000042] flex flex-col">
          <Link
            to={"/dashboard"}
            className="flex items-center ps-2.5 mb-6"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center me-3 shrink-0">
              <Shield
                size={18}
                className="text-white"
              />
            </div>
            <span className="min-w-0">
              <span className="block text-lg font-semibold leading-tight whitespace-nowrap text-white">
                PT. Vando
              </span>
              <span className="block text-xs text-slate-400 leading-tight whitespace-nowrap">Inventory Gresik</span>
            </span>
          </Link>

          <ul className="mx-2 mb-2">
            <h1 className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Menu Utama</h1>
          </ul>
          <ul className="space-y-1 font-medium">
            <li>
              <Link
                to={"/dashboard"}
                className={linkClass("/dashboard")}
              >
                <LayoutDashboard size={18} />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/items"}
                className={linkClass("/items")}
              >
                <BoxIcon size={18} />
                <span className="flex-1 ms-3 whitespace-nowrap">Master Barang</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/supplier"}
                className={linkClass("/supplier")}
              >
                <BookUser size={18} />
                <span className="flex-1 ms-3 whitespace-nowrap">Master Supplier</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/employes"}
                className={linkClass("/employes")}
              >
                <UserStar size={18} />
                <span className="flex-1 ms-3 whitespace-nowrap">Master Karyawan</span>
              </Link>
            </li>
          </ul>

          <ul className="mx-2 mt-6 mb-2">
            <h1 className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Transaksi</h1>
          </ul>
          <ul className="space-y-1 font-medium">
            <li>
              <Link
                to={"/stock-masuk"}
                className={linkClass("/stock-masuk")}
              >
                <ArrowUp size={18} />
                <span className="ms-3">Tambah Stock</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/stock-keluar"}
                className={linkClass("/stock-keluar")}
              >
                <ArrowDown size={18} />
                <span className="flex-1 ms-3 whitespace-nowrap">Barang Keluar</span>
              </Link>
            </li>
            {/* <li>
              <Link
                to={"/return-barang"}
                className={linkClass("/return-barang")}
              >
                <Undo2 />
                <span className="flex-1 ms-3 whitespace-nowrap">Return Barang</span>
              </Link>
            </li> */}
          </ul>

          <ul className="mx-2 mt-6 mb-2">
            <h1 className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Laporan & Admin</h1>
          </ul>
          <ul className="space-y-1 font-medium">
            <li>
              <Link
                to={"/laporan"}
                className={linkClass("/laporan")}
              >
                <ChartNoAxesColumn size={18} />
                <span className="ms-3">Laporan</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/activity-log"}
                className={linkClass("/activity-log")}
              >
                <ActivityIcon size={18} />
                <span className="flex-1 ms-3 whitespace-nowrap">Activity Log</span>
              </Link>
            </li>
            {/* <li>
              <Link
                to={"/user-management"}
                className={linkClass("/user-management")}
              >
                <UserCog />
                <span className="flex-1 ms-3 whitespace-nowrap">User Management</span>
              </Link>
            </li> */}
            {/* <li>
              <Link
                to={"/settings"}
                className={linkClass("/settings")}
              >
                <Settings />
                <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
              </Link>
            </li> */}
          </ul>

        </div>
      </aside>
    </div>
  );
};

export default SidebarComponent;