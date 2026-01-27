import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import MobileSidebar from "./MobileSidebar";

const Navbar = () => {
  const {
    setState,
    setShowLogin,
    user,
    navigate,
    authLoading,
    logout,
    setShowAddRoom,
    setShowChangePassword,
    userData,
  } = useAppContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const firstName =
    user?.FullName?.split(" ")[0] || userData?.Name?.split(" ")[0];
  const fallbackLetter =
    user?.FullName?.charAt(0)?.toUpperCase() ||
    userData?.Name?.charAt(0)?.toUpperCase() ||
    "U";

  const profileImageUrl = user?.pimg
    ? `https://api.careersphare.com/HotelLogo/${user.pimg}`
    : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (authLoading) return <Loader />;

  return (
    <div className="fixed top-0 w-full z-30">
      <nav className="flex items-center justify-between shadow-3xl transition-all backdrop-blur-sm px-2.5 md:px-10 py-5">
        {/* Left - Logo */}
        <div className="w-fit">
          <Link to="/" className="items-center">
            {/* <img className="max-w-24" src="/logo.png" alt="" /> */}

            <p className="font-bold text-3xl text-gray-700">
              Stay<span className="text-orange-500">In</span>
            </p>
          </Link>
        </div>

        {/* Center - Menu */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          <Link
            to="/"
            className="text-gray-800 text-lg hover:text-orange-600 font-medium"
          >
            {user ? "Dashboard" : "Home"}
          </Link>
          <Link
            to="/services"
            className="text-gray-800 text-lg hover:text-orange-600 font-medium"
          >
            Services
          </Link>
          <Link
            to="/support"
            className="text-gray-800 text-lg hover:text-orange-600 font-medium"
          >
            Support
          </Link>
          <Link
            to="/about"
            className="text-gray-800 hidden lg:block text-lg hover:text-orange-600 font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-800 hidden lg:block text-lg hover:text-orange-600 font-medium"
          >
            Contact
          </Link>
        </div>

        {/* Right - Auth Buttons */}
        <div className="w-fit">
          <div className="">
            {user ? (
              <div>
                {/* Profile Menu */}
                <div className="hidden sm:flex items-center">
                  <div className="relative group" ref={profileMenuRef}>
                    <div className="flex items-center gap-2">
                      {/* Welcome text */}
                      <span className="hidden sm:block text-md font-medium text-gray-900">
                        Welcome,{" "}
                        <span className="font-semibold text-orange-500">
                          {firstName}
                          {"!"}
                        </span>
                      </span>

                      {/* Profile avatar */}
                      <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-8 h-8 rounded-full overflow-hidden shadow bg-orange-500 flex items-center justify-center cursor-pointer transition duration-150 hover:scale-110"
                      >
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-semibold">
                            {fallbackLetter}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
                    <img
                      className="w-6 opacity-80 cursor-pointer transition duration-150 hover:scale-110"
                      src="/profile_icon.svg"
                      alt="profile"
                    />

                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold cursor-pointer select-none transition duration-150 hover:scale-110">
                      {userData?.FullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </button> */}
                    {showProfileMenu && (
                      <div className="absolute w-64 top-10 -right-0 shadow-md border p-5 rounded-xl z-40 text-sm bg-gray-100/80 transition-all backdrop-blur-xl border-b border-gray-100/10 opacity-0 fade-in-fast">
                        <ul className="flex flex-col w-50">
                          <li className="p-1.5 pl-3">
                            <p className="text-lg font-semibold text-orange-500">
                              {userData?.Name}
                            </p>
                            <p>{user?.EmailId}</p>
                          </li>
                          <div className="h-px bg-gray-500 m-2"></div>
                          <li
                            onClick={() => {
                              navigate("/dashboard");
                              setShowProfileMenu(!showProfileMenu);
                            }}
                            className="flex p-1.5 pl-3 gap-2 items-center hover:bg-orange-400/20 cursor-pointer font-medium"
                          >
                            <img
                              className="w-4 h-4 opacity-80"
                              src="/dashboard.png"
                              alt="dashboard_icon"
                            />
                            <p>Dashboard</p>
                          </li>
                          <li
                            onClick={() => {
                              navigate("/dashboard/profile");
                              setShowProfileMenu(false);
                            }}
                            className="flex p-1.5 pl-3 gap-2 items-center hover:bg-orange-400/20 cursor-pointer font-medium"
                          >
                            <img
                              className="w-4 h-4"
                              src="/profile_icon.svg"
                              alt=""
                            />
                            Profile
                          </li>

                          <li
                            onClick={() => {
                              setShowChangePassword(true);
                              setShowProfileMenu(false);
                            }}
                            className="flex p-1.5 pl-3 gap-2 items-center hover:bg-orange-400/20 cursor-pointer font-medium"
                          >
                            <img
                              className="w-4 h-4"
                              src="/change_password.svg"
                              alt=""
                            />
                            Change Password
                          </li>

                          <li
                            onClick={() => {
                              logout();
                              setShowProfileMenu(!showProfileMenu);
                            }}
                            className="flex items-center p-1.5 pl-3 gap-2 hover:bg-orange-400/20 cursor-pointer font-medium"
                          >
                            <img
                              className="w-4 h-4"
                              src="/logout.svg"
                              alt="logout_icon"
                            />
                            <p>Logout</p>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Menu Icons */}
                <div className="sm:hidden">
                  <div className="relative">
                    <button
                      onClick={() => (open ? setOpen(false) : setOpen(true))}
                      aria-label="Menu"
                    >
                      <img src="/menu_icon.svg" alt="menu" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setState("login");
                    setShowLogin(true);
                  }}
                  className="px-4 py-1.5 text-nowrap text-orange-500 border-orange-500 border-2 shadow-md hover:scale-105 ease-in-out duration-300 rounded-lg hover:shadow-lg"
                >
                  Sign In
                </button>

                <button
                  onClick={() => {
                    setState("register");
                    setShowLogin(true);
                  }}
                  className="px-4 py-2 text-nowrap bg-orange-500 text-white shadow-md hover:scale-105 ease-in-out duration-300 rounded-lg hover:bg-orange-600 hover:shadow-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR & OVERLAY --- */}
      <MobileSidebar open={open} setOpen={setOpen} />
    </div>
  );
};

export default Navbar;
