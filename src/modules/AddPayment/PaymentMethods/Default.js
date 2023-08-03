import React from "react";
import TextField from "~/components/Forms/TextField";
import { Grid, Box, makeStyles } from "@material-ui/core";
import ExpansionBar from "~/components/ExpansionBar";
import { withTranslation } from "react-i18next";

function Default({ defaultInputs, handleDefaultChange, t,isPayeeChoicePortal }) {
  const useStyles = makeStyles((theme) => ({
    button: {
      border: "2px solid #0B1941",
      borderRadius: "6px",
      marginTop: theme.spacing(2),
    },
    customFieldContainer: {
      border: "1px solid #CCCCCC",
      borderRadius: "8px",
      marginTop: theme.spacing(4),
      width: "98.1%",
    },
    subText: {
      color: "#4C4C4C",
      fontSize: "14px",
      marginTop: theme.spacing(2),
    },
    usBankCustomFieldContainer:{
      border: "1px solid #CCCCCC",
      borderRadius: "4px",
      width: "98.1%",
      marginTop:theme.spacing(3)
    }
  }));

  const classes = useStyles();
  return (
    <>
      <Box className={isPayeeChoicePortal ? classes.usBankCustomFieldContainer : classes.customFieldContainer}>
        <ExpansionBar
          label={t("componentData.addPayment.labels.customFields")}
          isBottomBorder={false}
          isBorderRadius={true}
        >
          <Grid
            xs={12}
            container
            spacing={3}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid xs={6} item>
              <TextField
                fullWidth={true}
                variant="outlined"
                label={t("componentData.addPayment.labels.custom1")}
                value={defaultInputs.customField1 || ""}
                name="customField1"
                onChange={handleDefaultChange}
                inputProps={{
                  maxLength: 140,
                }}
              />
            </Grid>
            <Grid xs={6} item>
              <TextField
                fullWidth={true}
                variant="outlined"
                label={t("componentData.addPayment.labels.custom2")}
                value={defaultInputs.customField2 || ""}
                name="customField2"
                onChange={handleDefaultChange}
                inputProps={{
                  maxLength: 140,
                }}
              />
            </Grid>
            <Grid xs={6} item>
              <TextField
                fullWidth={true}
                variant="outlined"
                label={t("componentData.addPayment.labels.custom3")}
                value={defaultInputs.customField3 || ""}
                name="customField3"
                onChange={handleDefaultChange}
                inputProps={{
                  maxLength: 140,
                }}
              />
            </Grid>
            <Grid xs={6} item>
              <TextField
                fullWidth={true}
                variant="outlined"
                label={t("componentData.addPayment.labels.custom4")}
                value={defaultInputs.customField4 || ""}
                name="customField4"
                onChange={handleDefaultChange}
                inputProps={{
                  maxLength: 140,
                }}
              />
            </Grid>
            <Grid xs={6} item>
              <TextField
                fullWidth={true}
                variant="outlined"
                label={t("componentData.addPayment.labels.custom5")}
                value={defaultInputs.customField5 || ""}
                name="customField5"
                onChange={handleDefaultChange}
                inputProps={{
                  maxLength: 140,
                }}
              />
            </Grid>
          </Grid>
        </ExpansionBar>
      </Box>
    </>
  );
}

export default withTranslation()(Default);
