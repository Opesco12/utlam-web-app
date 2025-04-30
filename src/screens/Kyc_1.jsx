import { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { Colors } from "../constants/Colors";
import HeaderText from "../components/HeaderText";

import { getClientInfo } from "../api";

const KYC_1 = () => {
  const [clientData, setClientData] = useState(null);
  const [proofOfAddressFile, setProofOfAddressFile] = useState(null);

  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);
    console.log("Uploaded proof of address:", proofOfAddressFile);
    // Add your form submission logic here including the file
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setProofOfAddressFile(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getClientInfo();
      console.log(data);
      setClientData(data);
    };

    fetchData();
  }, []);

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
            identificationExpiry: "",
          }}
          onSubmit={handleSubmit}
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
                {proofOfAddressFile && (
                  <p className="text-xs text-green-600 mt-1">
                    File selected: {proofOfAddressFile.name}
                  </p>
                )}
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
