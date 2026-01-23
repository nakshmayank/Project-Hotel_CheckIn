import { useAppContext } from "../context/AppContext";

const MainBanner = () => {
  const { setState, setShowLogin } = useAppContext();

  return (
    <section className="relative bg-[url('/service-bg.png')] shadow-xl rounded-t-2xl bg-cover bg-top bg-no-repeat overflow-hidden">
      {/* Gradient Background */}
      {/* <img src="/service-bg.png" alt="" className="" /> */}

      <div className="flex lg:justify-center backdrop-blur-sm">
        {/* <div className="absolute inset-0  -z-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10"></div> */}
        {/* <div className="p-5 rounded-2xl">
          <h1 className="text-6xl text-center text-[#44B1CF] font-bold pt-10">A Complete Digital Hotel Management Solution</h1>
        </div> */}

        <div className="max-w-2xl p-5 my-20 lg:ml-16">
          {/* Right: Text Content - Positioned on Right */}
          <div className="w-full rounded-3xl">
            <div className="flex flex-col items-center space-y-16">
              <div className="space-y-6 flex flex-col items-center">
                {/* Top Heading */}
                <div className="inline-block">
                  <span className="px-4 py-1.5 bg-orange-100/30 text-white text-sm font-semibold rounded-full tracking-wide">
                    MODERNIZE YOUR OPERATIONS
                  </span>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-6xl text-center font-bold text-orange-500 leading-tight tracking-tight">
                    Smart Digital <br />{" "}
                    <span className="text-white bg-clip-text">
                      Check-In Management
                    </span>
                  </h1>
                </div>
                <div>
                  <p className="text-lg text-center text-white leading-relaxed max-w-2xl">
                    Transform your hotel's guest experience with an intuitive
                    digital check-in system. Eliminate paperwork, enhance
                    security, and delight guests with seamless operations.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => {
                    setState("register");
                    setShowLogin(true);
                  }}
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Register your Hotel</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
                <button className="px-8 py-4 border-2 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-5 pt-4">
                <div className="bg-gray-200/10 text-center rounded-2xl p-4 w-full">
                  <p className="text-3xl font-bold text-gray-700">500+</p>
                  <p className="text-sm text-white mt-1">Hotels Trust Us</p>
                </div>
                <div className="bg-gray-200/10 text-center rounded-2xl p-4 w-full">
                  <p className="text-3xl font-bold text-white">2M+</p>
                  <p className="text-sm text-white mt-1">Guests Processed</p>
                </div>
                <div className="bg-gray-200/10 text-center rounded-2xl p-4 w-full">
                  <p className="text-3xl font-bold text-orange-500">99.9%</p>
                  <p className="text-sm text-white mt-1">Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
