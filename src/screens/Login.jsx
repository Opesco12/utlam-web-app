import { Formik, Form } from "formik";
import { Toaster, toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import AppButton from "../components/AppButton";
import AppTextField from "../components/AppTextField";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { userLoginSchema } from "../validationSchemas/userSchema";

import { login } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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
            alt="Auth background"
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

                try {
                  const userData = await login(email, password);
                  if (userData) {
                    if (userData?.message?.includes("Account is inactive")) {
                      toast.error(
                        "Account is inactive. Please activate account"
                      );
                      navigate(
                        `/account/activate?email=${encodeURIComponent(email)}`
                      );
                      return;
                    }
                    navigate(
                      `/account/2fa?email=${encodeURIComponent(
                        email
                      )}&from=${encodeURIComponent(from)}`
                    );
                  }
                } catch (error) {
                  toast.error("Login failed. Please check your credentials");
                } finally {
                  setSubmitting(false);
                }
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
                    className="text-light hover:text-primary"
                  >
                    <span
                      className="cursor-pointer"
                      onClick={() => navigate("/forgot_password")}
                    >
                      Forgot Password?
                    </span>
                  </StyledText>
                  <AppButton
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isSubmitting}
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
