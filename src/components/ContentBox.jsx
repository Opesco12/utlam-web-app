import React from "react";

const ContentBox = ({
  children,
  backgroundColor,
  className,
  width,
  style,
  ...props
}) => {
  return (
    <div
      className={`p-5 ${className}`}
      style={{
        backgroundColor: backgroundColor,
        borderRadius: 12,
        boxShadow: "0 4px 8px 0px rgba(0, 0, 0, 0.2)",
        // width: width,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default ContentBox;
