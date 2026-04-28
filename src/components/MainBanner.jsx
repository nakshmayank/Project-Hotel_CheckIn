import { useAppContext } from "../context/AppContext";

const MainBanner = () => {
  const { setState, setShowLogin, showLogin } = useAppContext();

  return (
    <section className="relative w-full shadow-xl rounded-t-2xl overflow-hidden">
      {/* Background Image */}
      <img
        src="/main_banner.jpg"
        className="absolute hidden md:flex inset-0 w-full h-full object-cover object-center"
        alt=""
      />
      <img
        src="/main_banner_mobile.jpg"
        className="md:hidden flex absolute inset-0 w-full h-full object-cover object-top"
        alt=""
      />

      {/* 🔥 VISIBILITY OVERLAY (MAIN FIX) */}
      <div className="absolute inset-0 bg-black/40 md:bg-transparent md:bg-gradient-to-r from-black/90 via-black/20 to-transparent"></div>

      <div
        className={`relative px-3 md:pl-12 lg:pl-24 py-24 md:py-36 z-10 flex items-center justify-center w-full md:w-[50vw] 2xl:w-[42vw]`}
      >
        {/* Content Container */}
        <div className="w-full">
          
          <div className="flex flex-col items-center md:items-start space-y-14">

            {/* Headings */}
            <div className="space-y-6 flex flex-col items-center md:items-start">
              <div className="flex flex-col gap-2 text-4xl text-center md:text-left lg:text-6xl font-bold leading-tight tracking-tight">
                {/* Modern Technology, Timeless Hospitality */}
                <h1 className="text-primary-500">Crafting Welcomes </h1>
                <span className="text-white">
                  Where Honor Meets Comfort
                </span>
              </div>

              <p className="text-lg text-center md:text-left text-white/85 leading-relaxed max-w-4xl">
              Elevate each arrival with a seamless welcome experience, where comfort, care, and quiet precision shape every guest’s journey.
                {/* Transform your hotel's guest experience with an intuitive digital
                check-in system. Eliminate paperwork, enhance security, and delight
                guests with seamless operations. */}
              </p>
            </div>

            {/* Features */}
            <div className="lg:ml-4 flex flex-col text-white gap-3">
              <div className="flex gap-2 items-center">
                <img className="w-4 h-4" src="/check.png" alt="check" />
                <p>Effortless Arrivals and Graceful Departures</p>
                {/* <p>Seamless Check-In & Check-Out at No Cost</p> */}
              </div>

              <div className="flex gap-2 items-center">
                <img className="w-4 h-4" src="/check.png" alt="check" />
                <p>Every Guest Detail, Thoughtfully Organized</p>
                {/* <p>Centralized Guest Records at Your Fingertips</p> */}
              </div>

              <div className="flex gap-2 items-center">
                <img className="w-4 h-4" src="/check.png" alt="check" />
                <p>Dedicated Support, Whenever You Need It</p>
                {/* <p>24*7 Support</p> */}
              </div>
            </div>

            {/* Button (UNCHANGED LOGIC) */}
            <div className="w-full flex justify-center pt-5">
              <button
                onClick={() => {
                  setState("register");
                  setShowLogin(true);
                }}
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Register your Hotel</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>

            {/* Stats */}
              <div className="grid grid-cols-3 gap-5 pt-4">
                <div className="bg-gray-200/10 text-center rounded-2xl p-4 w-full">
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-sm text-primary-500 mt-1">Hotels Trust Us</p>
                </div>
                <div className="bg-gray-200/10 text-center rounded-2xl p-4 w-full">
                  <p className="text-3xl font-bold text-white">2M+</p>
                  <p className="text-sm text-primary-500 mt-1">Guests Processed</p>
                </div>
                <div className="bg-gray-200/10 text-center rounded-2xl p-4 w-full">
                  <p className="text-3xl font-bold text-white">99.9%</p>
                  <p className="text-sm text-primary-500 mt-1">Uptime</p>
                </div>
              </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
