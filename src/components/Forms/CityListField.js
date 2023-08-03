import React from "react";
import TextField from "~/components/Forms/TextField";
import { MenuItem } from "@material-ui/core";
import csc from "country-state-city";
import { withTranslation } from 'react-i18next';

const CityListField = (props) => {
  const {
    value,
    onChange,
    label,
    name,
    state,
    countryCode,
    error,
    helperText,
    restProps,
    onBlurValidate,
    t
  } = props;

  const getStatesList = () => {
    return csc.getStatesOfCountry(csc.getCountryByCode(countryCode).id);
  };
  
  const getStateIdfromStateName = (name) => {
    const obj = getStatesList().find((s) => s.name === name);
    if(typeof obj === "undefined"){
      return "";
    }
    else{
      return obj.id;
    }     
  };

  return (
    <TextField
      name={name}
      select
      label={label}
      value={value ? value : ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth={true}
      onBlur={onBlurValidate}
      variant="outlined"
      {...restProps}
    >
      <MenuItem value="">{t('componentData.form.Select')}</MenuItem>
      {state &&
        csc.getCitiesOfState(getStateIdfromStateName(state)).map((option) => (
          <MenuItem key={option.id} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default withTranslation()(CityListField);
