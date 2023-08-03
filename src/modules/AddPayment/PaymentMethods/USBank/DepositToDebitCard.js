import React from "react";
import TextField from "~/components/Forms/TextField";
import { Grid, withStyles } from "@material-ui/core";
import { styles } from "./styles";
import { withTranslation } from "react-i18next";

function USBankDDC({
  ddcInputs,
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
          label={t("componentData.addPayment.labels.debitCardNumber")}
          value={ddcInputs.debitCardNumber || ""}
          name="debitCardNumber"
          disabled
        />
      </Grid>
      <Grid xs={6} item >
        <TextField
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.expiryDate")}
          value={ddcInputs.expiryDate || ""}
          name="expiryDate"
          disabled
        />
      </Grid>
    </Grid>
  );
}

export default withTranslation()(withStyles(styles)(USBankDDC));
