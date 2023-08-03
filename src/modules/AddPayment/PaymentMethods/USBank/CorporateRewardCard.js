import React from "react";
import TextField from "~/components/Forms/TextField";
import { Grid, withStyles } from "@material-ui/core";
import { CountryIso, CityIso, StateIso } from "~/components/CSC";
import { styles } from "./styles";
import { withTranslation } from "react-i18next";

function CorporateRewardCard({
  corporateRewardInputs,
  handleCorporateRewardChange,
  validationState,
  fieldsDisabled,
  t,
  classes,
  inputs,
}) {
  return (
    <Grid xs={12} container spacing={2}>
      <Grid item xs={6}>
        <TextField
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.firstName")}
          value={inputs.firstName || ""}
          name="firstName"
          disabled
          error={Boolean(validationState["firstName"])}
          helperText={(validationState && validationState["firstName"]) || ""}
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
          error={Boolean(validationState["lastName"])}
          helperText={
            (validationState && validationState["lastName"]) || ""
          }
          disabled
          inputProps={{
            maxLength: 35,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <TextField
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.address1")}
          value={corporateRewardInputs.addressLine1 || ""}
          name="addressLine1"
          onChange={handleCorporateRewardChange}
          error={Boolean(validationState["addressLine1"])}
          helperText={
            (validationState && validationState["addressLine1"]) || ""
          }
          disabled={fieldsDisabled}
          inputProps={{
            maxLength: 35,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <TextField
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.address2")}
          value={corporateRewardInputs.addressLine2 || ""}
          name="addressLine2"
          onChange={handleCorporateRewardChange}
          disabled={fieldsDisabled}
          inputProps={{
            maxLength: 35,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <CountryIso
          required
          name="country"
          label={t("componentData.addPayment.labels.country")}
          selectedCountry={corporateRewardInputs.country || ""}
          value={corporateRewardInputs.country || ""}
          onChange={handleCorporateRewardChange}
          error={Boolean(validationState["country"])}
          helperText={(validationState && validationState["country"]) || ""}
          disabled={fieldsDisabled}
          InputLabelProps={{
            shrink: corporateRewardInputs.country ? true : false,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <StateIso
          required
          name="state"
          label={t("componentData.addPayment.labels.state")}
          error={Boolean(validationState["state"])}
          helperText={(validationState && validationState["state"]) || ""}
          selectedState={corporateRewardInputs.state || ""}
          value={corporateRewardInputs.state || ""}
          selectedCountry={corporateRewardInputs.country || ""}
          onChange={handleCorporateRewardChange}
          disabled={fieldsDisabled}
          InputLabelProps={{
            shrink: corporateRewardInputs.state ? true : false,
          }}
        />
      </Grid>
      <Grid xs={6} item className={classes.gridMarginTop}>
        <CityIso
          required
          name="city"
          label={t("componentData.addPayment.labels.city")}
          error={Boolean(validationState["city"])}
          helperText={(validationState && validationState["city"]) || ""}
          selectedState={corporateRewardInputs.state || ""}
          selectedCountry={corporateRewardInputs.country || ""}
          selectedCity={corporateRewardInputs.city || ""}
          value={corporateRewardInputs.city || ""}
          onChange={handleCorporateRewardChange}
          disabled={fieldsDisabled}
          InputLabelProps={{
            shrink: corporateRewardInputs.city ? true : false,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <TextField
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.zipCode")}
          value={corporateRewardInputs.postalCode || ""}
          name="postalCode"
          onChange={handleCorporateRewardChange}
          error={Boolean(validationState["postalCode"])}
          helperText={(validationState && validationState["postalCode"]) || ""}
          inputProps={{
            minLength: 5,
            maxLength: 10,
          }}
          disabled={fieldsDisabled}
        />
      </Grid>
    </Grid>
  );
}

export default withTranslation()(withStyles(styles)(CorporateRewardCard));
