import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const CheckOut = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");

  const maskMobile = (num) => num.replace(/(\d{0})\d{6}(\d{4})/, "$1******$2");

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/stays/checkout/send-otp", { mobile });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/stays/checkout/verify-otp", {
        mobile,
        otp,
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const confirmCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/stays/checkout/verify-otp", {
        mobile,
        otp,
        paymentMode,
      });

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  // OTP resend countdown
  useEffect(() => {
    if (step === 2) {
      setTimer(30);
      setCanResend(false);

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="min-h-screen pt-20">
      <div className="p-10 flex flex-col xl:flex-row justify-center items-center gap-12 xl:gap-32">
        {/* Checkout Banner */}
        <div className="flex items-center justify-center">
          <div className="">
            <img
              className="w-[40vh] xl:w-[70vh] p-2"
              src="/checkout_banner.png"
              alt="checkout_banner"
            />
          </div>
        </div>

        {/* Checkout Form */}
        <div className="">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Visitor Check-Out
          </h2>

          <div className="bg-gray-200/40 p-8 xl:w-[50vh] rounded-xl shadow-lg">
            {/* Success */}
            {success && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-green-600 font-semibold">
                  Check-Out Successful
                </p>
              </div>
            )}

            {/* Step 1: Mobile */}
            {!success && step === 1 && (
              <div className="flex flex-col">
                <p className="text-xl font-medium text-center text-gray-800 mb-7">
                  Checkout Verification
                </p>
                <div className="w-full">
                  <p className="text-md font-medium text-gray-700 mb-2">
                    Registered Mobile Number
                  </p>
                  <input
                    className="w-full border-2 p-2.5 pl-3 shadow-md rounded-lg bg-gray-100/70 placeholder:text-orange-600 focus:placeholder:text-gray-500 focus:bg-orange-50 focus:border-orange-500 focus:shadow-lg outline-none mb-4"
                    placeholder="Enter here"
                    value={mobile}
                    maxLength={10}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div>
                  {error && (
                    <p className="text-orange-600 text-start text-sm mb-2.5">
                      {"*"}
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={sendOtp}
                    disabled={loading || mobile.length !== 10}
                    className="mt-1 p-3 px-5 bg-purple-900/80 hover:bg-purple-900/90 hover:shadow-xl text-white py-2 shadow-lg rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: OTP */}
            {!success && step === 2 && (
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium text-gray-800 mb-7">
                  Checkout Verification
                </p>
                <div className="w-full">
                  <p className="text-sm font-medium justify-start text-gray-700 mb-2">
                    OTP sent to {maskMobile(mobile)}
                  </p>

                  <div className="mb-3">
                    <input
                      className="w-full border-2 p-2.5 pl-3 bg-gray-100 shadow-md rounded-lg placeholder:text-orange-600 focus:placeholder:text-gray-500 focus:bg-orange-50 focus:border-orange-500 focus:shadow-lg outline-none"
                      placeholder="Enter OTP"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    {canResend ? (
                      <button
                        onClick={sendOtp}
                        className="text-orange-600 text-sm underline"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <div>
                        <p className="text-sm text-orange-600 mt-1">
                          <span className="text-gray-600">Didn’t receive OTP?</span> Resend in {timer}s
                        </p>
                      </div>
                    )}
                  </div>

                  {error && <p className="text-sm mb-2.5">{"*"}{error}</p>}

                  <div className="flex justify-center">
                    <button
                      onClick={verifyOtp}
                      disabled={loading || otp.length !== 6}
                      className="mt-1 p-3 px-5 bg-purple-900/80 hover:bg-purple-900/90 text-white rounded-lg shadow-lg hover:shadow-xl disabled:bg-gray-300"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 : Payment */}
            {!success && step === 3 && (
              <div className="flex flex-col items-center w-full">
                <p className="text-lg font-medium text-gray-800 mb-6">
                  Select a Payment Method
                </p>

                {/* Payment options */}
                <div className="w-full flex flex-col gap-3 mb-4">
                  {/* Cash */}
                  <div
                    onClick={() => setPaymentMode("CASH")}
                    className={`cursor-pointer p-2.5 pl-3 rounded-lg border flex items-center transition
          ${
            paymentMode === "CASH"
              ? "border-orange-500 bg-orange-50 border-2 shadow-md"
              : "border-gray-300 bg-gray-100/70 hover:bg-gray-200"
          }`}
                  >
                    <span className="font-medium">
                      Cash
                      <span className="pl-1 text-sm text-gray-600">
                        (Pay at Counter)
                      </span>
                    </span>
                  </div>

                  {/* Online */}
                  <div
                    onClick={() => setPaymentMode("ONLINE")}
                    className={`cursor-pointer p-2.5 pl-3 rounded-lg border flex justify-between items-center transition
          ${
            paymentMode === "ONLINE"
              ? "border-orange-500 bg-orange-50 border-2 shadow-md"
              : "border-gray-300 bg-gray-100/70 hover:bg-gray-200"
          }`}
                  >
                    <span className="font-medium">
                      Online
                      <span className="pl-1 text-sm text-gray-600">
                        (UPI / Card / Netbanking)
                      </span>
                    </span>
                  </div>
                </div>

                {error && <p className="text-sm mb-2">{error}</p>}

                <button
                  onClick={confirmCheckout}
                  disabled={loading}
                  className="mt-1 p-3 px-5 bg-purple-900/80 text-white shadow-lg rounded-lg disabled:bg-gray-300 hover:bg-purple-900/90 hover:shadow-xl"
                >
                  {loading ? "Processing..." : "Confirm Check-Out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
