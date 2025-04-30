import { Eye, EyeSlash, EmptyWallet } from "iconsax-react";

import StyledText from "./StyledText";
import { Colors } from "../constants/Colors";

import { amountFormatter } from "../helperFunctions/amountFormatter";

const BalanceCard = ({
  title,
  balance,
  hideBalance,
  onToggleHide,
  children,
}) => (
  <div className="bg-light-primary p-5 flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-2">
        <EmptyWallet
          variant="Bold"
          size={15}
          color={Colors.white}
        />
        <StyledText
          color={Colors.white}
          type="label"
        >
          {title}
        </StyledText>
      </div>

      <div className="flex items-center justify-between mb-[40px] mt-[15px]">
        <StyledText
          type="heading"
          variant="semibold"
          color={Colors.white}
        >
          {hideBalance ? "₦*******" : amountFormatter.format(balance)}
        </StyledText>
        {hideBalance ? (
          <EyeSlash
            size={25}
            color={Colors.white}
            variant="Bold"
            onClick={onToggleHide}
          />
        ) : (
          <Eye
            size={25}
            color={Colors.white}
            variant="Bold"
            onClick={onToggleHide}
          />
        )}
      </div>
    </div>
    {children}
  </div>
);

export default BalanceCard;
