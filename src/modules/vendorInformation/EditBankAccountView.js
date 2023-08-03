import React, { Component } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormHelperText,
  Grid,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Country, City, State } from "~/components/CSC";

import TextField from "~/components/Forms/TextField";
import RoutingCodeResults from "../RoutingCodeResults";

import { CustomDialog, AlertDialog } from "~/components/Dialogs";
import { updatePayeeBankDetails } from "~/redux/helpers/suppliers";

import { withStyles } from "@material-ui/styles";
import styles from "./styles";

import { withTranslation } from "react-i18next";
import { compose } from "redux";
import {
  getLocationOptions,
  getLocationTypes,
  getVendorClientList,
} from "../../redux/actions/payments";
import trim from "deep-trim-node";
import { connect } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AlphaNumericMaskInput from "~/components/MaskInput/AlphaNumericMaskInput";

class EditBankAccountView extends Component {
  state = {
    locationDisabled: false,
    selectedClients:
      (this.props.bankDetails &&
        this.props.bankDetails.clients &&
        this.props.bankDetails.clients.map((item) => item.clientId)) ||
      [],
    newDataInfo:
      (this.props.bankDetails && {
        ...this.props.bankDetails,
        payeeLocationIds:
          (this.props.bankDetails.payeeBankAccountLocations &&
            this.props.bankDetails.payeeBankAccountLocations.map(
              (loc) => loc.payeeLocationId
            )) ||
          [],
      }) ||
      {},
    validation: {},
    alertType: null,
    alertMessage: null,
    alertMessageCallbackType: null,
    locations: [],
    locationOptions: [],
    openSearchModal: false,
    btnDisabled: true,
    isSearching: false,
    updateProgress: false,
    clientsList: [],
    removeClientProgress: false,
  };

  componentDidMount = () => {
    this.fetchLocationTypes();
    this.fetchLocationOptionsTypes();
  };

  getClientList = () => {
    const { newDataInfo } = this.state;
    this.props
      .dispatch(
        getVendorClientList({
          payeeId: newDataInfo.payeeId,
          paymentMethodType: "BANK_ACCOUNT",
          onlyValid: true,
        })
      )
      .then((response) => {
        if (!response || response.error) {
          this.setState({
            alertType: "error",
            alertMessage: this.props.payment.error || "API error",
            alertMessageCallbackType: null,
          });
          return false;
        }

        this.setState({
          clientsList: this.props.payment.clientList,
        });
      });
  };

  fetchLocationTypes = () => {
    const { vendorDetail } = this.props;
    const payeeId = vendorDetail.payeeId;
    this.props
      .dispatch(getLocationTypes({ payeeId: payeeId }))
      .then((response) => {
        if (!response || response.error) {
          this.setState({
            alertMessage: this.props.payment.error || "API error",
            alertMessageCallbackType: null,
            alertType: "error",
          });
          return false;
        }
        this.setState({
          locations: this.props.payment.locations.rows,
        });
      });
  };

  fetchLocationOptionsTypes = () => {
    this.props.dispatch(getLocationOptions()).then((response) => {
      if (!response || response.error) {
        this.setState({
          alertMessage: this.props.payment.error || "API error",
          alertMessageCallbackType: null,
          alertType: "error",
        });
        return false;
      }
      this.setState({
        locationOptions: this.props.payment.locationOptions.rows,
      });
    });
  };

  selectBankDetails = (bankDetails) => {
    const { newDataInfo } = this.state;
    const re = /^([0-9]){9}$/;
    const validation = {};
    if (
      !bankDetails.routingCode ||
      bankDetails.routingCode.toString().trim() === "" ||
      !re.test(bankDetails.routingCode.trim())
    ) {
      validation["routingCode"] = this.props.t(
        "componentData.editBankView.error.routingCode"
      );
      this.setState({
        newDataInfo: {
          ...newDataInfo,
          routingCode: "",
          bankCountryIso: "",
          bankName: "",
          bankAddress1: "",
          bankCity: "",
          bankZipPostal: "",
          bankPhone: "",
        },
        validation: { ...validation },
        btnDisabled: true,
      });
      return false;
    }
    this.setState({
      newDataInfo: {
        ...newDataInfo,
        routingCode: bankDetails.routingCode,
        bankCountryIso: bankDetails.countryIso,
        bankName: bankDetails.bankName,
        bankAddress1: bankDetails.address,
        bankCity: bankDetails.city,
        bankZipPostal: bankDetails.postalCode,
        bankPhone: bankDetails.phone,
        bankStateRegion: bankDetails.stateName,
      },
      btnDisabled: false,
    });
  };

  handleChange = (field, event, value, position) => {
    const { newDataInfo, selectedClients, locationDisabled, locations } =
      this.state;
    const newDataDetail = { ...newDataInfo };
    const fieldName = event.target.name;

    switch (field) {
      case "payeeLocationIds":
        const { value: options } = event.target;
        if (!locationDisabled) {
          newDataDetail["payeeLocationIds"] = options;
          this.setState({ newDataInfo: { ...newDataDetail } });
        }
        break;
      case "locationOptionId":
        if (event.target.value === 2) {
          newDataDetail["payeeLocationIds"] =
            locations && locations.map((item) => item.payeeLocationId);
          newDataDetail[fieldName] = event.target.value;
          this.setState({
            newDataInfo: { ...newDataDetail },
            locationDisabled: true,
          });
        } else {
          newDataDetail["payeeLocationIds"] = [];
          newDataDetail[fieldName] = event.target.value;
          this.setState({
            newDataInfo: { ...newDataDetail },
            locationDisabled: false,
          });
        }

        break;
      case "roleId":
        newDataDetail[fieldName] = event.target.value;
        break;
      case "accountName":
        const validCharacters = /[a-zA-Z0-9 @#$%&()_+\-=;:".\/]$/g;
        const newAccountName = event.target.value;
        if (!newAccountName || validCharacters.test(newAccountName)) {
          newDataDetail[fieldName] = event.target.value;
        }
        this.setState({ newDataInfo: { ...newDataDetail } });
        break;
      case "accountNumber":
        newDataDetail[fieldName] = event.target.value.replace(
          /[^a-zA-Z0-9]/g,
          ""
        );
        this.setState({ newDataInfo: { ...newDataDetail } });
        break;
      case "routingCode":
        newDataDetail["routingCode"] = event.target.value.replace(
          /[^0-9]/g,
          ""
        );
        newDataDetail["bankName"] = "";
        this.setState({ newDataInfo: { ...newDataDetail } });
        break;
      case "bankCountryIso":
        newDataDetail["bankCountryIso"] = event.target.value;
        newDataDetail["currencyCode"] =
          event.target.value == "US" ? "USD" : newDataDetail["currencyCode"];
        this.setState({ newDataInfo: { ...newDataDetail } });
        break;
      case "selectedClients":
        const selectedClientId = event.target.value;
        const searchValue =
          selectedClients &&
          selectedClients.filter((item) => item === selectedClientId);
        const newSelectedClients =
          searchValue.length === 0
            ? [...selectedClients, selectedClientId]
            : [...selectedClients];
        this.setState({ selectedClients: newSelectedClients });
        break;
      default:
        newDataDetail[field] = event.target.value;
        this.setState({ newDataInfo: { ...newDataDetail } });
        break;
    }
  };

  validateForm = () => {
    const { newDataInfo } = this.state;

    let valid = true;
    const validation = {};

    if (
      newDataInfo &&
      newDataInfo.bankContactEmail &&
      newDataInfo.bankContactEmail.trim().length > 0
    ) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(newDataInfo.bankContactEmail.trim().toLowerCase())) {
        validation["bankContactEmail"] = this.props.t(
          "componentData.editBankView.error.bankContactEmail"
        );
        valid = false;
      }
    }

    if (
      !newDataInfo ||
      !newDataInfo.accountName ||
      (newDataInfo.accountName && newDataInfo.accountName.trim() === "")
    ) {
      validation["accountName"] = this.props.t(
        "componentData.editBankView.error.accountName"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.bankName ||
      (newDataInfo.bankName && newDataInfo.bankName.trim() === "")
    ) {
      validation["bankName"] = this.props.t(
        "componentData.editBankView.error.bankName"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.routingCode ||
      (newDataInfo.routingCode && newDataInfo.routingCode.trim() === "")
    ) {
      validation["routingCode"] = this.props.t(
        "componentData.editBankView.error.routingCode"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.routingCode ||
      newDataInfo.routingCode.toString().trim() === "" ||
      newDataInfo.routingCode.toString().trim().length !== 9
    ) {
      validation["routingCode"] = this.props.t(
        "componentData.editBankView.error.routingCode"
      );
      valid = false;
      const re = /^([0-9]){9}$/;
      if (
        !newDataInfo.routingCode ||
        newDataInfo.routingCode.toString().trim() === "" ||
        !re.test(newDataInfo.routingCode.trim())
      ) {
        validation["routingCode"] = this.props.t(
          "componentData.editBankView.error.routingCode"
        );
        valid = false;
      }
    } else {
      const re = /^([0-9]){9}$/;
      if (!re.test(newDataInfo.routingCode.trim())) {
        validation["routingCode"] = "Routing number should be 9 digits";
        valid = false;
      }
    }
    if (
      !newDataInfo ||
      !newDataInfo.accountNumber ||
      (newDataInfo.accountNumber && newDataInfo.accountNumber.trim() === "")
    ) {
      validation["empty_accountNumber"] = this.props.t(
        "componentData.editBankView.error.empty_accountNumber"
      );
      valid = false;
    }
    if (newDataInfo.accountNumber.trim().length < 6) {
      validation["accountNumber"] = this.props.t(
        "componentData.editBankView.error.accountNumber"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.accountTypeId ||
      (newDataInfo.accountTypeId &&
        newDataInfo.accountTypeId.toString().trim() === "")
    ) {
      validation["accountTypeId"] = this.props.t(
        "componentData.editBankView.bankErrors.accountTypeId"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.accountClassId ||
      (newDataInfo.accountClassId &&
        newDataInfo.accountClassId.toString().trim() === "")
    ) {
      validation["accountClassId"] = this.props.t(
        "componentData.editBankView.bankErrors.accountClassId"
      );
      valid = false;
    }

    if (
      !newDataInfo ||
      !newDataInfo.bankCountryIso ||
      (newDataInfo.bankCountryIso &&
        newDataInfo.bankCountryIso.toString().trim() === "")
    ) {
      validation["bankCountryIso"] = this.props.t(
        "componentData.editBankView.bankErrors.bankCountryIso"
      );
      valid = false;
    }
    if (!newDataInfo || !newDataInfo.currencyCode) {
      validation["currencyCode"] = this.props.t(
        "componentData.editBankView.bankErrors.currencyCode"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.locationOptionId ||
      (newDataInfo.locationOptionId &&
        newDataInfo.locationOptionId.toString().trim() === "")
    ) {
      validation["locationOptionId"] = this.props.t(
        "componentData.editBankView.bankErrors.locationOptionId"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.payeeLocationIds ||
      (newDataInfo.payeeLocationIds && newDataInfo.payeeLocationIds.length == 0)
    ) {
      validation["payeeLocationIds"] = this.props.t(
        "componentData.editBankView.bankErrors.payeeLocationIds"
      );
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
  };

  handleSubmit = () => {
    const { newDataInfo } = this.state;
    const valid = this.validateForm();
    if (!valid) {
      return false;
    }
    let data = {
      payeeId: newDataInfo.payeeId,
      bankAccountId: newDataInfo.payeeBankAccountDetailId,
      isCrossBorder: newDataInfo.isCrossBorder,
      type: "ACH",
      accountName: newDataInfo.accountName,
      routingCode: newDataInfo.routingCode,
      accountNumber: newDataInfo.accountNumber,
      accountClassId: newDataInfo.accountClassId,
      accountTypeId: newDataInfo.accountTypeId,
      bankCountryIso: newDataInfo.bankCountryIso,
      bankName: newDataInfo.bankName,
      currencyCode: newDataInfo.currencyCode,
      bankAddress1: newDataInfo.bankAddress1,
      bankAddress2: newDataInfo.bankAddress2,
      bankCity: newDataInfo.bankCity,
      bankStateRegion: newDataInfo.bankStateRegion,
      bankZipPostal: newDataInfo.bankZipPostal,
      bankContactEmail: newDataInfo.bankContactEmail,
      bankContact: newDataInfo.bankContact,
      bankPhone: newDataInfo.bankPhone,
      locationOptionId: newDataInfo.locationOptionId,
      payeeLocationIds: newDataInfo.payeeLocationIds,
    };
    data = trim(data);
    updatePayeeBankDetails(data).then((response) => {
      if (response.error) {
        this.setState({
          alertMessage: response.message,
          alertMessageCallbackType: null,
          alertType: "error",
        });
        return false;
      }

      this.setState({
        alertMessage: response.message,
        alertMessageCallbackType: "REDIRECT",
        alertType: "success",
      });
    });
  };

  searchRoutingCode = () => {
    this.setState({ openSearchModal: true, btnDisabled: true });
  };

  closeRoutingCode = () => {
    this.setState({ openSearchModal: false, btnDisabled: true });
  };

  handleCancel = (event) => {
    this.setState(
      {
        selectedClient: null,
        newDataInfo: {},
      },
      () => this.props.handleCancel()
    );
  };

  hideAlertMessage = () => {
    this.setState(
      {
        alertMessage: null,
        alertMessageCallbackType: null,
      },
      () => {
        if (this.state.alertType !== "error") {
          this.props.handleBankEditMode();
          this.props.refreshData();
        }
      }
    );
  };

  renderAlertMessage = (title, message) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          this.hideAlertMessage();
        }}
      />
    );
  };

  render() {
    const {
      alertMessage,
      alertMessageCallbackType,
      locations,
      locationOptions,
      newDataInfo,
      btnDisabled,
      validation,
      openSearchModal,
      locationDisabled,
      isSearching,
    } = this.state;
    const {
      classes,
      t,
      currencyList,
      accountClassification,
      paymentType,
      accountTypes,
    } = this.props;
    return (
      <>
        <Box width={1}>
          <CustomDialog
            showButton={true}
            btnDisabled={btnDisabled}
            fullWidth={true}
            open={openSearchModal}
            onConfirm={() => this.closeRoutingCode()}
          >
            <h2>{t("componentData.editBankView.search")}</h2>
            <RoutingCodeResults
              onSelectBank={this.selectBankDetails.bind(this)}
              accountDetails={{
                ...newDataInfo,
                type: paymentType,
                isCrossBorder: false,
              }}
            />
          </CustomDialog>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              {" "}
              <TextField
                required
                label={t("componentData.editBankView.accountName")}
                name={"accountName"}
                style={{ width: "100%" }}
                id={"accountName"}
                type="text"
                variant="outlined"
                value={(newDataInfo && newDataInfo.accountName) || ""}
                onChange={(event) => this.handleChange("accountName", event)}
                error={validation.accountName}
                helperText={validation.accountName}
                inputProps={{
                  maxLength: 50,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Country
                required={true}
                label={t("componentData.editBankView.bankCountryIso")}
                name="bankCountryIso"
                disabled={true}
                error={validation && validation.bankCountryIso}
                helperText={validation && validation.bankCountryIso}
                selectedCountry={
                  (newDataInfo && newDataInfo.bankCountryIso) || ""
                }
                onChange={(event) => this.handleChange("bankCountryIso", event)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              {" "}
              <TextField
                name={"routingCode"}
                style={{ width: "100%" }}
                id={"routingCode"}
                label={t("componentData.editBankView.routingCode")}
                type="text"
                variant="outlined"
                value={(newDataInfo && newDataInfo.routingCode) || ""}
                required
                onChange={(event) => this.handleChange("routingCode", event)}
                error={validation.routingCode}
                helperText={validation.routingCode}
                inputProps={{
                  maxLength: 9,
                }}
              />
              {!isSearching &&
              newDataInfo &&
              newDataInfo.bankCountryIso !== "CA" ? (
                <a
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "blue",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}
                  onClick={() => this.searchRoutingCode()}
                >
                  <b>{t("componentData.editBankView.searchNumber")}</b>
                </a>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label={t("componentData.editBankView.bankName")}
                name={"bankName"}
                style={{ width: "100%" }}
                id={"bankName"}
                type="text"
                variant="outlined"
                value={(newDataInfo && newDataInfo.bankName) || ""}
                onChange={(event) => this.handleChange("bankName", event)}
                error={validation.bankName}
                helperText={validation.bankName}
                inputProps={{
                  maxLength: 50,
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              {" "}
              <Box my={1}>
                <AlphaNumericMaskInput
                  required
                  label={t("componentData.editBankView.accountNumber")}
                  error={
                    validation.accountNumber || validation.empty_accountNumber
                  }
                  helperText={
                    newDataInfo.accountNumber &&
                    newDataInfo.accountNumber.trim().length < 6
                      ? validation.accountNumber
                      : validation.empty_accountNumber
                  }
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  value={(newDataInfo && newDataInfo.accountNumber) || ""}
                  name="accountNumber"
                  // onChange={(event) => this.handleChange("accountNumber", event)}
                  getValue={(val) => {
                    this.setState({
                      newDataInfo: {
                        ...newDataInfo,
                        accountNumber: val,
                      },
                    });
                  }}
                  resetValue={() =>
                    this.setState({
                      newDataInfo: {
                        ...newDataInfo,
                        accountNumber: null,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 17,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label={t("componentData.editBankView.currencyCode")}
                name={"currencyCode"}
                style={{ width: "100%" }}
                id={"currencyCode"}
                select
                disabled={true}
                type="text"
                variant="outlined"
                value={(newDataInfo && newDataInfo.currencyCode) || ""}
                onChange={(event) => this.handleChange("currencyCode", event)}
                error={validation.currencyCode}
                helperText={validation.currencyCode}
              >
                {currencyList ? (
                  currencyList
                    .filter((item) => {
                      if (
                        newDataInfo &&
                        newDataInfo.bankCountryIso &&
                        newDataInfo.bankCountryIso == "US" &&
                        item.isoCode == "CAD"
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((option) => (
                      <MenuItem key={option.isoCode} value={option.isoCode}>
                        {option.name}
                      </MenuItem>
                    ))
                ) : (
                  <Box
                    width="100px"
                    display="flex"
                    mt={1.875}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress color="primary" />
                  </Box>
                )}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              {" "}
              <TextField
                required
                label={t("componentData.editBankView.accountClassId")}
                name={"accountClassId"}
                style={{ width: "100%" }}
                id={"accountClassId"}
                select
                type="text"
                variant="outlined"
                value={(newDataInfo && newDataInfo.accountClassId) || ""}
                onChange={(event) => this.handleChange("accountClassId", event)}
                error={validation.accountClassId}
                helperText={validation.accountClassId}
              >
                {accountClassification ? (
                  accountClassification.map((option) => (
                    <MenuItem
                      key={option.accountClassId}
                      value={option.accountClassId}
                    >
                      {option.description}
                    </MenuItem>
                  ))
                ) : (
                  <Box
                    width="100px"
                    display="flex"
                    mt={1.875}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress color="primary" />
                  </Box>
                )}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              {" "}
              <TextField
                name={"accountTypeId"}
                style={{ width: "100%" }}
                id={"accountTypeId"}
                select
                label={t("componentData.editBankView.accountTypeId")}
                variant="outlined"
                value={(newDataInfo && newDataInfo.accountTypeId) || ""}
                required
                onChange={(event) => this.handleChange("accountTypeId", event)}
                error={validation.accountTypeId}
                helperText={validation.accountTypeId}
              >
                {accountTypes ? (
                  accountTypes.map((option) => (
                    <MenuItem
                      key={option.accountTypeId}
                      value={option.accountTypeId}
                    >
                      {option.description}
                    </MenuItem>
                  ))
                ) : (
                  <Box
                    width="100px"
                    display="flex"
                    mt={1.875}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress color="primary" />
                  </Box>
                )}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                label={t("componentData.editBankView.locationOptionId")}
                name={"locationOptionId"}
                style={{ width: "100%" }}
                id={"locationOptionId"}
                select
                type="text"
                variant="outlined"
                value={(newDataInfo && newDataInfo.locationOptionId) || ""}
                onChange={(event) =>
                  this.handleChange("locationOptionId", event)
                }
                error={validation.locationOptionId}
                helperText={validation.locationOptionId}
              >
                {locationOptions ? (
                  locationOptions.map((option) => (
                    <MenuItem
                      key={option.locationOptionId}
                      value={option.locationOptionId}
                    >
                      {option.description}
                    </MenuItem>
                  ))
                ) : (
                  <Box
                    width="100px"
                    display="flex"
                    mt={1.875}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress color="primary" />
                  </Box>
                )}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  id="payeeLocationIds"
                  variant="outlined"
                  className={classes.formControlLabel}
                >
                  {t("componentData.editBankView.payeeLocationIds")}
                </InputLabel>
                <Select
                  multiple
                  required
                  id="payeeLocationIds"
                  label={t("componentData.editBankView.payeeLocationIds")}
                  className={classes.maxwidthInput}
                  input={<OutlinedInput />}
                  error={validation && validation.payeeLocationIds}
                  helperText={validation && validation.payeeLocationIds}
                  fullWidth={true}
                  value={(newDataInfo && newDataInfo.payeeLocationIds) || []}
                  autoComplete="off"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}
                  variant="selectedMenu"
                  name="payeeLocationIds"
                  onChange={(event) =>
                    this.handleChange("payeeLocationIds", event)
                  }
                  renderValue={(selected) => {
                    if (selected.length === 1) {
                      const selectedRole =
                        locations &&
                        locations.filter(
                          (locations) =>
                            locations.payeeLocationId == selected[0]
                        );
                      const nm =
                        (locations.length &&
                          selectedRole.length &&
                          selectedRole[0].locationName) ||
                        "";
                      return (
                        <em className={classes.locations}>
                          {nm
                            ? `${nm} (${
                                selectedRole[0].locationType &&
                                selectedRole[0].locationType.locationTypeName
                              })`
                            : ""}
                        </em>
                      );
                    }

                    return this.props.t(
                      "componentData.editBankView.multipleLocations",
                      { selectedLength: selected.length }
                    );
                  }}
                >
                  {locations ? (
                    locations.map((option) => (
                      <MenuItem
                        style={{ overflow: "auto" }}
                        key={option.payeeLocationId}
                        value={option.payeeLocationId}
                      >
                        <Checkbox
                          disabled={locationDisabled}
                          checked={
                            newDataInfo &&
                            newDataInfo.payeeLocationIds &&
                            newDataInfo.payeeLocationIds.indexOf(
                              option.payeeLocationId
                            ) > -1
                          }
                        />
                        <ListItemText
                          primary={`${option.locationName} (${
                            option.locationType &&
                            option.locationType.locationTypeName
                          })`}
                        />
                      </MenuItem>
                    ))
                  ) : (
                    <Box
                      width="100px"
                      display="flex"
                      mt={1.875}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CircularProgress color="primary" />
                    </Box>
                  )}
                </Select>
                <FormHelperText style={{ color: "red" }}>
                  {validation && validation.payeeLocationIds}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Box alignItems="center">
            <Box py={1}>
              <Accordion className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    {t("componentData.editBankView.additionalDetails")}{" "}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box alignItems="center" width="100%">
                    <Grid container spacing={2}>
                      <Grid xs={6} item>
                        <TextField
                          label={t("componentData.editBankView.bankAddress1")}
                          name={"bankAddress1"}
                          style={{ width: "100%" }}
                          id={"bankAddress1"}
                          type="text"
                          variant="outlined"
                          value={
                            (newDataInfo && newDataInfo.bankAddress1) || ""
                          }
                          onChange={(event) =>
                            this.handleChange("bankAddress1", event)
                          }
                          error={validation.bankAddress1}
                          helperText={validation.bankAddress1}
                          inputProps={{
                            maxLength: 50,
                          }}
                        />
                      </Grid>
                      <Grid xs={6} item>
                        <TextField
                          label={t("componentData.editBankView.bankAddress2")}
                          name={"bankAddress2"}
                          style={{ width: "100%" }}
                          id={"bankAddress2"}
                          type="text"
                          variant="outlined"
                          value={
                            (newDataInfo && newDataInfo.bankAddress2) || ""
                          }
                          onChange={(event) =>
                            this.handleChange("bankAddress2", event)
                          }
                          error={validation.bankAddress2}
                          helperText={validation.bankAddress2}
                          inputProps={{
                            maxLength: 50,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid xs={6} item>
                        <TextField
                          label={t(
                            "componentData.editBankView.bankContactEmail"
                          )}
                          name={"bankContactEmail"}
                          style={{ width: "100%" }}
                          id={"bankContactEmail"}
                          type="text"
                          variant="outlined"
                          value={
                            (newDataInfo && newDataInfo.bankContactEmail) || ""
                          }
                          onChange={(event) =>
                            this.handleChange("bankContactEmail", event)
                          }
                          error={validation.bankContactEmail}
                          helperText={validation.bankContactEmail}
                          inputProps={{
                            maxLength: 50,
                          }}
                        />
                      </Grid>
                      <Grid xs={6} item>
                        <TextField
                          label={t("componentData.editBankView.bankZipPostal")}
                          name={"bankZipPostal"}
                          style={{ width: "100%" }}
                          id={"bankZipPostal"}
                          type="text"
                          variant="outlined"
                          value={
                            (newDataInfo && newDataInfo.bankZipPostal) || ""
                          }
                          onChange={(event) =>
                            this.handleChange("bankZipPostal", event)
                          }
                          error={validation.bankZipPostal}
                          helperText={validation.bankZipPostal}
                          inputProps={{
                            maxLength: 10,
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid xs={6} item>
                        <TextField
                          name={"bankContact"}
                          style={{ width: "100%" }}
                          id={"bankContact"}
                          label={t("componentData.editBankView.bankContact")}
                          type="text"
                          variant="outlined"
                          value={(newDataInfo && newDataInfo.bankContact) || ""}
                          onChange={(event) =>
                            this.handleChange("bankContact", event)
                          }
                          error={validation.bankContact}
                          helperText={validation.bankContact}
                          inputProps={{
                            maxLength: 10,
                          }}
                        />
                      </Grid>
                      <Grid xs={6} item>
                        <TextField
                          name={"bankPhone"}
                          style={{ width: "100%" }}
                          id={"bankPhone"}
                          label={t("componentData.editBankView.bankPhone")}
                          type="text"
                          variant="outlined"
                          value={(newDataInfo && newDataInfo.bankPhone) || ""}
                          onChange={(event) =>
                            this.handleChange("bankPhone", event)
                          }
                          error={validation.bankPhone}
                          helperText={validation.bankPhone}
                          inputProps={{
                            maxLength: 10,
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid xs={6} item>
                        <State
                          label={t(
                            "componentData.editBankView.bankStateRegion"
                          )}
                          name="bankStateRegion"
                          error={validation && validation.bankStateRegion}
                          helperText={validation && validation.bankStateRegion}
                          onChange={(event) =>
                            this.handleChange("bankStateRegion", event)
                          }
                          selectedState={
                            (newDataInfo && newDataInfo.bankStateRegion) || ""
                          }
                          selectedCountry={
                            (newDataInfo && newDataInfo.bankCountryIso) || ""
                          }
                        />
                      </Grid>
                      <Grid xs={6} item>
                        <City
                          label={t("componentData.editBankView.bankCity")}
                          name="bankCity"
                          error={validation && validation.bankCity}
                          helperText={validation && validation.bankCity}
                          selectedState={
                            (newDataInfo && newDataInfo.bankStateRegion) || ""
                          }
                          selectedCountry={
                            (newDataInfo && newDataInfo.bankCountryIso) || ""
                          }
                          selectedCity={
                            (newDataInfo && newDataInfo.bankCity) || ""
                          }
                          onChange={(event) =>
                            this.handleChange("bankCity", event)
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
          <Grid item xs={12} className={classes.gridItem}>
            <Box my={4} className={`button-container`}>
              <Box mx={2}>
                <Button
                  type="submit"
                  fullWidth={false}
                  variant="outlined"
                  color="primary"
                  className={classes.btnSave}
                  onClick={this.handleCancel}
                  style={{ padding: "10px" }}
                >
                  <Typography variant="h4">
                    {" "}
                    {t("componentData.editCompanyView.cancel")}
                  </Typography>
                </Button>
              </Box>
              <Box mx={2}>
                <Button
                  type="submit"
                  fullWidth={false}
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                  style={{ padding: "10px" }}
                >
                  <span
                    style={{
                      height: "18px",
                    }}
                  >
                    <span className={classes.checkIconClass}>
                      <CheckCircleIcon />
                    </span>
                  </span>
                  <Typography variant="h4">
                    {t("componentData.editCompanyView.SAVEANDEXIT")}
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Grid>
        </Box>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </>
    );
  }
}

export default compose(
  withTranslation(),
  connect((state) => ({
    ...state.user,
    ...state.client,
    ...state.csc,
    ...state.payment,
  })),
  withStyles(styles)
)(EditBankAccountView);
