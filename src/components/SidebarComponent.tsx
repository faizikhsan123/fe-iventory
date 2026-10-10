import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import {
  ActivityIcon,
  ArrowDown,
  ArrowUp,
  BookUser,
  BoxIcon,
  FileClock,
  GraduationCap,
  ClipboardList,
  Receipt,
  Stethoscope,
  ChartNoAxesColumn,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Shield,
  UsersRound,
  UserStar,
  X,
  type LucideIcon,
} from "lucide-react";
import { UseLogout } from "@/hooks/auth/logout";
import { useAuth } from "@/hooks/auth/useAuth";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, hover #1B406B, garis #25476F,
           redup di navy #9DB2D3, aksen terang #8FB0DC
*/

interface MenuItem {
  to: string;
  label: string;
  icon: LucideIcon;
  also?: string[]; // path lain yang dianggap "aktif" untuk menu ini
}

const mainMenu: MenuItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, also: ["/"] },
  { to: "/items", label: "Master Barang", icon: BoxIcon, also: ["/create-items", "/update-items"] },
  { to: "/supplier", label: "Master Supplier", icon: BookUser },
  { to: "/employes", label: "Master Karyawan", icon: UserStar },
  { to: "/groups", label: "Master Groups", icon: UsersRound },
  { to: "/trainings", label: "Master Training", icon: GraduationCap },
  { to: "/contracts", label: "Contract", icon: FileClock },
  { to: "/mcu", label: "Master MCU", icon: Stethoscope },
  { to: "/rfq", label: "Log RFQ", icon: ClipboardList },
  { to: "/invoices", label: "Status Invoicing", icon: Receipt },
];

const trxMenu: MenuItem[] = [
  { to: "/stock-masuk", label: "Tambah Stock", icon: ArrowUp },
  { to: "/stock-keluar", label: "Barang Keluar", icon: ArrowDown },
];

const reportMenu: MenuItem[] = [
  { to: "/laporan", label: "Laporan", icon: ChartNoAxesColumn },
  { to: "/activity-log", label: "Activity Log", icon: ActivityIcon },
];

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase tracking-wider text-[#8FB0DC] first:mt-0">
    {children}
  </p>
);

const SidebarComponent = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { loadingLogout, handleLogout } = UseLogout();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.roles?.includes("admin");

  // inisial dari nama, misal "Faiz Ikhsan" -> "FI"
  const inisial = (user?.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // tutup drawer saat pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape untuk tutup + kunci scroll body saat drawer terbuka
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // tutup drawer kalau layar dibesarkan ke desktop
  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isActive = (to: string, also: string[] = []) => {
    const current = pathname.toLowerCase();
    return [to, ...also].some((p) =>
      p === "/" ? current === "/" : current === p || current.startsWith(p + "/")
    );
  };

  const renderMenu = (items: MenuItem[]) => (
    <ul className="space-y-1">
      {items.map(({ to, label, icon: Icon, also }) => {
        const active = isActive(to, also);
        return (
          <li key={to}>
            <Link
              to={to}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#8FB0DC] ${
                active
                  ? "bg-[#F9F7F7] text-[#112D4E]"
                  : "text-[#DBE2EF] hover:bg-[#1B406B] hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute -left-3 bottom-2 top-2 w-1 rounded-r-full bg-[#8FB0DC]" />
              )}
              <Icon size={18} className={`shrink-0 ${active ? "text-[#3F72AF]" : ""}`} />
              <span className="truncate">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Top bar khusus mobile/tablet */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#DBE2EF] bg-white px-3 sm:px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-lg border border-[#BFCCE3] bg-[#F9F7F7] text-[#112D4E] outline-none transition active:bg-[#DBE2EF] focus-visible:ring-2 focus-visible:ring-[#3F72AF]"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#112D4E]">
            <Shield size={16} className="text-white" />
          </div>
          <span className="truncate font-extrabold text-[#112D4E]">PT. Vando </span>
        </div>

        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#DBE2EF] text-xs font-bold text-[#112D4E]">
          {inisial}
        </div>
      </header>

      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-[#0B2240]/70 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-[#112D4E] transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#25476F] px-4 py-4">
          <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#F9F7F7]">
            <img src="../../public/vando1.webp" alt="" />
            </div>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-md font-extrabold text-white mt-2">PT. Vando Teknik Solusi</span>
              <span className="block truncate text-xs text-[#9DB2D3] mt-1">Inventory Gresik</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#DBE2EF] transition hover:bg-[#1B406B] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu (scroll sendiri kalau layar pendek) */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <SectionTitle>Menu utama</SectionTitle>
          {renderMenu(mainMenu)}

          {isAdmin && (
            <>
              <SectionTitle>Transaksi</SectionTitle>
              {renderMenu(trxMenu)}
            </>
          )}

          <SectionTitle>Laporan &amp; admin</SectionTitle>
          {renderMenu(reportMenu)}
        </nav>

        {/* Profil + logout */}
        <div className="shrink-0 border-t border-[#25476F] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 rounded-lg bg-[#0B2240] p-2.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DBE2EF] text-sm font-bold text-[#112D4E]">
              {inisial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name ?? "-"}</p>
              <p className="truncate text-xs capitalize text-[#9DB2D3]">{user?.roles?.[0] ?? "-"}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loadingLogout}
              title="Logout"
              aria-label="Logout"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#DBE2EF] transition hover:bg-[#1B406B] hover:text-white disabled:opacity-50"
            >
              {loadingLogout ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarComponent;