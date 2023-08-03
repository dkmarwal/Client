import React from "react";
import TextField from "~/components/Forms/TextField";
import { Grid, MenuItem } from "@material-ui/core";
import Phone from "~/components/TextBox/Phone";
import { withTranslation } from "react-i18next";

function USBankZelle({
  zelleInputs,
  handleZelleChange,
  validationState,
  fieldsDisabled,
  t
}) {
  return (
    <Grid xs={12} container spacing={2}>
      <Grid xs={6} item>
        <TextField
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.tokenType")}
          value={zelleInputs.zelleTokenType}
          disabled={fieldsDisabled}
          name="zelleTokenType"
          onChange={handleZelleChange}
          select
        >
          <MenuItem value="email">
            {t("componentData.addPayment.labels.email")}
          </MenuItem>
          <MenuItem value="phone">
            {t("componentData.addPayment.labels.phone")}
          </MenuItem>
        </TextField>
      </Grid>
      {zelleInputs.zelleTokenType === "email" ? (
        <Grid xs={6} item>
          <TextField
            required
            fullWidth={true}
            disabled={fieldsDisabled}
            variant="outlined"
            label={t("componentData.addPayment.labels.email")}
            value={zelleInputs.emailZelle}
            name="emailZelle"
            onChange={handleZelleChange}
            error={
              Boolean(validationState["emailZelle"]) ||
              Boolean(validationState["emailValidZelle"])
            }
            helperText={
              (validationState && validationState["emailZelle"]) ||
              validationState["emailValidZelle"] ||
              ""
            }
            inputProps={{
              maxLength: 255,
            }}
          />
        </Grid>
      ) : null}
      {zelleInputs.zelleTokenType === "phone" ? (
        <Grid xs={6} item style={{ marginTop: "8px" }}>
          <Phone
            required={true}
            error={Boolean(validationState["zellePhoneNumber"])}
            helperText={
              (validationState && validationState["zellePhoneNumber"]) || ""
            }
            isExt={false}
            name="zellePhoneNumber"
            disabled={fieldsDisabled}
            value={zelleInputs.zellePhoneNumber?.phone}
            ccode={zelleInputs.zellePhoneNumber?.ccode}
            prefixCcode="+1"
            fullWidth={true}
            variant="outlined"
            onChange={handleZelleChange}
          />
        </Grid>
      ) : null}
    </Grid>
  );
}

export default withTranslation()(USBankZelle);
