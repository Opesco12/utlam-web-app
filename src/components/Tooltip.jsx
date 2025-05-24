import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";

const Tooltip = ({
  content,
  position = "top",
  iconSize = 16,
  className = "",
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile("ontouchstart" in window);
  }, []);

  const showTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => setIsVisible(true), isMobile ? 0 : delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const toggleTooltip = () => {
    setIsVisible(!isVisible);
  };

  const getPositionClasses = () => {
    // Base classes that allow multi-line text
    const baseClasses =
      "absolute z-[9999] bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg leading-relaxed";

    switch (position) {
      case "top":
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 sm:w-64 before:content-[''] before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900`;
      case "bottom":
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 sm:w-64 before:content-[''] before:absolute before:bottom-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-gray-900`;
      case "left":
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2 w-48 sm:w-64 before:content-[''] before:absolute before:left-full before:top-1/2 before:transform before:-translate-y-1/2 before:border-4 before:border-transparent before:border-l-gray-900`;
      case "right":
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 sm:w-64 before:content-[''] before:absolute before:right-full before:top-1/2 before:transform before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-gray-900`;
      default:
        return baseClasses;
    }
  };

  const eventHandlers = isMobile
    ? {
        onClick: toggleTooltip,
        onTouchStart: (e) => {
          e.preventDefault();
          toggleTooltip();
        },
      }
    : {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
      };

  return (
    <div className={`relative inline-block ${className}`}>
      <Info
        size={iconSize}
        className="text-gray-500 hover:text-gray-700 cursor-help touch-manipulation"
        {...eventHandlers}
      />

      {isVisible && (
        <>
          {isMobile && (
            <div
              className="fixed inset-0 z-[9998]"
              onClick={hideTooltip}
            />
          )}
          <div className={getPositionClasses()}>{content}</div>
        </>
      )}
    </div>
  );
};

export default Tooltip;
