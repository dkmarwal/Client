import React from "react";
import { withTranslation } from "react-i18next";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import Checkbox from "~/components/Forms/B2C/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Textfield from "@material-ui/core/TextField";
import {
  EmailDeliveryModeId,
  DownloadDeliveryModeId,
} from "~/config/paymentMethods";
import ACHIcon from "~/assets/icons/ACH_main.svg";
import PushToCardIcon from "~/assets/icons/Push_to_Card_main.svg";
import CheckIcon from "~/assets/icons/CHK_Blue.svg";
import ZelleIcon from "~/assets/icons/Zelle_main.svg";
import PayPalIcon from "~/assets/icons/Paypal_main.svg";

const Remittance = (props) => {
  const {
    remittanceFormat,
    remittanceDeliveryOptionName,
    classes,
    t,
    remittanceDeliveryOptionId,
    remittanceEmailId,
    preferredPaymentMethodName,
    consumerProfileData,
  } = props;

  const preferredPaymentMethodIcon = React.useMemo(() => {
    switch (preferredPaymentMethodName) {
      case "ACH":
        return {
          img: ACHIcon,
          data: consumerProfileData?.consumerBankAccountDetails?.accountNumber,
        };
      case "CHK":
        return {
          img: CheckIcon,
          data: consumerProfileData?.consumerCheckDetails?.addressLine1,
        };
      case "PayPal":
        return {
          img: PayPalIcon,
          data: consumerProfileData?.consumerPaypalDetails?.tokenValue,
        };
      case "PushToCard":
        return {
          img: PushToCardIcon,
          data: consumerProfileData?.consumerCardDetails?.cardNumber,
        };
      case "Zelle":
        return {
          img: ZelleIcon,
          data: consumerProfileData?.consumerZelleDetails?.tokenValue,
        };
      default:
        return null;
    }
  }, [preferredPaymentMethodName, consumerProfileData]);
  return (
    <Grid item xs={12} md={12}>
      <Divider />
      {(remittanceFormat || remittanceDeliveryOptionName) && (
        <>
          <Grid className={classes.remittanceInfoOuterGrid}>
            <Typography className={classes.remittanceInfoHeading}>
              {t("componentData.vendorInfo.remittanceInfo")}
            </Typography>
            <Grid container className={classes.preferredAccInfoCont}>
              <Grid item>
                <Typography className={classes.preferredAccInfoHeading}>
                  {t("componentData.vendorInfo.preferredAccount")}
                </Typography>
              </Grid>
              <Grid item style={{ paddingLeft: "57px", display: "flex" }}>
                <img
                  src={preferredPaymentMethodIcon?.img ?? ""}
                  alt="Preferred Payment Method"
                />
                <Typography className={classes.preferredAccInfoData}>
                  {preferredPaymentMethodIcon?.data ?? ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.remittanceOuterGrid}>
              <Grid item xs={4}>
                {remittanceDeliveryOptionName && (
                  <span className={classes.remittanceDeliveryMode}>
                    {t("componentData.vendorInfo.RemittanceDeliveryMode")}
                    <Box>
                      <span className={classes.gapHorizontal}>
                        <Checkbox
                          checked={true}
                          label={remittanceDeliveryOptionName}
                          index={0}
                          downloadIcon={Boolean(
                            remittanceDeliveryOptionId ===
                              DownloadDeliveryModeId
                          )}
                          emailIcon={Boolean(
                            remittanceDeliveryOptionId === EmailDeliveryModeId
                          )}
                        />
                      </span>
                    </Box>
                  </span>
                )}
              </Grid>
              <Grid item xs={4} style={{ marginLeft: "150px" }}>
                {remittanceFormat && (
                  <span
                    style={{ float: "right", width: "247px", color: "#2B2D30" }}
                  >
                    {t("componentData.vendorInfo.RemittanceFormat")}
                    <Box>
                      <span className={classes.gapHorizontal}>
                        <Checkbox
                          checked={true}
                          label={remittanceFormat}
                          index={0}
                        />
                      </span>
                    </Box>
                  </span>
                )}
              </Grid>
            </Grid>
          </Grid>
          {remittanceDeliveryOptionId === EmailDeliveryModeId && (
            <Grid container xs={6} md={6} className={classes.emailTextField}>
              <Textfield
                variant="outlined"
                value={remittanceEmailId}
                name="remittanceEmailId"
                label="E-mail"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};
export default withTranslation()(withStyles(styles)(Remittance));
