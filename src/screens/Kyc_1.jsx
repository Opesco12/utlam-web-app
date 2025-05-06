import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";

import IdentityKYC from "../api/kyc/IdentityKYC";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { Colors } from "../constants/Colors";
import HeaderText from "../components/HeaderText";
import { getClientInfo } from "../api";

const KYC_1 = () => {
  const [clientData, setClientData] = useState(null);
  const [proofOfAddressFile, setProofOfAddressFile] = useState(null);
  const [idDocument, setIdDocument] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch client data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getClientInfo();
        console.log("Client Data:", data);
        setClientData(data);
      } catch (error) {
        console.error("Error fetching client data:", error);
        setErrorMessage("Failed to fetch client data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle file upload for proof of address
  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setProofOfAddressFile(file);
    }
  };

  const handleIdDocumentChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) setIdDocument(file);
  };

  // // Trigger KYC verification
  // const initiateKYC = () => {
  //   if (!clientData) {
  //     setErrorMessage("Client data not loaded. Please try again.");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setVerificationStatus(null);
  //   setErrorMessage(null);

  //   IdentityKYC.verify({
  //     merchant_key: "live_sk_RfxvOPK05yXRXObmXaYuGcs3pOWQJ3FrgWIoFDv",
  //     first_name: clientData.first_name || "Emmanuel",
  //     last_name: clientData.last_name || "Oyeleke",
  //     email: clientData.email || "oyelekemmanuel@gmail.com",
  //     config_id: "98f2a6cf-0363-499a-8d55-2d21550d51cc",
  //     user_ref: clientData.id || `user_${Date.now()}`,
  //     callback: (response) => {
  //       console.log("KYC Callback Response:", response);
  //       setIsLoading(false);
  //       if (response.status === "success") {
  //         setVerificationStatus("KYC Verification Successful!");
  //         setErrorMessage(null);
  //       } else {
  //         setVerificationStatus(null);
  //         setErrorMessage(
  //           response.message || "Verification failed. Please try again."
  //         );
  //       }
  //     },
  //   });
  // };

  return (
    <div className="h-screen w-full">
      <HeaderText>KYC Details</HeaderText>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Formik
          enableReinitialize={true}
          initialValues={{
            nin: clientData?.nin || "",
            bvn: clientData?.bvn || "",
            identificationType: "",
            identificationDocument: "",
            identificationExpiry: "",
          }}
          onSubmit={(values) => {
            console.log("Form submitted with values:", values);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="nin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  National Identification Number
                </label>
                <Field
                  id="nin"
                  name="nin"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="bvn"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bank Verification Number
                </label>
                <Field
                  id="bvn"
                  name="bvn"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="governmentId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Identification Type
                </label>
                <Field
                  as="select"
                  id="governmentId"
                  name="governmentId"
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select an ID type</option>
                  <option value="international_passport">
                    International Passport
                  </option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="voters_card">Voter's Card</option>
                </Field>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="idDocument"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Identification Document
                </label>
                <input
                  id="idDocument"
                  name="identificationDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleIdDocumentChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="identificationExpiry"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Identification Expiry
                </label>
                <Field
                  id="identificationExpiry"
                  name="identificationExpiry"
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="proofOfAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Proof of Address
                </label>
                <input
                  id="proofOfAddress"
                  name="proofOfAddress"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {/* {proofOfAddressFile && (
                  <p className="text-xs text-green-600 mt-1">
                    File selected: {proofOfAddressFile.name}
                  </p>
                )} */}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-lightPrimary transition-colors"
              >
                {isSubmitting ? (
                  <SmallLoadingSpinner color={Colors.white} />
                ) : (
                  "Submit"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default KYC_1;

// {/* File upload for proof of address */}
// <div className="mb-4">
//   <label
//     htmlFor="proofOfAddress"
//     className="block text-sm font-medium text-gray-700 mb-1"
//   >
//     Proof of Address (Optional)
//   </label>
//   <input
//     id="proofOfAddress"
//     name="proofOfAddress"
//     type="file"
//     accept=".pdf,.jpg,.jpeg,.png"
//     onChange={handleFileChange}
//     className="w-full p-2 border border-gray-300 rounded-md"
//   />
//   {proofOfAddressFile && (
//     <p className="text-xs text-green-600 mt-1">
//       File selected: {proofOfAddressFile.name}
//     </p>
//   )}
// </div>

// {/* Button to trigger KYC widget */}
// <button
//   onClick={initiateKYC}
//   disabled={isLoading || !clientData}
//   className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-lightPrimary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
// >
//   {isLoading ? (
//     <SmallLoadingSpinner color={Colors.white} />
//   ) : (
//     "Start KYC Verification"
//   )}
// </button>

// {/* Display verification results */}
// {verificationStatus && (
//   <p className="text-green-600 mt-4">{verificationStatus}</p>
// )}
// {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
