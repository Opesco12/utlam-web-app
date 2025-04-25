import React from "react";
import { useField, useFormikContext } from "formik";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";

const AppSelect = ({
  options = [],
  label = "Select an option",
  disabled,
  name,
  onValueChange,
  ...props
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const safeOptions = Array.isArray(options) ? options : [];

  const handleChange = (event) => {
    const value = event.target.value;
    setFieldValue(name, value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
        fullWidth
        error={meta.touched && Boolean(meta.error)}
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          id={name}
          label={label}
          disabled={disabled}
          {...field}
          onChange={handleChange}
          {...props}
        >
          {safeOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label || ""}
            </MenuItem>
          ))}
        </Select>
        {meta.touched && meta.error && (
          <FormHelperText>{meta.error}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default AppSelect;
