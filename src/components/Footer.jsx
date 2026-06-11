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
      <div className="max-w-7xl mx-auto py-12">
        {/* Top Grid */}
        <div className="flex flex-col px-6 md:px-16 2xl:px-6 lg:flex-row text-center lg:text-left gap-10 items-center xl:items-start xl:justify-between">
          {/* Brand (LEFT) */}
          <div className="flex flex-col items-center lg:items-start">
            {/* <h2 className="text-xl font-semibold text-gray-700">Inn<span className="text-primary-500">Dez</span></h2> */}
            <img className="h-7" src="/inndez_orange_logo.png" alt="logo" />
            <p className="mt-3 text-sm text-gray-400 max-w-sm">
              A secure and reliable hotel management system built for smooth
              front-desk operations and trusted daily use.
            </p>

            <div className="flex justify-center sm:justify-start items-center gap-2 mt-4 text-sm text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Secure • Role-based • Encrypted</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full flex flex-wrap gap-6 justify-between lg:justify-end xl:w-fit lg:items-start lg:flex-row lg:gap-12">
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3 flex flex-col items-start text-sm">
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
                  <a
                    href="https://www.instagram.com/inndez"
                    className="hover:text-white"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/share/18ToyVgRcc/"
                    className="hover:text-white"
                  >
                    Facebook
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="hover:text-white">
                    LinkedIn
                  </a>
                </li> */}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-sm text-left font-semibold text-white mb-4">
                Policies
              </h3>
              <ul className="space-y-3 flex flex-col items-start text-sm text-gray-400">
                <li className="">
                  <Link to="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies & Trust */}
            <div className="">
              <h3 className="text-sm text-left font-semibold text-white mb-4">
                Trust & Legal
              </h3>
              <ul className="space-y-3 flex flex-col items-start text-sm text-gray-400">
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
        <div className="border-t border-gray-700 mx-6 2xl:mx-0 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col px-6 md:px-16 2xl:px-6 md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>
            © {new Date().getFullYear()} Techvio Enterprises. All rights
            reserved.
          </span>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/inndez"
              aria-label="Instagram"
              className="hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/share/18ToyVgRcc/"
              aria-label="Facebook"
              className="hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-facebook"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
              </svg>
            </a>
            {/* <a href="#" aria-label="X" className="hover:text-white">
              X
            </a> */}
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
