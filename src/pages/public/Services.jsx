import React from "react";
import {
  ClipboardCheck,
  Users,
  BedDouble,
  LogOut,
  ShieldCheck,
  FileText,
  CreditCard,
  BarChart3,
  Zap,
  ArrowRight,
  Sparkles,
  Contact2, // Added for the new card
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const Services = () => {
  const { setShowSubscription } = useAppContext();
  const freeServices = [
    {
      title: "Guest Check-In",
      description: "Quick guided flow for member details and room allocation.",
      icon: ClipboardCheck,
    },
    {
      title: "Check-Out Management",
      description:
        "Smooth check-outs with accurate stay tracking and status updates.",
      icon: LogOut,
    },
    {
      title: "Room Allocation",
      description:
        "Smart assignment based on real-time availability and types.",
      icon: BedDouble,
    },
    {
      title: "Stay Roster & ID View",
      description:
        "Instant access to the list of members in any stay along with their verified ID proofs.",
      icon: Contact2,
    },
  ];

  const paidServices = [
    {
      title: "Automated Billing",
      description:
        "Generate professional invoices and manage digital payments instantly.",
      icon: CreditCard,
    },
    {
      title: "Reports & Analytics",
      description: "Deep insights into occupancy rates and revenue trends.",
      icon: BarChart3,
    },
    {
      title: "Member History",
      description: "Maintain long-term guest profiles and loyalty preferences.",
      icon: Users,
    },
    {
      title: "Secure ID Vault",
      description: "Cloud-sync for ID documents with encrypted PDF support.",
      icon: FileText,
    },
  ];

  return (
    <div className="py-12 pt-28 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header - Matches Contact.jsx / About.jsx */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            Services
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            A set of carefully designed features that support smooth hotel
            operations from check-in to check-out.
          </p>
        </div>

        {/* Free Operations Section - Matches About.jsx card style */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Core Operations{" "}
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase">
              Lifetime Free<span> *</span>
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freeServices.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-transparent hover:border-gray-200 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Section - Matches Support.jsx grid style */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Advanced Management{" "}
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <Zap size={10} className="fill-orange-600" /> Premium
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paidServices.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative group overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition">
                  <Sparkles size={14} className="text-orange-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade CTA Strip - Matches Contact.jsx Trust Strip */}
        <div className="bg-gray-800 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <p className="font-bold text-lg">Scale Your Operations</p>
              <p className="text-sm text-gray-300">
                Unlock GST billing, deep analytics, and encrypted ID storage.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSubscription(true)}
            className="flex items-center gap-2 bg-white text-primary-500 font-bold py-3 px-6 rounded-xl hover:scale-105 duration-300 ease-in-out transition shadow-lg whitespace-nowrap active:scale-95"
          >
            Upgrade Now
            <ArrowRight className="text-gray-900" size={18} />
          </button>
        </div>

        {/* Terms & Conditions / Trust Footer */}
        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-2 text-[11px] text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-bold text-gray-700">*</span>
            <p>
              <strong>Lifetime Free:</strong> This tier provides permanent
              access to basic front-desk tools for individual stays. Terms
              include fair usage policies on guest record storage and document
              uploads. Inndez reserves the right to modify feature availability
              within the free tier to ensure system stability and performance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>
              Your data is protected using industry-standard security practices.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
