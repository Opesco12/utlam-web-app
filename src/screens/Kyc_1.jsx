import { useEffect, useState } from "react";
import { Formik, Form, Field, useField } from "formik";

import "@smileid/web-components/smart-camera-web";

import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { Colors } from "../constants/Colors";
import HeaderText from "../components/HeaderText";
import { getClientInfo, uploadClientDocument } from "../api";
import axios from "axios";

const FileInput = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      helpers.setValue(file);
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        className="w-full p-2 border border-gray-300 rounded-md"
        type="file"
        onChange={handleChange}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

const KYC_1 = () => {
  const [clientData, setClientData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getClientInfo();
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

  return (
    <div className="h-screen w-full">
      <HeaderText>KYC Details</HeaderText>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Formik
          enableReinitialize={true}
          initialValues={{
            nin: clientData?.nin || "",
            bvn: clientData?.bvn || "",
            governmentId: "",
            identificationDocument: null,
            identificationId: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // console.log("Form submitted with values:", values);

              if (values.identificationDocument) {
                const data = await uploadClientDocument(
                  values.identificationDocument,
                  values.identificationId || values.nin,
                  "This is a development test"
                );
                console.log("Response gotten: ", data);
              } else {
                console.error("No document selected");
              }
            } catch (error) {
              console.error("Error uploading document:", error);
            } finally {
              setSubmitting(false);
            }
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

              <FileInput
                id="identificationDocument"
                name="identificationDocument"
                accept=".pdf,.jpg,.jpeg,.png"
                label="Identification Document"
              />

              <div className="mb-4">
                <label
                  htmlFor="identificationId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Document Id
                </label>
                <Field
                  id="identificationId"
                  name="identificationId"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* 
              Uncomment this if you want to add proof of address back
              <FileInput
                id="proofOfAddress"
                name="proofOfAddress"
                accept=".pdf,.jpg,.jpeg,.png"
                label="Proof of Address"
              />
              */}

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-lightPrimary transition-colors"
                disabled={isSubmitting}
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
