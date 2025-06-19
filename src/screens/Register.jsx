import { Formik } from "formik";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import csc from "countries-states-cities";

import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import AppTextField from "../components/AppTextField";
import AppSelect from "../components/AppSelect";
import AppButton from "../components/AppButton";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

import { getCountries, registerNewIndividual } from "../api";
import {
  RegisterStep1ValidationSchema,
  RegisterStep2ValidationSchema,
} from "../validationSchemas/userSchema";
import StepIndicator from "../components/StepIndicator";
import Terms from "../components/Terms";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryIso2, setSelectedCountryIso2] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    title: "",
    country: "",
    address: "",
    city: "",
    state: "",
    nin: "",
    bvn: "",
    clientType: 1,
    referredBy: "",
    agreedToTerms: false,
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

  useEffect(() => {
    if (selectedCountry) {
      const country = csc
        .getAllCountries()
        .find((c) => c.iso3 === selectedCountry);

      if (country) {
        setSelectedCountryIso2(country.iso2);
        const statesList = State.getStatesOfCountry(country.iso2);
        setStates(statesList);
      }
    }
  }, [selectedCountry]);

  const handleNextStep = async (values, validateForm) => {
    const errors = await validateForm(values);
    if (!errors || Object.keys(errors).length === 0) {
      setFormData({ ...formData, ...values });
      setStep(2);
    } else {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const titleOptions = [
    {
      transId: 4,
      value: "Chief",
      label: "Chief",
    },
    {
      transId: 1,
      value: "Miss",
      label: "Miss",
    },
    {
      transId: 2,
      value: "Mr",
      label: "Mr",
    },
    {
      transId: 3,
      value: "Mrs",
      label: "Mrs",
    },
  ];

  return (
    <div className="w-full h-screen overflow-hidden">
      <Toaster />

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

              <StepIndicator currentStep={step} />

              {step === 1 ? (
                <Formik
                  validationSchema={RegisterStep1ValidationSchema}
                  initialValues={formData}
                  validateOnChange={false}
                  validateOnBlur={true}
                  onSubmit={(values, { validateForm }) =>
                    handleNextStep(values, validateForm)
                  }
                >
                  {({
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    errors,
                    values,
                    validateForm,
                  }) => (
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
                          setFormData({ ...formData, gender: value });
                          setFieldValue("gender", value);
                        }}
                        label="Gender"
                      />

                      <AppSelect
                        name="title"
                        options={titleOptions}
                        onValueChange={(value) => {
                          setFormData({ ...formData, title: value });
                          setFieldValue("title", value);
                        }}
                        label="Title"
                      />

                      <AppTextField
                        type="date"
                        name="dob"
                        label="Date of birth"
                        onChange={handleChange("dob")}
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
                      <AppButton
                        onClick={handleSubmit}
                        type={"submit"}
                      >
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

                      <StyledText style={{ textAlign: "center" }}>
                        Existing User?
                        <span
                          className="text-primary cursor-pointer ml-1"
                          onClick={() =>
                            navigate("/existing-user-registration")
                          }
                        >
                          Register again
                        </span>
                      </StyledText>
                    </>
                  )}
                </Formik>
              ) : (
                <Formik
                  validationSchema={RegisterStep2ValidationSchema}
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
                      title,
                      country,
                      state,
                      nin,
                      bvn,
                      referredBy,
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
                      title: title,
                      address1: address,
                      city: city,
                      state: selectedStateName,
                      country: country,
                      nin: nin,
                      bvn: bvn,
                      referredBy: referredBy,
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
                  validateOnBlur={true}
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
                      <AppSelect
                        name="state"
                        options={states.map((state) => ({
                          label: state.name,
                          value: state.isoCode,
                        }))}
                        onValueChange={(value) => {
                          setSelectedState(value);

                          const stateObj = states.find(
                            (state) => state.isoCode === value
                          );
                          if (stateObj) {
                            setSelectedStateName(stateObj.name);
                            setFormData({ ...formData, state: value });
                            setFieldValue("state", value);
                          }
                        }}
                        label="State"
                      />

                      <AppTextField
                        name="city"
                        onChange={handleChange("city")}
                        label="City"
                      />

                      <AppTextField
                        name="address"
                        onChange={handleChange("address")}
                        label="Address"
                      />
                      <AppTextField
                        onChange={handleChange("nin")}
                        name="nin"
                        label="NIN (National Identification Number)"
                        maxLength={11}
                      />
                      <AppTextField
                        onChange={handleChange("bvn")}
                        name="bvn"
                        label="BVN (Bank Verification Number)"
                        maxLength={11}
                      />
                      <AppTextField
                        onChange={handleChange("referredBy")}
                        name="referredBy"
                        label="Referral Code"
                      />

                      <div className="flex items-start gap-3 mb-4">
                        <input
                          type="checkbox"
                          id="agreedToTerms"
                          checked={agreedToTerms}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setAgreedToTerms(checked);
                            setFormData({
                              ...formData,
                              agreedToTerms: checked,
                            });
                            setFieldValue("agreedToTerms", checked);
                          }}
                          className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label
                          htmlFor="agreedToTerms"
                          className="text-sm text-gray-700"
                        >
                          I agree to the{" "}
                          <button
                            type="button"
                            onClick={() => setShowTermsModal(true)}
                            className="text-primary cursor-pointer underline hover:no-underline"
                          >
                            Terms and Conditions
                          </button>
                        </label>
                      </div>

                      {errors.agreedToTerms && touched.agreedToTerms && (
                        <StyledText
                          color="red"
                          className="text-sm -mt-2 mb-4"
                        >
                          {errors.agreedToTerms}
                        </StyledText>
                      )}

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
                          <a
                            href="https://utlam.com/privacy-policy/"
                            target="_blank"
                          >
                            Terms of Use & Privacy Policy
                          </a>
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
      <Terms
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};

export default Register;
