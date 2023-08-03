import React from "react";
import TextField from "~/components/Forms/TextField";
import { Grid, withStyles } from "@material-ui/core";
import { CountryIso, CityIso, StateIso } from "~/components/CSC";
import { styles } from "./styles";
import { withTranslation } from "react-i18next";

function USBankCheck({
  checkInputs,
  handleCheckChange,
  validationState,
  fieldsDisabled,
  t,
  classes,
}) {
  return (
    <Grid xs={12} container spacing={2}>
      <Grid xs={6} item>
        <TextField
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.address1")}
          value={checkInputs.checkAddressLine1 || ""}
          name="checkAddressLine1"
          onChange={handleCheckChange}
          error={Boolean(validationState["checkAddressLine1"])}
          helperText={
            (validationState && validationState["checkAddressLine1"]) || ""
          }
          disabled={fieldsDisabled}
          inputProps={{
            maxLength: 35,
          }}
        />
      </Grid>
      <Grid xs={6} item >
        <TextField
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.address2")}
          value={checkInputs.checkAddressLine2 || ""}
          name="checkAddressLine2"
          onChange={handleCheckChange}
          disabled={fieldsDisabled}
          inputProps={{
            maxLength: 35,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <CountryIso
          required
          name="checkCountry"
          label={t("componentData.addPayment.labels.country")}
          selectedCountry={checkInputs.checkCountry || ""}
          value={checkInputs.checkCountry || ""}
          onChange={handleCheckChange}
          error={Boolean(validationState["checkCountry"])}
          helperText={
            (validationState && validationState["checkCountry"]) || ""
          }
          disabled={fieldsDisabled}
          InputLabelProps={{
            shrink: checkInputs.checkCountry ? true : false,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <StateIso
          required
          name="checkState"
          label={t("componentData.addPayment.labels.state")}
          error={Boolean(validationState["checkState"])}
          helperText={(validationState && validationState["checkState"]) || ""}
          selectedState={checkInputs.checkState || ""}
          value={checkInputs.checkState || ""}
          selectedCountry={checkInputs.checkCountry || ""}
          onChange={handleCheckChange}
          disabled={fieldsDisabled}
          InputLabelProps={{
            shrink: checkInputs.checkState ? true : false,
          }}
        />
      </Grid>
      <Grid xs={6} item className={classes.gridMarginTop}>
        <CityIso
          required
          name="checkCity"
          label={t("componentData.addPayment.labels.city")}
          error={Boolean(validationState["checkCity"])}
          helperText={(validationState && validationState["checkCity"]) || ""}
          selectedState={checkInputs.checkState || ""}
          selectedCountry={checkInputs.checkCountry || ""}
          selectedCity={checkInputs.checkCity || ""}
          value={checkInputs.checkCity || ""}
          onChange={handleCheckChange}
          disabled={fieldsDisabled}
          InputLabelProps={{
            shrink: checkInputs.checkCity ? true : false,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <TextField
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.zipCode")}
          value={checkInputs.checkPostalCode || ""}
          name="checkPostalCode"
          onChange={handleCheckChange}
          error={Boolean(validationState["checkPostalCode"])}
          helperText={
            (validationState && validationState["checkPostalCode"]) || ""
          }
          inputProps={{
            minLength:5,
            maxLength: 10,
          }}
          disabled={fieldsDisabled}
        />
      </Grid>
    </Grid>
  );
}

export default withTranslation()(withStyles(styles)(USBankCheck));
