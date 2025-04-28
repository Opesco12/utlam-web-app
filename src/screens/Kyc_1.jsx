import { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { Colors } from "../constants/Colors";
import HeaderText from "../components/HeaderText";

import { getClientInfo } from "../api";

const KYC_1 = () => {
  const [clientData, setClientData] = useState(null);

  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);
    // Add your form submission logic here
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
            governmentId: "",
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
                  Government Issued Identification
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
