import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="pt-16 md:pt-28 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:inline-block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 shadow-2xl bg-gray-100/30 min-h-screen rounded-t-3xl md:rounded-t-none md:rounded-ss-3xl" >
          {/* Main content */}
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
