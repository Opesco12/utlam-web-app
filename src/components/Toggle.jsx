import { useState } from "react";

import FilterBox from "./FilterBox";
import { Colors } from "../constants/Colors";

const Toggle = ({ options, onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState(options[0].value);

  const handlePress = (value) => {
    setSelectedValue(value);
    onValueChange(value);
  };
  return (
    <div className="flex justify-center mb-5 gap-[8px] md:gap-10 ">
      {options.map((option, index) => (
        <FilterBox
          key={index}
          text={option.label}
          selected={option.value === selectedValue}
          style={{
            backgroundColor:
              selectedValue === option.value ? Colors.primary : Colors.white,
          }}
          onPress={() => handlePress(option.value)}
        />
      ))}
    </div>
  );
};

export default Toggle;
