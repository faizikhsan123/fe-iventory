
import SidebarComponent from "@/components/SidebarComponent";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div>
      <SidebarComponent />
      <main className="sm:ml-72 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;