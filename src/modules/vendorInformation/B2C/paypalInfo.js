import React from "react";
import { withTranslation } from "react-i18next";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import PayPal from "~/assets/icons/Paypal_main.svg";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import StarIcon from "@material-ui/icons/Star";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import { getAddress } from "~/utils/address";

const PayPalInfo = (props) => {
  const {
    classes,
    t,
    consumerPaypalDetails,
    isPreferredPaymentMethod,
    isAlternatePaymentMethod,
  } = props;
  return (
    <Grid item xs={12} md={12}>
      <ExpansionPanel className={classes.panel}>
        <ExpansionPanelSummary
          expandIcon={""}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid container>
            <Grid item xs={12} className={classes.paymentTitleOuterGrid}>
              <Grid className={classes.paymentTitleOuterCont}>
                <img
                  className={classes.payment_icon}
                  src={PayPal}
                  alt="PayPal"
                />
                <Typography
                  variant="h2"
                  className={classes.paymentTitle}
                  style={{ float: "left" }}
                >
                  {t(`componentData.vendorInfo.PayPal`)}
                </Typography>
              </Grid>
              <Grid>
                <div className={classes.preferenceIconsDiv}>
                  {isPreferredPaymentMethod && (
                    <StarIcon style={{ color: "#CBE4FF" }} />
                  )}
                  {isAlternatePaymentMethod && (
                    <StarHalfIcon style={{ color: "#CBE4FF" }} />
                  )}
                  <Typography
                    variant="h6"
                    className={classes.showText}
                    style={{ float: "right" }}
                  >
                    {t("componentData.vendorInfo.SHOWACCOUNT")}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container direction="row" style={{ paddingLeft: "32px" }}>
            <Grid
              container
              direction="row"
              className={classes.expansionDetails}
            >
              <Grid container direction="row" style={{ marginBottom: "8px" }}>
                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.TokenType")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.tokenType}>
                    {consumerPaypalDetails?.tokenType}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.Address")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPaypalDetails && getAddress(consumerPaypalDetails)}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.TokenValue")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPaypalDetails?.tokenValue}
                  </Typography>
                </Grid>
              </Grid>
              {(isPreferredPaymentMethod || isAlternatePaymentMethod) && (
                <Grid item xs={12}>
                  <div className={classes.paymentPreferenceDiv}>
                    <div className={classes.paymentPreferenceInnerDiv}>
                      {isPreferredPaymentMethod ? (
                        <StarIcon style={{ color: "#ffffff", height: 19 }} />
                      ) : isAlternatePaymentMethod ? (
                        <StarHalfIcon
                          style={{ color: "#ffffff", height: 19 }}
                        />
                      ) : null}
                      <Typography className={classes.paymentPrefText}>
                        {isPreferredPaymentMethod
                          ? t("componentData.vendorInfo.firstPaymentPreference")
                          : isAlternatePaymentMethod
                          ? t(
                              "componentData.vendorInfo.alternatePaymentPreference"
                            )
                          : null}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              )}
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
  );
};

export default withTranslation()(withStyles(styles)(PayPalInfo));
