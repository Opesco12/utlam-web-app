import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import "@smileid/web-components/smart-camera-web";
import { Colors } from "../constants/Colors";

const SmileIDKYC = ({ userEmail }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [hasSmileIDLoaded, setHasSmileIDLoaded] = useState(false);
  const containerRef = useRef(null);

  // Check if SmileID script is properly loaded
  useEffect(() => {
    // Check if custom elements are defined
    const isSmileIDDefined = customElements.get("smart-camera-web");
    setHasSmileIDLoaded(!!isSmileIDDefined);

    if (!isSmileIDDefined) {
      console.warn(
        "SmileID web component not found. Adding script dynamically."
      );

      // Try to add the script dynamically if not already loaded
      const script = document.createElement("script");
      script.src = "https://cdn.smileidentity.com/js/v2/smart-camera-web.js";
      script.async = true;
      script.onload = () => {
        console.log("SmileID script loaded dynamically");
        setHasSmileIDLoaded(true);
      };
      script.onerror = (err) => {
        console.error("Failed to load SmileID script:", err);
        toast.error("Failed to load identity verification component");
      };
      document.body.appendChild(script);
    }
  }, []);

  const getWebToken = async () => {
    const URL = "http://192.168.1.110:4000/token";
    setIsLoading(true);

    try {
      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Token response:", response.data);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Check if token is present and is a string
      if (!response.data.token || typeof response.data.token !== "string") {
        throw new Error("Invalid token format received from server");
      }

      setToken(response.data.token);

      // Return the token
      return response.data.token;
    } catch (e) {
      console.error(`Token API Error: ${e.name}, ${e.message}`);
      toast.error("Failed to get verification token");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateKYC = async () => {
    try {
      const tokenValue = await getWebToken();

      // Short delay to ensure DOM is ready
      setTimeout(() => {
        // Create the component programmatically
        if (containerRef.current) {
          // Clear previous content
          containerRef.current.innerHTML = "";

          // Create the web component
          const smartCamera = document.createElement("smart-camera-web");
          smartCamera.setAttribute("token", tokenValue);
          smartCamera.setAttribute("product", "biometric_kyc");
          smartCamera.setAttribute(
            "callback-url",
            "http://192.168.1.110:4000/callback"
          );
          smartCamera.setAttribute("environment", "sandbox");
          smartCamera.setAttribute("partner-id", "6329");
          smartCamera.setAttribute("partner-name", "UTLAM");
          smartCamera.setAttribute(
            "policy-url",
            "https://utlam.com/privacy-policy/"
          );
          smartCamera.setAttribute("theme-color", Colors.primary);

          // Set partner params
          const partnerParams = {
            job_id: `job_${Date.now()}`,
            user_id: `user_${userEmail || "anonymous"}`,
            sample_meta_data: "meta-data-value",
            sandbox_result: "0",
          };
          smartCamera.setAttribute(
            "partner-params",
            JSON.stringify(partnerParams)
          );

          // Add event listeners
          smartCamera.addEventListener("verification-success", handleSuccess);
          smartCamera.addEventListener("verification-error", handleError);
          smartCamera.addEventListener("close", handleClose);

          // Append to container
          containerRef.current.appendChild(smartCamera);

          console.log("Smart camera component added to DOM:", smartCamera);
        }
      }, 100);
    } catch (error) {
      console.error("Failed to initiate KYC:", error);
    }
  };

  const handleSuccess = (event) => {
    const { detail } = event;
    console.log("SmileID Success:", detail);
    toast.success("KYC verification completed successfully");
  };

  const handleError = (event) => {
    console.error("SmileID Error:", event.detail);
    toast.error("KYC verification failed");
  };

  const handleClose = () => {
    console.log("SmileID verification closed");
    setToken(null); // Reset token so button shows again
  };

  // Alternative approach using SmileIdentity function
  const useSmileIdentityAPI = async () => {
    try {
      const tokenValue = await getWebToken();

      if (!window.SmileIdentity) {
        throw new Error("SmileIdentity not found on window object");
      }

      // Use the window.SmileIdentity API instead of web component
      window.SmileIdentity({
        token: tokenValue,
        product: "biometric_kyc",
        callback_url: "http://192.168.1.110:4000/callback",
        environment: "sandbox", // Use sandbox for testing
        partner_details: {
          partner_id: "6329",
          name: "UTLAM",
          logo_url: "",
          policy_url: "https://utlam.com/privacy-policy/",
          theme_color: Colors.primary,
        },
        partner_params: {
          job_id: `job_${Date.now()}`,
          user_id: `user_${userEmail || "anonymous"}`,
          sample_meta_data: "meta-data-value",
          sandbox_result: "0",
        },
        onsuccess: (event) => {
          console.log("SmileID Success:", event);
          toast.success("KYC verification completed successfully");
        },
        onerror: (error) => {
          console.error("SmileID Error:", error);
          toast.error("KYC verification failed");
        },
        onclose: () => {
          console.log("SmileID modal closed");
          setToken(null);
        },
      });
    } catch (error) {
      console.error("Failed to use SmileIdentity API:", error);
      toast.error("Failed to start verification process");
    }
  };

  return (
    <div className="my-6 flex flex-col items-center">
      <h3 className="text-lg font-medium mb-4">Verify Your Identity</h3>

      {!token ? (
        <div className="flex gap-4">
          <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={handleInitiateKYC}
            disabled={isLoading || !hasSmileIDLoaded}
          >
            {isLoading ? "Loading..." : "Start Web Component KYC"}
          </button>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={useSmileIdentityAPI}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Use SmileIdentity API"}
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="min-h-[400px] w-full"
        >
          {/* Web component will be injected here */}
          <div className="text-center py-4">Initializing verification...</div>
        </div>
      )}
    </div>
  );
};

export default SmileIDKYC;
