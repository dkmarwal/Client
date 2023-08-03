import React from "react";
import TextField from "~/components/Forms/TextField";
import csc from "country-state-city";
import { MenuItem } from "@material-ui/core";

const CountryPhoneCode = (props) => {
  const { name, label, value, onChange, error, helperText, excludeCountryCode, ...restProps } = props;
  return (
    <TextField
      name={name}
      color="secondary"
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
      {excludeCountryCode && excludeCountryCode.length ?
        csc
          .getAllCountries().filter(x => !excludeCountryCode.includes(x.sortname))
          .map(({ name, sortname, phonecode }) => {
            if (sortname === "US") {
              return (<MenuItem key={sortname} value={`+${phonecode}`}>
                {`${name}/Canada(+${phonecode})`}
              </MenuItem>);
            }
            return (<MenuItem key={sortname} value={`+${phonecode}`}>
              {`${name}(+${phonecode})`}
            </MenuItem>);
          })
          .sort()
        : csc
          .getAllCountries()
          .map(({ name, sortname, phonecode }) => {
            if (sortname === "US") {
              return (<MenuItem key={sortname} value={`+${phonecode}`}>
                {`${name}/Canada(+${phonecode})`}
              </MenuItem>);
            }
            return (<MenuItem key={sortname} value={`+${phonecode}`}>
              {`${name}(+${phonecode})`}
            </MenuItem>);
          })
          .sort()}
    </TextField>
  );
};

export default CountryPhoneCode;
