import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  makeStyles,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { TextField } from "~/components/Forms";
import {
  getSupplierUpdateClearingHouse,
  getSupplierUpdateContact,
  getSupplierCompanyUpdate,
  getSupplierBankUpdate,
  getSupplierVCAUpdate,
  getSupplierWireUpdate,
  getSupplierCrossBorderUpdate,
  getSupplierLocationUpdate,
  updateNotificationRead,
  approveSupplierCompanyUpdate,
} from "../../redux/helpers/supplier";
import SupplierProfileCard from "../SupplierProfileCard";
import InfoDialogue from "~/components/InfoDialogue";
import { fetchUnmaskedAccountNumber } from "~/redux/actions/suppliers";
import { connect } from "react-redux";
import {
  approveSupplierUpdate,
  unshareSupplier,
} from "~/redux/helpers/supplier";
import Notification from "~/components/Notification";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import PaymentTooltip from "~/components/PaymentTooltip";
import { withTranslation } from "react-i18next";
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
}));

const SupplierUpdateDetails = (props) => {
  const { t } = props;
  const [payeeId, setPayeeId] = useState();
  const [entityId, setEntityId] = useState();
  const [actionType, setActionType] = useState();
  const [action, setAction] = useState();
  const [selectedCard, setSelectedCard] = useState();
  const [supplierId, setSupplierId] = useState(null);
  const [validation, setValidation] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [supplierData, setSupplierData] = useState({});
  const [error, setError] = useState(false);
  const [variant, setVariant] = useState("error");
  const [refreshKey, setRefreshKey] = useState(true);
  const [openUnmaskedAccountNumber, setOpenUnmaskedAccountNumber] =
    useState(false);

  useEffect(() => {
    setSupplierId("");
    setValidation("");
    setPayeeId(parseInt(props.payeeId));
    setEntityId(props.entityId);
    setActionType(props.actionType);
    setAction(props.action);
    setSelectedCard(props.selectedCard);
    fetchSupplierData(
      parseInt(props.payeeId),
      props.entityId,
      props.actionType,
      props.action
    );
    setShowBtn(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.payeeId, props.selectedCard]);

  const classes = useStyles();
  const getUnmaskedAccountNumber = (accountDetailId) => {
    props
      .dispatch(fetchUnmaskedAccountNumber(accountDetailId))
      .then((response) => {
        if (response) {
          setOpenUnmaskedAccountNumber(true);
        }
      });
  };
  const fetchSupplierData = async (payeeId, entityId, actionType, action) => {
    let response = {};
    const flag = action === "UPDATE" ? true : false;
    const isUnshare = action === "UNSHARE" ? true : false;
    switch (actionType) {
      case "CLEARING_HOUSE":
        response = await getSupplierUpdateClearingHouse({
          payeeId,
          entityId,
          flag,
        });
        break;
      case "CONTACT":
        response = await getSupplierUpdateContact({ payeeId, entityId, flag });
        break;
      case "COMPANY":
        response = await getSupplierCompanyUpdate({
          payeeId: payeeId,
          prevDetails: true,
        });

        break;
      case "BANK_ACCOUNT":
        response = await getSupplierBankUpdate({
          payeeId,
          entityId,
          flag,
          isUnshare,
        });
        break;
      case "VIRTUAL_CARD":
        response = await getSupplierVCAUpdate({
          payeeId,
          entityId,
          flag,
          isUnshare,
        });
        break;
      case "CROSS_BORDER":
        response = await getSupplierCrossBorderUpdate({
          payeeId,
          entityId,
          flag,
        });
        break;
      case "WIRE":
        response = await getSupplierWireUpdate({ payeeId, entityId, flag });
        break;
      case "LOCATION":
        response = await getSupplierLocationUpdate({ payeeId, entityId, flag });
        break;
      default:
    }

    if (response) {
      setSupplierData(response);
    }
  };
  const renderSupplierDetails = (newDetails, actionType) => {
    if (newDetails && Object.keys(newDetails).length) {
      if (actionType === "BANK_ACCOUNT") {
        const orderedNewDetails = {
          accountName: newDetails.accountName,
          routingCode: newDetails.routingCode,
          bankAddress1: newDetails.bankAddress1,
          bankCity: newDetails.bankCity,
          bankZipPostal: newDetails.bankZipPostal,
          bankCountryIso: newDetails.bankCountryIso,
          currencyCode: newDetails.currencyCode,
          accountNumber: newDetails.accountNumber,
          payeeBankAccountLocations: newDetails.payeeBankAccountLocations,
          payeeValidationStatus: newDetails.validationStatus,
          validationStatus: newDetails.validationStatus, //Added this one because lookupKeys do have validationStatus
          remitToIds: newDetails.remitToIds,
        };
        newDetails = { ...orderedNewDetails, ...newDetails };
      }
      if (actionType === "CROSS_BORDER") {
        const orderedNewDetails = {
          accountName: newDetails.accountName,
          routingCode: newDetails.routingCode,
          bankAddress1: newDetails.bankAddress1,
          bankCity: newDetails.bankCity,
          bankZipPostal: newDetails.bankZipPostal,
          bankCountryIso: newDetails.bankCountryIso,
          currencyCode: newDetails.currencyCode,
          accountNumber: newDetails.accountNumber,
          payeeBankAccountLocations: newDetails.payeeCrossBorderLocations,
          payeeValidationStatus: newDetails.validationStatus,
          validationStatus: newDetails.validationStatus, //Added this one because lookupKeys do have validationStatus
          ...newDetails,
        };
        newDetails = orderedNewDetails;
      }
      /*if(actionType === "WIRE"){
        let orderedNewDetails = {
          bicCode: newDetails.bicCode,
          accountName: newDetails.accountName,
          bankCountryIso: newDetails.bankCountryIso,
          bankName: newDetails.bankName,
          routingCode: newDetails.routingCode,
          accountNumber: newDetails.accountNumber,
          currencyCode: newDetails.currencyCode,
          ...newDetails
        }
        newDetails = orderedNewDetails;
      }*/
    }
    const lookupKeys = {
      BANK_ACCOUNT: {
        accountName: t("componentData.supplierUpdateDetail.accountName"),
        accountNumber: t("componentData.supplierUpdateDetail.accountNumber"),
        routingCode: t("componentData.supplierUpdateDetail.routingCode"),
        bankAddress1: t("componentData.supplierUpdateDetail.bankAddress1"),
        bankAddress2: t("componentData.supplierUpdateDetail.bankAddress2"),
        bankStateRegion: t(
          "componentData.supplierUpdateDetail.bankStateRegion"
        ),
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
      },
      VIRTUAL_CARD: {
        contactEmail: t("componentData.supplierUpdateDetail.vcContactEmail"),
        usedFor: t("componentData.supplierUpdateDetail.VCusedFor"),
        currencyCode: t("componentData.supplierUpdateDetail.currencyCode"),
        countryIso: t("componentData.supplierUpdateDetail.countryIso"),
        remitToIds: t("componentData.supplierUpdateDetail.RemitID"),
      },
      CROSS_BORDER: {
        accountName: t("componentData.supplierUpdateDetail.accountName"),
        accountNumber: t("componentData.supplierUpdateDetail.accountNumber"),
        routingCode: t("componentData.supplierUpdateDetail.routingCode"),
        bankAddress1: t("componentData.supplierUpdateDetail.bankAddress1"),
        bankAddress2: t("componentData.supplierUpdateDetail.bankAddress2"),
        bankStateRegion: t(
          "componentData.supplierUpdateDetail.bankStateRegion"
        ),
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
      },
      WIRE: {
        bicCode: t("componentData.supplierUpdateDetail.bicCode"),
        accountName: t("componentData.supplierUpdateDetail.accName"),
        bankCountryIso: t("componentData.supplierUpdateDetail.bankCountryIso"),
        bankName: t("componentData.supplierUpdateDetail.bankName"),
        routingCode: t("componentData.supplierUpdateDetail.routingCode"),
        accountNumber: t("componentData.supplierUpdateDetail.accNumber"),
        currencyCode: t("componentData.supplierUpdateDetail.currencyCode"),
        validationStatus: t(
          "componentData.supplierUpdateDetail.ValidationStatus"
        ),
      },
      LOCATION: {
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
      },
      CLEARING_HOUSE: {
        clearingHouseName: t(
          "componentData.supplierUpdateDetail.clearingHouseName"
        ),
      },
    };
    switch (actionType) {
      case "CLEARING_HOUSE":
      case "CONTACT":
      case "LOCATION":
      case "COMPANY":
      case "CROSS_BORDER":
      case "WIRE":
        return (
          <Box px={5} py={2} minHeight={"100px"}>
            <Grid container>
              {newDetails &&
                Object.keys(newDetails).length > 0 &&
                Object.keys(newDetails).map((key) => {
                  if (
                    newDetails[key] &&
                    lookupKeys &&
                    lookupKeys[actionType][key]
                  ) {
                    return (
                      <Grid container key={key}>
                        <Grid item xs={5}>
                          <Box mb={2}>
                            <span className={classes.title}>
                              {key === "bankZipPostal" &&
                              newDetails["bankCountryIso"] === "CA"
                                ? lookupKeys[actionType]["bankPostal"]
                                : lookupKeys[actionType][key]}
                            </span>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <div className={classes.newString}>
                            {key === "accountNumber"
                              ? newDetails[key].replace(/.(?=.{4})/g, "*")
                              : key === "payeeBankAccountLocations" &&
                                actionType === "CROSS_BORDER"
                              ? renderLocationList(
                                  newDetails["payeeBankAccountLocations"]
                                )
                              : newDetails[key]}
                          </div>
                        </Grid>
                      </Grid>
                    );
                  }
                  return false;
                })}
              {(actionType === "CROSS_BORDER" || actionType === "WIRE") &&
                action === "CREATE" && (
                  <>
                    <Grid item xs={5}>
                      <Box>
                        <span className={classes.title}>
                          {t("componentData.supplierUpdateDetail.RemitID")}
                        </span>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <div className={classes.newString}>
                        {props.isSupplierUpdateAcceptEnabled && (
                          <TextField
                            fullWidth={true}
                            color="secondary"
                            autoComplete="off"
                            variant="outlined"
                            name="f_name"
                            value={supplierId}
                            inputProps={{ maxLength: 50 }}
                            onChange={(e) => {
                              setSupplierId(
                                e.target.value.replace(
                                  /[^A-Za-z0-9-_+@$~%* ]/g,
                                  ""
                                )
                              );
                            }}
                            disabled={!props.isSupplierUpdateAcceptEnabled}
                            error={validation.length > 0 ? true : false}
                            helperText={validation}
                          />
                        )}
                      </div>
                    </Grid>
                  </>
                )}
            </Grid>
          </Box>
        );
      case "BANK_ACCOUNT":
      case "VIRTUAL_CARD":
        return (
          <Box px={5} py={2} minHeight={"200px"}>
            <Grid container>
              {newDetails &&
                Object.keys(newDetails).length > 0 &&
                Object.keys(newDetails).map((key) => {
                  if (
                    (newDetails[key] && typeof newDetails[key] === "object"
                      ? newDetails[key].length ||
                        Object.keys(newDetails[key]).length
                      : newDetails[key]) &&
                    lookupKeys &&
                    lookupKeys[actionType][key]
                  ) {
                    return (
                      <>
                        <Grid item xs={5} key={key}>
                          <Box mb={2}>
                            <span className={classes.title}>
                              {key === "bankZipPostal" &&
                              newDetails["bankCountryIso"] === "CA"
                                ? lookupKeys[actionType]["bankPostal"]
                                : lookupKeys[actionType][key]}
                            </span>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
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
                              : key === "payeeBankAccountLocations" &&
                                actionType === "BANK_ACCOUNT"
                              ? renderLocationList(
                                  newDetails["payeeBankAccountLocations"]
                                )
                              : newDetails[key]}
                          </div>
                        </Grid>
                      </>
                    );
                  }
                  return false;
                })}
              {action === "CREATE" && (
                <>
                  <Grid item xs={5}>
                    <Box>
                      <span className={classes.title}>
                        {t("componentData.supplierUpdateDetail.RemitID")}
                      </span>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.newString}>
                      {props.isSupplierUpdateAcceptEnabled && (
                        <TextField
                          fullWidth={true}
                          color="secondary"
                          autoComplete="off"
                          variant="outlined"
                          name="f_name"
                          value={supplierId}
                          inputProps={{ maxLength: 50 }}
                          onChange={(e) => {
                            setSupplierId(
                              e.target.value.replace(
                                /[^A-Za-z0-9-_+@$~%* ]/g,
                                ""
                              )
                            );
                          }}
                          disabled={!props.isSupplierUpdateAcceptEnabled}
                          error={validation.length > 0 ? true : false}
                          helperText={validation}
                          required
                        />
                      )}
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        );
      default:
    }
  };

  const onCompanyApproved = async () => {
    if (action === "UNSHARE") {
      setOpenModel(true);
    } else {
      setValidation("");
      const data = {
        payeeId: payeeId,
        payeeActionTypeId: selectedCard,
      };

      const resp = await approveSupplierCompanyUpdate(data);
      if (resp.error) {
        typeof resp.message === "string"
          ? setError(resp.message)
          : setError(t("componentData.supplierUpdateDetail.errorOccurred"));

        setVariant("error");
        return false;
      }
      setError(t("componentData.supplierUpdateDetail.ChangesApproved"));
      setVariant("success");
      setSupplierData("");
      setShowBtn(false);
      setRefreshKey(!refreshKey);
      props.fetchClientSupplierUpdate();
    }
  };

  const onApproved = async () => {
    if (action === "UNSHARE") {
      setOpenModel(true);
    } else {
      //Added remit to id validation only for bank account/ virtual card
      if (actionType === "BANK_ACCOUNT" || actionType === "VIRTUAL_CARD") {
        if (
          action === "CREATE" &&
          (supplierId === null ||
            (supplierId !== null && supplierId.length === 0))
        ) {
          setValidation(t("componentData.supplierUpdateDetail.fieldReq"));
          return false;
        }
      }
      setValidation("");
      const data = [
        {
          clientId: props.clientId,
          payeeId: payeeId,
          paymentId: entityId,
          paymentType: actionType,
          remitToId: action === "CREATE" ? supplierId.toString().trim() : null,
        },
      ];
      const resp = await approveSupplierUpdate(data);
      if (resp.error) {
        typeof resp.message === "string"
          ? setError(resp.message)
          : setError(t("componentData.supplierUpdateDetail.errorOccurred"));

        setVariant("error");
        return false;
      }
      setError(t("componentData.supplierUpdateDetail.ChangesApproved"));
      setVariant("success");
      setSupplierData("");
      setShowBtn(false);
      setRefreshKey(!refreshKey);
      props.fetchClientSupplierUpdate();
    }
  };
  const onReadNotification = async () => {
    const resp = await updateNotificationRead(selectedCard);
    if (resp.error) {
      typeof resp.message === "string"
        ? setError(resp.message)
        : setError(t("componentData.supplierUpdateDetail.errorOccurred"));

      setVariant("error");
      return false;
    }
    setError(t("componentData.supplierUpdateDetail.ChangesRead"));
    setVariant("success");
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

  const showApproveBtn = (newDetails, actionType, action) => {
    const validationStatus = "validationStatus";
    const flag =
      action !== "UNSHARE" &&
      ((actionType === "BANK_ACCOUNT" &&
        (newDetails[validationStatus] === "VALIDATION PENDING" ||
          newDetails[validationStatus] === "VALIDATION FAILED")) ||
        (actionType === "WIRE" &&
          (newDetails[validationStatus] === "VALIDATION FAILED" ||
            newDetails[validationStatus] === "VALIDATION PENDING")) ||
        (actionType === "CROSS_BORDER" &&
          (newDetails[validationStatus] === "VALIDATION FAILED" ||
            newDetails[validationStatus] === "VALIDATION PENDING")));
    return flag;
  };

  let { newDetails = {}, prevDetails = {} } = supplierData;
  const paymentActionTypes = [
    "VIRTUAL_CARD",
    "BANK_ACCOUNT",
    "WIRE",
    "CROSS_BORDER",
  ];
  const paymentAction = ["CREATE", "UPDATE", "UNSHARE"];
  if (newDetails && Object.keys(newDetails).length) {
    if (actionType === "BANK_ACCOUNT") {
      const orderedNewDetails = {
        accountName: newDetails.accountName,
        routingCode: newDetails.routingCode,
        bankAddress1: newDetails.bankAddress1,
        bankCity: newDetails.bankCity,
        bankZipPostal: newDetails.bankZipPostal,
        bankCountryIso: newDetails.bankCountryIso,
        currencyCode: newDetails.currencyCode,
        accountNumber: newDetails.accountNumber,
        payeeBankAccountLocations: newDetails.payeeBankAccountLocations,
        payeeValidationStatus: newDetails.validationStatus,
        validationStatus: newDetails.validationStatus, //Added this one because lookupKeys do have validationStatus
        remitToIds: newDetails.remitToIds,
        //...newDetails
      };
      newDetails = { ...orderedNewDetails, ...newDetails };
    }
    if (actionType === "CROSS_BORDER") {
      const orderedNewDetails = {
        accountName: newDetails.accountName,
        routingCode: newDetails.routingCode,
        bankAddress1: newDetails.bankAddress1,
        bankCity: newDetails.bankCity,
        bankZipPostal: newDetails.bankZipPostal,
        bankCountryIso: newDetails.bankCountryIso,
        currencyCode: newDetails.currencyCode,
        accountNumber: newDetails.accountNumber,
        payeeBankAccountLocations: newDetails.payeeCrossBorderLocations,
        payeeValidationStatus: newDetails.validationStatus,
        validationStatus: newDetails.validationStatus, //Added this one because lookupKeys do have validationStatus
        ...newDetails,
      };
      newDetails = orderedNewDetails;
    }
    /*if(actionType === "WIRE"){
        let orderedNewDetails = {
          bicCode: newDetails.bicCode,
          accountName: newDetails.accountName,
          bankCountryIso: newDetails.bankCountryIso,
          bankName: newDetails.bankName,
          routingCode: newDetails.routingCode,
          accountNumber: newDetails.accountNumber,
          currencyCode: newDetails.currencyCode,
          ...newDetails
        }
        newDetails = orderedNewDetails;
      }*/
  }

  const lookupKeys = {
    BANK_ACCOUNT: {
      accountName: t("componentData.supplierUpdateDetail.accountName"),
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
    },
    VIRTUAL_CARD: {
      contactEmail: t("componentData.supplierUpdateDetail.vcContactEmail"),
      usedFor: t("componentData.supplierUpdateDetail.VCusedFor"),
      currencyCode: t("componentData.supplierUpdateDetail.currencyCode"),
      countryIso: t("componentData.supplierUpdateDetail.countryIso"),
      remitToIds: t("componentData.supplierUpdateDetail.RemitID"),
    },
    CROSS_BORDER: {
      accountName: t("componentData.supplierUpdateDetail.accountName"),
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
    },
    WIRE: {
      bicCode: t("componentData.supplierUpdateDetail.bicCode"),
      accountName: t("componentData.supplierUpdateDetail.accName"),
      bankCountryIso: t("componentData.supplierUpdateDetail.bankCountryIso"),
      bankName: t("componentData.supplierUpdateDetail.bankName"),
      routingCode: t("componentData.supplierUpdateDetail.routingCode"),
      accountNumber: t("componentData.supplierUpdateDetail.accNumber"),
      currencyCode: t("componentData.supplierUpdateDetail.currencyCode"),
      validationStatus: t(
        "componentData.supplierUpdateDetail.ValidationStatus"
      ),
    },
    LOCATION: {
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
    },
    COMPANY: {
      companyName: t("componentData.supplierUpdateDetail.companyName"),
      // "dunsNumber": t('componentData.supplierUpdateDetail.dunsNumber'),
      taxId: t("componentData.supplierUpdateDetail.taxId"),
      // "website": t('componentData.supplierUpdateDetail.website'),
      // "address1": t('componentData.supplierUpdateDetail.address1'),
      // "address2": t('componentData.supplierUpdateDetail.address2'),
      // "city": t('componentData.supplierUpdateDetail.city'),
      // "country": t('componentData.supplierUpdateDetail.country')
    },
    CLEARING_HOUSE: {
      clearingHouseName: t(
        "componentData.supplierUpdateDetail.clearingHouseName"
      ),
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
          {action === "UPDATE" ? (
            <Box px={5} py={2} minHeight={"100px"}>
              {newDetails &&
                prevDetails &&
                Object.keys(newDetails).length > 0 &&
                Object.keys(prevDetails).length > 0 &&
                Object.keys(newDetails).map((key) => {
                  if (
                    newDetails[key] &&
                    prevDetails[key] &&
                    lookupKeys &&
                    lookupKeys[actionType][key]
                  ) {
                    if (
                      newDetails[key] !== prevDetails[key] &&
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
                                  className={classes.prevString}
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
                                    : prevDetails[key]}{" "}
                                  <ArrowForwardIcon fontSize="small" />
                                </span>
                              </Box>
                            </Grid>
                            <Grid item xs={3}>
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
                                  : newDetails[key]}
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
                                  : newDetails[key]}
                              </div>
                            </Box>
                          </Grid>
                        </Grid>
                      );
                    }
                  } else {
                    if (
                      newDetails[key] !== prevDetails[key] &&
                      key === "clearingHouseName" &&
                      lookupKeys[actionType][key]
                    ) {
                      //This is only for clearinghouse update changes
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
                                  {lookupKeys[actionType][key]}
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
                                <span className={classes.prevString}>
                                  {prevDetails[key]}{" "}
                                  <ArrowForwardIcon fontSize="small" />
                                </span>
                              </Box>
                            </Grid>
                            <Grid item xs={3}>
                              <div className={classes.newString}>
                                {newDetails[key]}
                              </div>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    }

                    return false;
                  }
                })}
            </Box>
          ) : (
            renderSupplierDetails(newDetails, actionType)
          )}
          {showBtn && (
            <Box p={3}>
              <Box mx="auto" textAlign="center">
                <Box mb={2} textAlign="center">
                  {showApproveBtn(newDetails, actionType, action) && (
                    <Typography variant="h4" color="error">
                      {t(
                        "componentData.supplierUpdateDetail.validationStatusMessage"
                      )}
                    </Typography>
                  )}
                </Box>
                {props.isSupplierUpdateAcceptEnabled ? (
                  (actionType === "COMPANY" && props.needApproval) ||
                  (paymentActionTypes.includes(actionType) &&
                    paymentAction.includes(action)) ? (
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
                      onClick={
                        actionType === "COMPANY" && props.needApproval
                          ? onCompanyApproved
                          : onApproved
                      }
                      disabled={showApproveBtn(newDetails, actionType, action)}
                    >
                      {t("componentData.supplierUpdateDetail.ACCEPT")}
                    </Button>
                  ) : (
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
                      onClick={onReadNotification}
                    >
                      {t("componentData.supplierUpdateDetail.markAsRead")}
                    </Button>
                  )
                ) : (
                  <></>
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
