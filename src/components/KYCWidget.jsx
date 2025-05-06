// src/components/KYCWidget.js
import React, { useEffect, useState } from "react";
import IdentityKYC from "../api/kyc/IdentityKYC";

const KYCWidget = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    user_ref: "", // Optional: Generate a unique ID if needed
  });
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load the external script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://js.prembly.com/v1/inline/loader/src/loadingOverlay.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Initiate KYC verification
  const initiateWidget = () => {
    IdentityKYC.verify({
      merchant_key: "live_pk_7ThRl6e4HLrZgbN8yXyjIn7IpUur2pEuVFnQeOk", // Replace with your live public key
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      config_id: "98f2a6cf-0363-499a-8d55-2d21550d51cc", // Replace with your widget ID
      user_ref: formData.user_ref || `user_${Date.now()}`, // Fallback to a generated ID
      callback: (response) => {
        console.log("Callback Response", response);
        if (response.status === "success") {
          setVerificationStatus("Information Verified");
          setErrorMessage(null);
        } else {
          setVerificationStatus(null);
          setErrorMessage(response.message);
        }
      },
    });
  };

  return (
    <div>
      <h2>KYC Verification</h2>
      <form>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>User Reference (Optional):</label>
          <input
            type="text"
            name="user_ref"
            value={formData.user_ref}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <button
        onClick={initiateWidget}
        disabled={
          !formData.first_name || !formData.last_name || !formData.email
        }
      >
        Start KYC Verification
      </button>
      {verificationStatus && (
        <p style={{ color: "green" }}>{verificationStatus}</p>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default KYCWidget;
