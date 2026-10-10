import { Suspense } from "react";
import { Outlet } from "react-router";
import SidebarComponent from "@/components/SidebarComponent";

// Fallback saat chunk halaman sedang dimuat; sidebar tetap tampil.
const PageFallback = () => (
  <div className="animate-pulse space-y-4" aria-busy="true">
    <div className="h-10 w-48 rounded-lg bg-[#DBE2EF]" />
    <div className="h-32 rounded-xl bg-[#DBE2EF]" />
    <div className="h-72 rounded-xl bg-[#EBEFF6]" />
  </div>
);

export default function DashboardLayout() {
  return (
    <div className="min-h-[100dvh] bg-[#F9F7F7]">
      <SidebarComponent />

      <div className="pt-14 lg:pl-[280px] lg:pt-0">
        <main className="min-h-[calc(100dvh-3.5rem)] min-w-0 p-3 sm:p-6 lg:min-h-[100dvh] lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
