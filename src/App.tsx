import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layout/layout";
import Supplier from "./pages/Supplier";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Employes from "./pages/Employes";
import Items from "./pages/Items";
import CreateItems from "./components/items/CreateItems";
import UpdateItems from "./components/items/updateItems";
import StockMasuk from "./pages/StockMasuk";
import StockKeluarPage from "./pages/StockKeluar";
import Activityy from "./pages/Activity";
import LaporanPage from "./pages/Laporan";

function App() {
  return (
    <Routes>
      {/* Login berdiri sendiri, tanpa Sidebar */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Semua route di bawah ini WAJIB diarahkan ke protected route untuk pengecekan token */}
      <Route element={<ProtectedRoute />}>
        {/* in */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={<Dashboard />}
          />
          <Route
            path="/supplier"
            element={<Supplier />}
          />

          {/* employes */}
          <Route
            path="/employes"
            element={<Employes />}
          />

          <Route
            path="/items"
            element={<Items></Items>}
          />

          <Route
            path="/create-items"
            element={<CreateItems />}
          />

          <Route
            path="/update-items/:id"
            element={<UpdateItems />}
          />

          <Route
            path="/stock-masuk"
            element={<StockMasuk />}
          />

          <Route
            path="/stock-keluar"
            element={<StockKeluarPage />}
          />
          <Route
            path="/Activity-log"
            element={<Activityy />}
          />
          <Route
            path="/laporan"
            element={<LaporanPage />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;
