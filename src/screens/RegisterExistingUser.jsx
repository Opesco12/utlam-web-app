import { Formik } from "formik";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import AppButton from "../components/AppButton";
import AppTextField from "../components/AppTextField";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

import { registerExistingIndividual } from "../api";
import { existingUserRegistrationSchema } from "../validationSchemas/userSchema";

const RegisterExistingUser = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-white">
      <Toaster position="top-right" />
      <div className="grid md:grid-cols-2">
        <div className="bg-primary h-screen hidden md:block">
          <img
            src="/images/auth-image.svg"
            className="h-full w-full object-cover"
            alt="Authentication visual"
          />
        </div>

        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col gap-5 w-[90%] mx-auto lg:w-[60%]">
            <img
              src="/images/utlam-logo.svg"
              alt="logo"
              className="w-15"
            />
            <div className="mb-3">
              <StyledText
                type="heading"
                variant="semibold"
                color={Colors.primary}
              >
                Existing User?
              </StyledText>
              <br />
              <StyledText
                color={Colors.light}
                variant="medium"
                type="body"
              >
                Register below
              </StyledText>
            </div>
            <Formik
              initialValues={{
                accountNumber: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={existingUserRegistrationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const { email, password, accountNumber } = values;

                try {
                  const userData = await registerExistingIndividual({
                    accountNo: accountNumber,
                    password,
                  });

                  if (userData) {
                    navigate(
                      `/account/activate?email=${encodeURIComponent(
                        email
                      )}&header=Activate Account`
                    );
                    toast.success("Registration Successful");
                  }
                } catch (error) {
                  toast.error(
                    error.response.data?.Message || "Registration failed"
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleChange, handleSubmit, isSubmitting }) => (
                <>
                  <AppTextField
                    label="Account Number"
                    name="accountNumber"
                    onChange={handleChange("accountNumber")}
                    placeholder="Enter your account number"
                  />

                  <AppTextField
                    label="Email"
                    name="email"
                    onChange={handleChange("email")}
                    placeholder="Enter your email"
                  />

                  <AppTextField
                    label="Password"
                    name="password"
                    onChange={handleChange("password")}
                    type="password"
                    placeholder="Enter your password"
                  />

                  <AppTextField
                    label="Confirm Password"
                    name="confirmPassword"
                    onChange={handleChange("confirmPassword")}
                    type="password"
                    placeholder="Enter your password"
                  />

                  <StyledText
                    style={{ textAlign: "right" }}
                    className={"text-light hover:text-primary cursor-pointer"}
                    onClick={() => navigate("/forgot_password")}
                  >
                    Forgot Password?
                  </StyledText>

                  <AppButton onClick={handleSubmit}>
                    {isSubmitting ? (
                      <SmallLoadingSpinner color={Colors.white} />
                    ) : (
                      "Register"
                    )}
                  </AppButton>
                </>
              )}
            </Formik>
            <StyledText style={{ textAlign: "center" }}>
              Already Registered?
              <span
                className="text-primary cursor-pointer ml-[5px]"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </StyledText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterExistingUser;
