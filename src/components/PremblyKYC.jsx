import React, { useEffect, useRef } from "react";

const PremblyKYC = ({
  merchantKey,
  firstName,
  lastName,
  email,
  userRef,
  configId,
  image,
  onVerificationComplete,
}) => {
  const scriptLoaded = useRef(false);
  const verificationInitiated = useRef(false);

  useEffect(() => {
    // Only load the script once
    if (!scriptLoaded.current) {
      const loadPremblyScript = () => {
        // Create script element for loading overlay
        const overlayScript = document.createElement("script");
        overlayScript.src =
          "https://js.prembly.com/v1/inline/loader/src/loadingOverlay.js";
        overlayScript.async = true;

        // Create script element for main Prembly script (can be hosted locally or loaded from somewhere)
        const premblyScript = document.createElement("script");
        premblyScript.textContent = window.premblyKYCScript; // We'll define this in index.html

        // Append scripts to document
        document.head.appendChild(overlayScript);

        // Wait for overlay script to load before initializing the verification
        overlayScript.onload = () => {
          document.body.appendChild(premblyScript);
          scriptLoaded.current = true;
        };
      };

      loadPremblyScript();
    }
  }, []);

  useEffect(() => {
    // Only initiate verification if script is loaded and verification hasn't been initiated
    if (
      scriptLoaded.current &&
      !verificationInitiated.current &&
      merchantKey &&
      firstName &&
      lastName &&
      email &&
      configId
    ) {
      // Set flag to prevent multiple initiations
      verificationInitiated.current = true;

      // Initialize the verification
      window.IdentityKYC.verify({
        merchant_key: merchantKey,
        first_name: firstName,
        last_name: lastName,
        email: email,
        user_ref: userRef || undefined,
        config_id: configId,
        image: image || undefined,
        callback: (response, data) => {
          // Reset flag to allow verification to be initiated again if needed
          verificationInitiated.current = false;

          // Call the callback prop with verification result
          if (onVerificationComplete) {
            onVerificationComplete(response, data);
          }
        },
      });
    }
  }, [
    merchantKey,
    firstName,
    lastName,
    email,
    userRef,
    configId,
    image,
    onVerificationComplete,
  ]);

  return (
    <div className="prembly-kyc-container">
      {/* The Prembly verification iframe will be appended to the body directly */}
    </div>
  );
};

export default PremblyKYC;
