import { ShieldCheck, HelpCircle, BookOpen, AlertTriangle, UserCog, Mail } from "lucide-react";

const Support = () => {
  const cards = [
    {
      title: "Getting Started",
      description:
        "Learn how to create check-ins, add members, upload ID proofs, and complete check-outs smoothly.",
      action: "View Quick Guide →",
      icon: BookOpen,
    },
    {
      title: "ID Proof & Data Safety",
      description:
        "All ID documents are securely stored. Access is restricted and data is never shared with third parties.",
      action: "Learn how we protect your data →",
      icon: ShieldCheck,
    },
    {
      title: "Common Issues",
      description:
        "Facing upload errors, room allocation issues, or sync problems? Find quick solutions here.",
      action: "Troubleshooting →",
      icon: AlertTriangle,
    },
    {
      title: "Account & Access",
      description:
        "Manage roles, passwords, sessions, and ensure secure access across devices.",
      action: "Manage account security →",
      icon: UserCog,
    },
  ];

  return (
    <div className="py-12 pt-28 px-3 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support & Help</h1>
          <p className="text-gray-600 mt-1">
            Everything here is designed to keep your operations smooth, secure, and reliable.
          </p>
        </div>

        {/* Support Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-gray-100/70 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500">
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {card.description}
                  </p>
                  <button className="mt-3 text-sm font-medium text-primary-500 hover:underline">
                    {card.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-10 bg-gray-200/60 rounded-2xl p-6 shadow-inner">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Contact Support
          </h2>
          <p className="text-gray-600 mb-4">
            If something affects daily operations, our support team is ready to assist you.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-800">
              <Mail className="w-4 h-4" />
              <span>support@inndez.com</span>
            </div>
            <div className="text-gray-600">🕒 9:00 AM – 9:00 PM</div>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-6 text-xs text-gray-500 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Your data is protected using industry-standard security practices.</span>
        </div>
      </div>
    </div>
  );
};

export default Support;
