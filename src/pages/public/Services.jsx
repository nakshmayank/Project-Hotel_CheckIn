import {
  ClipboardCheck,
  Users,
  BedDouble,
  LogOut,
  ShieldCheck,
  FileText,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      group: "Front Desk Operations",
      items: [
        {
          title: "Guest Check-In",
          description:
            "Create check-ins quickly with member details, stay duration, and room allocation in a guided flow.",
          icon: ClipboardCheck,
        },
        {
          title: "Check-Out Management",
          description:
            "Complete guest check-outs smoothly with accurate stay tracking and status updates.",
          icon: LogOut,
        },
      ],
    },
    {
      group: "Guest & Member Management",
      items: [
        {
          title: "Member Details",
          description:
            "Add, update, and manage guest members associated with a stay, including age and contact information.",
          icon: Users,
        },
        {
          title: "ID Proof Handling",
          description:
            "Upload and securely store ID documents with support for front and back images or PDFs.",
          icon: FileText,
        },
      ],
    },
    {
      group: "Room & Stay Control",
      items: [
        {
          title: "Room Allocation",
          description:
            "Assign rooms based on availability and room types, ensuring clarity and avoiding conflicts.",
          icon: BedDouble,
        },
      ],
    },
    {
      group: "Security & Reliability",
      items: [
        {
          title: "Secure Data Handling",
          description:
            "All guest data and documents are protected using controlled access and secure communication.",
          icon: ShieldCheck,
        },
      ],
    },
  ];

  return (
    <div className="py-12 pt-28 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            A set of carefully designed features that support smooth hotel
            operations from check-in to check-out.
          </p>
        </div>

        {/* Service Groups */}
        <div className="space-y-8">
          {services.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {section.group}
              </h2>

              <div className="space-y-4">
                {section.items.map((item, j) => (
                  <div
                    key={j}
                    className="flex gap-4 bg-gray-100/70 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="p-2 h-fit rounded-lg bg-orange-500/10 text-orange-600">
                      <item.icon className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer reassurance */}
        <div className="bg-gray-200/60 rounded-xl p-5 text-sm text-gray-600">
          Services are continuously improved to meet operational needs, ensure
          reliability, and maintain secure handling of guest information.
        </div>
      </div>
    </div>
  );
};

export default Services;
