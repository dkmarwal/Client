import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Box, IconButton,} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import EditIcon from "@material-ui/icons/Edit";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import StarIcon from "@material-ui/icons/Star";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import EditachAccountInfo from "./editachAccountInfo";
import { paymentMethodIds } from "~/config/paymentMethods";

const BankAccountInfo = (props) => {
  const {
    classes,
    t,
    consumerBankAccountDetails,
    isPreferredPaymentMethod,
    isAlternatePaymentMethod,
    vendorDetail,
    updateCTAsData,
    accountTypeList,
    sppList,
    source,
    isCssfClient,
    consumerProfileInfo,
  } = props;
  const [editDetail, setEditDetail] = useState(false);

  return (
    <>
    {editDetail ? (
      <EditachAccountInfo
        data={consumerBankAccountDetails}
        vendorDetail={vendorDetail}
        accountTypeList={accountTypeList}
        updateCTAsData={() => {
          setEditDetail(false);
          updateCTAsData();
        }}
        onCancel={() => setEditDetail(false)}
      />
    ) : 
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
              {consumerProfileInfo?.data?.primaryPaymentMethodId === paymentMethodIds.ACH && 
                <img
                  className={classes.payment_icon}
                  src={require(`~/assets/icons/ACH_main.svg`)}
                  alt="ACH"
                />
                }
                {consumerProfileInfo?.data?.primaryPaymentMethodId === paymentMethodIds.USBankRTP && 
                <img
                  className={classes.payment_icon}
                  src={require(`~/assets/icons/RTP.svg`)}
                  alt="RTP"
                />
                }
                <Typography
                  variant="h2"
                  className={classes.paymentTitle}
                  style={{ float: "left" }}
                >
                  {consumerProfileInfo?.data?.primaryPaymentMethodId === paymentMethodIds.ACH && t(`componentData.vendorInfo.BankAccountACH`)}
                  {consumerProfileInfo?.data?.primaryPaymentMethodId === paymentMethodIds.USBankRTP && t(`componentData.vendorInfo.RTP`)}
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
                    style={{ paddingLeft: "16px" }}
                    className={classes.showText}
                  >
                    {t("componentData.vendorInfo.SHOWACCOUNT")}
                    {((source ==="WebUi")||(isCssfClient===1)) && (
         
         <IconButton
           color="primary"
           aria-label="Edit Company"
           title={t("componentData.vendorCompanyInfo.EditCompany")}
           component="span"
           onClick={() => setEditDetail(true)}
           //disabled={isPayeeEditableDisabled}
         >
           <EditIcon
             color="primary"
             className={classes.smallIcon}
             onClick={() => setEditDetail(true)}
             //color={
             //isPayeeEditableDisabled ? "disabled" : "secondary"
             //}
           />
          </IconButton>
     
     )}
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
                    {t("componentData.vendorInfo.RoutingCode")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerBankAccountDetails?.routingNumber ?? ""}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.AccountNumber")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerBankAccountDetails?.accountNumber ?? ""}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.BankName")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerBankAccountDetails?.bankName ?? ""}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.AccountType")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerBankAccountDetails?.description ?? ""}
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
       }
       </>
  );
};

export default withTranslation()(withStyles(styles)(BankAccountInfo));
