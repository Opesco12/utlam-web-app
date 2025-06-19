import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Lock, Refresh } from "iconsax-react";

import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import { Colors } from "../constants/Colors";
import HeaderText from "../components/HeaderText";
import {
  changeTransactionPin,
  createTransactionPin,
  getClientInfo,
  getWalletBalance,
  hasTransactionPin,
  resetTransactionPin,
  resetTransactionPinRequest,
} from "../api";
import StyledText from "../components/StyledText";

const Pin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasTransactionPin, setUserHasTransactionPin] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("create");

  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [oldPin, setOldPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmNewPin, setConfirmNewPin] = useState(["", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [resetNewPin, setResetNewPin] = useState(["", "", "", ""]);
  const [resetConfirmPin, setResetConfirmPin] = useState(["", "", "", ""]);

  const digitRefs = useRef([]);
  const confirmRefs = useRef([]);
  const oldPinRefs = useRef([]);
  const newPinRefs = useRef([]);
  const confirmNewPinRefs = useRef([]);
  const resetNewPinRefs = useRef([]);
  const resetConfirmPinRefs = useRef([]);
  const tokenRef = useRef(null);

  useEffect(() => {
    digitRefs.current = digitRefs.current.slice(0, 4);
    confirmRefs.current = confirmRefs.current.slice(0, 4);
    oldPinRefs.current = oldPinRefs.current.slice(0, 4);
    newPinRefs.current = newPinRefs.current.slice(0, 4);
    confirmNewPinRefs.current = confirmNewPinRefs.current.slice(0, 4);
    resetNewPinRefs.current = resetNewPinRefs.current.slice(0, 4);
    resetConfirmPinRefs.current = resetConfirmPinRefs.current.slice(0, 4);

    if (digitRefs.current[0] && activeSection === "create") {
      digitRefs.current[0].focus();
    } else if (oldPinRefs.current[0] && activeSection === "change") {
      oldPinRefs.current[0].focus();
    } else if (tokenRef.current && activeSection === "reset") {
      tokenRef.current.focus();
    }
  }, [activeSection]);

  const handlePinChange = (index, value, fieldType) => {
    const newValue = value.replace(/[^0-9]/g, "").slice(0, 1);

    switch (fieldType) {
      case "pin":
        setPin((prev) => {
          const newPin = [...prev];
          newPin[index] = newValue;
          return newPin;
        });
        if (newValue && index < 3 && digitRefs.current[index + 1]) {
          digitRefs.current[index + 1].focus();
        }
        break;
      case "confirmPin":
        setConfirmPin((prev) => {
          const newConfirmPin = [...prev];
          newConfirmPin[index] = newValue;
          return newConfirmPin;
        });
        if (newValue && index < 3 && confirmRefs.current[index + 1]) {
          confirmRefs.current[index + 1].focus();
        }
        break;
      case "oldPin":
        setOldPin((prev) => {
          const newOldPin = [...prev];
          newOldPin[index] = newValue;
          return newOldPin;
        });
        if (newValue && index < 3 && oldPinRefs.current[index + 1]) {
          oldPinRefs.current[index + 1].focus();
        }
        break;
      case "newPin":
        setNewPin((prev) => {
          const newNewPin = [...prev];
          newNewPin[index] = newValue;
          return newNewPin;
        });
        if (newValue && index < 3 && newPinRefs.current[index + 1]) {
          newPinRefs.current[index + 1].focus();
        }
        break;
      case "confirmNewPin":
        setConfirmNewPin((prev) => {
          const newConfirmNewPin = [...prev];
          newConfirmNewPin[index] = newValue;
          return newConfirmNewPin;
        });
        if (newValue && index < 3 && confirmNewPinRefs.current[index + 1]) {
          confirmNewPinRefs.current[index + 1].focus();
        }
        break;
      case "resetNewPin":
        setResetNewPin((prev) => {
          const newResetNewPin = [...prev];
          newResetNewPin[index] = newValue;
          return newResetNewPin;
        });
        if (newValue && index < 3 && resetNewPinRefs.current[index + 1]) {
          resetNewPinRefs.current[index + 1].focus();
        }
        break;
      case "resetConfirmPin":
        setResetConfirmPin((prev) => {
          const newResetConfirmPin = [...prev];
          newResetConfirmPin[index] = newValue;
          return newResetConfirmPin;
        });
        if (newValue && index < 3 && resetConfirmPinRefs.current[index + 1]) {
          resetConfirmPinRefs.current[index + 1].focus();
        }
        break;
      default:
        console.error(`Unknown fieldType: ${fieldType}`);
        return;
    }
  };

  const handleKeyDown = (e, index, fieldType) => {
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      switch (fieldType) {
        case "pin":
          digitRefs.current[index - 1]?.focus();
          break;
        case "confirmPin":
          confirmRefs.current[index - 1]?.focus();
          break;
        case "oldPin":
          oldPinRefs.current[index - 1]?.focus();
          break;
        case "newPin":
          newPinRefs.current[index - 1]?.focus();
          break;
        case "confirmNewPin":
          confirmNewPinRefs.current[index - 1]?.focus();
          break;
        case "resetNewPin":
          resetNewPinRefs.current[index - 1]?.focus();
          break;
        case "resetConfirmPin":
          resetConfirmPinRefs.current[index - 1]?.focus();
          break;
      }
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const pinString = pin.join("");
    const confirmPinString = confirmPin.join("");

    if (pinString.length !== 4 || confirmPinString.length !== 4) {
      toast.error("Please enter all 4 digits");
      setIsSubmitting(false);
      return;
    }

    if (pinString !== confirmPinString) {
      toast.error("PINs do not match");
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      accountNo: walletBalance?.[0]?.walletAccountNo,
      transactionPin: Number(pinString),
    };

    try {
      const response = await createTransactionPin(requestData);
      if (response?.status === true) {
        toast.success("Successfully created transaction PIN");
        setUserHasTransactionPin(true);
        setPin(["", "", "", ""]);
        setConfirmPin(["", "", "", ""]);
      } else {
        toast.error(response?.message || "Failed to create transaction PIN");
      }
    } catch (error) {
      toast.error("An error occurred while creating the PIN");
      console.error(error);
    }

    setIsSubmitting(false);
  };

  const handleChangePin = async () => {
    setIsSubmitting(true);
    const oldPinString = oldPin.join("");
    const newPinString = newPin.join("");
    const confirmNewPinString = confirmNewPin.join("");

    if (
      oldPinString.length !== 4 ||
      newPinString.length !== 4 ||
      confirmNewPinString.length !== 4
    ) {
      toast.error("Please enter all 4 digits for all fields");
      setIsSubmitting(false);
      return;
    }

    if (newPinString !== confirmNewPinString) {
      toast.error("New PINs do not match");
      setIsSubmitting(false);
      return;
    }

    if (oldPinString === newPinString) {
      toast.error("New PIN must be different from old PIN");
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      oldPin: Number(oldPinString),
      newPin: Number(newPinString),
    };

    try {
      const response = await changeTransactionPin(requestData);
      if (response?.status === true) {
        toast.success("Successfully changed transaction PIN");
        setActiveSection("create");
        setOldPin(["", "", "", ""]);
        setNewPin(["", "", "", ""]);
        setConfirmNewPin(["", "", "", ""]);
      } else {
        toast.error(response?.message || "Failed to change transaction PIN");
      }
    } catch (error) {
      toast.error("An error occurred while changing the PIN");
      console.error(error);
    } finally {
      setIsMenuHidden(false);
    }

    setIsSubmitting(false);
  };

  const handleResetPin = async () => {
    setIsSubmitting(true);
    try {
      const response = await resetTransactionPinRequest(
        clientInfo?.emailAddress
      );
      if (response?.status === true) {
        toast.success(
          "PIN reset request sent successfully. Please check your email for the reset token."
        );
        setActiveSection("reset");
      } else {
        toast.error(response?.message || "Failed to request PIN reset");
      }
    } catch (error) {
      toast.error("An error occurred while requesting PIN reset");
      console.error(error);
    } finally {
      setIsMenuHidden(true);
    }

    setIsSubmitting(false);
  };

  const handleCreateNewPin = async () => {
    setIsSubmitting(true);
    const newPinString = resetNewPin.join("");
    const confirmPinString = resetConfirmPin.join("");

    if (newPinString.startsWith("0")) {
      toast.error("PIN cannot start with zero");
      setIsSubmitting(false);
      return;
    }

    if (!resetToken.trim()) {
      toast.error("Please enter the reset token");
      setIsSubmitting(false);
      return;
    }

    if (newPinString.length !== 4 || confirmPinString.length !== 4) {
      toast.error("Please enter all 4 digits for PIN fields");
      setIsSubmitting(false);
      return;
    }

    if (newPinString !== confirmPinString) {
      toast.error("New PINs do not match");
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      token: resetToken,
      newTransactionPin: Number(newPinString),
    };

    try {
      const response = await resetTransactionPin(requestData);

      console.log("Response from reset pin: ", response);

      if (response?.status === true) {
        toast.success("Successfully reset transaction PIN");
        setUserHasTransactionPin(true);
        setActiveSection("create");
        setResetToken("");
        setResetNewPin(["", "", "", ""]);
        setResetConfirmPin(["", "", "", ""]);
      } else {
        toast.error(response?.message || "Failed to reset transaction PIN");
      }
    } catch (error) {
      toast.error("An error occurred while resetting the PIN");
      console.error(error);
    } finally {
      setIsMenuHidden(false);
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pinResponse, balanceResponse, clientInfo] = await Promise.all([
          hasTransactionPin(),
          getWalletBalance(),
          getClientInfo(),
        ]);
        setUserHasTransactionPin(pinResponse?.status !== false);
        setWalletBalance(balanceResponse);
        setClientInfo(clientInfo);
      } catch (error) {
        toast.error("Failed to load data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <HeaderText>Pin</HeaderText>

      {isMenuHidden === false && (
        <div>
          {userHasTransactionPin && (
            <div className="mb-6">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  setActiveSection("change");
                  setIsMenuHidden(true);
                }}
              >
                <Lock
                  size={23}
                  color={Colors.lightPrimary}
                />
                <StyledText
                  color={Colors.lightPrimary}
                  style={{ cursor: "pointer" }}
                  type="title"
                >
                  Change PIN
                </StyledText>
              </div>
              <div
                className="flex items-center gap-3 cursor-pointer mt-5"
                onClick={handleResetPin}
              >
                <Refresh
                  size={23}
                  color={Colors.lightPrimary}
                />
                <StyledText
                  color={Colors.lightPrimary}
                  style={{ cursor: "pointer" }}
                  type="title"
                >
                  Reset PIN
                </StyledText>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Create PIN */}
      {activeSection === "create" && !userHasTransactionPin && (
        <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-primary">Create PIN</h1>

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
                  onChange={(e) =>
                    handlePinChange(index, e.target.value, "pin")
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "pin")}
                  className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
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
                  onChange={(e) =>
                    handlePinChange(index, e.target.value, "confirmPin")
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "confirmPin")}
                  className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>

          <button
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="w-full py-3 px-4 bg-primary hover:bg-light-primary text-white font-medium rounded-md shadow transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <SmallLoadingSpinner color={Colors.white} />
            ) : (
              "Confirm PIN"
            )}
          </button>
        </div>
      )}

      {/* Change PIN */}
      {activeSection === "change" && (
        <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-primary text-center">
            Change PIN
          </h1>

          <div className="w-full mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Old PIN
            </label>
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={`old-pin-${index}`}
                  ref={(el) => (oldPinRefs.current[index] = el)}
                  type="password"
                  value={oldPin[index]}
                  onChange={(e) =>
                    handlePinChange(index, e.target.value, "oldPin")
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "oldPin")}
                  className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                />
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              New PIN
            </label>
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={`new-pin-${index}`}
                  ref={(el) => (newPinRefs.current[index] = el)}
                  type="password"
                  value={newPin[index]}
                  onChange={(e) =>
                    handlePinChange(index, e.target.value, "newPin")
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "newPin")}
                  className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                />
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New PIN
            </label>
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={`confirm-new-pin-${index}`}
                  ref={(el) => (confirmNewPinRefs.current[index] = el)}
                  type="password"
                  value={confirmNewPin[index]}
                  onChange={(e) =>
                    handlePinChange(index, e.target.value, "confirmNewPin")
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "confirmNewPin")}
                  className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex gap-4">
            <button
              disabled={isSubmitting}
              onClick={() => {
                setActiveSection("create");
                setIsMenuHidden(false);
              }}
              className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleChangePin}
              className="w-full py-3 px-4 bg-primary hover:bg-light-primary text-white font-medium rounded-md shadow transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <SmallLoadingSpinner color={Colors.white} />
              ) : (
                "Change PIN"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Reset PIN */}
      {activeSection === "reset" && (
        <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-primary text-center">
            Reset PIN
          </h1>

          <div className="w-full mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reset Token (from email)
            </label>
            <input
              ref={tokenRef}
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none mb-6"
              placeholder="Enter reset token"
              disabled={isSubmitting}
            />

            <label className="block text-sm font-medium text-gray-700 mb-2">
              New PIN
            </label>
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={`reset-new-pin-${index}`}
                  ref={(el) => (resetNewPinRefs.current[index] = el)}
                  type="password"
                  value={resetNewPin[index]}
                  onChange={(e) =>
                    handlePinChange(index, e.target.value, "resetNewPin")
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "resetNewPin")}
                  className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                />
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New PIN
            </label>
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={`reset-confirm-pin-${index}`}
                  ref={(el) => (resetConfirmPinRefs.current[index] = el)}
                  type="password"
                  value={resetConfirmPin[index]}
                  onChange={(e) =>
                    handlePinChange(index, e.target.value, "resetConfirmPin")
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "resetConfirmPin")}
                  className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex gap-4">
            <button
              disabled={isSubmitting}
              onClick={() => setActiveSection("create")}
              className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleCreateNewPin}
              className="w-full py-3 px-4 bg-primary hover:bg-light-primary text-white font-medium rounded-md shadow transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <SmallLoadingSpinner color={Colors.white} />
              ) : (
                "Create New PIN"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pin;
