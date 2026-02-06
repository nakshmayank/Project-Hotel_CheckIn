import {
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const Contact = () => {
  return (
    <div className="py-16 pt-28 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Support channels for operational assistance and system-related
            issues. This application is monitored to ensure reliable daily use.
          </p>
        </div>

        {/* Primary Contact Block */}
        <div className="bg-gray-100/70 rounded-2xl p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Reach Support
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                For issues affecting check-ins, check-outs, or guest data.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-800">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>support@inndez.com</span>
              </div>

              <div className="flex items-center gap-3 text-gray-800">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>+91 8800214384</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Support Hours: 9:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Escalation Notice */}
        <div className="flex gap-4 bg-gray-200/60 rounded-xl p-6">
          <AlertCircle className="w-5 h-5 text-primary-500 mt-0.5" />
          <p className="text-sm text-gray-600">
            For critical operational issues during active guest stays, priority
            assistance is available during support hours.
          </p>
        </div>

        {/* Trust & Security Strip */}
        <div className="flex items-start gap-4 bg-gray-800 rounded-xl p-6 text-white">
          <ShieldCheck className="w-6 h-6 text-green-400 mt-0.5" />
          <div>
            <p className="font-medium">Secure Communication</p>
            <p className="text-sm text-gray-300 mt-1">
              All communication regarding guest data and system access is handled
              securely. Sensitive information should only be shared through
              official support channels.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500">
          This system is intended for authorized hotel staff only.
        </div>
      </div>
    </div>
  );
};

export default Contact;
