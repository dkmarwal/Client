import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  makeStyles,
  Paper,
  Divider,
  Avatar,
} from "@material-ui/core";
import { getConsumerUpdateDetails } from "~/redux/helpers/supplier";
import SupplierProfileCardB2C from "../../SupplierProfileCard/B2C/index";

import Notification from "~/components/Notification";
import { withTranslation } from "react-i18next";
import PasswordUpdateDetails from "../B2C/DetailCards/PasswordUpdateDetails";
import PaymentPreferenceDetails from "../B2C/DetailCards/PaymentPreferenceDetails";
import AccountDetails from "../B2C/DetailCards/AccountDetails";
import USbankAccountDetails from "./DetailCards/USbankAccountDetails";
import clsx from "clsx";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
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
    paddingTop: 10,
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
    marginBottom: 16,
    paddingLeft: "10px",
  },
  btnContainer: {
    display: "block",
    textAlign: "center",
  },
  dividerBorder: {
    backgroundColor: "#8F9EC4",
    width: "100%",
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "14px !important",
  },
  orange: {
    color: "#b11c1cad",
    backgroundColor: "#f5a6a66b",
  },
}));

const B2CSupplierUpdateDetails = (props) => {
  const { t, actionTypeId, selectedCard, consumerIdentifier, payeeType, createdAt } =
    props;
    const { isPayeeChoicePortal } = props.user;
  const [supplierData, setSupplierData] = useState({});
  const [error, setError] = useState(false);
  useEffect(() => {
    fetchSupplierData(selectedCard);
    return () => {};
  }, [selectedCard, consumerIdentifier]);

  const classes = useStyles();

  const fetchSupplierData = async (consumerUpdatesId) => {
    let response = {};
    response = await getConsumerUpdateDetails({ consumerUpdatesId });
    if (response) {
      setSupplierData(response.data);
    }
  };
 

  const renderDetailCard = (actionTypeId) => {
    switch (actionTypeId) {
      case 1: {
        return <PasswordUpdateDetails passwordData={supplierData} />;
      }
      case 2: {
        if (isPayeeChoicePortal) {
          return <USbankAccountDetails accountData={supplierData} />;
        }
        else{
        return <AccountDetails accountData={supplierData} />;}
      }
      case 4: {
        return <PaymentPreferenceDetails paymentData={supplierData} />;
      }
      default:
    }
  };

  const getProfileCircleName = (name) => {
    return (
      name &&
      name
        .match(/(\b\S)?/g)
        .join("")
        .match(/(^\S|\S$)?/g)
        .join("")
        .toUpperCase()
    );
  };

  return (
    <Box m={3} width="65%">
      <Box className={classes.profile} mb={2}>
        {typeof consumerIdentifier !== "undefined" && (
          <Paper square elevation={3}>
            <Box p={3}>
              <SupplierProfileCardB2C
                supplierId={consumerIdentifier}
                payeeType={payeeType}
                consumerInfo={supplierData?.consumerInfo}
              />
            </Box>
          </Paper>
        )}
      </Box>
      <Box className={classes.details} minHeight="50%">
        <Paper square elevation={3} style={{ wordWrap: "break-word" }}>
          {Object.keys(supplierData).length > 0 &&
            renderDetailCard(actionTypeId)}
          <Box px={2} py={2}>
            <Divider className={classes.dividerBorder} />
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <Box mb={2} display="flex" alignItems="center">
                  <Box my={1} style={{ color: "#7F7F7F" }}>
                    {t("componentData.supplierUdateList.Updated By")}:
                  </Box>
                  <Box ml={1} my={1}>
                    <Avatar className={clsx(classes.orange, classes.small)}>
                      {getProfileCircleName(props.userName)}
                    </Avatar>
                  </Box>
                  <Box m={1}>{props.userName}</Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  mb={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="end"
                >
                  <Box m={1} style={{ color: "#7F7F7F" }}>
                    {t("componentData.supplierUdateList.Date")} |{" "}
                    {t("componentData.supplierUdateList.Time")}:{" "}
                  </Box>
                  <Box my={1}>
                    {moment(createdAt).format("Do MMM YYYY | hh:mm:ss A")}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      {error && (
        <Notification
          open={error ? true : false}
          variant="error"
          message={error}
          handleClose={() => setError(false)}
        />
      )}
    </Box>
  );
};

export default withTranslation()(B2CSupplierUpdateDetails);
