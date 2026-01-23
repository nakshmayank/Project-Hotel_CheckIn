import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { axios, navigate, user } = useAppContext();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("User");

  if (!token) {
    return (
      <p className="text-center text-red-600 mt-10">
        Invalid or expired reset link
      </p>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) return toast.error("Passwords mismatch");

    try {
      setLoading(true);

      const { data } = await axios.post("/api/v1/Hotel/HotelChangePassword", {
        UserId: token,
        CurrentPassword: "R",
        password: password,
      });

      if (data[0]?.Status === 1) {
        setShowSuccess(true);
      } else {
        toast.error("Password reset failed");
      }
    } catch (error) {
      toast.error("Reset link expired or invalid");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if(user) {
    toast.error("Already logged in!");
    navigate("/dashboard");
    return;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-300 to-amber-300/70 flex items-center justify-center px-4">
      <div>
        <div className="max-w-lg bg-gray-200/40 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mx-auto relative">
          <form onSubmit={submitHandler} className="p-5 pt-7">
            {/* Back to Home Button */}
            <button
              type="button"
              className="absolute top-3 left-3"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center gap-1 hover:-translate-x-1 transition-transform duration-300">
                <img className="w-3 h-3" src="/back2.png" alt="" />
                <span className="text-sm font-medium text-gray-900">Back to Home</span>
              </div>
            </button>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-7">
              Reset Password
            </h2>

            <div className="flex flex-col">
              <div className="mb-4">
                <p className="text-sm mb-1 font-medium text-gray-800">New Password</p>
                <div className="relative">
                  <input
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Enter new password"
                    type={showNewPassword ? "text" : "password"}
                    className="w-full border-2 shadow-md p-2 pr-10 rounded-lg outline-none 
               placeholder:text-orange-600 focus:placeholder:text-gray-400 
               focus:shadow-lg focus:border-orange-500"
                    required
                  />

                  {/* Show / Hide button */}
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
               text-sm font-medium text-gray-600 hover:text-orange-600"
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

              <div className="mb-4">
                <p className="text-sm mb-1 font-medium text-gray-800">Confirm Password</p>
                <div className="relative">
                  <input
                    name="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    placeholder="Confirm new password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full border-2 shadow-md p-2 pr-10 rounded-lg outline-none 
               placeholder:text-orange-600 focus:placeholder:text-gray-400 
               focus:shadow-lg focus:border-orange-500"
                    required
                  />

                  {/* Show / Hide button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
               text-sm font-medium text-gray-600 hover:text-orange-600"
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

              <button
                disabled={loading}
                className={`w-full mt-2 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 ${
                  loading
                    ? "bg-orange-500/80 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 hover:scale-105 hover:shadow-xl"
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-gray-200/70 rounded-2xl shadow-2xl px-8 py-8 text-center relative">
            {/* Curvy Tick Badge */}
            <div className="flex justify-center mb-6">
              <img src="/green_badge.png" alt="green_badge" />
            </div>

            {/* Text */}
            <div className="flex justify-center">
              <div className="max-w-xs">
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                  Password Changed!
                </h2>
                <p className="text-gray-500 mb-8">
                  Your password has been changed successfully.
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => navigate("/")}
              className="w-fit px-8 py-3 rounded-lg bg-gray-800 text-white font-medium shadow-md hover:scale-105 duration-300 hover:bg-gray-900 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
