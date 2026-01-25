import {
  ShieldCheck,
  Lock,
  Info,
  FileText,
  LifeBuoy,
  Phone,
  UserCheck,
  FileLock,
} from "lucide-react";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Grid */}
        <div className="flex justify-between">
          {/* Brand (LEFT) */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Stay<span className="text-orange-500">In</span></h2>
            <p className="mt-3 text-sm text-gray-400 max-w-sm">
              A secure and reliable hotel management system built for smooth
              front-desk operations and trusted daily use.
            </p>

            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Secure • Role-based • Encrypted</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="grid grid-cols-4">
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <Info className="w-4 h-4" />
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <FileText className="w-4 h-4" />
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <LifeBuoy className="w-4 h-4" />
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <Phone className="w-4 h-4" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us (NEW – Flowbite style) */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                Follow Us
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    X (Twitter)
                  </a>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                Policies
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="pt-2">
                  <Link to="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies & Trust */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                Trust & Legal
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  Secure Data Handling
                </li>

                <li className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-green-400" />
                  Role-Based Access Control
                </li>

                <li className="flex items-center gap-2">
                  <FileLock className="w-4 h-4 text-green-400" />
                  Encrypted File Storage
                </li>

                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  Authorized Staff Only
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>
            © {new Date().getFullYear()} StayIn. All rights reserved.
          </span>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" aria-label="GitHub" className="hover:text-white">
              GitHub
            </a>
            <a href="#" aria-label="Discord" className="hover:text-white">
              Discord
            </a>
            <a href="#" aria-label="X" className="hover:text-white">
              X
            </a>
          </div>

          {/* Trust Badge */}
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-green-400" />
            Secure • Reliable • Operational
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
