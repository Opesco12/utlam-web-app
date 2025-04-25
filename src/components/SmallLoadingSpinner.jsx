import React from "react";

const SmallLoadingSpinner = ({ color }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-6 h-6 rounded-full border-4 border-t-4  border-t-transparent animate-spin border-[${color}]`}
      ></div>
    </div>
  );
};

export default SmallLoadingSpinner;
