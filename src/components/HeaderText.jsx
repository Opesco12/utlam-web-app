import React from "react";

import StyledText from "./StyledText";
import { Colors } from "../constants/Colors";

const HeaderText = ({ children }) => {
  return (
    <div className="mb-[15px] md:my-[25px]">
      <StyledText
        color={Colors.primary}
        type="subheading"
        variant="semibold"
      >
        {children}
      </StyledText>
    </div>
  );
};

export default HeaderText;
