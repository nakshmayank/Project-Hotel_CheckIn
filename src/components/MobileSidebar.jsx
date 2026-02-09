import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";

const MobileSidebar = ({ open, setOpen }) => {
  const {
    user,
    userData,
    navigate,
    logout,
    setShowAddRoom,
    setShowChangePassword,
  } = useAppContext();

  const location = useLocation();
  const isActive = (path) => location.pathname.endsWith(path);
  const close = () => setOpen(false);

  const firstName = user?.FullName || userData?.Name || "User";
  const email = user?.EmailId || "";

  return (
    <div className="md:hidden">
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={close}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[65%] max-w-[320px] bg-gray-200/60 shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {user && (
          <div className="px-5 py-7 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center font-semibold text-primary-500 shrink-0">
              {user?.pimg ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/HotelLogo/${user.pimg}`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                firstName.charAt(0)
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {firstName}
              </p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-5 overflow-y-auto hide-scrollbar px-4 flex flex-col">
          {/* 🔥 PRIMARY ACTION — NEW CHECK-IN */}
          <div className="">
            <button
              onClick={() => {
                navigate("/dashboard/checkin");
                close();
              }}
              className={`relative w-full pl-3 py-2 flex items-center justify-start gap-2 text-primary-500 hover:bg-gray-100/40 rounded-lg active:scale-[0.98] transition-all ${
                isActive("/dashboard/checkin")
                  ? "bg-primary-100/30 shadow-lg"
                  : "bg-gray-100/20 shadow-md hover:bg-gray-100/30"
              }`}
            >
              {isActive("/dashboard/checkin") && (
                <span className="absolute left-[2px] top-[6px] bottom-[6px] w-1 rounded-r bg-primary-500" />
              )}
              <img src="/checkin.svg" className="w-5 h-5" alt="" />
              New Check-In
            </button>
          </div>

          <div className="">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-gray-900 uppercase mb-3">
              Main
            </p>

            {/* Dashboard */}
            <button
              onClick={() => {
                navigate("/dashboard");
                close();
              }}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive("/dashboard")
                  ? "bg-primary-100/30 text-primary-500 shadow-md"
                  : "text-gray-700 hover:bg-gray-100/30"
              }`}
            >
              {isActive("/dashboard") && (
                <span className="absolute left-[2px] top-[6px] bottom-[6px] w-1 rounded-r bg-primary-500" />
              )}
              <img src="/dashboard.png" className="w-5 h-5 shrink-0" alt="" />
              Dashboard
            </button>

            {/* Manage Stay */}
            <button
              onClick={() => {
                navigate("/dashboard/manage-stay");
                close();
              }}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive("/dashboard/manage-stay")
                  ? "bg-primary-100/30 text-primary-500 shadow-md"
                  : "text-gray-700 hover:bg-gray-100/30"
              }`}
            >
              {isActive("/dashboard/manage-stay") && (
                <span className="absolute left-[2px] top-[6px] bottom-[6px] w-1 rounded-r bg-primary-500" />
              )}
              <img src="/stay2.png" className="w-5 h-5 shrink-0" alt="" />
              Manage Stay
            </button>

            {/* Add Room */}
            <button
              onClick={() => {
                setShowAddRoom(true);
                close();
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100/30 transition-all"
            >
              <img src="/add_room.svg" className="w-5 h-5 shrink-0" alt="" />
              Add Room
            </button>

            {/* Services */}
            <button
              onClick={() => {
                navigate("/services");
                close();
              }}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive("/services")
                  ? "bg-primary-100/30 text-primary-500 shadow-md"
                  : "text-gray-700 hover:bg-gray-100/30"
              }`}
            >
              {isActive("/services") && (
                <span className="absolute left-[2px] top-[6px] bottom-[6px] w-1 rounded-r bg-primary-500" />
              )}
              <img src="/service.png" className="w-5 h-5 shrink-0" alt="" />
              Services
            </button>
          </div>

          <div className="">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-gray-900 uppercase mb-3">
              Help
            </p>

            {/* About */}
            <button
              onClick={() => {
                navigate("/about");
                close();
              }}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive("/about")
                  ? "bg-primary-100/30 text-primary-500 shadow-md"
                  : "text-gray-700 hover:bg-gray-100/30"
              }`}
            >
              {isActive("/about") && (
                <span className="absolute left-[2px] top-[6px] bottom-[6px] w-1 rounded-r bg-primary-500" />
              )}
              <img src="/info.png" className="w-5 h-5 shrink-0" alt="" />
              About
            </button>

            {/* Support */}
            <button
              onClick={() => {
                navigate("/support");
                close();
              }}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive("/support")
                  ? "bg-primary-100/30 text-primary-500 shadow-md"
                  : "text-gray-700 hover:bg-gray-100/30"
              }`}
            >
              {isActive("/support") && (
                <span className="absolute left-[2px] top-[6px] bottom-[6px] w-1 rounded-r bg-primary-500" />
              )}
              <img src="/support.png" className="w-5 h-5 shrink-0" alt="" />
              Support
            </button>

            {/* Contact */}
            <button
              onClick={() => {
                navigate("/contact");
                close();
              }}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive("/contact")
                  ? "bg-primary-100/30 text-primary-500 shadow-md"
                  : "text-gray-700 hover:bg-gray-100/30"
              }`}
            >
              {isActive("/contact") && (
                <span className="absolute left-[2px] top-[6px] bottom-[6px] w-1 rounded-r bg-primary-500" />
              )}
              <img src="/contact.png" className="w-5 h-5 shrink-0" alt="" />
              Contact
            </button>
          </div>

          {/* <div className="flex-1" /> */}

          <div className="">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-gray-900 uppercase mb-3">
              Account
            </p>

            {/* Profile */}
            <button
              onClick={() => {
                navigate("/dashboard/profile");
                close();
              }}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive("/dashboard/profile")
                  ? "bg-primary-100/30 text-primary-500 shadow-md"
                  : "text-gray-700 hover:bg-gray-100/30"
              }`}
            >
              {isActive("/dashboard/profile") && (
                <span className="absolute left-[2px] top-[6px] bottom-[6px] w-1 rounded-r bg-primary-500" />
              )}
              <img
                src="/profile_icon.svg"
                className="w-5 h-5 shrink-0"
                alt=""
              />
              Profile
            </button>

            {/* Change Password */}
            <button
              onClick={() => {
                setShowChangePassword(true);
                close();
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100/30 transition-all"
            >
              <img
                src="/change_password.svg"
                className="w-5 h-5 shrink-0"
                alt=""
              />
              Change Password
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                close();
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/20 transition-all"
            >
              <img src="/logout.svg" className="w-5 h-5 shrink-0" alt="" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
