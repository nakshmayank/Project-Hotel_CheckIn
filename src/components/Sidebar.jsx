import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Sidebar = () => {
  const { user, navigate, setShowAddRoom, setShowChangePassword, logout } =
    useAppContext();

    const location = useLocation();

    const isActive = (path) => location.pathname.endsWith(path);

  return (
    <div className="py-8 w-full md:px-7 lg:px-16 transition-all">
      <div className="flex flex-col gap-4 items-center justify-center mb-6">
        <label className="relative block shadow-lg rounded-full w-32 h-32 bg-gray-300 hover:scale-105 duration-300 transition-all ease-in-out overflow-hidden">
          {user?.pimg ? (
            <img
              className="w-full h-full object-cover"
              src={
                user?.pimg
                  ? `${import.meta.env.VITE_BACKEND_URL}/HotelLogo/${user.pimg}`
                  : "/"
              }
              alt="logo"
            />
          ) : (
            <img
              src="/profile_logo.svg"
              alt="loading avatar"
              className="absolute inset-0 w-full h-full object-cover opacity-60 animate-pulse"
            />
          )}
        </label>
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-900 font-semibold">
            {user?.FullName}
          </p>
          <p className="text-sm text-gray-700 font-medium">{user?.EmailId}</p>
        </div>
      </div>

      {/* Title */}
      <div>
        <p className="text-lg font-semibold text-gray-900 text-center mb-2">
          Dashboard
        </p>
      </div>

      <div className="h-px bg-black mb-4"></div>

      <div className="flex flex-col gap-2">
        {/* Check-In Button */}
        <button
          onClick={() => navigate("/dashboard/checkin")}
          className={`my-1 flex items-center gap-1.5 rounded-full ${isActive("/dashboard/checkin") && "pl-1 bg-primary-500/60"}`}
        >
          <div className={`${isActive("/dashboard/checkin") ? "slide-in-right " : "transition-transform hover:scale-110 duration-300 ease-in-out"} bg-white/70 rounded-full p-2 shadow-lg`}>
            <img className="w-4 h-4" src="/checkin.svg" alt="checkin" />
          </div>

          <div className={`${isActive("/dashboard/checkin") ? "transform-none hover:transform-none fade-in" : "transition-transform duration-300 ease-in-out hover:scale-105"} rounded-full flex-1 bg-white/70 px-4 py-2 shadow-lg`}>
            <p className="text-primary-500 font-medium text-left">New Check-In</p>
          </div>
        </button>

        {/* Main Section */}
        <div className="mt-2.5">
          <p className="w-full text-xs font-semibold tracking-[0.08em] text-gray-800 uppercase">Main</p>
        </div>

        {/* Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`my-1 flex items-center gap-1.5 rounded-full ${isActive("/dashboard") && "pl-1 bg-primary-500/60"}`}
        >
          <div className={`${isActive("/dashboard") ? "slide-in-right" : "transition-transform hover:scale-110 duration-300 ease-in-out"} bg-white/70 rounded-full p-2 shadow-lg`}>
            <img className="w-4 h-4" src="/dashboard.png" alt="dashboard" />
          </div>

          <div className={`${isActive("/dashboard") ? "transform-none hover:transform-none fade-in" : "transition-transform duration-300 ease-in-out hover:scale-105"} rounded-full flex-1 bg-white/70 px-4 py-2 shadow-lg`}>
            <p className={`${isActive("/dashboard") ? "text-primary-500" : "text-gray-800"} font-medium text-left`}>Overview</p>
          </div>
        </button>
        {/* <button
          onClick={() => navigate("/dashboard")}
          className="p-2.5 bg-gray-100/60 rounded-lg transition-transform hover:scale-105 hover:shadow-lg duration-300 flex items-center gap-2 shadow-md"
        >
          <img className="w-5 h-5" src="/dashboard.png" alt="overview" />
          Overview
        </button> */}

        <button
          onClick={() => navigate("/dashboard/manage-stay")}
          className={`my-1 flex items-center gap-1.5 rounded-full ${isActive("/dashboard/manage-stay") && "pl-1 bg-primary-500/60"}`}
        >
          <div className={`${isActive("/dashboard/manage-stay") ? "slide-in-right" : "transition-transform hover:scale-110 duration-300 ease-in-out"} bg-white/70 rounded-full p-2 shadow-lg`}>
            <img className="w-4 h-4" src="/stay2.png" alt="manage_stay" />
          </div>

          <div className={`${isActive("/dashboard/manage-stay") ? "transform-none hover:transform-none fade-in" : "transition-transform duration-300 ease-in-out hover:scale-105"} rounded-full flex-1 bg-white/70 px-4 py-2 shadow-lg`}>
            <p className={`${isActive("/dashboard/manage-stay") ? "text-primary-500" : "text-gray-800"} font-medium text-left`}>Manage Stay</p>
          </div>
        </button>

        {/* Add Rooms */}
        <button
          onClick={() => setShowAddRoom(true)}
          className="my-1 flex items-center gap-1.5"
        >
          <div className={`bg-white/70 rounded-full p-2 shadow-lg transition-transform hover:scale-110 duration-300 ease-in-out`}>
            <img className="w-4 h-4" src="/add_room.svg" alt="add_room" />
          </div>

          <div className="rounded-full flex-1 bg-white/70 px-4 py-2 shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
            <p className="text-gray-800 font-medium text-left">Add New Room</p>
          </div>
        </button>

        {/* Settings Section Divider */}
        {/* <div className="flex gap-1 items-center mx-1 my-2">
          <div className="text-xs uppercase font-medium text-gray-500">
            Settings
          </div>
          <div className="border-t border-gray-500 w-full"></div>
        </div> */}

        {/* Main Section */}
        <div className="mt-2.5">
          <p className="w-full text-xs font-semibold tracking-[0.08em] text-gray-800 uppercase">Account</p>
        </div>

        {/* Profile */}
        <button
          onClick={() => navigate("/dashboard/profile")}
          className={`my-1 flex items-center gap-1.5 rounded-full ${isActive("/dashboard/profile") && "pl-1 bg-primary-500/60"}`}
        >
          <div className={`${isActive("/dashboard/profile") ? "slide-in-right" : "transition-transform hover:scale-110 duration-300 ease-in-out"} bg-white/70 rounded-full p-2 shadow-lg`}>
            <img className="w-4 h-4" src="/profile_icon.svg" alt="profile" />
          </div>

          <div className={`${isActive("/dashboard/profile") ? "transform-none hover:transform-none fade-in" : "transition-transform duration-300 ease-in-out hover:scale-105"} rounded-full flex-1 bg-white/70 px-4 py-2 shadow-lg`}>
            <p className={`${isActive("/dashboard/profile") ? "text-primary-500" : "text-gray-800"} font-medium text-left`}>My Profile</p>
          </div>
        </button>

        <button
          onClick={() => setShowChangePassword(true)}
          className="my-1 flex items-center gap-1.5"
        >
          <div className={`bg-white/70 rounded-full p-2 shadow-lg transition-transform hover:scale-110 duration-300 ease-in-out`}>
            <img
              className="w-4 h-4"
              src="/change_password.svg"
              alt="change_password"
            />
          </div>

          <div className="rounded-full flex-1 bg-white/70 px-4 py-2 shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
            <p className="text-gray-800 font-medium text-left">Change Password</p>
          </div>
        </button>

        <button onClick={logout} className="my-1 flex items-center gap-1.5">
          <div className="rounded-full py-2.5 pl-2 pr-3  bg-white/70 hover:bg-red-500/20 shadow-lg transition-transform hover:scale-110 duration-300 ease-in-out">
            <img className="w-4 h-4" src="/logout.svg" alt="logout" />
          </div>

          <div className="rounded-full flex-1 bg-white/70 hover:bg-red-500/20 px-4 py-2 shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
            <p className="text-red-500 font-medium text-left">Logout</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
