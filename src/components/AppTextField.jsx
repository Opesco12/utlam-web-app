import React from "react";
import { TextField, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useField } from "formik";

import { Colors } from "../constants/Colors";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& label.Mui-focused": {
    color: Colors.primary,
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: Colors.primary,
    },
    borderRadius: "0.5rem",
  },
}));

const AppTextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <CustomTextField
      label={label}
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default AppTextField;
