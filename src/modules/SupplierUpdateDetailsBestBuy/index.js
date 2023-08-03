/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  makeStyles,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { getSupplierBestBuyUpdate } from "../../redux/helpers/supplier";
import SupplierProfileCard from "../SupplierProfileCard";
import InfoDialogue from "~/components/InfoDialogue";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

import {
  approveSupplierUpdateBestBuy,
  rejectSupplierUpdateBestBuy,
  unshareSupplier,
} from "~/redux/helpers/supplier";
import Notification from "~/components/Notification";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import PaymentTooltip from "~/components/PaymentTooltip";
import { withTranslation } from "react-i18next";
import { fetchUnmaskedAccountNumber } from "~/redux/actions/suppliers";
import { connect } from "react-redux";

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
  noDataText: {
    color: "#9E9E9E",
    fontSize: "14px",
    letterSpacing: "0.44px",
    lineHeight: "16px",
    wordBreak: "break-word",
    paddingLeft: "10px",
  },
}));

const SupplierUpdateDetails = (props) => {
  const { t } = props;
  const [payeeId, setPayeeId] = useState();
  const [entityId, setEntityId] = useState();
  const [actionType, setActionType] = useState();
  const [action, setAction] = useState();
  const [openModel, setOpenModel] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [supplierData, setSupplierData] = useState({});
  const [error, setError] = useState(false);
  const [variant, setVariant] = useState("error");
  const [refreshKey, setRefreshKey] = useState(true);
  const [inProcessing, setInProcessing] = useState(false);
  const [openUnmaskedAccountNumber, setOpenUnmaskedAccountNumber] =
    useState(false);

  const { recordStatusId, canAcceptReject, noteMessage } =
    props.bestBuySupplier;
  useEffect(() => {
    setPayeeId(parseInt(props.payeeId));
    setEntityId(props.entityId);
    setActionType(props.actionType);
    setAction(props.action);
    fetchSupplierData(props.entityId);
    setShowBtn(true);
    return () => {};
  }, [props.payeeId, props.selectedCard, props.bestBuySupplier.status]);

  const classes = useStyles();

  const fetchSupplierData = async (entityId) => {
    let response = {};
    response = await getSupplierBestBuyUpdate(entityId);
    if (response && !response.error) {
      setSupplierData(response);
    } else {
      setError(response.message);
      setVariant(
        response.status && response.status === 404 ? "warning" : "error"
      );
    }
  };
  const getUnmaskedAccountNumber = (accountDetailId) => {
    props
      .dispatch(fetchUnmaskedAccountNumber(accountDetailId))
      .then((response) => {
        if (response) {
          setOpenUnmaskedAccountNumber(true);
        }
      });
  };
  const checkIfKeyUpdated = (key, newDetails, prevDetails) => {
    let isUpdated = false;
    switch (key) {
      case "commercialCardType": {
        isUpdated =
          newDetails[key].creditCardTypeId &&
          prevDetails[key].creditCardTypeId &&
          newDetails[key].creditCardTypeId !==
            prevDetails[key].creditCardTypeId;
        break;
      }
      case "locationType": {
        isUpdated =
          newDetails[key].locationTypeId &&
          prevDetails[key].locationTypeId &&
          newDetails[key].locationTypeId !== prevDetails[key].locationTypeId;
        break;
      }
      case "accountClass": {
        isUpdated =
          newDetails[key].accountClassId &&
          prevDetails[key].accountClassId &&
          newDetails[key].accountClassId !== prevDetails[key].accountClassId;
        break;
      }
      case "accountType": {
        isUpdated =
          newDetails[key].accountTypeId &&
          prevDetails[key].accountTypeId &&
          newDetails[key].accountTypeId !== prevDetails[key].accountTypeId;
        break;
      }
      case "contactType": {
        isUpdated =
          newDetails[key].contactTypeId &&
          prevDetails[key].contactTypeId &&
          newDetails[key].contactTypeId !== prevDetails[key].contactTypeId;
        break;
      }
      default: {
        isUpdated = false;
        break;
      }
    }
    return isUpdated;
  };

  const onApproved = async () => {
    //Added remit to id validation only for bank account/ virtual card
    setInProcessing(true);
    const data = { payerReviewUpdateId: entityId };
    const resp = await approveSupplierUpdateBestBuy(data);
    if (resp.error) {
      typeof resp.message === "string"
        ? setError(resp.message)
        : setError(t("componentData.supplierUpdateDetail.errorOccurred"));

      setVariant(resp.status && resp.status === 404 ? "warning" : "error");
      return false;
    }
    setInProcessing(false);
    setError(t("componentData.supplierUpdateDetail.ChangesApproved"));
    setVariant("success");
    setSupplierData("");
    setShowBtn(false);
    setRefreshKey(!refreshKey);
    props.fetchClientSupplierUpdate();
  };

  const onReject = async () => {
    //Added remit to id validation only for bank account/ virtual card
    setInProcessing(true);
    const data = { payerReviewUpdateId: entityId };
    const resp = await rejectSupplierUpdateBestBuy(data);
    if (resp.error) {
      typeof resp.message === "string"
        ? setError(resp.message)
        : setError(t("componentData.supplierUpdateDetail.errorOccurred"));

      setVariant(resp.status && resp.status === 404 ? "warning" : "error");
      return false;
    }
    setInProcessing(false);
    setError(resp.message);
    setVariant("success");
    setSupplierData("");
    setShowBtn(false);
    setRefreshKey(!refreshKey);
    props.fetchClientSupplierUpdate();
  };

  const handleUnshareApprove = async () => {
    const data = {
      actionId: entityId,
      actionType: actionType,
    };
    const resp = await unshareSupplier(payeeId, props.clientId, data);
    if (resp.error) {
      typeof resp.message === "string"
        ? setError(resp.message)
        : setError(t("componentData.supplierUpdateDetail.errorOccurred"));

      setVariant("error");
      return false;
    }
    setShowBtn(false);
    setOpenModel(false);
    setError(t("componentData.supplierUpdateDetail.PayeeUnshared"));
    setVariant("success");
    props.fetchClientSupplierUpdate();
  };

  const renderLocationList = (locations) => {
    let result = "";
    if (locations.length > 1) {
      result = (
        <>
          {`${locations[0].locationName} ( ${locations[0].locationType.locationTypeName} )`}
          <PaymentTooltip payeeBankAccountData={locations} />
        </>
      );
    } else {
      result = locations
        .map((location) => {
          return `${location.locationName} ( ${location.locationType.locationTypeName} )`;
        })
        .join(", ");
    }

    return result;
  };

  let { newDetails = {}, prevDetails = {} } = supplierData;
  if (newDetails && Object.keys(newDetails).length > 0) {
    if (actionType === "BANK_ACCOUNT") {
      const {
        accountName,
        bankName,
        routingCode,
        bankAddress1,
        bankAddress2,
        bankCity,
        bankZipPostal,
        bankStateRegion,
        bankCountryIso,
        currencyCode,
        accountNumber,
        accountClass,
        accountType,
        payeeBankAccountLocations,
        validationStatus,
        remitToIds,
        bankContactEmail,
        bankContact,
      } = newDetails;
      const orderedNewDetails = {
        accountName,
        bankName,
        routingCode,
        bankAddress1,
        bankAddress2,
        bankCity,
        bankStateRegion,
        bankCountryIso,
        bankZipPostal,
        bankContactEmail,
        bankContact,
        currencyCode,
        accountNumber,
        accountClass,
        accountType,
        payeeBankAccountLocations,
        payeeValidationStatus: validationStatus,
        validationStatus, //Added this one because lookupKeys do have validationStatus
        remitToIds,
        //...newDetails
      };
      newDetails = { ...orderedNewDetails, ...newDetails };
    }
    if (actionType === "VIRTUAL_CARD") {
      const {
        contactEmail,
        commercialCardType,
        countryIso,
        currencyCode,
        usedFor,
      } = newDetails;
      const orderedNewDetails = {
        contactEmail,
        commercialCardType,
        countryIso,
        currencyCode,
        usedFor,
      };
      newDetails = { ...orderedNewDetails, ...newDetails };
    }
    if (actionType === "COMPANY") {
      const { companyName, website, taxId, dunsNumber } = newDetails;
      const orderedNewDetails = {
        companyName,
        website,
        taxId,
        dunsNumber,
      };
      newDetails = { ...orderedNewDetails, ...newDetails };
    }
    if (actionType === "CONTACT") {
      const {
        title,
        firstName,
        lastName,
        displayName,
        jobTitle,
        email,
        contactType,
        phoneCountryCode,
        phone,
        phoneExt,
        fax,
      } = newDetails;
      const orderedNewDetails = {
        title,
        firstName,
        lastName,
        displayName,
        jobTitle,
        email,
        contactType,
        phoneCountryCode,
        phone,
        phoneExt,
        fax,
      };
      newDetails = { ...orderedNewDetails, ...newDetails };
    }
  }

  const lookupKeys = {
    BANK_ACCOUNT: {
      accountName: t("componentData.supplierUpdateDetail.accountName"),
      bankName: t("componentData.supplierUpdateDetail.bankName"),
      accountNumber: t("componentData.supplierUpdateDetail.accountNumber"),
      routingCode: t("componentData.supplierUpdateDetail.routingCode"),
      bankAddress1: t("componentData.supplierUpdateDetail.bankAddress1"),
      bankAddress2: t("componentData.supplierUpdateDetail.bankAddress2"),
      bankStateRegion: t("componentData.supplierUpdateDetail.bankStateRegion"),
      bankCity: t("componentData.supplierUpdateDetail.bankCity"),
      bankCountryIso: t("componentData.supplierUpdateDetail.bankCountryIso"),
      bankZipPostal: t("componentData.supplierUpdateDetail.bankZipPostal"),
      bankPostal: t("componentData.supplierUpdateDetail.bankPostal"),
      bankPhone: t("componentData.supplierUpdateDetail.bankPhone"),
      bankPhoneExt: t("componentData.supplierUpdateDetail.bankPhoneExt"),
      currencyCode: t("componentData.supplierUpdateDetail.currencyCode"),
      locationName: "",
      payeeBankAccountLocations: t(
        "componentData.supplierUpdateDetail.Location"
      ),
      validationStatus: t(
        "componentData.supplierUpdateDetail.ValidationStatus"
      ),
      remitToIds: t("componentData.supplierUpdateDetail.RemitID"),
      accountClass: t("componentData.supplierUpdateDetail.accountClass"),
      accountType: t("componentData.supplierUpdateDetail.accountType"),
      bankContactEmail: t(
        "componentData.supplierUpdateDetail.bankContactEmail"
      ),
      bankContact: t("componentData.supplierUpdateDetail.bankContact"),
    },
    VIRTUAL_CARD: {
      contactEmail: t("componentData.supplierUpdateDetail.vcContactEmail"),
      usedFor: t("componentData.supplierUpdateDetail.VCusedFor"),
      currencyCode: t("componentData.supplierUpdateDetail.currencyCode"),
      countryIso: t("componentData.supplierUpdateDetail.countryIso"),
      remitToIds: t("componentData.supplierUpdateDetail.RemitID"),
      commercialCardType: t(
        "componentData.supplierUpdateDetail.commercialCardType"
      ),
    },
    LOCATION: {
      locationName: t("componentData.supplierUpdateDetail.locationName"),
      locationType: t("componentData.supplierUpdateDetail.locationType"),
      address1: t("componentData.supplierUpdateDetail.address1"),
      address2: t("componentData.supplierUpdateDetail.address2"),
      city: t("componentData.supplierUpdateDetail.city"),
      country: t("componentData.supplierUpdateDetail.country"),
      zipCode: t("componentData.supplierUpdateDetail.zipCode"),
      postalCode: t("componentData.supplierUpdateDetail.postalCode"),
      fax: t("componentData.supplierUpdateDetail.fax"),
      phone: t("componentData.supplierUpdateDetail.phone"),
      phoneCountryCode: t(
        "componentData.supplierUpdateDetail.phoneCountryCode"
      ),
      phoneExt: t("componentData.supplierUpdateDetail.phoneExt"),
      state: t("componentData.supplierUpdateDetail.state"),
    },
    CONTACT: {
      displayName: t("componentData.supplierUpdateDetail.displayName"),
      email: t("componentData.supplierUpdateDetail.email"),
      fax: t("componentData.supplierUpdateDetail.fax"),
      firstName: t("componentData.supplierUpdateDetail.firstName"),
      jobTitle: t("componentData.supplierUpdateDetail.jobTitle"),
      lastName: t("componentData.supplierUpdateDetail.lastName"),
      phone: t("componentData.supplierUpdateDetail.phone"),
      phoneCountryCode: t(
        "componentData.supplierUpdateDetail.phoneCountryCode"
      ),
      phoneExt: t("componentData.supplierUpdateDetail.phoneExt"),
      title: t("componentData.supplierUpdateDetail.title"),
      contactType: t("componentData.supplierUpdateDetail.contactType"),
    },
    COMPANY: {
      companyName: t("componentData.supplierUpdateDetail.companyName"),
      dunsNumber: t("componentData.supplierUpdateDetail.dunsNumber"),
      taxId: t("componentData.supplierUpdateDetail.taxId"),
      website: t("componentData.supplierUpdateDetail.website"),
      address1: t("componentData.supplierUpdateDetail.address1"),
      address2: t("componentData.supplierUpdateDetail.address2"),
      city: t("componentData.supplierUpdateDetail.city"),
      country: t("componentData.supplierUpdateDetail.country"),
      zipCode: t("componentData.supplierUpdateDetail.zipCode"),
      postalCode: t("componentData.supplierUpdateDetail.postalCode"),
      phone: t("componentData.supplierUpdateDetail.phone"),
      phoneCountryCode: t(
        "componentData.supplierUpdateDetail.phoneCountryCode"
      ),
      phoneExt: t("componentData.supplierUpdateDetail.phoneExt"),
      fax: t("componentData.supplierUpdateDetail.fax"),
      state: t("componentData.supplierUpdateDetail.state"),
    },
  };
  const unmaskedAccountNumber =
    props.suppliers?.unmaskedAccountNumber?.data?.accountNumber;

  return (
    <Box m={3} width="65%">
      {openModel && (
        <InfoDialogue
          title={t("componentData.supplierUpdateDetail.txtMsg")}
          px={12}
          py={2.4}
          onCancel={() => {
            setOpenModel(false);
          }}
          onConfirm={handleUnshareApprove}
          confirmText={t("componentData.supplierUpdateDetail.CONTINUE")}
          open={true}
        />
      )}
      {openUnmaskedAccountNumber && (
        <Dialog onClose={() => setOpenUnmaskedAccountNumber(false)} open={true}>
          <DialogContent style={{ display: "flex" }}>
            <Typography
              style={{
                paddingRight: "8px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {t("componentData.vendorInfo.accountNumber")}
            </Typography>
            <Typography style={{ fontWeight: "bold", fontSize: "18px" }}>
              {unmaskedAccountNumber}
            </Typography>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => setOpenUnmaskedAccountNumber(false)}
            >
              {t("componentData.vendorInfo.OK")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Box className={classes.profile} mb={2}>
        {typeof payeeId !== "undefined" && (
          <Paper square elevation={3}>
            <Box p={3}>
              <SupplierProfileCard
                supplierId={payeeId}
                refreshKey={refreshKey}
              />
            </Box>
          </Paper>
        )}
      </Box>
      <Box className={classes.details} minHeight="50%">
        <Paper square elevation={3} style={{ wordWrap: "break-word" }}>
          {action === "UPDATE" && (
            <Box px={4} py={2} minHeight={"200px"}>
              {newDetails &&
                prevDetails &&
                Object.keys(newDetails).length > 0 &&
                Object.keys(prevDetails).length > 0 &&
                Object.keys(newDetails).map((key) => {
                  if (
                    (newDetails[key] || prevDetails[key]) &&
                    lookupKeys &&
                    lookupKeys[actionType][key]
                  ) {
                    const objectTypeKeys = [
                      "commercialCardType",
                      "locationType",
                      "accountClass",
                      "accountType",
                      "contactType",
                    ];
                    const isUpdated = checkIfKeyUpdated(
                      key,
                      newDetails,
                      prevDetails
                    );
                    if (
                      (objectTypeKeys.includes(key)
                        ? isUpdated
                        : newDetails[key] !== prevDetails[key]) &&
                      key !== "payeeBankAccountLocations"
                    ) {
                      return (
                        <Box pt={1} key={key}>
                          <Grid
                            container
                            alignItems="center"
                            style={{ gap: "20px" }}
                          >
                            <Grid item xs={3}>
                              <Box mb={2}>
                                <span className={classes.title}>
                                  {key === "zipCode" &&
                                  newDetails["country"] === "CA"
                                    ? lookupKeys[actionType]["postalCode"]
                                    : lookupKeys[actionType][key]}
                                </span>
                              </Box>
                            </Grid>
                            <Grid item xs={5}>
                              <Box
                                mb={2}
                                display="flex"
                                alignItems="center"
                                style={{ maxWidth: "400px" }}
                              >
                                <span
                                  className={
                                    prevDetails[key]
                                      ? classes.prevString
                                      : classes.noDataText
                                  }
                                  onClick={
                                    key === "accountNumber"
                                      ? () =>
                                          getUnmaskedAccountNumber(
                                            prevDetails[
                                              "payeeBankAccountDetailId"
                                            ]
                                          )
                                      : undefined
                                  }
                                >
                                  {key === "accountNumber"
                                    ? prevDetails[key].replace(
                                        /.(?=.{4})/g,
                                        "*"
                                      )
                                    : key === "locationType" &&
                                      prevDetails[key].locationTypeName
                                    ? prevDetails[key].locationTypeName
                                    : key === "contactType" &&
                                      prevDetails[key].contactTypeName
                                    ? prevDetails[key].contactTypeName
                                    : key === "accountClass" &&
                                      prevDetails[key].description
                                    ? prevDetails[key].description
                                    : key === "accountType" &&
                                      prevDetails[key].description
                                    ? prevDetails[key].description
                                    : key === "commercialCardType" &&
                                      newDetails[key].description
                                    ? newDetails[key].description
                                    : prevDetails[key]
                                    ? prevDetails[key]
                                    : t(
                                        "componentData.supplierUpdateDetail.informationAdded"
                                      )}{" "}
                                  {prevDetails[key] && (
                                    <ArrowForwardIcon fontSize="small" />
                                  )}
                                </span>
                              </Box>
                            </Grid>
                            <Grid item xs={3}>
                              <div
                                className={
                                  newDetails[key]
                                    ? classes.newString
                                    : classes.noDataText
                                }
                                onClick={
                                  key === "accountNumber"
                                    ? () =>
                                        getUnmaskedAccountNumber(
                                          newDetails["payeeBankAccountDetailId"]
                                        )
                                    : undefined
                                }
                              >
                                {key === "accountNumber"
                                  ? newDetails[key].replace(/.(?=.{4})/g, "*")
                                  : key === "locationType" &&
                                    newDetails[key].locationTypeName
                                  ? newDetails[key].locationTypeName
                                  : key === "contactType" &&
                                    newDetails[key].contactTypeName
                                  ? newDetails[key].contactTypeName
                                  : key === "accountClass" &&
                                    newDetails[key].description
                                  ? newDetails[key].description
                                  : key === "accountType" &&
                                    newDetails[key].description
                                  ? newDetails[key].description
                                  : key === "commercialCardType" &&
                                    newDetails[key].description
                                  ? newDetails[key].description
                                  : newDetails[key]
                                  ? newDetails[key]
                                  : t(
                                      "componentData.supplierUpdateDetail.informationDeleted"
                                    )}
                              </div>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    } else {
                      return (
                        <Grid container style={{ gap: "20px" }} key={key}>
                          <Grid item xs={3}>
                            <Box mb={2}>
                              <span className={classes.title}>
                                {key === "zipCode" &&
                                newDetails["country"] === "CA"
                                  ? lookupKeys[actionType]["postalCode"]
                                  : lookupKeys[actionType][key]}
                              </span>
                            </Box>
                          </Grid>
                          <Grid item xs={5}>
                            <Box mb={2} style={{ maxWidth: "400px" }}>
                              <div
                                className={classes.newString}
                                onClick={
                                  key === "accountNumber"
                                    ? () =>
                                        getUnmaskedAccountNumber(
                                          newDetails["payeeBankAccountDetailId"]
                                        )
                                    : undefined
                                }
                              >
                                {key === "accountNumber"
                                  ? newDetails[key].replace(/.(?=.{4})/g, "*")
                                  : key === "payeeBankAccountLocations"
                                  ? renderLocationList(
                                      newDetails["payeeBankAccountLocations"]
                                    )
                                  : key === "locationType" &&
                                    newDetails[key]["locationTypeName"]
                                  ? newDetails[key]["locationTypeName"]
                                  : key === "contactType" &&
                                    newDetails[key]["contactTypeName"]
                                  ? newDetails[key]["contactTypeName"]
                                  : key === "accountClass" &&
                                    newDetails[key].description
                                  ? newDetails[key].description
                                  : key === "accountType" &&
                                    newDetails[key].description
                                  ? newDetails[key].description
                                  : key === "commercialCardType" &&
                                    newDetails[key].description
                                  ? newDetails[key].description
                                  : newDetails[key]}
                              </div>
                            </Box>
                          </Grid>
                        </Grid>
                      );
                    }
                  }
                  return false;
                })}
            </Box>
          )}
          {inProcessing && (
            <Box display="flex" p={3} justifyContent="center">
              <CircularProgress color="primary" />
            </Box>
          )}
          {!inProcessing && showBtn && (
            <Box display="flex" p={3} justifyContent="center">
              <Box mx="auto" textAlign="center">
                <Box mb={2} textAlign="center">
                  {recordStatusId === 6 ? (
                    canAcceptReject === 1 && noteMessage.length > 0 ? (
                      <Box display="flex" width={1}>
                        <Box display="flex">
                          <InfoOutlinedIcon color="error" />
                          <Typography
                            style={{ padding: "5px" }}
                            variant="h4"
                            color="error"
                          >
                            {noteMessage}
                          </Typography>
                        </Box>
                      </Box>
                    ) : canAcceptReject === 0 ? (
                      <Box display="flex" width={1}>
                        <Box display="flex">
                          <InfoOutlinedIcon color="error" />
                          <Typography
                            style={{ padding: "5px" }}
                            variant="h4"
                            color="error"
                          >
                            {t(
                              "componentData.supplierUpdateDetail.pendingApprovalMessage"
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      ""
                    )
                  ) : (
                    <></>
                  )}
                </Box>

                {canAcceptReject === 1 &&
                  props.isSupplierUpdateAcceptEnabled &&
                  Object.keys(newDetails).length > 0 &&
                  Object.keys(prevDetails).length > 0 && (
                    <>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="small"
                        disableElevation
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          fontWeight: "normal",
                        }}
                        onClick={onReject}
                      >
                        {t("componentData.supplierUpdateDetail.REJECT")}
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="small"
                        disableElevation
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          fontWeight: "normal",
                          margin: "10px",
                        }}
                        onClick={onApproved}
                        disabled={
                          (actionType === "BANK_ACCOUNT" &&
                            newDetails["validationStatus"] ===
                              "VALIDATION PENDING") ||
                          (actionType === "BANK_ACCOUNT" &&
                            newDetails["validationStatus"] ===
                              "VALIDATION FAILED") ||
                          (actionType === "WIRE" &&
                            newDetails["validationStatus"] ===
                              "VALIDATION FAILED") ||
                          (actionType === "WIRE" &&
                            newDetails["validationStatus"] ===
                              "VALIDATION PENDING") ||
                          (actionType === "CROSS_BORDER" &&
                            newDetails["validationStatus"] ===
                              "VALIDATION FAILED") ||
                          (actionType === "CROSS_BORDER" &&
                            newDetails["validationStatus"] ===
                              "VALIDATION PENDING")
                            ? true
                            : false
                        }
                      >
                        {t("componentData.supplierUpdateDetail.ACCEPT")}
                      </Button>
                    </>
                  )}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {error && (
        <Notification
          open={error ? true : false}
          variant={variant}
          message={error}
          handleClose={() => setError(false)}
        />
      )}
    </Box>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.suppliers,
  }))(SupplierUpdateDetails)
);
