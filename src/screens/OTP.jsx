import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";

import AppButton from "../components/AppButton";
import OtpInput from "../components/Otp_Input";
import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import { obfuscateEmail } from "../helperFunctions/obfuscateEmail";
import { login2fa, resnedActivationCode } from "../api";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

import { useAuth } from "../context/AuthProvider";

const OTP_LENGTH = 6;

const Otp = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (code.join("").length < OTP_LENGTH) return;

    setLoading(true);
    try {
      const data = await login2fa({ email, code: code.join("") });
      if (data) {
        toast.success("Login Successful", {
          onAutoClose: () => {
            userStorage.setItem(keys.user, data);
            setIsAuthenticated(true);
            const from = searchParams.get("from") || "/";
            navigate(from, { replace: true });
          },
        });
      }
    } catch (error) {
      toast.error("Invalid security code");
    } finally {
      setLoading(false);
    }
  }, [code, email, navigate, setIsAuthenticated, searchParams]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && code.join("").length === OTP_LENGTH) {
        handleSubmit();
      }
    },
    [code, handleSubmit]
  );

  return (
    <div
      className="w-full h-screen"
      onKeyDown={handleKeyDown}
    >
      <Toaster position="top-right" />
      <div className="grid md:grid-cols-2">
        <div className="bg-primary h-screen hidden md:block">
          <img
            src="/images/auth-image.svg"
            className="h-full w-full object-cover"
            alt="Auth background"
          />
        </div>
        <div className="flex h-screen items-center justify-center">
          <div className="mx-auto w-[90%] md:w-[75%] lg:w-[50%]">
            <div className="mb-6">
              <StyledText
                type="heading"
                variant="semibold"
                color={Colors.primary}
              >
                OTP Verification
              </StyledText>
              <br />
              <StyledText
                color={Colors.light}
                variant="medium"
                type="body"
              >
                We have sent a security code to your email address{" "}
                {email && obfuscateEmail(email)}. Enter the code below to
                verify.
              </StyledText>
            </div>
            <div className="mb-7">
              <OtpInput
                code={code}
                setCode={setCode}
              />
            </div>
            <AppButton
              onClick={handleSubmit}
              disabled={loading || code.join("").length < OTP_LENGTH}
            >
              {loading ? <SmallLoadingSpinner /> : "Submit"}
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
