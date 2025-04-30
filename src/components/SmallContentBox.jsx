import { ArrowCircleRight2 } from "iconsax-react";

import StyledText from "./StyledText";
import { Colors } from "../constants/Colors";

const SmallContentBox = ({ icon, title, subtitle, navigateTo, navigate }) => {
  return (
    <div
      className="border border-gray-300 flex justify-between items-center rounded-lg p-[15px_10px] hover:bg-border/50 gap-[10px] cursor-pointer"
      onClick={() => navigate(navigateTo)}
    >
      <div className="flex items-center gap-[10px] md:gap-[15px]">
        {icon}
        <div>
          <StyledText
            variant="semibold"
            color={Colors.primary}
          >
            {title}
          </StyledText>
          <br />
          <StyledText
            type="label"
            color={Colors.light}
          >
            {subtitle}
          </StyledText>
        </div>
      </div>
      <ArrowCircleRight2
        size={35}
        color={Colors.primary}
        variant="Bold"
      />
    </div>
  );
};

export default SmallContentBox;
