import React from "react";
import { Grid, Box, makeStyles, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { withTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  dividerBorder: {
    backgroundColor: "#8F9EC4",
    width: "100%",
  },
  title: {
    color: "rgba(0,0,0,0.87)",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "0.44px",
    lineHeight: "17px",
    textTransform: "capitalize",
  },
  prevString: {
    color: "#212121",
    fontSize: "14px",
    letterSpacing: "0.44px",
    lineHeight: "16px",
    textDecoration: "line-through",
    display: "flex",
    alignItems: "center",
    wordBreak: "break-word",
    paddingLeft: "10px",
  },
  arrow: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  newString: {
    color: "#33C3A4",
    fontSize: "14px",
    letterSpacing: "0.44px",
    lineHeight: "16px",
    wordBreak: "break-word",
    paddingLeft: "10px",
  },
  upperCase: {
    textTransform: "upperCase",
  },
}));

const AccountDetails = (props) => {
  const classes = useStyles();
  const { t } = props;
  const {
    newRecord,
    oldRecord,
    paymentMethodId,
    paymentMethodInfo,
  } = props.accountData;
  const lookupKeys = {
    /*  Bank Account  */
    2: {
      accountNumber: t("componentData.supplierUpdateDetail.accountNumber"),
      routingNumber: t("componentData.supplierUpdateDetail.routingNumber"),
      accountClassification: t(
        "componentData.supplierUpdateDetail.accountClass"
      ),
      accountType: t("componentData.supplierUpdateDetail.accountType"),
      bankName: t("componentData.supplierUpdateDetail.bankName"),
      validationStatus: t(
        "componentData.supplierUpdateDetail.ValidationStatus"
      ),
    },
    /*  PayPal */
    16: {
      tokenType: t("componentData.supplierUpdateDetail.tokenType"),
      tokenValue: t("componentData.supplierUpdateDetail.tokenValue"),
      email: t("componentData.supplierUpdateDetail.email"),
      addressLine1: t("componentData.supplierUpdateDetail.addressLine1"),
      addressLine2: t("componentData.supplierUpdateDetail.addressLine2"),
      country: t("componentData.supplierUpdateDetail.country"),
      state: t("componentData.supplierUpdateDetail.state"),
      city: t("componentData.supplierUpdateDetail.city"),
      postalCode: t("componentData.supplierUpdateDetail.postalCode"),
      phone: t("componentData.supplierUpdateDetail.phone"),
    },
    /*  Zelle  */
    64: {
      tokenType: t("componentData.supplierUpdateDetail.tokenType"),
      tokenValue: t("componentData.supplierUpdateDetail.tokenValue"),
    },
    /*  Push to Card  */
    32: {
      nameOnCard: t("componentData.supplierUpdateDetail.nameOnCard"),
      cardNumber: t("componentData.supplierUpdateDetail.cardNumber"),
      cvv: t("componentData.supplierUpdateDetail.CVV"),
      addressLine1: t("componentData.supplierUpdateDetail.addressLine1"),
      addressLine2: t("componentData.supplierUpdateDetail.addressLine2"),
      country: t("componentData.supplierUpdateDetail.country"),
      state: t("componentData.supplierUpdateDetail.state"),
      city: t("componentData.supplierUpdateDetail.city"),
      postalCode: t("componentData.supplierUpdateDetail.postalCode"),
    },
    /*  Check  */
    1: {
      addressLine1: t("componentData.supplierUpdateDetail.addressLine1"),
      addressLine2: t("componentData.supplierUpdateDetail.addressLine2"),
      country: t("componentData.supplierUpdateDetail.country"),
      state: t("componentData.supplierUpdateDetail.state"),
      city: t("componentData.supplierUpdateDetail.city"),
      postalCode: t("componentData.supplierUpdateDetail.postalCode"),
      validationStatus: t(
        "componentData.supplierUpdateDetail.ValidationStatus"
      ),
    },
  };

  return (
    <Box px={3} py={2}>
      <Box pt={1}>
        <Grid container alignItems="center" style={{ gap: "20px" }}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography variant="h2" className={classes.upperCase}>
                {paymentMethodInfo && newRecord.actionType
                  ? `${paymentMethodInfo} ${newRecord.actionType}`
                  : ""}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {Object.keys(newRecord).length > 0 &&
              Object.keys(oldRecord).length > 0 &&
              lookupKeys[paymentMethodId] &&
              Object.keys(lookupKeys[paymentMethodId]).map((key) => {
                return newRecord[key] && oldRecord[key] ? (
                  newRecord[key] !== oldRecord[key] ? (
                    <>
                      <Box my={3} key={key}>
                        <Grid
                          container
                          alignItems="center"
                          style={{ gap: "20px" }}
                        >
                          <Grid item xs={3}>
                            <Box
                            //   mb={2}
                            >
                              <span className={classes.title}>
                                {key === "tokenValue"
                                  ? lookupKeys[paymentMethodId][
                                      newRecord["tokenType"]
                                    ]
                                  : lookupKeys[paymentMethodId][key]}
                              </span>
                            </Box>
                          </Grid>
                          <Grid item xs={5}>
                            <Box
                              // mb={2}
                              display="flex"
                              alignItems="center"
                            >
                              <span className={classes.prevString}>
                                {oldRecord[key]}{" "}
                                <ArrowForwardIcon fontSize="small" />
                              </span>
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <div className={classes.newString}>
                              {newRecord[key]}
                            </div>
                          </Grid>
                        </Grid>
                      </Box>
                      {key === "tokenType" && newRecord[key] === "phone" && (
                        <Box my={3} key={key}>
                          <Grid container style={{ gap: "20px" }}>
                            <Grid item xs={3}>
                              <Box
                                alignItems="center"
                                // mb={2}
                              >
                                <span className={classes.title}>
                                  {t(
                                    "componentData.supplierUpdateDetail.phoneExt"
                                  )}
                                </span>
                              </Box>
                            </Grid>
                            <Grid item xs={5}>
                              <Box
                                style={{ maxWidth: "400px" }}
                                alignItems="center"
                              >
                                <div className={classes.newString}>{"+1"}</div>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box my={3} key={key}>
                      <Grid container style={{ gap: "20px" }}>
                        <Grid item xs={3}>
                          <Box
                            alignItems="center"
                            // mb={2}
                          >
                            <span className={classes.title}>
                              {key === "tokenValue"
                                ? lookupKeys[paymentMethodId][
                                    newRecord["tokenType"]
                                  ]
                                : lookupKeys[paymentMethodId][key]}
                            </span>
                          </Box>
                        </Grid>
                        <Grid item xs={5}>
                          <Box
                            style={{ maxWidth: "400px" }}
                            alignItems="center"
                          >
                            <div className={classes.newString}>
                              {newRecord[key]}
                            </div>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )
                ) : (
                  <></>
                );
              })}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default withTranslation()(AccountDetails);
