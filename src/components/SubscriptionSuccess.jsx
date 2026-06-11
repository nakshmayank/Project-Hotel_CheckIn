import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const SubscriptionSuccess = ({
  setShowSuccess,
  invoiceNo,
}) => {
  const { axios } = useAppContext();

  const [isDownloading, setIsDownloading] = useState(false);

const downloadInvoice = async () => {
  try {
    setIsDownloading(true);

    const response = await axios.get(
      `/api/v1/Hotel/payment/PlanDownloadInvoice/${invoiceNo}`,
      {
        responseType: "blob", // Important
      }
    );

    // Create downloadable file
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // If backend sends filename in header
    const contentDisposition =
      response.headers["content-disposition"];

    let filename = `Invoice-${invoiceNo}.pdf`;

    if (contentDisposition) {
      const match = contentDisposition.match(
        /filename="?([^"]+)"?/
      );

      if (match?.[1]) {
        filename = match[1];
      }
    }

    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Invoice download failed:", error);
  } finally {
    setIsDownloading(false);
  }
};

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
            🎉 Congratulations!
          </h2>

          <p className="text-gray-600 mb-3">
            You are successfully subscribed and ready to use premium services.
          </p>

          <p className="text-sm text-gray-500 mb-4">
            You can now download the subscription invoice or access it anytime from your subscription panel.
          </p>

          {invoiceNo && (
            <div className="bg-white/70 border border-gray-300 rounded-full px-4 py-2 inline-block shadow-sm">
              <p className="text-xs text-gray-700">Transaction ID:</p>
              <p className="text-primary-500 font-semibold tracking-wide">
                {invoiceNo}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      
        <button
          onClick={downloadInvoice}
          className="w-full px-6 py-3 rounded-full bg-gray-700 text-white flex justify-center font-medium shadow-md hover:scale-105 hover:bg-gray-800 transition"
        >
          {isDownloading ? (
            <div className="flex gap-2 items-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Downloading..</span>
            </div>
          ) : (
            "Download Invoice"
          )}
        </button>
    </div>
  );
};

export default SubscriptionSuccess;
