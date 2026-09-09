import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layout/layout";
import Supplier from "./pages/Supplier";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Employes from "./pages/Employes";
import Items from "./pages/Items";

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
