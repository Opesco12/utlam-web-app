import { Colors } from "../constants/Colors";
import AppRipple from "./AppRipple";
import StyledText from "./StyledText";

const AppButton = ({
  children,
  onClick,
  disabled,
  classname,
  textColor,
  type,
}) => {
  return (
    <div onClick={onClick}>
      <AppRipple>
        <button
          className={`w-full flex items-center justify-center px-6 py-3  bg-primary rounded-lg ${classname}`}
          disabled={disabled}
          type={type}
        >
          <StyledText
            type="title"
            variant="medium"
            color={textColor || Colors.white}
          >
            {children}
          </StyledText>
        </button>
      </AppRipple>
    </div>
  );
};

export default AppButton;
