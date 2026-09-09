import {
  ActivityIcon,
  ArrowDown,
  ArrowUp,
  BookUser,
  BoxIcon,
  ChartNoAxesColumn,
  CircleUser,
  LayoutDashboard,
  UserStar,
} from "lucide-react";
import { Link } from "react-router";
const SidebarComponent = () => {
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
          <a
            href="https://flowbite.com/"
            className="flex items-center ps-2.5 mb-5"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 me-3"
              alt="Flowbite Logo"
            />
            <span className="self-center text-lg text-heading font-semibold whitespace-nowrap text-white">
              Iventory Controller
            </span>
          </a>
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className=" text-white flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <LayoutDashboard />
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <Link
                to={"/items"}
                className="text-white flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <BoxIcon></BoxIcon>
                <span className="flex-1 ms-3 whitespace-nowrap">Master Barang</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/supplier"}
                className=" text-white flex items-center px-2 py-1.5 text-body rounded-base hover:bg-blue-600 hover:text-white group"
              >
                <BookUser />
                <span className="flex-1 ms-3 whitespace-nowrap">Master Supplier</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/employes"}
                className="text-white flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <UserStar />
                <span className="flex-1 ms-3 whitespace-nowrap">Employes</span>
              </Link>
            </li>
          </ul>

          <ul className="text-center mx-2 my-2">
            <h1 className="text-1xl text-gray-300">Transaksi</h1>
          </ul>
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className=" text-white flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <ArrowUp />
                <span className="ms-3">Tambah Stock</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-white flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <ArrowDown />
                <span className="flex-1 ms-3 whitespace-nowrap">Barang Keluar</span>
              </a>
            </li>
          </ul>
          <ul className="text-center mx-2 my-2 ">
            <h1 className="text-1xl text-gray-300">Laporan & Admin</h1>
          </ul>
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className=" text-white flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <ChartNoAxesColumn />
                <span className="ms-3">Laporan</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-white flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <ActivityIcon />
                <span className="flex-1 ms-3 whitespace-nowrap">Actity Log</span>
              </a>
            </li>
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
