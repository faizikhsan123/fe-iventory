import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTopBorrowed } from "@/hooks/Laporan/TopBorrow";
import { usePenerimaanStok, type StockHistoryItem } from "@/hooks/Laporan/penerimaan";


// ============================================================
// DAFTAR TAB YANG ADA DI HALAMAN INI
// ============================================================

// Ini semua pilihan tab yang valid. Kalau mau nambah tab baru,
// tambahin di sini dan di array "tabs" di bawah.
type TabKey = "top-diberikan" | "penerimaan-stok" | "barang-keluar" | "stok-kritis";

const DAFTAR_TAB: { key: TabKey; label: string }[] = [
  { key: "top-diberikan", label: "Top Diberikan" },
  { key: "penerimaan-stok", label: "Penerimaan Stok" },
  { key: "barang-keluar", label: "Barang Keluar" },
  { key: "stok-kritis", label: "Stok Kritis" },
];

const TAB_DEFAULT: TabKey = "top-diberikan";

// Cek apakah string dari URL itu salah satu tab yang valid.
// Dipakai supaya kalau ada orang iseng ubah URL jadi ?tab=asal-ketik,
// aplikasi tetap fallback ke tab default, bukan error.
function apakahTabValid(value: string | null): value is TabKey {
  const semuaKey = DAFTAR_TAB.map((tab) => tab.key);
  return value !== null && semuaKey.includes(value as TabKey);
}

// ============================================================
// KOMPONEN UTAMA
// ============================================================

export default function StockDashboardSection() {
  // --- Bagian 1: baca & ubah tab aktif lewat URL ---
  // Contoh URL setelah user klik tab "Stok Kritis":
  //   /laporan?tab=stok-kritis
  // Jadi kalau halaman di-refresh, tab yang kebuka tetap sama.
  const [searchParams, setSearchParams] = useSearchParams();

  const tabDariUrl = searchParams.get("tab");
  const tabAktif: TabKey = apakahTabValid(tabDariUrl) ? tabDariUrl : TAB_DEFAULT;

  function pindahTab(tabBaru: TabKey) {
    const paramsBaru = new URLSearchParams(searchParams);
    paramsBaru.set("tab", tabBaru);
    setSearchParams(paramsBaru, { replace: true });
  }

  // --- Bagian 2: ambil data dari API, sesuai tab yang lagi aktif ---
  // Tiap tab punya hook & sumber data sendiri-sendiri.
  const { dataTopBorrowed, loading: loadingTopDiberikan, error: errorTopDiberikan, getTopBorrowed } = useTopBorrowed();
  const { dataPenerimaanStok, loading: loadingPenerimaan, error: errorPenerimaan, getPenerimaanStok } = usePenerimaanStok();

  // Fetch data cuma jalan pas tab yang bersangkutan lagi dibuka —
  // biar gak nembak API yang datanya belum kepakai.
  useEffect(() => {
    if (tabAktif === "top-diberikan") {
      getTopBorrowed();
    }
    if (tabAktif === "penerimaan-stok") {
      getPenerimaanStok();
    }
  }, [tabAktif]);

  // --- Bagian 3: tampilan ---
  return (
    <div className="w-full space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        {/* Tombol-tombol tab */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-neutral-50 p-1">
            {DAFTAR_TAB.map((tab) => {
              const sedangAktif = tabAktif === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => pindahTab(tab.key)}
                  className={
                    sedangAktif
                      ? "rounded-md bg-white px-3.5 py-1.5 text-sm font-medium text-blue-600 shadow-sm"
                      : "rounded-md px-3.5 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700"
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Isi tab "Top Diberikan" */}
        {tabAktif === "top-diberikan" && (
          <TabelTopDiberikan
            data={dataTopBorrowed}
            loading={loadingTopDiberikan}
            error={errorTopDiberikan}
          />
        )}

        {/* Isi tab "Penerimaan Stok" */}
        {tabAktif === "penerimaan-stok" && (
          <TabelPenerimaanStok
            data={dataPenerimaanStok}
            loading={loadingPenerimaan}
            error={errorPenerimaan}
          />
        )}

        {/* Isi tab yang belum dibikin tabelnya — placeholder dulu */}
        {tabAktif !== "top-diberikan" && tabAktif !== "penerimaan-stok" && (
          <div className="flex h-40 items-center justify-center text-sm text-neutral-400">
            Data {DAFTAR_TAB.find((tab) => tab.key === tabAktif)?.label} belum tersedia
          </div>
        )}

        {/* Info periode + pagination (statis dulu, belum fungsional) */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-neutral-400">Data periode: Agustus 2026</p>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((nomorHalaman) => (
              <button
                key={nomorHalaman}
                className={
                  nomorHalaman === 1
                    ? "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-medium text-white"
                    : "flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                }
              >
                {nomorHalaman}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUB-KOMPONEN: TABEL TOP DIBERIKAN
// ============================================================
// Dipisah dari komponen utama biar gampang dibaca — komponen utama
// fokus ngatur tab & URL, komponen ini fokus nampilin tabel aja.

interface TopBorrowedItem {
  id: number;
  rank: number;
  name: string;
  category: string;
  current_stock: number;
  total_pinjam: number;
}

interface TabelTopDiberikanProps {
  data: TopBorrowedItem[];
  loading: boolean;
  error: string;
}

function TabelTopDiberikan({ data, loading, error }: TabelTopDiberikanProps) {
  // Kondisi 1: masih loading
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-neutral-400">
        Memuat data...
      </div>
    );
  }

  // Kondisi 2: request gagal
  if (error) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  // Kondisi 3: request berhasil tapi datanya kosong
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-neutral-400">
        Belum ada data untuk periode ini
      </div>
    );
  }

  // Kondisi 4: data ada, tampilkan tabelnya
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
            <th className="py-3 pr-4 font-medium">Rank</th>
            <th className="py-3 pr-4 font-medium">Nama Barang</th>
            <th className="py-3 pr-4 font-medium">Kategori</th>
            <th className="py-3 pr-4 font-medium">Stok Saat Ini</th>
            <th className="py-3 pr-4 font-medium">Total Diberikan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {data.map((item) => (
            <BarisTabel key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BarisTabel({ item }: { item: TopBorrowedItem }) {
  const warnaKategori =
    item.category === "APD"
      ? "bg-blue-50 text-blue-600"
      : "bg-violet-50 text-violet-600";

  return (
    <tr className="text-neutral-700">
      <td className="py-3.5 pr-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 text-xs font-semibold text-white">
          {item.rank}
        </span>
      </td>
      <td className="py-3.5 pr-4 font-medium text-neutral-900">{item.name}</td>
      <td className="py-3.5 pr-4">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${warnaKategori}`}>
          {item.category}
        </span>
      </td>
      <td className="py-3.5 pr-4">{item.current_stock} unit</td>
      <td className="py-3.5 pr-4 font-medium text-violet-600">{item.total_pinjam}x</td>
    </tr>
  );
}

// ============================================================
// SUB-KOMPONEN: TABEL PENERIMAAN STOK
// ============================================================
// Pola sama persis kayak TabelTopDiberikan di atas — cuma beda
// kolom yang ditampilin, karena datanya beda.

interface TabelPenerimaanStokProps {
  data: StockHistoryItem[];
  loading: boolean;
  error: string;
}

function TabelPenerimaanStok({ data, loading, error }: TabelPenerimaanStokProps) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-neutral-400">
        Memuat data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  // stock-history nyimpen semua pergerakan stok (masuk & keluar jadi satu),
  // jadi di sini kita saring dulu yang type-nya "in" doang.
  const dataMasuk = data.filter((item) => item.type === "in");

  if (dataMasuk.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-neutral-400">
        Belum ada data penerimaan stok untuk periode ini
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
            <th className="py-3 pr-4 font-medium">Tanggal</th>
            <th className="py-3 pr-4 font-medium">Barang</th>
            <th className="py-3 pr-4 font-medium">Supplier</th>
            <th className="py-3 pr-4 font-medium">Qty</th>
            <th className="py-3 pr-4 font-medium">Catatan</th>
            <th className="py-3 pr-4 font-medium">User</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {dataMasuk.map((item, index) => (
            <tr key={index} className="text-neutral-700">
              <td className="py-3.5 pr-4 text-neutral-500">{item.date}</td>
              <td className="py-3.5 pr-4 font-medium text-neutral-900">
                {item.item_id?.name ?? "—"}
              </td>
              <td className="py-3.5 pr-4 text-neutral-500">
                {item.item_id?. supplier_id?.name ?? "—"}
              </td>
              <td className="py-3.5 pr-4 font-medium text-emerald-600">
                +{item.qty} {item.item_id?.unit ?? ""}
              </td>
              <td className="py-3.5 pr-4 text-neutral-500">{item.note || "—"}</td>
              <td className="py-3.5 pr-4 text-neutral-500">{item.user_id?.name ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}