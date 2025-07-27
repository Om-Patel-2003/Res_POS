import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
    </div>
  );
};

export default FullScreenLoader;
