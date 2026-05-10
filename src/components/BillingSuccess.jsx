import React from "react";
import { useAppContext } from "../context/AppContext";

const BillingSuccess = ({ setShowSuccess, invoiceNo, onDownload }) => {
  const { navigate } = useAppContext();

  return (
    <div className="w-full fade-in max-w-md bg-gray-200/70 rounded-2xl shadow-2xl px-8 py-8 text-center relative">
      
      {/* Close */}
      <button
        onClick={() => setShowSuccess(false)}
        className="text-xl absolute right-4 top-2 hover:text-red-600 hover:scale-110 transition duration-200"
      >
        ×
      </button>

      {/* Tick */}
      <div className="flex justify-center mb-6">
        <svg width="96" height="96">
          <circle cx="48" cy="48" r="48" fill="#00c92b" />
          <path
            d="M28 50 L42 64 L70 36"
            stroke="white"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex justify-center">
  <div className="max-w-xs">

    <h2 className="text-3xl font-semibold text-gray-800 mb-2">
      🎉 Invoice Ready!
    </h2>

    <p className="text-gray-600 mb-3">
      Your bill has been successfully generated and is ready for download.
    </p>

    <p className="text-sm text-gray-500 mb-4">
      You can now print the invoice or access it anytime from your billing records.
    </p>

    <div className="bg-white/70 border border-gray-300 rounded-xl px-4 py-2 inline-block shadow-sm mb-6">
      <p className="text-xs text-gray-500">Invoice Number</p>
      <p className="text-primary-500 font-semibold tracking-wide">
        {invoiceNo}
      </p>
    </div>

  </div>
</div>

      {/* Actions */}
      <div className="flex flex-col gap-3 items-center">

        <button
          onClick={onDownload}
          className="w-full px-6 py-3 rounded-lg bg-gray-700 text-white font-medium shadow-md hover:scale-105 hover:bg-gray-800 transition"
        >
          Print / Download Invoice
        </button>

        <button
          onClick={() => {
            setShowSuccess(false);
            navigate("/dashboard/billing-list");
          }}
          className="w-full px-6 py-3 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Go to Billing List
        </button>

      </div>
    </div>
  );
};

export default BillingSuccess;