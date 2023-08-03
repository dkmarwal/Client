import React from "react";
import { TextField as MUITextField,
  withStyles,
  Tooltip,
  InputAdornment, } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const styles = (theme) => ({
  root: {
    margin: theme.spacing(1, 0)
  }
});

const TextField = (props) => {
  const {
    classes,
    id,
    name,
    label,
    value,
    type,
    required,
    select,
    onChange,
    onBlur,
    helperText,
    error,
    disabled,
    children,
    tooltipProps,
    inputProps,
    defaultValue,
    ...restProps
  } = props;
  const info = tooltipProps && (
    <Tooltip title={tooltipProps.title} arrow placement="right">
      {tooltipProps.icon || <InfoOutlinedIcon />}
    </Tooltip>
  );

  return (
    <MUITextField
      className={classes.root}
      select={select ? true : false}
      name={name}
      id={id}
      label={label}
      type={type}
      value={value}
      required={required ? true : false}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      disabled={disabled}
      autoFocus={false}
      autoComplete="off"
      inputProps={{
        ...inputProps
      }}
      InputProps={{
          endAdornment: tooltipProps ? (
            <InputAdornment style={{cursor:'default'}} position="end">{info}</InputAdornment>
          ) : null,
        }}
      {...restProps}
    >
      {select && children}
    </MUITextField>
  );
};

export default withStyles(styles)(TextField);
