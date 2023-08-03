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
}));

const PaymentPreferenceDetails = (props) => {
  const classes = useStyles();
  const { newRecord, oldRecord } = props.paymentData;

  const lookupKeys = {
    description: props.t("componentData.supplierUpdateDetail.preferredPayment"),
  };

  return (
    <Box px={3} py={2}>
      <Box>
        <Grid container alignItems="center" style={{ gap: "20px" }}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography variant="h2">
                {newRecord.actionType &&
                  newRecord.actionType.toString().toUpperCase()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {Object.keys(newRecord).length > 0 &&
              Object.keys(oldRecord).length > 0 &&
              Object.keys(lookupKeys).map((key) => {
                return newRecord[key] && oldRecord[key] ? (
                  newRecord[key] !== oldRecord[key] ? (
                    <Box my={3}>
                      <Grid
                        container
                        alignItems="center"
                        style={{ gap: "20px" }}
                      >
                        <Grid item xs={3}>
                          <Box>
                            <span className={classes.title}>
                              {lookupKeys[key]}
                            </span>
                          </Box>
                        </Grid>
                        <Grid item xs={5}>
                          <Box display="flex" alignItems="center">
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
                  ) : (
                    <Grid container style={{ gap: "20px" }}>
                      <Grid item xs={3}>
                        <Box>
                          <span className={classes.title}>
                            {lookupKeys[key]}
                          </span>
                        </Box>
                      </Grid>
                      <Grid item xs={5}>
                        <Box style={{ maxWidth: "400px" }}>
                          <div className={classes.newString}>
                            {newRecord[key]}
                          </div>
                        </Box>
                      </Grid>
                    </Grid>
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

export default withTranslation()(PaymentPreferenceDetails);
