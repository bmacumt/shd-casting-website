import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { MobileFloatingBar } from "./components/MobileFloatingBar";

export function Root() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* pb-16 on mobile to avoid content hiding behind the floating bar */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileFloatingBar />
    </div>
  );
}
