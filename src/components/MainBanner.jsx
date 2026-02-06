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
        className={`relative px-5 md:pl-24 py-24 md:py-36 z-10 flex items-center justify-center w-full md:w-[50vw] 2xl:w-[42vw]`}
      >
        {/* Content Container */}
        <div className="w-full">
          
          <div className="flex flex-col items-center md:items-start space-y-14">

            {/* Headings */}
            <div className="space-y-6 flex flex-col items-center md:items-start">
              <div className="flex flex-col gap-2 text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
                <h1 className="text-white">Modern Technology, </h1>
                <span className="text-primary-500">
                  Timeless Hospitality
                </span>
              </div>

              <p className="text-lg text-center md:text-left text-white/85 leading-relaxed max-w-4xl">
                Transform your hotel's guest experience with an intuitive digital
                check-in system. Eliminate paperwork, enhance security, and delight
                guests with seamless operations.
              </p>
            </div>

            {/* Features */}
            <div className="ml-4 flex flex-col text-white gap-5">
              <div className="flex gap-2 items-center">
                <img className="w-4 h-4" src="/check.png" alt="check" />
                <p>Seamless Digital Check-In & Check-Out at No Cost</p>
              </div>

              <div className="flex gap-2 items-center">
                <img className="w-4 h-4" src="/check.png" alt="check" />
                <p>Centralized Digital Guest Records at Your Fingertips</p>
              </div>

              <div className="flex gap-2 items-center">
                <img className="w-4 h-4" src="/check.png" alt="check" />
                <p>24*7 Support</p>
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

          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
