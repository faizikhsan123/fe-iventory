import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
//   jika token tidak ada, maka akan diarahkan ke halaman login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  //   jika token ada, maka akan menampilkan komponen anak dari ProtectedRoute seperti  DashboardLayout, Supplier, dll
  //   outlet digunakan untuk menampilkan komponen anak dari ProtectedRoute
  return <Outlet />;
};

export default ProtectedRoute;
