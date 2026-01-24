import { useAppContext } from "../context/AppContext";

const Sidebar = () => {
  const { user, navigate, setShowAddRoom, setShowChangePassword, logout } =
    useAppContext();

  return (
    <div className="py-8 w-full md:px-7 lg:px-16 transition-all">
      <div className="flex flex-col gap-4 items-center justify-center mb-6">
        <label className="relative block shadow-lg rounded-full w-32 h-32 bg-red-400 transition-all overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={
              user?.pimg
                ? `https://api.careersphare.com/HotelLogo/${user.pimg}`
                : ""
            }
            alt=""
          />
        </label>
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-900 font-semibold">{user?.FullName}</p>
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
          className="my-1 flex items-center gap-1.5"
        >
          <div className="rounded-full p-2 bg-orange-500 shadow-lg transition-transform hover:scale-110 duration-300 ease-in-out">
            <img className="w-4 h-4" src="/checkin.svg" alt="checkin" />
          </div>

          <div className="bg-orange-500 flex-1 rounded-full px-4 py-2 shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
            <p className=" text-white text-left">New Check-In</p>
          </div>
        </button>

        {/* Dashboard */}
        {/* <button
          onClick={() => navigate("/dashboard")}
          className="p-2.5 bg-gray-100/60 rounded-lg transition-transform hover:scale-105 hover:shadow-lg duration-300 flex items-center gap-2 shadow-md"
        >
          <img className="w-5 h-5" src="/dashboard.png" alt="overview" />
          Dashboard
        </button> */}

        <button
          onClick={() => navigate("/dashboard/manage-stay")}
          className="my-1 flex items-center gap-1.5"
        >
          <div className="rounded-full p-2 bg-white/80 shadow-lg transition-transform hover:scale-110 duration-300 ease-in-out">
            <img className="w-5 h-5" src="/stay2.png" alt="manage_stay" />
          </div>

          <div className="rounded-full flex-1 bg-white/80 px-4 py-2 shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
            <p className="text-left">Manage Stay</p>
          </div>
        </button>

        {/* Section Divider */}
        <div className="flex gap-1 items-center mx-1 my-3">
          <div className="border-t border-gray-500 w-full"></div>
        </div>

        {/* Add Rooms */}
        <button
          onClick={() => setShowAddRoom(true)}
          className="my-1 flex items-center gap-1.5"
        >
          <div className="rounded-full p-2 bg-white/80 shadow-lg transition-transform hover:scale-110 duration-300 ease-in-out">
            <img className="w-4 h-4" src="/add_room.svg" alt="add_room" />
          </div>

          <div className="rounded-full flex-1 bg-white/80 px-4 py-2 shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
            <p className="text-left">Add New Room</p>
          </div>
        </button>

        {/* Settings Section Divider */}
        <div className="flex gap-1 items-center mx-1 my-2">
          <div className="text-xs uppercase font-medium text-gray-500">
            Settings
          </div>
          <div className="border-t border-gray-500 w-full"></div>
        </div>

        {/* Profile */}
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="my-1 flex items-center gap-1.5"
        >
          <div className="rounded-full p-2.5 bg-white/80 shadow-lg transition-transform hover:scale-110 duration-300 ease-in-out">
            <img className="w-4 h-4" src="/profile_icon.svg" alt="profile" />
          </div>

          <div className="rounded-full flex-1 bg-white/80 px-4 py-2 shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
            <p className="text-left">My Profile</p>
          </div>
        </button>

        <button
          onClick={() => setShowChangePassword(true)}
          className="my-1 flex items-center gap-1.5"
        >
          <div className="rounded-full p-2.5 bg-white/80 shadow-lg transition-transform hover:scale-110 duration-300 ease-in-out">
            <img
              className="w-4 h-4"
              src="/change_password.svg"
              alt="change_password"
            />
          </div>

          <div className="rounded-full flex-1 bg-white/80 px-4 py-2 shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
            <p className="text-left">Change Password</p>
          </div>
        </button>

        <button onClick={logout} className="my-1 flex items-center gap-1.5">
          <div className="rounded-full py-2.5 pl-2 pr-3  bg-white/80 shadow-lg transition-transform hover:scale-110 duration-300 ease-in-out">
            <img className="w-4 h-4" src="/logout.svg" alt="logout" />
          </div>

          <div className="rounded-full flex-1 bg-white/80 px-4 py-2 shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
            <p className="text-red-500 text-left">Logout</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
