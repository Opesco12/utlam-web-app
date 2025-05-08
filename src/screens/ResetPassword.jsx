import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Toaster, toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import AppButton from "../components/AppButton";
import AppTextField from "../components/AppTextField";

import { resetPassword, resetPasswordRequest } from "../api";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [isEmailRegistered, setIsEmailRegistered] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),

    password: Yup.string().when([], {
      is: () => isEmailRegistered,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(6, "Password must be at least 6 characters")
          .matches(
            /^[A-Za-z\d@$!%*?#&]+$/,
            "Password can only contain letters, numbers, and @$!%*#?&"
          )
          .matches(
            /[a-z]/,
            "Password must contain at least one lowercase letter"
          )
          .matches(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
          )
          .matches(/\d/, "Password must contain at least one number")
          .matches(
            /[@$!%*?&#]/,
            "Password must contain at least one special character (@$!%*?&#)"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    confirmPassword: Yup.string().when([], {
      is: () => isEmailRegistered,
      then: (schema) =>
        schema
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    token: Yup.string().when([], {
      is: () => isEmailRegistered,
      then: (schema) => schema.required("Please input the token in your mail"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
  return (
    <div className="w-full h-screen">
      <Toaster />
      <div className="grid md:grid-cols-2">
        <div className="bg-primary h-screen hidden md:block">
          <img
            src="/images/auth-image.svg"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex h-screen items-center justify-center ">
          <div className=" flex flex-col gap-5  w-[90%] mx-auto lg:w-[60%]">
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
                Reset Password
              </StyledText>
              <br />
              <StyledText
                color={Colors.light}
                variant="medium"
                type="body"
              >
                A Password reset email will be sent to your mail
              </StyledText>
            </div>
            <Formik
              initialValues={{
                email: "",
                token: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const { email, token, password } = values;

                if (isEmailRegistered === true) {
                  const response = await resetPassword(token, password);
                  if (response) {
                    toast.success("Password Reset Succesful");
                    setIsEmailRegistered(false);
                    // navigate("/login");
                  }
                } else {
                  const response = await resetPasswordRequest(email);
                  console.log(response);
                  console.log(
                    "This is the response from the server: ",
                    response
                  );
                  if (response) setIsEmailRegistered(true);
                }
                setSubmitting(false);
              }}
            >
              {({ handleChange, handleSubmit, isSubmitting }) => (
                <>
                  <AppTextField
                    label="Email"
                    name="email"
                    onChange={handleChange("email")}
                  />
                  {isEmailRegistered && (
                    <>
                      <AppTextField
                        label="Token"
                        name="token"
                        onChange={handleChange("token")}
                      />
                      <AppTextField
                        label="Password"
                        name="password"
                        onChange={handleChange("password")}
                        type="password"
                      />
                      <AppTextField
                        label="Confirm Password"
                        name="confirmPassword"
                        onChange={handleChange("confirmPassword")}
                        type="password"
                      />
                    </>
                  )}
                  {isEmailRegistered ? (
                    <AppButton onClick={handleSubmit}>
                      {isSubmitting ? (
                        <SmallLoadingSpinner color={Colors.white} />
                      ) : (
                        "Reset Password"
                      )}
                    </AppButton>
                  ) : (
                    <AppButton onClick={handleSubmit}>
                      {isSubmitting ? (
                        <SmallLoadingSpinner color={Colors.white} />
                      ) : (
                        "Send Link"
                      )}
                    </AppButton>
                  )}
                  <StyledText style={{ textAlign: "center" }}>
                    <span
                      className="text-primary cursor-pointer ml-[5px]"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </span>
                  </StyledText>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
