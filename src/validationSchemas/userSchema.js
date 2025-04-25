import * as Yup from "yup";

export const userLoginSchema = Yup.object().shape({
  email: Yup.string().email("Email is not valid").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const userRegisterSchema = Yup.object().shape({
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
  country: Yup.string().required().label("Country"),
  dob: Yup.string().required("Date of Birth is required"),
  gender: Yup.string().required(),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string().email("Email is not valid").required("Email is required"),
});

export const userProfileSchema = Yup.object().shape({
  firstname: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),

  surname: Yup.string()
    .required("Surname is required")
    .min(2, "Surname must be at least 2 characters")
    .max(50, "Surname must not exceed 50 characters"),

  phoneNumber: Yup.string().required("Phone number is required"),

  kinFirstname: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Kin's First Name is required"),

  kinLastname: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Kin's Last name is required"),

  kinEmail: Yup.string()
    .email("Invalid email address")
    .required("Kin's Email Address is required"),
  kinPhoneNumber: Yup.string().required("Kin's Phone number is required"),
});

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
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
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
