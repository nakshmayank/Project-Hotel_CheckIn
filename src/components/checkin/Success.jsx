import React from "react";
import { useAppContext } from "../../context/AppContext";

const Success = ({setShowSuccess}) => {
    const {navigate} = useAppContext();
  return (
    <div className="w-full fade-in max-w-md bg-gray-200/70 rounded-2xl shadow-2xl px-8 py-8 text-center relative">
      <button
        onClick={() => {
          setShowSuccess(false);
        }}
        className="text-xl absolute right-4 top-2 hover:text-red-600 hover:scale-110 transition duration-200 ease-in-out"
      >
        ×
      </button>
      {/* Curvy Tick Badge */}
      <div className="flex justify-center mb-6">
        {/* <img className="w-24 fade-in" src={green_badge} alt="green_badge" /> */}
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
        <div className="max-w-xs">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Check-In Confirmed
          </h2>
          <p className="text-gray-600 mb-8">
            The guest has been successfully checked in. You can now view stay
            details, manage members, or proceed with checkout.
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => {
          setShowSuccess(false);
          navigate("/dashboard/manage-stay");
        }}
        className="w-fit px-8 py-3 rounded-lg bg-gray-700 text-white font-medium shadow-md hover:scale-105 ease-in-out duration-300 hover:bg-gray-800 transition"
      >
        Manage Stay
      </button>
    </div>
  );
};

export default Success;
