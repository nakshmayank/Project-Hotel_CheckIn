import { useAppContext } from "../context/AppContext";
import { useState } from "react";
import {
  ReceiptIndianRupee,
  BarChart3,
  TrendingUp,
  Headphones,
  Crown,
  FileSpreadsheet,
  Users,
  Sparkles,
} from "lucide-react";

const Subscription = () => {
  const { setShowSubscription } = useAppContext();

  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handleContactSupport = () => {
    window.open("https://wa.me/917982634341", "_blank");
  };

  const pricing = {
    pro: {
      monthly: 499,
      yearly: 4999,
    },
    business: {
      monthly: 799,
      yearly: 7999,
    },
  };

  const getPrice = (plan) => {
    if (plan === "starter") return "Free";
    return `₹${pricing[plan][billingCycle]}`;
  };

  const mainFeatures = [
    {
      icon: ReceiptIndianRupee,
      title: "GST Billing",
      desc: "Create professional invoices",
    },
    {
      icon: FileSpreadsheet,
      title: "Export Bills",
      desc: "PDF & Excel download",
    },
    {
      icon: BarChart3,
      title: "Reports",
      desc: "Daily & monthly insights",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      desc: "Track revenue trends",
    },
  ];

  const extraFeatures = [
    { icon: Users, title: "Guest History" },
    { icon: Headphones, title: "Priority Support" },
  ];

  // 🔥 Feature availability per plan
  const featureList = [
    { name: "Check-in / Check-out", starter: true, pro: true, business: true },
    { name: "Room allocation", starter: true, pro: true, business: true },
    { name: "Guest management", starter: true, pro: true, business: true },

    { name: "GST Billing", starter: false, pro: true, business: true },
    { name: "PDF / Excel Export", starter: false, pro: true, business: true },

    { name: "Reports", starter: false, pro: false, business: true },
    { name: "Analytics", starter: false, pro: false, business: true },

    { name: "Guest History", starter: false, pro: true, business: true },
    { name: "Priority Support", starter: false, pro: true, business: true },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={() => setShowSubscription(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-2xl bg-white/70 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={() => setShowSubscription(false)}
          className="absolute top-3 right-3 rounded-full bg-white/70 hover:bg-white shadow transition"
        >
          <span className="px-2 hover:font-bold hover:text-red-700">×</span>
        </button>
        <div className="grid md:grid-cols-2">
          {/* 🔥 LEFT SIDE (UNCHANGED) */}
          <div className="hidden sm:block p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <span className="flex items-center gap-2 bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full text-xs font-semibold">
                  <Crown size={14} />
                  PREMIUM PLAN
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Upgrade your hotel operations
              </h2>

              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Billing, reports & insights — all in one place
              </p>
            </div>

            {/* Highlight */}
            <div className="bg-gradient-to-r from-primary-500/10 to-orange-400/10 border border-primary-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-primary-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Billing & Reports Suite
                  </p>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Generate invoices, track payments, and monitor your business
                    growth effortlessly
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {mainFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="flex gap-3 items-start bg-white/60 border border-gray-200 rounded-lg p-4"
                  >
                    <Icon size={18} className="text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {f.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extras */}
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-800 mb-2">
                Included extras
              </p>

              <div className="flex gap-3 flex-wrap text-xs text-gray-700">
                {extraFeatures.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-gray-100/70 px-3 py-1.5 rounded-full"
                    >
                      <Icon className="text-primary-500" size={14} />
                      {f.title}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 🔥 RIGHT SIDE */}
          <div className="p-6 border-l border-gray-200 bg-white/40">
            <div className="flex justify-center mb-5">
              <div className="bg-gray-100 p-1 rounded-full flex text-xs relative">
                {/* Sliding background (modern effect) */}
                <div
                  className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-white shadow transition-all duration-300 ${
                    billingCycle === "monthly" ? "left-1" : "left-1/2"
                  }`}
                />

                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`relative px-4 py-1.5 rounded-full z-10 transition ${
                    billingCycle === "monthly"
                      ? "text-primary-500 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Monthly
                </button>

                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`relative px-4 py-1.5 rounded-full z-10 transition ${
                    billingCycle === "yearly"
                      ? "text-primary-500 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Yearly
                </button>
              </div>

              {/* Savings badge */}
              <span className="flex items-center ml-2">
                <span className="text-[10px] bg-green-100 text-green-600 h-fit p-1 rounded-full px-1.5">
                  Save 20%
                </span>
              </span>
            </div>

            <div>
              
            </div>

            {/* Plans */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {/* Starter */}
              <div
                onClick={() => setSelectedPlan("starter")}
                className={`cursor-pointer relative rounded-xl p-4 text-center transition-all duration-300 ${
                  selectedPlan === "starter"
                    ? "bg-primary-500/10 border-2 border-primary-500 shadow-lg scale-[1.05] transition-all duration-300 ease-in-out"
                    : "bg-white border border-gray-200 hover:shadow-md"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">Starter</p>
                <p className="text-xs text-gray-500">Basic</p>
                <p className="mt-3 text-lg font-semibold">Free</p>
              </div>

              {/* Pro */}
              <div
                onClick={() => setSelectedPlan("pro")}
                className={`cursor-pointer relative rounded-xl p-4 text-center transition-all duration-300 ${
                  selectedPlan === "pro"
                    ? "bg-primary-500/10 border-2 border-primary-500 shadow-lg scale-[1.05] transition-all duration-300 ease-in-out"
                    : "bg-white border border-gray-200 hover:shadow-md"
                }`}
              >
                {/* Badge stays */}
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-primary-500 text-white px-2 py-0.5 rounded">
                  POPULAR
                </span>

                <p className="text-sm font-semibold text-gray-900">Pro</p>
                <p className="text-xs text-gray-500">Daily ops</p>
                <p className="mt-3 text-lg font-semibold text-primary-600">
                  {getPrice("pro")}
                  <span className="text-xs text-gray-500">
                    {billingCycle === "monthly" ? "/mo" : "/yr"}
                  </span>
                </p>
              </div>

              {/* Business */}
              <div
                onClick={() => setSelectedPlan("business")}
                className={`cursor-pointer relative rounded-xl p-4 text-center transition-all duration-300 ${
                  selectedPlan === "business"
                    ? "bg-primary-500/10 border-2 border-primary-500 shadow-lg scale-[1.05] transition-all duration-300 ease-in-out"
                    : "bg-white border border-gray-200 hover:shadow-md"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">Business</p>
                <p className="text-xs text-gray-500">Insights</p>
                <p className="mt-3 text-lg font-semibold">
                  {getPrice("business")}
                  <span className="text-xs text-gray-500">
                    {billingCycle === "monthly" ? "/mo" : "/yr"}
                  </span>
                </p>
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="flex justify-between">
              {/* LEFT: Feature names */}
              <div className="space-y-3 py-2 text-sm flex-1">
                {featureList.map((f, i) => (
                  <div key={i} className="h-6 flex items-center">
                    <span className="text-gray-800">{f.name}</span>
                  </div>
                ))}
              </div>

              <div className="relative h-full py-2 w-[120px]">
                <div
                  className={`absolute top-0 bottom-0 w-1/3 rounded-2xl bg-primary-500/10 border border-primary-500 transition-all duration-300 ${
                    selectedPlan === "starter"
                      ? "left-0"
                      : selectedPlan === "pro"
                        ? "left-1/3"
                        : "left-2/3"
                  }`}
                />

                {/* Indicators list */}
                <div className="space-y-3 text-xs flex flex-col text-center relative z-10">
                  {featureList.map((f, i) => (
                    <div
                      key={i}
                      className="h-6 grid grid-cols-3 items-center justify-center"
                    >
                      {/* Starter */}
                      <span
                        className={`transition ${
                          f.starter
                            ? selectedPlan === "starter"
                              ? "text-primary-500 scale-125 font-bold"
                              : "text-green-500"
                            : "text-gray-400"
                        }`}
                      >
                        {f.starter ? "✔" : "-"}
                      </span>

                      {/* Pro */}
                      <span
                        className={`transition ${
                          f.pro
                            ? selectedPlan === "pro"
                              ? "text-primary-500 scale-125 font-bold"
                              : "text-green-500"
                            : "text-gray-400"
                        }`}
                      >
                        {f.pro ? "✔" : "-"}
                      </span>

                      {/* Business */}
                      <span
                        className={`transition ${
                          f.business
                            ? selectedPlan === "business"
                              ? "text-primary-500 scale-125 font-bold"
                              : "text-green-500"
                            : "text-gray-400"
                        }`}
                      >
                        {f.business ? "✔" : "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleContactSupport}
              className="w-full mt-3 bg-primary-500 text-white py-2.5 rounded-lg font-medium hover:scale-[1.02] transition"
            >
              {selectedPlan === "starter"
                ? "Continue with Free"
                : selectedPlan === "business"
                  ? "Upgrade to Business"
                  : "Upgrade to Pro"}
            </button>

            <p className="text-xs text-center text-gray-500 mt-2">
              Cancel anytime • No hidden charges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
