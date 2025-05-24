import React from "react";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import { Colors } from "../constants/Colors";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) {
    return null;
  }

  const getPageNumbers = () => {
    const delta = window.innerWidth < 640 ? 1 : 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <nav className="flex flex-wrap justify-center items-center space-x-1 sm:space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 sm:p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ArrowLeft
          size={16}
          color={Colors.black}
        />
      </button>

      <div className="flex flex-wrap justify-center items-center space-x-1 sm:space-x-2">
        {getPageNumbers().map((number, index) => (
          <React.Fragment key={index}>
            {number === "..." ? (
              <span className="px-2 py-1">...</span>
            ) : (
              <button
                onClick={() => onPageChange(number)}
                className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base ${
                  currentPage === number
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {number}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 sm:p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ArrowRight
          size={16}
          color={Colors.black}
        />
      </button>
    </nav>
  );
};

export default Pagination;
