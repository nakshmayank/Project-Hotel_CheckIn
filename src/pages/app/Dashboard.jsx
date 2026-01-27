import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, setIsFirstLogin, navigate, setShowChangePassword, userData } =
    useAppContext();

  // const showReminder =
  //   user?.IsFirstLogin === 1 &&
  //   sessionStorage.getItem("remindMeLater") === "1";

  //   useEffect(() => {
  //   if (user?.IsFirstLogin === 1 && !sessionStorage.getItem("firstLoginPopupShown")) {
  //     setIsFirstLogin(true);
  //   }
  // }, [user]);

  return (
    <div className="py-12 px-5">
      <div className="w-full flex justify-center">
        <div className="">
          <div className="flex flex-col gap-6 w-full max-w-4xl">
            {/* Header */}
            <div className="opacity-0 fade-in-fast">
              <h1 className="text-2xl text-gray-900 font-bold">
                Welcome,{" "}
                <span className="text-orange-600">
                  {user?.FullName || "Hotel"}
                </span>
              </h1>
              <p className="text-gray-700">Manage your stay digitally</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-200/90 p-4 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-xl duration-300 cursor-pointer">
                <p className="text-sm text-gray-600">Active Stays</p>
                <h2 className="text-2xl text-gray-900 font-bold">8</h2>
              </div>

              <div className="bg-gray-200/40 p-4 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-xl duration-300 cursor-pointer">
                <p className="text-sm text-gray-600">Today’s Check-Ins</p>
                <h2 className="text-2xl text-gray-900 font-bold">3</h2>
              </div>

              <div className="bg-gray-200/40 p-4 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-xl duration-300 cursor-pointer">
                <p className="text-sm text-gray-600">Today’s Check-Outs</p>
                <h2 className="text-2xl text-gray-900 font-bold">2</h2>
              </div>
            </div>

            {/* Primary Action */}
            {/* <div className="mt-2 flex justify-end">
          <button
            onClick={() => navigate("/checkin")}
            className="px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl duration-300
                     bg-orange-500 hover:bg-orange-600"
          >
            New Check-In
          </button>
        </div> */}

            {/* Profile Snapshot */}
            <div className="bg-gray-200/40 p-5 rounded-2xl shadow-lg relative">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Profile
                </h2>

                {/* Logo */}
                {/* <div className="w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div> */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Full Name */}
                <div className="bg-gray-200/70 p-4 rounded-xl flex items-center gap-3 shadow-md">
                  <div className="flex-shrink-0 w-7 h-7 bg-orange-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">
                      Full Name
                    </p>
                    <p className="font-bold text-xs text-gray-900">
                      {userData?.Name || user?.FullName}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gray-200/70 p-4 rounded-xl flex items-center gap-3 shadow-md">
                  <div className="flex-shrink-0 w-7 h-7 bg-orange-200 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-600">Email</p>
                    <p className="font-bold text-xs text-gray-900 break-words leading-snug">
                      {userData?.email || user?.EmailId}
                    </p>
                  </div>
                </div>

                {/* Mobile */}
                <div className="bg-gray-200/70 p-4 rounded-xl flex items-center gap-3 shadow-md">
                  <div className="flex-shrink-0 w-7 h-7 bg-orange-200 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">
                      Mobile
                    </p>
                    <p className="font-bold text-xs text-gray-900">
                      {userData?.mobile || "not updated yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Three Cards: New Check-In, Check-Out, Manage Stays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* New Check-In Card */}
              <div className="bg-gray-200/40 p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-green-500/60 rounded-2xl flex items-center justify-center shadow-md">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Available
                  </span>
                </div>
                <h3 className="text-md font-bold text-gray-900 mb-2">
                  New Check-In
                </h3>
                <p className="text-sm text-gray-600 mb-5">
                  Start a new guest check-in process
                </p>
                <button
                  onClick={() => navigate("/dashboard/checkin")}
                  className="w-full bg-green-500/60 hover:bg-green-600/70 text-white font-bold py-4 rounded-2xl transition-all hover:scale-105 ease-in-out hover:shadow-lg duration-300"
                >
                  Check-In Guest
                </button>
              </div>

              {/* Check-Out Card */}
              <div className="bg-gray-200/40 p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-red-500/80 rounded-2xl flex items-center justify-center shadow-md">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    Action
                  </span>
                </div>
                <h3 className="text-md font-bold text-gray-900 mb-2">
                  Check-Out
                </h3>
                <p className="text-sm text-gray-600 mb-5">
                  Process guest check-out and billing
                </p>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-red-500/80 hover:bg-red-600/90 hover:scale-105 ease-in-out text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg duration-300"
                >
                  Check-Out Guest
                </button>
              </div>

              {/* Manage Stays Card */}
              <div className="bg-gray-200/40 p-6 rounded-2xl shadow-lg sm:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-blue-500/80 rounded-2xl flex items-center justify-center shadow-md">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Manage
                  </span>
                </div>
                <h3 className="text-md font-bold text-gray-900 mb-2">
                  Manage Stays
                </h3>
                <p className="text-sm text-gray-600 mb-5">
                  View and manage current stays
                </p>
                <button
                  onClick={() => navigate("/dashboard/manage-stay")}
                  className="w-full bg-blue-500/80 hover:bg-blue-600/90 hover:scale-105 ease-in-out text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg duration-300"
                >
                  Manage Stays
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-5 p-2">
              <h3 className="font-semibold text-lg mb-3">Recent Activities</h3>
              <div className="bg-gray-200/40 p-5 rounded-xl shadow-md">
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Room 203 checked in (10:30 AM)</li>
                  <li>• Room 105 checked out (9:15 AM)</li>
                  <li>• New booking created (yesterday)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right-side reminder */}
          {/* <div className="mt-10 mr-10 hidden lg:block">
        {showReminder && (
          <div className="max-w-64">
            <div className="bg-gray-200/40 flex flex-col justify-center rounded-2xl px-5 py-7 shadow-lg">
              <p className="font-semibold text-center text-gray-900 mb-3">
                🔐 Security Reminder
              </p>
              <p className="text-sm text-center text-gray-700 mb-5">
                You’re still using a temporary password. Please change it to
                secure your account.
              </p>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="px-5 bg-orange-500 text-white py-2.5 shadow-md hover:shadow-lg rounded-lg font-medium hover:scale-105 duration-300 ease-in-out hover:bg-orange-600"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
