import React from "react";
import TextField from "~/components/Forms/TextField";
import {MenuItem } from "@material-ui/core";

const CountryPhoneCode = (props) => {
  const {
    name,
    label,
    value,
    onChange,
    error,
    helperText,
    excludeCountryCode,
    ...restProps
  } = props;
  return (
    <TextField
      name={name}
      select
      label={label}
      value={value || ""}
      renderValue={(phonecode) => `+${phonecode}`}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth={true}
      variant="outlined"
      {...restProps}
    >
      <MenuItem key={"US"} value={`+${1}`}>
        {`(+${1})`}
      </MenuItem>
      {/* <MenuItem key={"CA"} value={`+${1}`}>
        {`${"Canada"}(+${1})`}
      </MenuItem> */}
    </TextField>
  );
};

export default CountryPhoneCode;
