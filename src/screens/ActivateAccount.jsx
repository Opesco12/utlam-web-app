import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";

import OtpInput from "../components/Otp_Input";
import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

import { obfuscateEmail } from "../helperFunctions/obfuscateEmail";
import { activateAccount, resnedActivationCode } from "../api";
import { useAuth } from "../context/AuthProvider";

const ActivateAccount = () => {
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [userId, setUserId] = useState(null);

  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stateData = location.state;

  const [code, setCode] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!stateData?.email) {
  //     navigate("/login");
  //   }
  // }, [stateData, navigate]);

  const fetchSmileLink = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://smile-id.vercel.app/initiate-smilelink",
        {
          email: stateData.email,
          // user_id: "oyelekemmanuel@gmail.com",
        }
      );
      const { url, job_id, user_id } = response.data;
      console.log("SmileLink response: ", response.data);
      setVerificationUrl(url);
      setJobId(job_id);
      setUserId(user_id);
      if (url) {
        const newTab = window.open(url, "_blank");

        if (!newTab) {
          toast.error("Please allow popups for this site.");
        }
        setVerifying(true);
      }
    } catch (error) {
      toast.error("Failed to start verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async (jobId, userId) => {
    if (!jobId) return;
    setLoading(true);
    try {
      console.log("Trying to check verification status");
      const response = await axios.post(`https://smile-id.vercel.app/status`, {
        userId: userId,
        jobId: jobId,
      });

      console.log("Job status response: ", response.data);
      if (response.data.job_success === true) {
        setIsUserVerified(true);
        setVerifying(false);
        toast.success(
          `Identity verification successful. ${response.data.result.ResultText}`
        );
      } else {
        setIsUserVerified(false);
        setVerifying(false);
        toast.error(
          `Identity verification failed. ${response.data.result.ResultText}`
        );
      }
    } catch (error) {
      toast.error("Error checking verification status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isUserVerified) {
      toast.error("Please complete identity verification first.");
      return;
    }
    setLoading(true);
    const info = {
      username: stateData?.email,
      securityCode: code.join(""),
    };
    try {
      const data = await activateAccount(info);
      if (data) {
        toast.success("Your account has been successfully activated");
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error activating account:", error.message);
      toast.error(
        "Failed to activate account. Please check the OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendActivationCodeHandler = async () => {
    if (!stateData?.email) {
      toast.error("Email not provided. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const data = await resnedActivationCode({ userName: stateData.email });
      if (data) {
        toast.success("Activation code sent successfully.");
      }
    } catch (error) {
      toast.error("Failed to resend activation code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen">
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
          <div className="mx-auto max-w-3/4 lg:w-1/2">
            <div className="mb-3">
              <StyledText
                type="heading"
                variant="semibold"
                color={Colors.primary}
              >
                Activate Account
              </StyledText>
              <br />
              <StyledText
                color={Colors.light}
                variant="medium"
                type="body"
              >
                {isUserVerified
                  ? `We have sent a security code to your email address ${
                      stateData?.email && obfuscateEmail(stateData?.email)
                    }. Enter the code below to verify.`
                  : "Kindly verify your identity to continue."}
              </StyledText>
            </div>
            {!isUserVerified && verifying === false ? (
              <button
                onClick={fetchSmileLink}
                disabled={loading}
                className="bg-primary text-white w-full py-3 px-4 mt-5 rounded-lg hover:bg-light-primary focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
              >
                {loading ? <SmallLoadingSpinner /> : "Verify Identity"}
              </button>
            ) : (
              !isUserVerified && (
                <button
                  onClick={() => checkUserStatus(jobId, userId)}
                  disabled={loading}
                  className="bg-primary text-white w-full py-3 px-4 mt-5 rounded-lg hover:bg-light-primary focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
                >
                  {loading ? (
                    <SmallLoadingSpinner />
                  ) : (
                    "Confirm Identity Verification"
                  )}
                </button>
              )
            )}
            {isUserVerified && (
              <>
                <div className="mb-7">
                  <OtpInput
                    code={code}
                    setCode={setCode}
                  />
                </div>
                {code.join("").length > 5 && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-primary text-white w-full py-3 px-4 rounded-lg hover:bg-light-primary focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
                  >
                    {loading ? <SmallLoadingSpinner /> : "Submit"}
                  </button>
                )}
                <div className="my-[10px] text-center">
                  <StyledText color={Colors.light}>
                    Didn't get a code?{" "}
                    <span
                      className="text-primary font-semibold cursor-pointer"
                      onClick={resendActivationCodeHandler}
                    >
                      Resend Code
                    </span>
                  </StyledText>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
