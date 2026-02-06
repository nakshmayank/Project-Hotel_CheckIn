import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const { axios, setShowChangePassword, user } = useAppContext();
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [processing, setProcessing] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();

    try {
      const accessToken = user?.AccessToken;

      if (!accessToken) return;

      if (newPassword !== confirmPassword)
        return toast.error("Passwords mismatch");

      setProcessing(true);

      const { data } = await axios.post("/api/v1/Hotel/HotelChangePassword", {
        UserId: accessToken,
        CurrentPassword: oldPassword,
        password: newPassword,
      });

      if (data[0]?.Status === 1) {
        toast.success("Password changed");
        // sessionStorage.removeItem("remindMeLater");
      } else {
        toast.error("Incorrect Password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setProcessing(false);
      setShowChangePassword(false);
    }
  };

  const maybeHandler = () => {
    // if (!sessionStorage.getItem("remindMeLater")) {
    //   sessionStorage.setItem("remindMeLater", "1");
    // }

    setShowChangePassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={() => setShowChangePassword(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div className="bg-gray-100/30 p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg w-[85vw] max-w-sm relative">
          <form onSubmit={changePassword} className="p-4">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              Change Password
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm mb-1 font-medium text-gray-800">
                  Current Password
                </p>
                <input
                  className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-primary-500"
                  placeholder="Enter current password"
                  type="password"
                  onChange={(e) => setOld(e.target.value)}
                  required
                />
              </div>
              <div>
                <p className="text-sm mb-1 font-medium text-gray-800">
                  New Password
                </p>
                <div className="relative mb-2">
                  <input
                    name="password"
                    onChange={(e) => setNew(e.target.value)}
                    value={newPassword}
                    placeholder="Enter new password"
                    type={showNewPassword ? "text" : "password"}
                    className="w-full border-2 shadow-md p-2 pr-10 rounded-lg outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-primary-500"
                    required
                  />

                  {/* Show / Hide button */}
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-primary-500"
                  >
                    {showNewPassword ? (
                      <img
                        className="w-4 h-4"
                        src="/show.png"
                        alt="show_icon"
                      ></img>
                    ) : (
                      <img
                        className="w-4 h-4"
                        src="/hide.png"
                        alt="hide_icon"
                      ></img>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm mb-1 font-medium text-gray-800">
                  Confirm Password
                </p>
                <div className="relative mb-2">
                  <input
                    name="password"
                    onChange={(e) => setConfirm(e.target.value)}
                    value={confirmPassword}
                    placeholder="Confirm new password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full border-2 shadow-md p-2 pr-10 rounded-lg outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-primary-500"
                    required
                  />

                  {/* Show / Hide button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-primary-500"
                  >
                    {showConfirmPassword ? (
                      <img
                        className="w-4 h-4"
                        src="/show.png"
                        alt="show_icon"
                      ></img>
                    ) : (
                      <img
                        className="w-4 h-4"
                        src="/hide.png"
                        alt="hide_icon"
                      ></img>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-5">
              <button
                type="button"
                onClick={maybeHandler}
                className="text-gray-800 hover:text-black hover:underline"
              >
                Maybe Later
              </button>
              <button className="bg-primary-500/80 shadow-md hover:scale-105 duration-300 transition-transform ease-in-out hover:bg-primary-500 hover:shadow-lg text-white px-5 p-2 rounded-lg font-semibold">
              <span>
                
              </span>
                {processing ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </span> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
