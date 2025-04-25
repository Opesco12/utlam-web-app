import React from "react";

import AppRipple from "./AppRipple";

const AppRippleButton = ({ children, backgroundColor, width }) => {
  return (
    <AppRipple width={width}>
      <div
        style={{
          height: "50px",
          backgroundColor: backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          gap: 10,
        }}
      >
        {children}
      </div>
    </AppRipple>
  );
};

export default AppRippleButton;
