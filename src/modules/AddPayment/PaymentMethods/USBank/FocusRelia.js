import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import moment from "moment";
import {
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  withStyles,
} from "@material-ui/core";
import { CountryIso, CityIso, StateIso } from "~/components/CSC";
import DatePicker, { registerLocale } from "react-datepicker";
import EventIcon from "@material-ui/icons/Event";
import Phone from "~/components/TextBox/Phone";
import { styles } from "./styles";
import MaskedInput from "~/components/MaskedInput";
import en from "date-fns/locale/es";
import fr from "date-fns/locale/es";
import es from "date-fns/locale/es";

registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("es", es);

const FocusRelia = (props) => {
  const {
    prepaidCardInputs,
    USBankPayment,
    handleFocusReliaChange,
    t,
    handleDOBActivatedAt,
    handleGovExpiredDate,
    classes,
    inputs,
    fieldsDisabled,
    validationState,
    i18n,
  } = props;
  const { storedPrepaidCardData } = USBankPayment;
  const cardDetails = storedPrepaidCardData?.data?.registrationData?.[0];

  return (
    <Grid xs={12} container spacing={2}>
      {cardDetails?.isName || fieldsDisabled ? (
        <>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth={true}
              variant="outlined"
              label={t("componentData.addPayment.labels.firstName")}
              value={inputs.firstName || ""}
              name="firstName"
              disabled
              inputProps={{
                maxLength: 35,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth={true}
              variant="outlined"
              label={t("componentData.addPayment.labels.lastName")}
              value={inputs.lastName || ""}
              name="lastName"
              disabled
              inputProps={{
                maxLength: 35,
              }}
            />
          </Grid>
        </>
      ) : null}
      {cardDetails?.isEmail || fieldsDisabled ? (
        <Grid item xs={6}>
          <TextField
            fullWidth={true}
            variant="outlined"
            label={t("componentData.addPayment.labels.email")}
            disabled
            value={inputs.email || ""}
            name="email"
            inputProps={{
              maxLength: 48,
            }}
            required
          />
        </Grid>
      ) : null}
      {cardDetails?.isMobilePhone || fieldsDisabled ? (
        <Grid container item xs={6} spacing={1} style={{ paddingRight: "0px" }}>
          <Grid item xs={2}>
            <TextField
              label={t("componentData.SmallTxt.Country")}
              value={"+1"}
              disabled
              select
              variant="outlined"
              required
            >
              <MenuItem value="+1">+1</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={10} style={{ paddingLeft: "16px" }}>
            <MaskedInput
              style={{ marginTop: "0px" }}
              disabled={fieldsDisabled || Boolean(inputs.phoneNumber?.phone)}
              fullWidth
              required
              color="secondary"
              variant="outlined"
              autoComplete="off"
              autoFocus={false}
              value={
                fieldsDisabled || prepaidCardInputs?.mobilePhone
                  ? prepaidCardInputs?.mobilePhone ?? ""
                  : inputs.phoneNumber?.phone || ""
              }
              name="mobilePhone"
              type="text"
              label={t("componentData.SmallTxt.Phone")}
              onChange={handleFocusReliaChange}
              placeholder={"XXX-XXX-XXXX"}
              error={
                !(fieldsDisabled || Boolean(prepaidCardInputs?.mobilePhone)) &&
                Boolean(validationState["mobilePhone"])
              }
              helperText={
                !(fieldsDisabled || Boolean(prepaidCardInputs?.mobilePhone)) &&
                ((validationState && validationState["mobilePhone"]) || "")
              }
              formatterProps={{
                format: "###-###-####",
                isNumericString: true,
              }}
              inputProps={{
                maxLength: 10,
              }}
            />
          </Grid>
        </Grid>
      ) : null}
      {cardDetails?.isAddress || fieldsDisabled ? (
        <>
          <Grid item xs={6}>
            <TextField
              fullWidth={true}
              variant="outlined"
              label={t("componentData.addPayment.labels.address1")}
              value={prepaidCardInputs.address1 || ""}
              name="address1"
              inputProps={{
                maxLength: 35,
              }}
              onChange={handleFocusReliaChange}
              required
              disabled={fieldsDisabled}
              error={Boolean(validationState.address1)}
              helperText={validationState.address1}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth={true}
              variant="outlined"
              label={t("componentData.addPayment.labels.address2")}
              value={prepaidCardInputs.address2 || ""}
              name="address2"
              inputProps={{
                maxLength: 35,
              }}
              onChange={handleFocusReliaChange}
              disabled={fieldsDisabled}
            />
          </Grid>
          <Grid item xs={6}>
            <CountryIso
              name="country"
              label={t("componentData.addPayment.labels.country")}
              value={(prepaidCardInputs && prepaidCardInputs.country) ?? ""}
              error={Boolean(validationState.country)}
              helperText={validationState.country}
              onChange={handleFocusReliaChange}
              required
              disabled={fieldsDisabled}
              InputLabelProps={{
                shrink: prepaidCardInputs.country ? true : false,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              error={Boolean(validationState.postalCode)}
              helperText={validationState.postalCode}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              label={t("componentData.addPayment.labels.zipCode")}
              value={(prepaidCardInputs && prepaidCardInputs.postalCode) || ""}
              name="postalCode"
              inputProps={{
                minLength: 5,
                maxLength: 10,
              }}
              onChange={handleFocusReliaChange}
              disabled={fieldsDisabled}
            />
          </Grid>
          <Grid item xs={6}>
            <StateIso
              name="state"
              label={t("componentData.addPayment.labels.state")}
              error={Boolean(validationState.state)}
              helperText={validationState.state}
              selectedState={prepaidCardInputs.state ?? ""}
              selectedCountry={
                (prepaidCardInputs && prepaidCardInputs.country) || ""
              }
              onChange={handleFocusReliaChange}
              required
              disabled={fieldsDisabled}
              InputLabelProps={{
                shrink: prepaidCardInputs.state ? true : false,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <CityIso
              name="city"
              label={t("componentData.addPayment.labels.city")}
              error={Boolean(validationState.city)}
              helperText={validationState.city}
              selectedState={
                (prepaidCardInputs && prepaidCardInputs.state) || ""
              }
              selectedCountry={
                (prepaidCardInputs && prepaidCardInputs.country) || ""
              }
              selectedCity={(prepaidCardInputs && prepaidCardInputs.city) ?? ""}
              onChange={handleFocusReliaChange}
              required
              disabled={fieldsDisabled}
              InputLabelProps={{
                shrink: prepaidCardInputs.city ? true : false,
              }}
            />
          </Grid>
        </>
      ) : null}
      {cardDetails?.isDateOfBirth || fieldsDisabled ? (
        <Grid item xs={6}>
          <DatePicker
            customInput={
              <TextField
                label={t("componentData.addPayment.labels.DOB")}
                variant="outlined"
                className="full-width"
                color="primary"
                error={Boolean(validationState.dob)}
                helperText={validationState.dob}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <EventIcon
                        fontSize="small"
                        style={{ cursor: "pointer" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            }
            disabled={fieldsDisabled}
            popperClassName={classes.popperClass}
            name="dob"
            placeholderText={t("componentData.addPayment.labels.DOB")}
            dateFormat="MM/dd/yyyy"
            value={prepaidCardInputs.dob ? moment(prepaidCardInputs.dob).format("MM/DD/YYYY") : null}
            onChange={handleDOBActivatedAt}
            required
            locale={i18n.language}
          />
        </Grid>
      ) : null}
      {cardDetails?.isSsn || fieldsDisabled ? (
        <Grid item xs={6}>
          <TextField
            label={t("componentData.addPayment.labels.SSN")}
            error={Boolean(validationState.ssn)}
            helperText={validationState.ssn}
            value={prepaidCardInputs.ssn || ""}
            name="ssn"
            inputProps={{
              minLength: 9,
              maxLength: 9,
            }}
            onChange={handleFocusReliaChange}
            required
            variant="outlined"
            fullWidth={true}
            disabled={fieldsDisabled}
          />
        </Grid>
      ) : null}
      {cardDetails?.isHomePhone || fieldsDisabled ? (
        <Grid item xs={6}>
          <Phone
            isExt={false}
            prefixCcode="+1"
            error={Boolean(validationState["phone"])}
            helperText={(validationState && validationState["phone"]) || ""}
            id="homePhone"
            name="homePhone"
            ext=""
            value={prepaidCardInputs.homePhone?.phone ?? ""}
            ccode={prepaidCardInputs.countryCode?.ccode ?? ""}
            onChange={handleFocusReliaChange}
            disabled={fieldsDisabled}
            label={t("componentData.addPayment.labels.homePhone")}
            required
          />
        </Grid>
      ) : null}

      {cardDetails?.isEmployeeState || fieldsDisabled ? (
        <Grid item xs={6}>
          <TextField
            label={t("componentData.addPayment.labels.employerState")}
            error={Boolean(validationState.employerState)}
            helperText={validationState.employerState}
            value={prepaidCardInputs.employerState || ""}
            name="employerState"
            inputProps={{
              minLength: 2,
              maxLength: 4,
            }}
            onChange={handleFocusReliaChange}
            required
            fullWidth={true}
            variant="outlined"
            disabled={fieldsDisabled}
          />
        </Grid>
      ) : null}

      {cardDetails?.govIdTypeId || fieldsDisabled ? (
        <>
          <Grid item xs={6}>
            <TextField
              label={t("componentData.addPayment.labels.govIdType")}
              value={prepaidCardInputs.govId ?? cardDetails?.govIdValue ?? ""}
              name="govId"
              disabled
              fullWidth={true}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={t("componentData.addPayment.labels.govIdValue")}
              error={Boolean(validationState.govIdValue)}
              helperText={validationState.govIdValue}
              value={prepaidCardInputs.govIdValue || ""}
              name="govIdValue"
              inputProps={{
                maxLength: 20,
              }}
              onChange={handleFocusReliaChange}
              required
              variant="outlined"
              fullWidth={true}
              disabled={fieldsDisabled}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              customInput={
                <TextField
                  label={t("componentData.addPayment.labels.govExpiredDate")}
                  variant="outlined"
                  className="full-width"
                  error={Boolean(validationState.govExpiredDate)}
                  helperText={validationState.govExpiredDate}
                  color="primary"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EventIcon
                          fontSize="small"
                          style={{ cursor: "pointer" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              }
              disabled={fieldsDisabled}
              popperClassName={classes.popperClass}
              placeholderText={t(
                "componentData.addPayment.labels.govExpiredDate"
              )}
              dateFormat="MM/dd/yyyy"
              name="govExpiryDate"
              value={
                prepaidCardInputs.govExpiryDate
                  ? moment(prepaidCardInputs.govExpiryDate).format("MM/DD/YYYY")
                  : null
              }
              onChange={handleGovExpiredDate}
              required
              locale={i18n.language}
            />
          </Grid>
        </>
      ) : null}
      {cardDetails?.isGovLocation || fieldsDisabled ? (
        <Grid item xs={6}>
          <TextField
            label={t("componentData.addPayment.labels.govLocation")}
            error={Boolean(validationState.govLocation)}
            helperText={validationState.govLocation}
            value={prepaidCardInputs.govLocation || ""}
            name="govLocation"
            inputProps={{
              maxLength: 20,
            }}
            onChange={handleFocusReliaChange}
            required
            fullWidth={true}
            variant="outlined"
            disabled={fieldsDisabled}
          />
        </Grid>
      ) : null}
      {cardDetails?.isUniqueId || fieldsDisabled ? (
        <Grid item xs={6}>
          <TextField
            label={t("componentData.addPayment.labels.uniqueId")}
            error={Boolean(validationState.uniqueId)}
            helperText={validationState.uniqueId}
            value={prepaidCardInputs.uniqueId || ""}
            name="uniqueId"
            inputProps={{
              maxLength: 50,
            }}
            onChange={handleFocusReliaChange}
            fullWidth={true}
            variant="outlined"
            disabled={fieldsDisabled}
            required
          />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default withTranslation()(
  connect((state) => ({ ...state.USBankPayment }))(
    withStyles(styles)(FocusRelia)
  )
);
