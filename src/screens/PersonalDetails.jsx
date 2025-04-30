import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import HeaderText from "../components/HeaderText";
import { Colors } from "../constants/Colors";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

import {
  getClientInfo,
  getNextOfKins,
  createNextOfKin,
  updateClientInfo,
} from "../api";
import {
  personalInfoSchema,
  nextOfKinSchema,
} from "../validationSchemas/userSchema";

// Custom TextField component using Formik's Field
const TextField = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium">{label}</label>
      <Field
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      />
      <ErrorMessage
        name={props.name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
};

// Custom Select component using Formik's Field
const SelectField = ({ label, options, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium">{label}</label>
      <Field
        as="select"
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name={props.name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
};

// Tab component for switching between views
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

// Personal Information Form Component
const PersonalInfoForm = ({ userData, onSubmit, maritalStatusOptions }) => {
  const initialValues = {
    firstname: userData?.firstname || "",
    surname: userData?.surname || "",
    phoneNumber: userData?.mobileNumber || "",
    maritalStatus: userData?.maritalStatus || "",
    placeOfBirth: userData?.placeOfBirth || "",
    nationality: "",
    occupation: "",
    religion: "",
    mothersMaidenName: "",
  };

  return (
    <Formik
      validationSchema={personalInfoSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="w-full">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between relative">
              <div className="w-[48%]">
                <TextField
                  name="firstname"
                  label="First Name"
                  disabled
                />
              </div>
              <div className="w-[48%]">
                <TextField
                  name="surname"
                  label="Last Name"
                  disabled
                />
              </div>
            </div>

            <TextField
              name="phoneNumber"
              label="Phone Number"
              disabled
            />

            <SelectField
              name="maritalStatus"
              label={"Marital Status"}
              options={maritalStatusOptions}
              disabled={userData?.maritalStatus !== null}
            />

            <TextField
              name="placeOfBirth"
              label={"Place of Birth"}
              disabled={userData?.placeOfBirth !== null}
            />

            <TextField
              name="nationality"
              label={"Nationality"}
              disabled={userData?.nationality !== null}
            />

            <TextField
              name="occupation"
              label={"Occupation"}
              disabled={userData?.occupation !== null}
            />

            <TextField
              name="religion"
              label={"Religion"}
              disabled={userData?.religion !== null}
            />

            <TextField
              name="mothersMaidenName"
              label={"Mothers Maiden Name"}
              disabled={userData?.mothersMaidenName !== null}
            />

            <div className="mt-6">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  (userData?.maritalStatus !== null &&
                    userData?.placeOfBirth !== null)
                }
                className="bg-primary text-white w-full py-3 px-4 rounded-md hover:bg-light-primary focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <SmallLoadingSpinner color={Colors.white} />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// Next of Kin Form Component
const NextOfKinForm = ({
  nextOfKin,
  userHasNextOfKin,
  kinRelationships,
  genderOptions,
  onSubmit,
}) => {
  const initialValues = {
    kinFirstname: nextOfKin?.firstname || "",
    kinLastname: nextOfKin?.surname || "",
    kinEmail: nextOfKin?.email || "",
    kinPhoneNumber: nextOfKin?.telephoneNo || "",
    kinGender: nextOfKin?.gender || "",
    kinRelationship: nextOfKin?.relationship || "",
  };

  return (
    <Formik
      validationSchema={nextOfKinSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="w-full">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between relative">
              <div className="w-[48%]">
                <TextField
                  name="kinFirstname"
                  label="First Name"
                  disabled={userHasNextOfKin === 1}
                />
              </div>
              <div className="w-[48%]">
                <TextField
                  name="kinLastname"
                  label="Last Name"
                  disabled={userHasNextOfKin === 1}
                />
              </div>
            </div>

            <TextField
              name="kinEmail"
              label="Email Address"
              disabled={userHasNextOfKin === 1}
            />

            <TextField
              name="kinPhoneNumber"
              label="Phone Number"
              disabled={userHasNextOfKin === 1}
            />

            <SelectField
              name="kinRelationship"
              label="Relationship"
              options={kinRelationships}
              disabled={userHasNextOfKin === 1}
            />

            <SelectField
              name="kinGender"
              label="Gender"
              options={genderOptions}
              disabled={userHasNextOfKin === 1}
            />

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting || userHasNextOfKin === 1}
                className="bg-primary text-white w-full py-3 px-4 rounded-md hover:bg-light-primary focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <SmallLoadingSpinner color={Colors.white} />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const PersonalDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userHasNextOfKin, setUserHasNextOfKin] = useState(0);
  const [nextOfKin, setNextOfKin] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  const kinRelationships = [
    { label: "Spouse", value: "Spouse" },
    { label: "Parent", value: "Parent" },
    { label: "Sibling", value: "Sibling" },
    { label: "Son", value: "Son" },
    { label: "Daughter", value: "Daughter" },
    { label: "Guardian", value: "Guardian" },
    { label: "Aunt", value: "Aunt" },
    { label: "Uncle", value: "Uncle" },
    { label: "Niece", value: "Niece" },
    { label: "Nephew", value: "Nephew" },
    { label: "Cousin", value: "Cousin" },
    { label: "Other", value: "Other" },
  ];

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  const maritalStatusOptions = [
    {
      label: "Single",
      value: "s",
    },
    { label: "Married", value: "m" },
    { label: "Divorced", value: "d" },
    { label: "Widowed", value: "w" },
  ];

  const fetchData = async () => {
    try {
      const clientInfo = await getClientInfo();
      // const { firstname, surname, mobileNumber, maritalStatus, placeOfBirth } =
      //   clientInfo;
      // setUserData({
      //   firstname,
      //   surname,
      //   mobileNumber,
      //   maritalStatus,
      //   placeOfBirth,

      // });
      console.log(clientInfo);
      setUserData(clientInfo);

      console.log("Client info: ", clientInfo);

      const nextOfKins = await getNextOfKins();
      if (nextOfKins.length > 0) {
        setUserHasNextOfKin(1);
        setNextOfKin(nextOfKins[0]);
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePersonalInfoSubmit = async (values, { setSubmitting }) => {
    try {
      const personalInfoData = {
        ...userData,
        maritalStatus: values.maritalStatus,
        placeOfBirth: values.placeOfBirth,
      };

      const response = await updateClientInfo(personalInfoData);
      console.log("response: ", response);

      if (response !== undefined) {
        setLoading(true);
        fetchData();
        toast.success("Personal information updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update personal information");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextOfKinSubmit = async (values, { setSubmitting }) => {
    try {
      if (userHasNextOfKin === 0) {
        const {
          kinEmail,
          kinFirstname,
          kinLastname,
          kinPhoneNumber,
          kinGender,
          kinRelationship,
        } = values;

        if (
          !kinFirstname ||
          !kinLastname ||
          !kinEmail ||
          !kinPhoneNumber ||
          !kinRelationship ||
          !kinGender
        ) {
          toast.error("Please fill out all required fields");
          setSubmitting(false);
          return;
        }

        const nextOfKinData = {
          email: kinEmail,
          firstname: kinFirstname,
          surname: kinLastname,
          telephoneNo: kinPhoneNumber,
          relationship: kinRelationship,
          gender: kinGender,
        };

        const response = await createNextOfKin(nextOfKinData);
        if (response) {
          setUserHasNextOfKin(1);
          setNextOfKin(nextOfKinData);
          toast.success("Next of kin added successfully");
        }
      } else {
        toast.info("You already have a next of kin registered");
      }
    } catch (error) {
      toast.error("Failed to add next of kin");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  return (
    <div>
      <HeaderText>Personal Details</HeaderText>

      <div className="mt-5">
        <div className="bg-gray-200 rounded-lg w-fit p-2">
          <div className="flex">
            <Tab
              active={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
            >
              Personal Details
            </Tab>
            <Tab
              active={activeTab === "nextOfKin"}
              onClick={() => setActiveTab("nextOfKin")}
            >
              Next of Kin
            </Tab>
          </div>
        </div>

        <div className="py-6">
          {/* Personal Details Tab Content */}
          {activeTab === "personal" && (
            <PersonalInfoForm
              userData={userData}
              onSubmit={handlePersonalInfoSubmit}
              maritalStatusOptions={maritalStatusOptions}
            />
          )}

          {/* Next of Kin Tab Content */}
          {activeTab === "nextOfKin" && (
            <NextOfKinForm
              nextOfKin={nextOfKin}
              userHasNextOfKin={userHasNextOfKin}
              kinRelationships={kinRelationships}
              genderOptions={genderOptions}
              onSubmit={handleNextOfKinSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
