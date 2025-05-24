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

  // Handle redirect from Smile Identity (runs in new tab)
  useEffect(() => {
    const status = searchParams.get("status");
    const userId = searchParams.get("user_id");

    if (status && userId && window.opener) {
      // Send message to the original tab
      window.opener.postMessage(
        { status, user_id: userId },
        "http://localhost:5173"
      );
      console.log("Sent message to original tab:", { status, user_id: userId });
      // Close the new tab
      window.close();
    } else if (status && userId && !window.opener) {
      console.warn("No opener window found. Handling redirect in current tab.");
      checkUserStatus(userId);
    }
  }, [searchParams]);

  // Listen for postMessage from new tab (runs in original tab)
  useEffect(() => {
    const handleMessage = (event) => {
      // Verify message origin for security
      if (
        event.origin !== "https://189zln6v-5173.uks1.devtunnels.ms" ||
        event.origin !== "http://localhost:5173"
      ) {
        console.warn("Received message from untrusted origin:", event.origin);
        return;
      }
      const { status, user_id } = event.data;
      if (status && user_id) {
        console.log("Received redirect data:", { status, user_id });
        // Update query parameters and check status
        navigate(`/account/activate?status=${status}&user_id=${user_id}`, {
          replace: true,
          state: stateData, // Preserve stateData
        });
        checkUserStatus(user_id);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, stateData]);

  // Redirect to login if no email in stateData
  // useEffect(() => {
  //   if (!stateData?.email) {
  //     navigate("/login");
  //   }
  // }, [stateData, navigate]);

  // Fetch Smile Identity verification link
  const fetchSmileLink = async () => {
    // if (!stateData?.email) {
    //   toast.error("An error occured");
    //   navigate("/login");
    //   return;
    // }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/initiate-smilelink",
        {
          // email: stateData.email, // Send email to backend for hashing
          user_id: "oyelekemmanuel@gmail.com",
        }
      );
      const { url, job_id, user_id } = response.data;
      setVerificationUrl(url);
      setJobId(job_id);
      setUserId(user_id);
      if (url) {
        const newTab = window.open(url, "_blank");
        if (!newTab) {
          toast.error("Please allow popups for this site.");
        }
      }
      console.log("SmileLink response:", response.data);
    } catch (error) {
      console.error("Error initiating SmileLink:", error.message);
      toast.error("Failed to start verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check verification status
  const checkUserStatus = async (userIdToCheck) => {
    if (!userIdToCheck) return;
    setLoading(true);
    try {
      console.log("Trying to check verification status");
      // const response = await axios.get(`http://localhost:3000/user-status/${userIdToCheck}`);
      // if (response.status !== 200) {
      //   throw new Error("Failed to fetch user status");
      // }
      // const { is_approved, jobs } = response.data;
      // if (is_approved) {
      //   toast.success("Verification approved! Enter the OTP to activate your account.");
      //   setIsUserVerified(true);
      // } else if (jobs.some((job) => job.status === "pending")) {
      //   toast.info("Verification pending. Please wait.");
      // } else {
      //   const failedReasons = jobs
      //     .filter((job) => job.result_code && job.result_code !== "1012")
      //     .map((job) => job.result_text)
      //     .join("; ");
      //   toast.error(`Verification failed: ${failedReasons || "Unknown reason"}. Please try again.`);
      // }
    } catch (error) {
      console.error("Error fetching user status:", error.message);
      toast.error("Error checking verification status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
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
        navigate("/dashboard"); // Redirect to dashboard after activation
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

  // Resend activation code
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
            {!isUserVerified && (
              <button
                onClick={fetchSmileLink}
                disabled={loading}
                className="bg-primary text-white w-full py-3 px-4 mt-5 rounded-lg hover:bg-light-primary focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
              >
                {loading ? <SmallLoadingSpinner /> : "Verify Identity"}
              </button>
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
