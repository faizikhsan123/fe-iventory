import { UseLogin } from "@/hooks/auth/login";
import {
  AlertCircle,
  BarChart3,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  PackageCheck,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useState, type CSSProperties } from "react";

/*
  Palet:
  navy #112D4E | biru #3F72AF | muda #DBE2EF | putih #F9F7F7
  turunan: navy gelap #0B2240, navy hover #1B406B, redup di navy #9DB2D3,
           teks redup #50688C, border input #BFCCE3
*/

const features = [
  {
    icon: PackageCheck,
    title: "Stok real-time",
    desc: "Pantau barang masuk dan keluar kapan saja.",
  },
  {
    icon: ShieldCheck,
    title: "Akses terkontrol",
    desc: "Hak akses sesuai peran setiap pengguna.",
  },
  {
    icon: BarChart3,
    title: "Laporan otomatis",
    desc: "Ringkasan stok APD & Tools siap dilihat.",
  },
];

// pola garis halus di background navy (warna solid, bukan transparan)
const gridStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, #1B3F68 1px, transparent 1px), linear-gradient(to bottom, #1B3F68 1px, transparent 1px)",
  backgroundSize: "36px 36px",
};

const inputClass =
  "block h-12 w-full rounded-lg border border-[#BFCCE3] bg-[#F9F7F7] pl-11 text-base font-medium text-[#112D4E] outline-none transition placeholder:text-[#7B8FAE] hover:border-[#3F72AF] focus:border-[#3F72AF] focus:bg-white focus:ring-4 focus:ring-[#DBE2EF] sm:text-sm";

export default function Login() {
  const { error, loading, HandleLogin, email, SetEmail, password, SetPassword } = UseLogin();

  const [hidepw, SethidePw] = useState(true);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await HandleLogin(email, password);
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-[#F9F7F7] lg:flex-row">
      {/* ========== PANEL BRAND (desktop) ========== */}
      <section
        className="relative hidden w-1/2 flex-col justify-between bg-[#112D4E] p-10 lg:flex xl:p-16"
        style={gridStyle}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#F9F7F7]">
            <Shield className="h-6 w-6 text-[#112D4E]" />
          </div>
          <div className="leading-tight">
            <p className="text-xl font-extrabold text-white">PT. Vando Teknik Solusi</p>
            <p className="text-sm font-medium text-[#9DB2D3]">Inventory Gresik</p>
          </div>
        </div>

        {/* Konten utama */}
        <div className="max-w-xl">
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white xl:text-5xl">
            Kelola inventaris APD &amp; Tools lebih mudah.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#DBE2EF]">
            Satu tempat untuk mengelola barang, stok, supplier, karyawan, dan laporan.
          </p>

          <ul className="mt-10 border-t border-[#25476F]">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <li
                key={title}
                className="flex items-start gap-4 border-b border-[#25476F] py-5"
              >
                <span className="w-7 shrink-0 pt-0.5 text-sm font-bold tabular-nums text-[#3F72AF]">
                  0{i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white">{title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-[#9DB2D3]">{desc}</p>
                </div>
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#DBE2EF]" />
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs font-medium text-[#9DB2D3]">
          © {new Date().getFullYear()} PT Vando Teknik Solusi
        </p>
      </section>

      {/* ========== HEADER BRAND (mobile / tablet) ========== */}
      <header
        className="bg-[#112D4E] px-5 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8 lg:hidden"
        style={gridStyle}
      >
        <div className="mx-auto flex w-full max-w-[440px] items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#F9F7F7]">
            <Shield className="h-5 w-5 text-[#112D4E]" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-lg font-extrabold text-white">PT. Vando Teknik Solusi</p>
            <p className="text-xs font-medium text-[#9DB2D3]">Inventory Gresik</p>
          </div>
        </div>
      </header>

      {/* ========== AREA LOGIN ========== */}
      <main className="relative -mt-8 flex flex-1 items-start justify-center px-4 pb-8 sm:px-6 lg:mt-0 lg:w-1/2 lg:flex-none lg:items-center lg:px-10 lg:py-8 xl:px-16">
        <div className="w-full max-w-[440px]">
          {/* Kartu login */}
          <div className="overflow-hidden rounded-xl border border-[#DBE2EF] bg-white shadow-[0_10px_30px_rgb(17,45,78,0.12)]">
            <div className="h-1.5 w-full bg-[#3F72AF]" />

            <div className="p-5 sm:p-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#112D4E] sm:text-3xl">
                Masuk ke akun
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#50688C]">
                Gunakan email dan password yang terdaftar.
              </p>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mt-5 flex items-start gap-3 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3.5 py-3 text-sm text-[#B3261E]"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="min-w-0 break-words leading-5">{error}</span>
                </div>
              )}

              <form onSubmit={handleCreate} className="mt-6 space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-[#112D4E]">
                    Email
                  </label>
                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#3F72AF]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      placeholder="nama@perusahaan.com"
                      value={email}
                      onChange={(e) => SetEmail(e.target.value)}
                      className={`${inputClass} pr-4`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-[#112D4E]">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#3F72AF]" />
                    <input
                      id="password"
                      name="password"
                      type={hidepw ? "password" : "text"}
                      required
                      autoComplete="current-password"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => SetPassword(e.target.value)}
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => SethidePw((prev) => !prev)}
                      aria-label={hidepw ? "Tampilkan password" : "Sembunyikan password"}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-[#50688C] transition hover:text-[#112D4E]"
                      tabIndex={-1}
                    >
                      {hidepw ? (
                        <Eye className="h-[18px] w-[18px]" />
                      ) : (
                        <EyeOff className="h-[18px] w-[18px]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#112D4E] px-4 text-sm font-extrabold text-white outline-none transition hover:bg-[#0B2240] focus-visible:ring-4 focus-visible:ring-[#9DB2D3] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Footer mobile */}
          <p className="mt-6 text-center text-xs font-medium text-[#50688C] lg:hidden">
            © {new Date().getFullYear()} PT Vando Teknik Solusi
          </p>
        </div>
      </main>
    </div>
  );
}