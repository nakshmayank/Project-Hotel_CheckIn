import React from "react";
import { useAppContext } from "../context/AppContext";

const BillingSuccess = ({
  setShowSuccess,
  invoiceNo,
  onDownload,
  isGeneratingPdf,
}) => {
  const { navigate } = useAppContext();

  return (
    <div className="w-full fade-in max-w-md bg-gray-200/70 rounded-2xl shadow-2xl px-8 py-8 text-center relative">
      {/* Close */}
      <button
        onClick={() => setShowSuccess(false)}
        className="text-xl absolute right-3 top-3 bg-white/70 hover:bg-white shadow rounded-full hover:text-red-600 hover:scale-110 transition duration-200"
      >
        <span className="px-2">×</span>
      </button>

      {/* Tick */}
      <div className="flex justify-center mb-6">
        <svg
          className="fade-in"
          xmlns="http://www.w3.org/2000/svg"
          xml:space="preserve"
          width="96"
          height="96"
        >
          <g fill="none" stroke-miterlimit="10" stroke-width="0">
            <path
              fill="#00c92b"
              d="M53.735 2.593a10.77 10.77 0 0 1 13.954 3.74 10.76 10.76 0 0 0 8.506 4.912A10.77 10.77 0 0 1 86.41 21.459a10.76 10.76 0 0 0 4.911 8.506 10.77 10.77 0 0 1 3.74 13.954 10.76 10.76 0 0 0 0 9.821 10.77 10.77 0 0 1-3.74 13.955A10.76 10.76 0 0 0 86.41 76.2a10.77 10.77 0 0 1-10.214 10.214 10.76 10.76 0 0 0-8.506 4.912 10.77 10.77 0 0 1-13.954 3.74 10.76 10.76 0 0 0-9.821 0 10.77 10.77 0 0 1-13.949-3.748 10.76 10.76 0 0 0-8.506-4.912 10.77 10.77 0 0 1-10.214-10.215 10.76 10.76 0 0 0-4.912-8.506 10.76 10.76 0 0 1-3.74-13.951 10.76 10.76 0 0 0 0-9.821 10.77 10.77 0 0 1 3.74-13.955 10.76 10.76 0 0 0 4.912-8.505A10.77 10.77 0 0 1 21.46 11.238a10.76 10.76 0 0 0 8.506-4.912 10.77 10.77 0 0 1 13.952-3.734 10.76 10.76 0 0 0 9.82 0"
            />
            <path
              fill="#00b22a"
              d="M40.331 71.27V50.825l27.251-12.178 10.22 10.22z"
            />
            <path
              fill="#fff"
              d="M40.331 71.27 19.85 50.795l10.22-10.232 10.262 10.262L64.747 26.38l10.22 10.212z"
            />
          </g>
        </svg>
      </div>

      {/* Text */}
      <div className="flex justify-center">
        <div className="max-w-xs mb-5">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            🎉 Invoice Ready!
          </h2>

          <p className="text-gray-600 mb-3">
            Your bill has been successfully generated and is ready for download.
          </p>

          <p className="text-sm text-gray-500 mb-4">
            You can now print the invoice or access it anytime from your billing
            records.
          </p>

          {invoiceNo && (
            <div className="bg-white/70 border border-gray-300 rounded-full px-4 py-2 inline-block shadow-sm">
              <p className="text-xs text-gray-700">Invoice Number</p>
              <p className="text-primary-500 font-semibold tracking-wide">
                {invoiceNo}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={onDownload}
          className="w-full px-6 py-3 rounded-full bg-gray-700 text-white flex justify-center font-medium shadow-md hover:scale-105 hover:bg-gray-800 transition"
        >
          {isGeneratingPdf ? (
            <div className="flex gap-2 items-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Printing..</span>
            </div>
          ) : (
            "Print / Download Invoice"
          )}
        </button>

        <button
          onClick={() => {
            setShowSuccess(false);
            navigate("/dashboard/billing-list");
          }}
          className="w-full px-6 py-3 rounded-full border-2 border-gray-500 text-gray-700 hover:bg-gray-100 transition"
        >
          Go to Billing List
        </button>
      </div>
    </div>
  );
};

export default BillingSuccess;
