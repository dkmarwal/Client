import React, {useState} from "react";
import { withTranslation } from "react-i18next";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import Zelle from "~/assets/icons/Zelle_main.svg";
import { Box, IconButton,} from "@material-ui/core";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import StarIcon from "@material-ui/icons/Star";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import EditzelleAccountInfo from "./editzelleInfo";
import EditIcon from "@material-ui/icons/Edit";
const ZelleInfo = (props) => {
  const {
    classes,
    t,
    consumerZelleDetails,
    consumerBankAccountDetails,
    isAlternatePaymentMethod,
    isPreferredPaymentMethod,
    vendorDetail,
    updateCTAsData,
    source,
    isCssfClient
  } = props;
  const [editDetail, setEditDetail] = useState(false);
  return (
    <>
    {editDetail ? (
      <EditzelleAccountInfo
        data={consumerZelleDetails}
        vendorDetail={vendorDetail}
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
                <img className={classes.payment_icon} src={Zelle} alt="Zelle" />
                <Typography variant="h3" className={classes.paymentTitle}>
                  {t(`componentData.vendorInfo.Zelle`)}
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
                  className={classes.smallIcon}
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
                    {t("componentData.vendorInfo.TokenType")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.tokenType}>
                    {consumerZelleDetails?.tokenType}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.TokenStatus")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.tokenStatus}>
                    {consumerZelleDetails?.tokenStatus}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.TokenValue")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                  {`${consumerZelleDetails?.tokenType == 'phone' && consumerZelleDetails?.tokenValue ? 
                  consumerZelleDetails?.tokenValue.replace('+','') : consumerZelleDetails?.tokenValue}`}

                    {/* {consumerZelleDetails?.tokenValue} */}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.infoKey}>
                    {t("componentData.vendorInfo.TokenUpate")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.infoValue}>
                    {consumerZelleDetails?.updatedAt}
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

export default withTranslation()(withStyles(styles)(ZelleInfo));
