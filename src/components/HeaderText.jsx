import React from "react";

import StyledText from "./StyledText";
import { Colors } from "../constants/Colors";

const HeaderText = ({ children }) => {
  return (
    <div className="mb-[15px] md:my-[25px] border-b border-gray-300 pb-3">
      <StyledText
        color={Colors.lightPrimary}
        type="subheading"
        variant="semibold"
      >
        {children}
      </StyledText>
    </div>
  );
};

export default HeaderText;
