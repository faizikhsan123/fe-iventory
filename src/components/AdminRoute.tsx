import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/auth/useAuth";

// Route khusus admin (form tulis). Role lain (mis. office) dialihkan ke halaman daftar.
const AdminRoute = ({ redirectTo }: { redirectTo: string }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default AdminRoute;
