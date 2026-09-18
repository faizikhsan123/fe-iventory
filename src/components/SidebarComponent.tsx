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
    `flex items-center px-2 py-1.5 text-body rounded-base group ${
      pathname === path ? "bg-blue-600 rounded-md text-white" : "text-white hover:bg-neutral-tertiary hover:text-fg-brand"
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
        className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default bg-[#000042] flex flex-col">
          <Link
            to={"/dashboard"}
            className="flex items-center ps-2.5 mb-5"
          >
            <div className="w-9 h-9 rounded-base bg-blue-600 flex items-center justify-center me-3 shrink-0">
              <Shield
                size={18}
                className="text-white"
              />
            </div>
            <span className="min-w-0">
              <span className="block text-lg text-heading font-semibold leading-tight whitespace-nowrap text-white">
                PT. Industri
              </span>
              <span className="block text-xs text-gray-400 leading-tight whitespace-nowrap">Inventory System</span>
            </span>
          </Link>

          <ul className="mx-2 mb-1">
            <h1 className="text-xs text-gray-500 uppercase tracking-wider">Menu Utama</h1>
          </ul>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to={"/dashboard"}
                className={linkClass("/dashboard")}
              >
                <LayoutDashboard />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/items"}
                className={linkClass("/items")}
              >
                <BoxIcon />
                <span className="flex-1 ms-3 whitespace-nowrap">Master Barang</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/supplier"}
                className={linkClass("/supplier")}
              >
                <BookUser />
                <span className="flex-1 ms-3 whitespace-nowrap">Master Supplier</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/employes"}
                className={linkClass("/employes")}
              >
                <UserStar />
                <span className="flex-1 ms-3 whitespace-nowrap">Master Karyawan</span>
              </Link>
            </li>
          </ul>

          <ul className="mx-2 mt-5 mb-1">
            <h1 className="text-xs text-gray-500 uppercase tracking-wider">Transaksi</h1>
          </ul>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to={"/stock-masuk"}
                className={linkClass("/stock-masuk")}
              >
                <ArrowUp />
                <span className="ms-3">Tambah Stock</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/stock-keluar"}
                className={linkClass("/stock-keluar")}
              >
                <ArrowDown />
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

          <ul className="mx-2 mt-5 mb-1">
            <h1 className="text-xs text-gray-500 uppercase tracking-wider">Laporan & Admin</h1>
          </ul>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to={"/laporan"}
                className={linkClass("/laporan")}
              >
                <ChartNoAxesColumn />
                <span className="ms-3">Laporan</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/activity-log"}
                className={linkClass("/activity-log")}
              >
                <ActivityIcon />
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

          <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4 px-2">
            <CircleUser
              size={40}
              color="white"
            />
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">Budi Santoso</p>
              <p className="text-gray-400 text-xs truncate">Admin Inventory</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidebarComponent;
