import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import AppButton from "../components/AppButton";
import AppTextField from "../components/AppTextField";

import { userLoginSchema } from "../validationSchemas/userSchema";
import { login } from "../api";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { obfuscateEmail } from "../helperFunctions/obfuscateEmail";

const Login = () => {
  const navigate = useNavigate();

  const handleKeyDown = (event, handleSubmit) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full h-screen bg-white">
      <Toaster position="top-right" />
      <div className="grid md:grid-cols-2">
        <div className="bg-primary h-screen hidden md:block">
          <img
            src="/images/auth-image.svg"
            className="h-full w-full object-cover"
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
                Welcome Back!
              </StyledText>
              <br />
              <StyledText
                color={Colors.light}
                variant="medium"
                type="body"
              >
                Log in to your account
              </StyledText>
            </div>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={userLoginSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const { email, password } = values;

                const userData = await login(email, password);

                if (userData) {
                  if (
                    userData.message ===
                    `Account is inactive. Please activate account from ${obfuscateEmail(
                      email
                    )}`
                  ) {
                    toast.error("Account is inactive. Please activate account");
                    navigate("/account/activate", {
                      state: { email: email, header: "Activate Account" },
                    });
                  } else {
                    navigate("/account/2fa", { state: { email: email } });
                  }
                }
                setSubmitting(false);
              }}
            >
              {({ handleChange, handleSubmit, isSubmitting }) => (
                <Form
                  onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
                  className="flex flex-col gap-5"
                >
                  <AppTextField
                    label="Email"
                    name="email"
                    onChange={handleChange("email")}
                  />
                  <AppTextField
                    label="Password"
                    name="password"
                    onChange={handleChange("password")}
                    type="password"
                  />
                  <StyledText
                    style={{ textAlign: "right" }}
                    className={"text-light hover:text-primary"}
                  >
                    <span onClick={() => navigate("/forgot_password")}>
                      Forgot Password?
                    </span>
                  </StyledText>
                  <AppButton
                    onClick={handleSubmit}
                    type={"submit"}
                  >
                    {isSubmitting ? (
                      <SmallLoadingSpinner color={Colors.white} />
                    ) : (
                      "Login"
                    )}
                  </AppButton>
                </Form>
              )}
            </Formik>
            <StyledText style={{ textAlign: "center" }}>
              Don't have an account?
              <span
                className="text-primary cursor-pointer ml-[5px]"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </StyledText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
