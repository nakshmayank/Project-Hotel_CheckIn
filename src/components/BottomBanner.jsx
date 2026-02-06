import { useAppContext } from "../context/AppContext";

const BottomBanner = () => {
  const { setState, setShowLogin } = useAppContext();

  return (
    <section className="relative bg-[url('/bottom_banner.jpg')] bg-cover bg-top bg-no-repeat overflow-hidden">
      {/* Gradient Background */}
      {/* Blurred Background Image */}
{/* <div className="absolute inset-0 -z-10">
  <div className="w-full h-full bg-[url('/bottom_banner.jpg')] bg-cover bg-top bg-no-repeat blur-sm scale-110"></div>
</div> */}

{/* Dark Overlay */}
  {/* <div className="absolute inset-0 bg-black/40 -z-10"></div> */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-500 to-red-500 -z-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10"></div> */}

      <div className=""></div>
      <div className="flex items-center bg-gradient-to-b from-black/50 via-transparent to-black/50 justify-center"> 
        <div className="max-w-4xl mx-auto py-24 px-6 lg:px-8 text-center flex gap-64 flex-col">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Transform Your <span className="text-primary-500">Hotel?</span>
            </h2>
            <p className="text-xl text-[#E7E8D1] max-w-2xl mx-auto leading-relaxed">
              Join 500+ hotels that have already revolutionized their guest
              experience with our intelligent check-in system.
            </p>
          </div>

          <div>
            <div className="flex justify-center pt-6">
              <button
                onClick={() => {
                  setState("register");
                  setShowLogin(true);
                }}
                className="group px-8 py-4 bg-white text-primary-500 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Get Started Today</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              {/* <button className="px-8 py-4 border-2 border-primary-500 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300">
                Schedule Demo
              </button> */}
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-white text-sm font-medium">
              <div className="flex items-center gap-2">
                <img className="w-4 h-4" src="/check.png" alt="check" />
                Free 14-day trial
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="flex items-center gap-2">
                <img className="w-4 h-4" src="/check.png" alt="check" />
                No credit card required
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="flex items-center gap-2">
                <img className="w-4 h-4" src="/check.png" alt="check" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
        
    </section>
  );
};

export default BottomBanner;
