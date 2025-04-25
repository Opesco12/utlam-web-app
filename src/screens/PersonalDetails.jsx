import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import HeaderText from "../components/HeaderText";
import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

import { getClientInfo, getNextOfKins, createNextOfKin } from "../api";
import { userProfileSchema } from "../validationSchemas/userSchema";

// Custom TextField component using Formik's Field
const TextField = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium">{label}</label>
      <Field
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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

// Custom Button component to replace AppButton
const Button = ({ children, type = "button", disabled = false, ...props }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`px-4 py-2 rounded-md bg-${Colors.primary} text-white font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${Colors.primary} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};

const PersonalDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userHasNextOfKin, setUserHasNextOfKin] = useState(0);
  const [nextOfKin, setNextOfKin] = useState(null);

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

  const fetchData = async () => {
    try {
      const clientInfo = await getClientInfo();
      const { firstname, surname, mobileNumber } = clientInfo;
      setUserData({
        firstname,
        surname,
        mobileNumber,
      });

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

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  // Prepare initial form values
  const initialValues = {
    firstname: userData?.firstname || "",
    surname: userData?.surname || "",
    phoneNumber: userData?.mobileNumber || "",
    kinFirstname: nextOfKin?.firstname || "",
    kinLastname: nextOfKin?.surname || "",
    kinEmail: nextOfKin?.email || "",
    kinPhoneNumber: nextOfKin?.telephoneNo || "",
    kinGender: nextOfKin?.gender || "",
    kinRelationship: nextOfKin?.relationship || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const {
        kinEmail,
        kinFirstname,
        kinLastname,
        kinPhoneNumber,
        kinGender,
        kinRelationship,
      } = values;

      if (userHasNextOfKin === 0) {
        if (!kinRelationship || !kinGender) {
          toast.error("Please fill out all fields");
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

        const data = await createNextOfKin(nextOfKinData);
        if (data) {
          toast.success("Profile has been updated successfully");
          navigate("/profile");
        }
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <HeaderText>Personal Details</HeaderText>

      <div className="border p-[20px] rounded-lg mt-5">
        <Formik
          validationSchema={userProfileSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="w-full flex flex-col gap-[40px]">
              <div className="w-full flex justify-between flex-col md:flex-row">
                <div className="flex flex-col gap-[15px] w-[100%] md:w-[48%]">
                  <StyledText
                    type="title"
                    color={Colors.text}
                    style={{ fontWeight: "600" }}
                  >
                    Personal Details
                  </StyledText>

                  <div className="flex justify-between relative">
                    <div className="w-[48%]">
                      <TextField
                        name="firstname"
                        label="First Name"
                      />
                    </div>
                    <div className="w-[48%]">
                      <TextField
                        name="surname"
                        label="Last Name"
                      />
                    </div>
                  </div>

                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                  />
                </div>

                <div className="flex flex-col gap-[15px] w-[100%] mt-[20px] md:w-[48%] md:mt-[0px]">
                  <StyledText
                    type="title"
                    color={Colors.text}
                    style={{ fontWeight: "600" }}
                  >
                    Next of kin
                  </StyledText>

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
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-lightPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <SmallLoadingSpinner color={Colors.white} />
                ) : (
                  "Save"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonalDetails;
