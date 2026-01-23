import { useAppContext } from "../context/AppContext";

const BottomBanner = () => {
  const { setState, setShowLogin } = useAppContext();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 -z-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Transform Your Hotel?
          </h2>
          <p className="text-xl text-[#E7E8D1] max-w-2xl mx-auto leading-relaxed">
            Join 500+ hotels that have already revolutionized their guest experience with our intelligent check-in system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button 
            onClick={() => {setState("register"); setShowLogin(true)}}
            className="group px-8 py-4 bg-white text-orange-600 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Get Started Today</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button className="px-8 py-4 border-2 border-orange-500 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300">
            Schedule Demo
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-white text-sm font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free 14-day trial
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No credit card required
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            24/7 Support
          </div>
        </div>
      </div>
    </section>
  );
}

export default BottomBanner;
