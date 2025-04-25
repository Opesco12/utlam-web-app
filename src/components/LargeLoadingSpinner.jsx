import React from "react";

const LargeLoadingSpinner = ({ color }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-12 h-12 rounded-full border-4 border-t-4  border-t-transparent animate-spin border-[${color}]`}
      ></div>
    </div>
  );
};

export default LargeLoadingSpinner;
