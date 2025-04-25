import React from "react";

import StyledText from "./StyledText";
import { Colors } from "../constants/Colors";

const FilterBox = ({ text, selected, onPress }) => {
  return (
    <div
      className="p-1 px-4 rounded-full border flex "
      style={{
        borderColor: selected ? Colors.primary : Colors.lightPrimary,
        backgroundColor: selected ? Colors.primary : Colors.white,
      }}
      onClick={onPress}
    >
      <StyledText
        className={"sm:text-[12px]"}
        variant="medium"
        color={selected ? Colors.white : Colors.lightPrimary}
      >
        {text}
      </StyledText>
    </div>
  );
};

export default FilterBox;
