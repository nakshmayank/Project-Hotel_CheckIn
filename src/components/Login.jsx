import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { state, setState, setShowLogin, axios, setUser, navigate } =
    useAppContext();
  const [hName, sethName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  const checkPasswordStrength = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const score = Object.values(rules).filter(Boolean).length;

    return { rules, score };
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      console.log("I'm here");

      const { data } = await axios.post("/api/v1/Hotel/HotelLogin", {
        email: identifier,
        password,
      });

      console.log(data);

      const userId = data[0];

      if (userId?.Status === 1) {
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem("authUser", JSON.stringify(userId));
        storage.setItem("accessToken", userId.AccessToken);

        setUser(userId);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${userId.AccessToken}`;

        toast.success("Welcome back!");
        navigate("/dashboard");
        setShowLogin(false);
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const registrationHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      if (passwordStrength?.score < 4) {
        toast.error("Please use a strong password");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Password mismatch");
        return;
      }

      const { data } = await axios.post("/api/v1/Hotel/HotelRegistration", {
        hName,
        mobile,
        email,
        password,
      });

      console.log(data);
      const userId = data[0];

      if (userId?.Status === 1) {
        sessionStorage.setItem("authUser", JSON.stringify(userId));
        sessionStorage.setItem("accessToken", userId.AccessToken);
        setUser(userId);
        toast.success("Account created");
        navigate("/dashboard");
        setShowLogin(false);
      } else if (userId?.Status === 2) {
        toast.error("Mobile number already in use");
      } else {
        toast.error("Account already exists");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const passwordResetHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const { data } = await axios.post("/api/v1/Hotel/HotelResetPassword", {
        EmailId: email,
      });
      toast.success("Reset link has been sent to your email");
      setShowLogin(false);
    } catch (error) {
      toast.error("Failed to send reset link");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowPassword(false);
    setShowConfirmPassword(false);

    // Text fields
    sethName("");
    setEmail("");
    setMobile("");
    setIdentifier("");
    setPassword("");
    setConfirmPassword("");

    // UI / helper states
    setRememberMe(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordStrength(null);
    setShowPasswordInfo(false);
    setShowCountryDropdown(false);

    // reset country code to default
    setCountryCode("+91");
  }, [state]);

  useEffect(() => {
    const closeAllPopups = () => {
      setShowCountryDropdown(false);
      setShowPasswordInfo(false);
    };

    window.addEventListener("click", closeAllPopups);
    return () => window.removeEventListener("click", closeAllPopups);
  }, []);

  useEffect(() => {
    if (passwordStrength?.score >= 4) {
      const t = setTimeout(() => {
        setShowPasswordInfo(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [passwordStrength]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div>
        <div
          className={`bg-gray-50/30 fade-in-fast p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg w-[85vw] max-w-sm relative`}
        >
          <form
            className="p-4"
            onSubmit={
              state === "register"
                ? registrationHandler
                : state === "login"
                  ? loginHandler
                  : passwordResetHandler
            }
          >
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
              {state === "register"
                ? "Create Account"
                : state === "login"
                  ? "Welcome Back"
                  : "Forgot Password"}
            </h2>

            <p className="test-xs text-center text-gray-800/80 font-medium mb-7">
              {state === "register"
                ? "Sign up to get started"
                : "Sign in to your account"}
            </p>

            {/* Register */}
            {state === "register" && (
              <div>
                {/* name */}
                <div className="w-full">
                  {/* <p className="text-sm mb-1 font-medium text-gray-800">
                    Hotel Name
                  </p> */}
                  <input
                    name="hName"
                    autoComplete="hName"
                    onChange={(e) => sethName(e.target.value)}
                    value={hName}
                    placeholder="Hotel Name"
                    onFocus={(e) => (e.target.placeholder = "Enter hotel name")}
                    onBlur={(e) => (e.target.placeholder = "Hotel Name")}
                    className="w-full border-2 shadow-md p-2 rounded-lg mb-2 outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-primary-500"
                    type="text"
                    required
                  />
                </div>

                {/* Email */}
                <div className="w-full mb-2">
                  {/* <p className="text-sm mb-1 font-medium text-gray-800">
                    Email Address
                  </p> */}
                  <input
                    name="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Email Address"
                    onFocus={(e) =>
                      (e.target.placeholder = "Enter email address")
                    }
                    onBlur={(e) => (e.target.placeholder = "Email Address")}
                    className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-primary-500"
                    type="email"
                    required
                  />
                </div>

                {/* Mobile */}
                {/* <p className="text-sm mb-1 font-medium text-gray-800">
                  Mobile Number
                </p> */}
                <div className="w-full flex justify-between gap-1 mb-2">
                  <div className="relative w-[22%] md:w-[20%]">
                    {/* Selected value (input-like box) */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCountryDropdown(!showCountryDropdown);
                      }}
                      className={`flex items-center justify-between p-2 pr-1.5 bg-white border-2 rounded-lg shadow-md cursor-pointer outline-none ${
                        showCountryDropdown ? "border-primary-500" : ""
                      }`}
                    >
                      <span className="text-gray-900">{countryCode}</span>
                      <span>
                        <img
                          className={`w-3 h-3 transition-transform ${
                            showCountryDropdown ? "rotate-180" : ""
                          }`}
                          src="/down.png"
                          alt="down_arrow"
                        />
                      </span>
                    </div>

                    {/* Country Code Dropdown */}
                    {showCountryDropdown && (
                      <div
                        className="absolute z-50 mt-0.5 py-2 w-full bg-white border-2 hover:border-primary-500 rounded-lg shadow-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {["+91", "+1", "+44"].map((code) => (
                          <div
                            key={code}
                            onClick={() => {
                              setCountryCode(code);
                              setShowCountryDropdown(false);
                            }}
                            className="px-2 py-1 cursor-pointer text-gray-900 hover:bg-primary-200/60"
                          >
                            {code}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      name="mobile"
                      autoComplete="tel"
                      onChange={(e) => setMobile(e.target.value)}
                      value={mobile}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="Mobile Number"
                      onFocus={(e) =>
                        (e.target.placeholder = "Enter 10-digit mobile number")
                      }
                      onBlur={(e) => (e.target.placeholder = "Mobile Number")}
                      className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-primary-500"
                      type="tel"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="relative mb-2">
                  <div className="relative">
                    <input
                      name="password"
                      onChange={(e) => {
                        const val = e.target.value;
                        setPassword(val);
                        setPasswordStrength(checkPasswordStrength(val));
                      }}
                      value={password}
                      placeholder="Password"
                      onFocus={(e) => {
                        // setShowPasswordHints(true);
                        // setShowPasswordInfo(true);
                        e.target.placeholder = "Enter password";
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.placeholder = "Password";
                      }}
                      type={showPassword ? "text" : "password"}
                      className="w-full border-2 shadow-md p-2 pr-10 rounded-lg outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-primary-500"
                      required
                    />

                    {/* Show / Hide button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-primary-500"
                    >
                      {showPassword ? (
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

                  {/* Password Strength Warning */}
                  {password && passwordStrength && (
                    <div className="flex justify-end gap-2 items-center mt-1 px-1 mr-2">
                      <p className="text-sm font-medium">
                        {passwordStrength.score <= 2 && (
                          <span className="text-red-500/70">Weak password</span>
                        )}
                        {passwordStrength.score === 3 && (
                          <span className="text-yellow-500/70">
                            Moderate password
                          </span>
                        )}
                        {passwordStrength.score >= 4 && (
                          <span className="text-green-600/70">
                            Strong password
                          </span>
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPasswordInfo((v) => !v);
                        }}
                      >
                        <img className="w-3 h-3" src="/info.svg" alt="info" />
                      </button>
                    </div>
                  )}

                  {/* Password Strength Info */}
                  {password && showPasswordInfo && passwordStrength && (
                    <div
                      className={`absolute right-0 top-full bg-gray-50/60 backdrop-blur border-2 rounded-xl shadow-xl p-3 text-xs z-50 mr-2 hover:border-primary-500 transition-all duration-200 ease-out  ${
                        showPasswordInfo
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p
                        className={
                          passwordStrength.rules.length
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        • At least 8 characters
                      </p>
                      <p
                        className={
                          passwordStrength.rules.uppercase
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        • One uppercase letter (A–Z)
                      </p>
                      <p
                        className={
                          passwordStrength.rules.lowercase
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        • One lowercase letter (a–z)
                      </p>
                      <p
                        className={
                          passwordStrength.rules.number
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        • One number (0–9)
                      </p>
                      <p
                        className={
                          passwordStrength.rules.special
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        • One special character (!@#$%)
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative mb-2">
                  <input
                    name="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onFocus={(e) =>
                      (e.target.placeholder = "Enter password again")
                    }
                    onBlur={(e) => (e.target.placeholder = "Confirm Password")}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full border-2 shadow-md p-2 pr-10 rounded-lg outline-none 
               placeholder:text-primary-500 focus:placeholder:text-gray-400 
               focus:shadow-lg focus:border-primary-500"
                    required
                  />

                  {/* Show / Hide button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
               text-sm font-medium text-gray-600 hover:text-primary-500"
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

                <p className="text-sm mb-4 text-gray-900">
                  By creating an account, you agree to our{" "}
                  <span
                    className="text-primary-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowLogin(false);
                      navigate("/terms");
                    }}
                  >
                    Terms of Service
                  </span>{" "}
                  <span className="text-gray-900">and</span>{" "}
                  <span
                    className="text-primary-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowLogin(false);
                      navigate("/privacy-policy");
                    }}
                  >
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            )}

            {/* Login */}
            {state === "login" && (
              <div>
                {/* Email/Mobile Number */}
                <p className="text-sm mb-1 font-medium text-gray-800">
                  Email or Mobile Number
                </p>
                <input
                  name="email/mobile"
                  autoComplete="email/mobile"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or mobile number"
                  className="w-full border-2 shadow-md p-2 rounded-lg mb-4 outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-primary-500"
                  required
                />

                {/* Password */}
                <p className="text-sm mb-1 font-medium text-gray-800">
                  Password
                </p>
                <div className="relative mb-2">
                  <input
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    className="w-full border-2 shadow-md p-2 pr-10 rounded-lg outline-none 
               placeholder:text-primary-500 focus:placeholder:text-gray-400 
               focus:shadow-lg focus:border-primary-500"
                    required
                  />

                  {/* Show / Hide button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
               text-sm font-medium text-gray-600 hover:text-primary-500"
                  >
                    {showPassword ? (
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

                {/* Forgot Password */}
                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center gap-1 text-sm text-gray-900 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-primary-500 cursor-pointer"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <button
                    className="cursor-pointer"
                    type="button"
                    onClick={() => setState("reset")}
                  >
                    <p className="text-sm text-right text-primary-500 hover:underline">
                      Forgot password?
                    </p>
                  </button>
                </div>
              </div>
            )}

            {state === "reset" && (
              <div>
                {/* Email */}
                <p className="text-sm font-medium mb-1 text-gray-800">
                  Email Address
                </p>
                <input
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full border-2 shadow-md p-2 rounded-lg mb-4 outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-primary-500"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-md hover:scale-105 transition-all duration-300 ${
                loading
                  ? "bg-primary-500/80 cursor-not-allowed"
                  : "bg-primary-500 hover:bg-primary-500 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {state === "register"
                    ? "Creating Account..."
                    : state === "login"
                      ? "Authenticating..."
                      : "Sending link..."}
                </span>
              ) : (
                <span>
                  {state === "register"
                    ? "Sign Up"
                    : state === "login"
                      ? "Sign In"
                      : "Send Reset Link"}
                </span>
              )}
            </button>

            {state === "register" ? (
              <p className="text-center text-sm font-medium text-gray-900 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setState("login")}
                  className="text-primary-500 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-center text-sm font-medium text-gray-900 mt-4">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setState("register")}
                  className="text-primary-500 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
