import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  PackageMinus,
  Truck,
  Users,
  History,
  FileBarChart,
  LogOut,
  Menu,
  X,
  HardHat,
} from "lucide-react";

const menus = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/items", label: "Barang", icon: Package },
  { to: "/stock-masuk", label: "Stock Masuk", icon: PackagePlus },
  { to: "/stock-keluar", label: "Stock Keluar", icon: PackageMinus },
  { to: "/supplier", label: "Supplier", icon: Truck },
  { to: "/employes", label: "Karyawan", icon: Users },
  { to: "/Activity-log", label: "Aktivitas", icon: History },
  { to: "/laporan", label: "Laporan", icon: FileBarChart },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // tutup drawer saat pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // tutup dengan tombol Escape + kunci scroll body saat drawer terbuka
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // otomatis tutup drawer kalau layar dibesarkan ke desktop
  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    // ganti "token" sesuai key yang kamu pakai di ProtectedRoute / Login
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/40 lg:flex">
      {/* Overlay mobile */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-gradient-to-b from-indigo-950 via-indigo-900 to-violet-900 text-white shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 shadow-lg shadow-orange-500/30">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-lg font-extrabold tracking-tight">Inventory</p>
              <p className="text-xs font-medium text-indigo-200">PT Vando Teknik Solusi</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
            className="rounded-lg p-2 text-indigo-200 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-indigo-300/70">
            Menu Utama
          </p>
          {menus.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-white/15 text-white shadow-inner ring-1 ring-white/10"
                    : "text-indigo-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-amber-400" />
                  )}
                  <Icon
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-amber-300" : ""
                    }`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Konten */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar mobile */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500">
              <HardHat className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-indigo-900">Inventory Vando</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}