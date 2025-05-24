import { useEffect, useState } from "react";
import { Formik, Form, Field, useField } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { Colors } from "../constants/Colors";
import HeaderText from "../components/HeaderText";
import {
  getClientInfo,
  getPendingDocuments,
  uploadClientDocument,
  updateClientInfo,
} from "../api";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import AppButton from "../components/AppButton";

const FileInput = ({ label, uploadButton, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      helpers.setValue(file);
    }
  };

  return (
    <div className="mb-4 flex items-center gap-4">
      <div className="flex-1">
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
      {uploadButton}
    </div>
  );
};

const KYC_1 = () => {
  const [clientData, setClientData] = useState(null);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("identification");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getClientInfo();
        setClientData(data);

        const pendingDocs = await getPendingDocuments();
        const requiredDocs = pendingDocs.filter(
          (doc) =>
            (doc.document === "MEANS OF IDENTIFICATION" && doc?.uploaded < 1) ||
            (doc.document === "PASSPORTS" && doc?.uploaded < 1) ||
            (doc.document === "UTILITY BILL" && doc?.uploaded < 1)
        );
        setPendingDocuments(requiredDocs);
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast.error("Failed to fetch client data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const documentConfig = {
    "MEANS OF IDENTIFICATION": {
      label: "Means of Identification",
      comment: "Means of Identification",
    },
    PASSPORTS: {
      label: "Passport Photograph",
      comment: "Passport Photograph",
    },
    "UTILITY BILL": {
      label: "Utility Bill",
      comment: "Utility Bill",
    },
  };

  const Tab = ({ active, onClick, children }) => {
    return (
      <button
        onClick={onClick}
        className={`px-3 rounded-md py-1 font-medium ${
          active ? `bg-white text-primary` : `text-gray-500 hover:text-gray-700`
        } transition-colors`}
      >
        {children}
      </button>
    );
  };

  const verificationSchema = Yup.object().shape({
    nin: Yup.string()
      .matches(/^\d{11}$/, "NIN must be 11 digits")
      .required("NIN is required"),
    bvn: Yup.string()
      .matches(/^\d{11}$/, "BVN must be 11 digits")
      .required("BVN is required"),
  });

  const handleUpdateInfo = async (values) => {
    try {
      const data = await updateClientInfo({
        clientType: clientData?.clientType,
        clientGroupId: clientData?.clientGroupId,
        surname: clientData?.surname,
        firstname: clientData?.firstname,
        dateOfBirth: clientData?.dateOfBirth,
        emailAddress: clientData?.emailAddress,
        address1: clientData?.address1,
        mobileNumber: clientData?.mobileNumber,
        gender: clientData?.gender,
        titleCode: clientData?.titleCode,
        nin: values?.nin,
        bvn: values?.bvn,
      });
      if (data) {
        toast.success("Data updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-full w-full">
      <HeaderText>KYC Details</HeaderText>

      <div className="bg-gray-200 rounded-lg w-fit p-2 mb-5">
        <div className="flex">
          <Tab
            active={activeTab === "identification"}
            onClick={() => setActiveTab("identification")}
          >
            {" "}
            Verification Numbers
          </Tab>

          <Tab
            active={activeTab === "documents"}
            onClick={() => setActiveTab("documents")}
          >
            Documents Upload
          </Tab>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "identification" && (
          <Formik
            enableReinitialize={true}
            initialValues={{
              nin: clientData?.nin || "",
              bvn: clientData?.bvn || "",
            }}
            validationSchema={verificationSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);

              handleUpdateInfo(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form>
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
                    disabled={clientData?.nin}
                  />
                  {errors.nin && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.nin}
                    </div>
                  )}
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
                    disabled={clientData?.bvn}
                  />
                  {errors.bvn && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.bvn}
                    </div>
                  )}
                </div>
                {!clientData?.nin ||
                  (!clientData?.bvn && (
                    <button
                      type="submit"
                      className="bg-primary w-full text-white py-2 px-4 rounded-md hover:bg-lightPrimary transition-colors mt-6"
                      disabled={
                        isSubmitting && clientData?.nin && clientData?.bvn
                      }
                    >
                      {isSubmitting ? (
                        <SmallLoadingSpinner color={Colors.white} />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ))}
              </Form>
            )}
          </Formik>
        )}

        {activeTab === "documents" && (
          <div>
            {isLoading ? (
              <div className="flex justify-center">
                <LargeLoadingSpinner color={Colors.primary} />
              </div>
            ) : pendingDocuments.length === 0 ? (
              <div className="text-center text-gray-700">
                All required documents have been uploaded.
              </div>
            ) : (
              pendingDocuments.map((doc) => (
                <Formik
                  key={doc.documentId}
                  initialValues={{
                    documentFile: null,
                  }}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                      if (!values.documentFile) {
                        toast.error("Please select a file to upload");
                        return;
                      }

                      const response = await uploadClientDocument(
                        values.documentFile,
                        doc.documentId,
                        documentConfig[doc.document].comment
                      );

                      if (response) {
                        toast.success(
                          `${
                            documentConfig[doc.document].label
                          } uploaded successfully`
                        );
                        setPendingDocuments((prev) =>
                          prev.filter((d) => d.documentId !== doc.documentId)
                        );
                        resetForm();
                      } else {
                        toast.error(
                          `Failed to upload ${
                            documentConfig[doc.document].label
                          }`
                        );
                      }
                    } catch (error) {
                      console.error(`Error uploading ${doc.document}:`, error);
                      toast.error(
                        `Error uploading ${documentConfig[doc.document].label}`
                      );
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                      <FileInput
                        id={`documentFile-${doc.documentId}`}
                        name="documentFile"
                        accept=".pdf,.jpg,.jpeg,.png"
                        label={documentConfig[doc.document].label}
                        disabled={isSubmitting}
                        uploadButton={
                          <button
                            type="submit"
                            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-lightPrimary transition-colors mt-6"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <SmallLoadingSpinner color={Colors.white} />
                            ) : (
                              "Upload"
                            )}
                          </button>
                        }
                      />
                    </Form>
                  )}
                </Formik>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KYC_1;
