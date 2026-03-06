import { Outlet } from "react-router";
import { BottomNav } from "./BottomNav";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto relative min-h-screen">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
}
