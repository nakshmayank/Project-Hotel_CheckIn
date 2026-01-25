import {
  Building2,
  ShieldCheck,
  Workflow,
  TrendingUp,
  Lock,
} from "lucide-react";

const About = () => {
  return (
    <div className="py-12 pt-28 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            About This Application
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            A purpose-built hotel management system focused on operational speed,
            data security, and reliability for real front-desk workflows.
          </p>
        </div>

        {/* What / Why Section */}
        <div className="bg-gray-100/70 rounded-2xl p-6 md:p-8 shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Designed for Hospitality Operations
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                This system is built specifically for hotels and stays to manage
                check-ins, guests, room allocations, and check-outs without
                unnecessary complexity. Every screen is optimized for daily
                reception work.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Rows (NOT cards) */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <Workflow className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">
                Workflow-First Design
              </h3>
              <p className="text-sm text-gray-600">
                The application follows real operational sequences, reducing
                training time and preventing mistakes during busy hours.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <ShieldCheck className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">
                Secure Handling of Guest Data
              </h3>
              <p className="text-sm text-gray-600">
                Guest details and ID documents are protected using access control,
                secure storage, and encrypted communication.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <TrendingUp className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">
                Built to Scale Reliably
              </h3>
              <p className="text-sm text-gray-600">
                Whether managing a few rooms or multiple stays, the system
                maintains performance and consistency as usage grows.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Strip (distinct visual) */}
        <div className="bg-gray-800 rounded-2xl p-6 text-white flex items-center gap-4">
          <Lock className="w-6 h-6 text-green-400" />
          <div>
            <p className="font-semibold">Security & Reliability First</p>
            <p className="text-sm text-gray-300">
              This application follows industry-standard practices to ensure data
              safety, controlled access, and dependable system behavior.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-xs text-gray-500">
          This system is intended for authorized staff use only and is continuously
          improved to meet operational and security standards.
        </div>
      </div>
    </div>
  );
};

export default About;
