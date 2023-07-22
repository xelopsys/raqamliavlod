import React from "react";

export default function Loader() {
  return (
    <div role="status" className="animate-pulse">
      <div className="h-2.5 bg-gray-300 rounded-full max-w-[640px] mb-2.5 mx-auto"></div>
      <div className="h-2.5 mx-auto bg-gray-300 rounded-full max-w-[540px]"></div>
      <div className="flex items-center justify-center mt-4">
        <svg
          className="w-10 h-10 mr-2 text-gray-200"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <div className="w-20 h-2.5 bg-gray-200 rounded-full mr-3"></div>
        <div className="w-24 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
