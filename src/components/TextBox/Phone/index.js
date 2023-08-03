import React, { useRef } from "react";
import { Grid, Box, withStyles, InputLabel, MenuItem } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import MaskedInput from "~/components/MaskedInput";
import { withTranslation } from "react-i18next";

const styles = (theme) => ({
  grid: {
    //marginBottom:'22px',
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
  },
});

const Phone = (props) => {
  const {
    t,
    isExt = true,
    prefixCcode,
    value,
    ext,
    ccode,
    error,
    helperText,
    phoneExtHelperText = "",
    onChange,
    dir = "horizontal",
    label = "",
    disabled = false,
    required,
    inputProps,
    removeFocus,
    showPhoneLabel=false,
    ...restProps
  } = props;
  const { classes } = props;

  const phoneValue = [prefixCcode, ccode, value, ext];
  let phone = {
    ccode: ccode || prefixCcode,
    num: value,
    ext: ext,
    value: phoneValue.join(""),
  };

  const numRef = useRef(null);
  const extRef = useRef(null);

  function handleChange(event, position) {
    const newValue = event.target.value.trim();

    if (isNaN(event.target.value) && (position == 2 || position == 3)) {
      return false;
    }

    const tempPhone = newValue.split("");
    switch (position) {
      case 1:
        phone.ccode = newValue || "";
        if (!Boolean(removeFocus)) {
          numRef.current && numRef.current.focus();
        }
        break;
      case 2:
        phone.num = newValue || "";
        if (!Boolean(removeFocus)) {
          tempPhone.length === 10 && extRef.current && extRef.current.focus();
        }
        break;
      case 3:
        phone.ext = newValue || "";
        break;
      default:
        break;
    }

    const phoneValue = [phone.ccode, phone.num, phone.ext];
    const newPhone = {
      ccode: phone.ccode,
      num: phone.num,
      ext: phone.ext,
      value: phoneValue.join(""),
    };
    phone = { ...newPhone };

    onChange({
      target: {
        name: props.name,
        value: {
          phone: phone.num,
          ext: phone.ext,
          ccode: phone.ccode,
          prefixCcode: prefixCcode,
        },
      },
    });
  }

  return (
    <Grid
      container
      item
      direction={dir}
      justifyContent="center"
      alignItems="center"
      className={classes.grid}
    >
      {label && showPhoneLabel && (
        <Grid item xs={6} md={4}>
          <InputLabel
            className={classes.label}
            htmlFor={`component${error ? "-error" : ""}${
              disabled ? "-disabled" : ""
            }`}
          >
            {label}
            {required ? (
              <span style={{ color: "red", fontSize: "10px" }}>*</span>
            ) : (
              ""
            )}
          </InputLabel>
        </Grid>
      )}
      <Grid container item xs={label && showPhoneLabel ? 6 : 12} md={label && showPhoneLabel ? 8 : 12}>
        <Grid item xs={12} md={2}>
          <Box>
            <TextField
              select
              className="countryCodeBox"
              required={required ? true : false}
              disabled={disabled}
              autoComplete="off"
              autoFocus={false}
              variant="outlined"
              //value={phone.ccode || ""}
              value={"+1"}
              label={t("componentData.SmallTxt.Country")}
              inputProps={{
                maxLength: 5,
                ...inputProps,
              }}
              onChange={(e) => {
                handleChange(e, 1);
              }}
              {...restProps}
            >
              {[{ name: "+1", sortname: "", phonecode: "+1" }].map(
                ({ name, sortname, phonecode }) => (
                  <MenuItem key={sortname} value={`${phonecode}`}>
                    {`${phonecode}`}
                  </MenuItem>
                )
              )}
            </TextField>
          </Box>
        </Grid>
        <Grid item xs={12} md={isExt ? 7 : 10}>
          <Box ml={2}>
            <MaskedInput
              disabled={disabled}
              className="phoneNumberBox"
              fullWidth={true}
              required = {required ? true : false}
              color="secondary"
              variant="outlined"
              autoComplete="off"
              autoFocus={false}
              value={phone.num || ""}
              name="phone"
              type="text"
              label={label || t("componentData.SmallTxt.Phone")}
              inputRef={numRef}
              onChange={(e) => {
                handleChange(e, 2);
              }}
              placeholder={"XXX-XXX-XXXX"}
              error={error}
              helperText={helperText}
              formatterProps={{
                format: "###-###-####",
                isNumericString: true,
              }}
              inputProps={{
                maxLength: 10,
                ...inputProps,
              }}
              {...restProps}
            />
            {/*<TextField
                            disabled={disabled}
                            required={required ? true : false}
                            label={label || "Phone"}
                            error={error}
                            helperText={helperText}
                            fullWidth={true}
                            autoComplete="off"
                            autoFocus={false}
                            variant="outlined"
                            value={phone.num || ""}
                            inputRef={numRef}
                            inputProps={{
                                maxLength:10,
                                ...inputProps
                            }}
                            onChange={(e) => { handleChange(e, 2)}}
                            {...restProps}
                        />
                            */}
          </Box>
        </Grid>
        {isExt ? (
          <Grid item xs={12} md={3}>
            <Box ml={2}>
              <TextField
                className="extNumberBox"
                error={phoneExtHelperText}
                helperText={phoneExtHelperText}
                disabled={disabled}
                fullWidth={true}
                label={t("componentData.SmallTxt.Ext")}
                autoComplete="off"
                variant="outlined"
                inputRef={extRef}
                inputProps={{
                  maxLength: 10,
                  ...inputProps,
                }}
                value={phone.ext || ""}
                onChange={(e) => {
                  handleChange(e, 3);
                }}
                {...restProps}
              />
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default withTranslation()(withStyles(styles)(Phone));
