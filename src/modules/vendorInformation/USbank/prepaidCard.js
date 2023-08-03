import React, {useState} from "react";
import { withTranslation } from "react-i18next";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import StarIcon from "@material-ui/icons/Star";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import { Box, IconButton,} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import EditppdAccountInfo from "./editppdAccountInfo"
import EditcorporateAccountInfo from "./editcorporateAccountInfo"
import { paymentMethodIds } from "~/config/paymentMethods";
const PrepaidCardInfo = (props) => {
  const {
    classes,
    t,
    consumerPrepaidCardDetails,
    isPreferredPaymentMethod,
    isAlternatePaymentMethod,
    vendorDetail,
    updateCTAsData,
    finalCardDetails,
    source,
    isCssfClient,
    primaryPaymentMethodIdselected,
  } = props;

  const [editDetail, setEditDetail] = useState(false);
  return (
    <>
     {editDetail ? 
     
     (primaryPaymentMethodIdselected=== paymentMethodIds.PrepaidFocusNonPayroll|| primaryPaymentMethodIdselected===paymentMethodIds.PrepaidReliaCard)?
     
      <EditppdAccountInfo
        data={consumerPrepaidCardDetails}
        vendorDetail={vendorDetail}
        updateCTAsData={() => {
          setEditDetail(false);
          updateCTAsData();
        }}
        finalCardDetails={finalCardDetails}
        onCancel={() => setEditDetail(false)}
      />
     :
    (primaryPaymentMethodIdselected===paymentMethodIds.PlasticCorporateCard||primaryPaymentMethodIdselected===paymentMethodIds.DigitalCorporateCard)?
    <EditcorporateAccountInfo
    data={consumerPrepaidCardDetails}
    vendorDetail={vendorDetail}
    updateCTAsData={() => {
      setEditDetail(false);
      updateCTAsData();
    }}
    finalCardDetails={finalCardDetails}
    onCancel={() => setEditDetail(false)}
  />:null
    
    : 
    <Grid item xs={12} md={12}>
        {/* {true && (
            <Box justifyContent="flex-end" alignSelf="flex-end" display="flex">
              <IconButton
                color="primary"
                aria-label="Edit Company"
                title={t("componentData.vendorCompanyInfo.EditCompany")}
                component="span"
                onClick={() => setEditDetail(true)}
                //disabled={isPayeeEditableDisabled}
              >
                <EditIcon
                  className={classes.smallIcon}
                  //color={
                  //isPayeeEditableDisabled ? "disabled" : "secondary"
                  //}
                />
              </IconButton>
            </Box>
          )} */}
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
                  src={require(`~/assets/icons/USbank/Prepaidcard.svg`)}
                  alt="Prepaid Card"
                />
                <Typography
                  variant="h2"
                  className={classes.paymentTitle}
                  style={{ float: "left" }}
                >
                  {primaryPaymentMethodIdselected===paymentMethodIds.PrepaidFocusNonPayroll?              
                  t(`componentData.vendorInfo.FocusCard`):primaryPaymentMethodIdselected===paymentMethodIds.PrepaidReliaCard?
                  t(`componentData.vendorInfo.ReliaCard`):primaryPaymentMethodIdselected===paymentMethodIds.PlasticCorporateCard?
                  t(`componentData.vendorInfo.PlasticCard`):primaryPaymentMethodIdselected===paymentMethodIds.DigitalCorporateCard?
                  t(`componentData.vendorInfo.DigitalCard`):""      
                }
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
                        >
                          <EditIcon className={classes.smallIcon} />
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
              {(primaryPaymentMethodIdselected===paymentMethodIds.PrepaidFocusNonPayroll||primaryPaymentMethodIdselected===paymentMethodIds.PrepaidReliaCard)?

              <Grid container direction="row" style={{ marginBottom: "8px" }}>
              <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.RoutingCode")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPrepaidCardDetails?.routingNumber ?? ""}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.BankAccountNumber")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPrepaidCardDetails?.payToNumber ?? ""}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.BankName")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPrepaidCardDetails?.bankName ?? ""}
                  </Typography>
                </Grid>

              </Grid>:null}
              
              {
              (primaryPaymentMethodIdselected===paymentMethodIds.PlasticCorporateCard||primaryPaymentMethodIdselected===paymentMethodIds.DigitalCorporateCard)?
              
             
             <Grid container direction="row" style={{ marginBottom: "8px" }}>
              <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.AddressLine1")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPrepaidCardDetails?.address1 ?? ""}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.AddressLine2")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPrepaidCardDetails?.address2 ?? ""}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.Country")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPrepaidCardDetails?.country ?? ""}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.State")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPrepaidCardDetails?.state ?? ""}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.City")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPrepaidCardDetails?.city ?? ""}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.PostalCode")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerPrepaidCardDetails?.postalCode ?? ""}
                  </Typography>
                </Grid>

              </Grid>:null}
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
    </Grid>}
  </>
  );
};

export default withTranslation()(withStyles(styles)(PrepaidCardInfo));
