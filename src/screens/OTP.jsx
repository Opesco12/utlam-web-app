import { useLocation, useNavigate, Navigate } from "react-router-dom";

import AppButton from "../components/AppButton";
import OtpInput from "../components/Otp_Input";
import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import { obfuscateEmail } from "../helperFunctions/obfuscateEmail";
import { useState } from "react";
import { activateAccount, login2fa, resnedActivationCode } from "../api";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

import { useAuth } from "../context/AuthProvider";
import { Toaster, toast } from "sonner";

const Otp = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, header } = location.state;

  const [code, setCode] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (header) {
      const info = {
        username: email,
        securityCode: code.join(""),
      };
      const data = await activateAccount(info);
      if (data) {
        console.log(data);
        toast.success("Your account has been successfully activated");
        navigate("/login");
      }
    } else {
      const data = await login2fa({ email: email, code: code.join("") });
      if (data) {
        console.log(data);
        toast.success("Login Successful");
        userStorage.setItem(keys.user, data);
        setIsAuthenticated(true);
        const from = location.state?.from?.pathname || "/";
        return (
          <Navigate
            to={from}
            replace
          />
        );
      }
    }
    setLoading(false);
  };

  const resendActivationCode = async (email) => {
    setLoading(true);
    const data = await resnedActivationCode({ userName: email });
    if (data) {
      toast.success("Activation code has been sent succesfully.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen">
      <Toaster position="top-right" />
      <div className="grid md:grid-cols-2">
        <div className="bg-primary h-screen hidden md:block"></div>

        <div className="flex h-screen items-center justify-center ">
          <div className=" mx-auto max-w-3/4 lg:w-1/2">
            <div className="mb-3">
              <StyledText
                type="heading"
                variant="semibold"
                color={Colors.primary}
              >
                {header ? header : "OTP Verification"}
              </StyledText>
              <br />
              <StyledText
                color={Colors.light}
                variant="medium"
                type="body"
              >
                We have sent a security code to your email address{" "}
                {obfuscateEmail(email)}. Enter the code below to verify
              </StyledText>
            </div>

            <div className="mb-7">
              <OtpInput
                code={code}
                setCode={setCode}
              />
            </div>
            {code.join("").length > 5 && (
              <AppButton
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <SmallLoadingSpinner /> : "Submit"}
              </AppButton>
            )}

            {header && (
              <div className="my-[10px] text-center">
                <StyledText color={Colors.light}>
                  Didn't get a code?{"  "}
                  <span
                    className="text-primary font-semibold"
                    onClick={() => resendActivationCode(email)}
                  >
                    Resend Code
                  </span>
                </StyledText>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
