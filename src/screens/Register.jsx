import * as Yup from "yup";
import { Formik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import AppTextField from "../components/AppTextField";
import AppSelect from "../components/AppSelect";
import AppButton from "../components/AppButton";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

import { getCountries, registerNewIndividual } from "../api";

// Split validation schemas for each step
const step1ValidationSchema = Yup.object().shape({
  firstname: Yup.string()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),
  lastname: Yup.string()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .required("Last name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Email is not valid").required("Email is required"),
  dob: Yup.string().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
});

const step2ValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^[A-Za-z\d@$!%*?#&]+$/,
      "Password can only contain letters, numbers, and @$!%*#?&"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(50, "Address must not exceed 100 characters"),
  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters"),
  state: Yup.string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .max(50, "State must not exceed 50 characters"),
  country: Yup.string().required("Country is required"),
});

// Step Indicator Component
const StepIndicator = ({ currentStep }) => {
  return (
    <div className="flex justify-center items-center my-6">
      <div className="flex items-center">
        {/* Step 1 Circle */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === 1
              ? "bg-primary text-white"
              : "bg-primary text-white"
          }`}
        >
          1
        </div>

        {/* Connecting Line */}
        <div
          className="w-16 h-1 mx-2"
          style={{
            backgroundColor: currentStep === 2 ? Colors.primary : "#D1D5DB",
          }}
        ></div>

        {/* Step 2 Circle */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === 2
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          2
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    country: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    clientType: 1,
  });

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const countries = await getCountries();
      if (countries) {
        setCountries(
          countries.map((country) => ({
            label: country.name,
            value: country.code,
          }))
        );
      }
    };

    fetchData();
  }, []);

  // Handle next step
  const handleNextStep = (values) => {
    setFormData({ ...formData, ...values });
    setStep(2);
  };

  // Handle previous step
  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <ToastContainer />
      <div className="grid md:grid-cols-2">
        <div className="bg-primary h-screen hidden md:block">
          <img
            src="/images/auth-image.svg"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="h-screen overflow-y-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="flex flex-col gap-5 w-[90%] mx-auto lg:w-[60%]">
              <div className="mt-8 mb-3">
                <img
                  src="/images/utlam-logo.svg"
                  alt="logo"
                  className="w-15"
                />
                <StyledText
                  type="heading"
                  variant="semibold"
                  color={Colors.primary}
                >
                  {step === 1
                    ? "Hello, it's nice to meet you"
                    : "Almost there!"}
                </StyledText>
                <br />
                <StyledText
                  color={Colors.light}
                  variant="medium"
                  type="body"
                >
                  {step === 1
                    ? "Sign up for an account below"
                    : "Complete your profile details"}
                </StyledText>
              </div>

              {/* Step Indicator */}
              <StepIndicator currentStep={step} />

              {step === 1 ? (
                <Formik
                  validationSchema={step1ValidationSchema}
                  initialValues={formData}
                  // onSubmit={}
                >
                  {({ handleChange, handleSubmit, setFieldValue }) => (
                    <>
                      <AppTextField
                        onChange={handleChange("firstname")}
                        name="firstname"
                        label="First Name"
                      />
                      <AppTextField
                        onChange={handleChange("lastname")}
                        name="lastname"
                        label="Last Name"
                      />
                      <AppTextField
                        onChange={handleChange("phoneNumber")}
                        name="phoneNumber"
                        label="Phone Number"
                      />
                      <AppTextField
                        onChange={handleChange("email")}
                        name="email"
                        label="Email Address"
                        type="email"
                      />
                      <AppSelect
                        name="gender"
                        options={genderOptions}
                        onValueChange={(value) => {
                          setGender(value);
                          setFormData({ ...formData, gender: value });
                          setFieldValue("gender", value);
                        }}
                        label="Gender"
                      />
                      <AppTextField
                        type="date"
                        name="dob"
                        label="Date of birth"
                        placeholder=""
                        onChange={handleChange("dob")}
                      />
                      <AppButton onClick={(values) => handleNextStep(values)}>
                        Continue
                      </AppButton>

                      <StyledText style={{ textAlign: "center" }}>
                        Already have an account?
                        <span
                          className="text-primary cursor-pointer ml-1"
                          onClick={() => navigate("/login")}
                        >
                          Sign in
                        </span>
                      </StyledText>
                    </>
                  )}
                </Formik>
              ) : (
                <Formik
                  validationSchema={step2ValidationSchema}
                  initialValues={formData}
                  onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);

                    const {
                      address,
                      city,
                      clientType,
                      firstname,
                      lastname,
                      phoneNumber,
                      email,
                      password,
                      dob,
                      gender,
                      country,
                      state,
                    } = values;
                    const DOB = new Date(dob).toISOString();

                    const data = {
                      dateOfBirth: DOB,
                      emailAddress: email,
                      password: password,
                      firstName: firstname,
                      lastName: lastname,
                      phoneNo: phoneNumber,
                      // clientType: clientType,
                      gender: gender,
                      address1: address,
                      city: city,
                      state: state,
                      country: country,
                    };

                    const response = await registerNewIndividual(data);

                    if (response) {
                      setSubmitting(false);
                      toast.success(
                        "Your account has been created successfully"
                      );
                      navigate("/account/activate", {
                        state: { email: email, header: "Activate Account" },
                      });
                    }

                    setSubmitting(false);
                  }}
                  validateOnChange={false}
                  validateOnBlur={false}
                >
                  {({
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <>
                      <AppTextField
                        name="address"
                        onChange={handleChange("address")}
                        label="Address"
                      />
                      <AppTextField
                        name="city"
                        onChange={handleChange("city")}
                        label="City"
                      />
                      <AppTextField
                        name="state"
                        onChange={handleChange("state")}
                        label="State"
                      />
                      <AppSelect
                        name="country"
                        label="Country"
                        options={countries}
                        onValueChange={(value) => {
                          setSelectedCountry(value);
                          setFormData({ ...formData, country: value });
                          setFieldValue("country", value);
                        }}
                      />
                      <AppTextField
                        onChange={handleChange("password")}
                        name="password"
                        label="Password"
                        type="password"
                      />
                      <AppTextField
                        onChange={handleChange("confirmPassword")}
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                      />

                      <div className="flex gap-4 flex-col">
                        <AppButton
                          onClick={handlePrevStep}
                          classname={"bg-white border border-primary mt-3"}
                          textColor={Colors.primary}
                        >
                          Back
                        </AppButton>
                        <AppButton
                          onClick={handleSubmit}
                          type={"submit"}
                        >
                          {isSubmitting ? (
                            <SmallLoadingSpinner color={Colors.white} />
                          ) : (
                            "Register"
                          )}
                        </AppButton>
                      </div>

                      <StyledText
                        color={Colors.light}
                        className="text-center"
                      >
                        By signing up, you agree to the{" "}
                        <span className="text-primary">
                          Terms of Use & Privacy Policy
                        </span>
                      </StyledText>
                    </>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
