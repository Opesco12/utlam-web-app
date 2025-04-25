import React, { useState, useRef, useEffect } from "react";
import { Colors } from "../constants/Colors";

const OtpInput = ({
  codeLength = 6,
  onCodeFilled,
  isIncorrect,
  code,
  setCode,
}) => {
  const inputRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, codeLength);
      const newCode = [...code];

      for (let i = 0; i < pastedData.length; i++) {
        if (/^\d$/.test(pastedData[i])) {
          newCode[i] = pastedData[i];
        }
      }

      setCode(newCode);

      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
      const focusIndex =
        nextEmptyIndex === -1 ? codeLength - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex].focus();

      if (newCode.every((digit) => digit !== "")) {
        onCodeFilled && onCodeFilled(newCode.join(""));
      }
    };

    const container = containerRef.current;
    container.addEventListener("paste", handlePaste);

    return () => {
      container.removeEventListener("paste", handlePaste);
    };
  }, [code, codeLength, onCodeFilled, setCode]);

  const handleChange = (text, index) => {
    if (!/^[0-9]*$/.test(text) && text !== "") {
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      onCodeFilled && onCodeFilled(newCode.join(""));
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div
      className="flex justify-between py-3 lg:px-2"
      ref={containerRef}
    >
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={{ borderColor: isIncorrect ? Colors.error : undefined }}
          className="text-center text-lg justify-center h-[50px] w-[50px] flex border rounded-md focus:border-primary focus:outline-none focus:border-2"
          maxLength={1}
          type="tel"
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(event) => handleKeyPress(event, index)}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
};

export default OtpInput;
