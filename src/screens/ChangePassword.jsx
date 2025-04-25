import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AppTextField from "../components/AppTextField";
import HeaderText from "../components/HeaderText";
import AppButton from "../components/AppButton";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { Colors } from "../constants/Colors";
import ContentBox from "../components/ContentBox";

import { changePassword } from "../api";
import { changePasswordSchema } from "../validationSchemas/userSchema";

const ChangePassword = () => {
  const navigate = useNavigate();
  return (
    <div>
      <HeaderText>Change Password</HeaderText>

      <ContentBox>
        <div className="flex flex-col gap-[20px] p-[20px]">
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={changePasswordSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              console.log(values);
              const { oldPassword, newPassword } = values;

              const response = await changePassword(oldPassword, newPassword);

              if (response) {
                toast.success("Password Succesfully Changed");
                navigate("/profile");
              }
              setSubmitting(true);
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting }) => (
              <>
                <AppTextField
                  name="oldPassword"
                  label={"Old Password"}
                  onChange={handleChange("oldPassword")}
                  type="password"
                />

                <AppTextField
                  name="newPassword"
                  label={"New Password"}
                  onChange={handleChange("newPassword")}
                  type="password"
                />
                <AppTextField
                  name="confirmPassword"
                  label={"Confirm Password"}
                  onChange={handleChange("confirmPassword")}
                  type="password"
                />
                <AppButton onClick={handleSubmit}>
                  {isSubmitting === true ? (
                    <SmallLoadingSpinner color={Colors.white} />
                  ) : (
                    "Save"
                  )}
                </AppButton>
              </>
            )}
          </Formik>
        </div>
      </ContentBox>
    </div>
  );
};

export default ChangePassword;
