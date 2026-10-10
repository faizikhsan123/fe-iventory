import { lazy } from "react";
import { Route, Routes } from "react-router";
import DashboardLayout from "./layout/layout";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Tiap halaman jadi chunk sendiri: dimuat saat dikunjungi, bukan semuanya di awal.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Supplier = lazy(() => import("./pages/Supplier"));
const Employes = lazy(() => import("./pages/Employes"));
const DetailKaryawan = lazy(() => import("./components/employes/DetailEmployes"));
const Items = lazy(() => import("./pages/Items"));
const CreateItems = lazy(() => import("./components/items/CreateItems"));
const UpdateItems = lazy(() => import("./components/items/updateItems"));
const DetailBarang = lazy(() => import("./components/items/DetailItems"));
const StockMasuk = lazy(() => import("./pages/StockMasuk"));
const StockKeluarPage = lazy(() => import("./pages/StockKeluar"));
const Activityy = lazy(() => import("./pages/Activity"));
const LaporanPage = lazy(() => import("./pages/Laporan"));
const GroupPages = lazy(() => import("./pages/Group"));
const TrainingPages = lazy(() => import("./pages/TrainingPages"));
const TrainingDetailPages = lazy(() => import("./components/Trainings/TrainingDetailPages"));
const ContractPage = lazy(() => import("./pages/Contract"));
const ContractDetail = lazy(() => import("./components/Contract/ContractDetail"));
const McuPage = lazy(() => import("./pages/Mcu"));
const InvoicePage = lazy(() => import("./pages/Invoice"));
const RfqPage = lazy(() => import("./pages/Rfq"));

function App() {
  return (
    <Routes>
      {/* Login berdiri sendiri, tanpa Sidebar */}
      <Route path="/login" element={<Login />} />

      {/* Semua route di bawah ini WAJIB lewat protected route untuk pengecekan token */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/supplier" element={<Supplier />} />

          <Route path="/employes" element={<Employes />} />
          <Route path="/employes/:id" element={<DetailKaryawan />} />

          <Route path="/items" element={<Items />} />
          <Route path="/create-items" element={<CreateItems />} />
          <Route path="/update-items/:id" element={<UpdateItems />} />
          <Route path="/items/:id" element={<DetailBarang />} />

          <Route path="/stock-masuk" element={<StockMasuk />} />
          <Route path="/stock-keluar" element={<StockKeluarPage />} />

          <Route path="/groups" element={<GroupPages />} />

          <Route path="/trainings" element={<TrainingPages />} />
          <Route path="/trainings/:id" element={<TrainingDetailPages />} />

          <Route path="/contracts" element={<ContractPage />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />

          <Route path="/mcu" element={<McuPage />} />
          <Route path="/rfq" element={<RfqPage />} />
          <Route path="/invoices" element={<InvoicePage />} />

          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/Activity-log" element={<Activityy />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
