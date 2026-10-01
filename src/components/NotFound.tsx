import { Link, useNavigate } from "react-router";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F9F7F7] px-4 py-8 sm:px-6">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[#DBE2EF] bg-white shadow-[0_10px_30px_rgb(17,45,78,0.12)]">
        {/* Blok 404 */}
        <div
          className="bg-[#112D4E] px-6 py-10 text-center sm:py-12"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1B3F68 1px, transparent 1px), linear-gradient(to bottom, #1B3F68 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        >
          <p className="text-7xl font-black leading-none tracking-tight text-white sm:text-8xl">
            404
          </p>
        </div>
        <div className="h-1.5 w-full bg-[#3F72AF]" />

        <div className="p-6 text-center sm:p-10">
          <h1 className="text-xl font-extrabold text-[#112D4E] sm:text-2xl">
            Halaman tidak ditemukan
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#50688C]">
            Halaman yang kamu cari tidak tersedia .
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#BFCCE3] bg-[#F9F7F7] px-5 text-sm font-bold text-[#112D4E] outline-none transition hover:bg-[#DBE2EF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF] active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>

            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#112D4E] px-5 text-sm font-bold text-white outline-none transition hover:bg-[#0B2240] focus-visible:ring-4 focus-visible:ring-[#9DB2D3] active:scale-[0.98]"
            >
              <Home className="h-4 w-4" />
              Ke beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;  