import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

const CreatePin = () => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);

  const digitRefs = useRef([]);
  const confirmRefs = useRef([]);

  useEffect(() => {
    digitRefs.current = digitRefs.current.slice(0, 4);
    confirmRefs.current = confirmRefs.current.slice(0, 4);

    if (digitRefs.current[0]) {
      digitRefs.current[0].focus();
    }
  }, []);

  const handlePinChange = (index, value, isPinField) => {
    const newValue = value.replace(/[^0-9]/g, "").slice(0, 1);

    if (isPinField) {
      const newPin = [...pin];
      newPin[index] = newValue;
      setPin(newPin);

      if (newValue && index < 3) {
        digitRefs.current[index + 1].focus();
      }
    } else {
      const newConfirmPin = [...confirmPin];
      newConfirmPin[index] = newValue;
      setConfirmPin(newConfirmPin);

      if (newValue && index < 3) {
        confirmRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index, isPinField) => {
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      if (isPinField) {
        digitRefs.current[index - 1].focus();
      } else {
        confirmRefs.current[index - 1].focus();
      }
    }
  };

  const handleConfirm = () => {
    const pinString = pin.join("");
    const confirmPinString = confirmPin.join("");

    if (pinString.length !== 4 || confirmPinString.length !== 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    if (pinString !== confirmPinString) {
      toast.error("PINS do not match");
      return;
    }

    console.log(pinString, confirmPinString);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto ">
      <h1 className="text-2xl font-bold mb-6 text-primary">Create Your PIN</h1>

      <div className="w-full mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter PIN
        </label>
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={`pin-${index}`}
              ref={(el) => (digitRefs.current[index] = el)}
              type="password"
              value={pin[index]}
              onChange={(e) => handlePinChange(index, e.target.value, true)}
              onKeyDown={(e) => handleKeyDown(e, index, true)}
              className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md  focus:ring-2 focus:ring-primary focus:outline-none"
              maxLength={1}
              inputMode="numeric"
            />
          ))}
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm PIN
        </label>
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={`confirm-${index}`}
              ref={(el) => (confirmRefs.current[index] = el)}
              type="password"
              value={confirmPin[index]}
              onChange={(e) => handlePinChange(index, e.target.value, false)}
              onKeyDown={(e) => handleKeyDown(e, index, false)}
              className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary  focus:outline-none"
              maxLength={1}
              inputMode="numeric"
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full py-3 px-4 bg-primary hover:bg-light-primary text-white font-medium rounded-md shadow transition-colors"
      >
        Confirm PIN
      </button>
    </div>
  );
};

export default CreatePin;
