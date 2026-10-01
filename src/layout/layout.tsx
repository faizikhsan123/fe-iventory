import { Outlet } from "react-router";
import SidebarComponent from "@/components/SidebarComponent";

export default function DashboardLayout() {
  return (
    <div className="min-h-[100dvh] bg-[#F9F7F7]">
      <SidebarComponent />

      <div className="pt-14 lg:pl-[280px] lg:pt-0">
        <main className="min-h-[calc(100dvh-3.5rem)] min-w-0 p-3 sm:p-6 lg:min-h-[100dvh] lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}