import React, { Component } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  Grid,
} from "@material-ui/core";

import { Country } from "~/components/CSC";
import TextField from "~/components/Forms/TextField";
import { AlertDialog } from "~/components/Dialogs";
import { updateVirtualCardInfo } from "~/redux/helpers/suppliers";
import { withStyles } from "@material-ui/styles";
import styles from "./styles";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { getCardType } from "../../redux/actions/payments";
import trim from "deep-trim-node";
import { connect } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
class EditvirtualCardView extends Component {
  state = {
    locationDisabled: false,
    selectedClients:
      (this.props.VCADetails &&
        this.props.VCADetails.clients &&
        this.props.VCADetails.clients.map((item) => item.clientId)) ||
      [],
    newDataInfo: this.props.VCADetails || {},
    validation: {},
    alertType: null,
    alertMessage: null,
    alertMessageCallbackType: null,
    btnDisabled: true,
    clientsList: [],
    removeClientProgress: false,
    cardTypes: [],
    updateProgress: false,
  };

  componentDidMount = () => {
    this.fetchCardTypes();
  };

  fetchCardTypes = () => {
    this.props.dispatch(getCardType()).then((response) => {
      if (response && response.error) {
        this.setState({
          alertMessage: response.message,
          alertMessageCallbackType: null,
          alertType: "error",
        });
        return false;
      }
      this.setState({
        isLoading: false,
        cardTypes: this.props.payment.cardTypes.rows,
      });
    });
  };

  handleSubmit = () => {
    const { newDataInfo } = this.state;
    const valid = this.validateForm();
    if (!valid) {
      return false;
    }

    let data = {
      virtualCardId: newDataInfo.payeeCardDetailId,
      payeeId: newDataInfo.payeeId,
      contactEmail: newDataInfo.contactEmail,
      commercialCardTypeId: newDataInfo.commercialCardTypeId,
      countryIso: newDataInfo.countryIso,
      currencyCode: newDataInfo.currencyCode,
      usedFor: newDataInfo.usedFor,
    };

    data = trim(data);
    updateVirtualCardInfo(data).then((response) => {
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

  validateForm = () => {
    const { newDataInfo } = this.state;

    let valid = true;
    const validation = {};

    if (
      !newDataInfo ||
      !newDataInfo.contactEmail ||
      (newDataInfo.contactEmail && newDataInfo.contactEmail.trim() === "")
    ) {
      validation["contactEmail"] = this.props.t(
        "componentData.editVCAView.error.contactEmail"
      );
      valid = false;
    }
    if (
      newDataInfo &&
      newDataInfo.contactEmail &&
      newDataInfo.contactEmail.trim().length > 0
    ) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(newDataInfo.contactEmail.trim().toLowerCase())) {
        validation["contactEmail"] = "Invalid email address";
        valid = false;
      }
    }

    if (
      !newDataInfo ||
      !newDataInfo.commercialCardTypeId ||
      (newDataInfo.commercialCardTypeId &&
        newDataInfo.commercialCardTypeId.toString().trim() === "")
    ) {
      validation["commercialCardTypeId"] = this.props.t(
        "componentData.editVCAView.error.commercialCardTypeId"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.countryIso ||
      (newDataInfo.countryIso && newDataInfo.countryIso.trim() === "")
    ) {
      validation["countryIso"] = this.props.t(
        "componentData.editVCAView.error.countryIso"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.usedFor ||
      (newDataInfo.usedFor && newDataInfo.usedFor.trim() === "")
    ) {
      validation["usedFor"] = this.props.t(
        "componentData.editVCAView.error.usedFor"
      );
      valid = false;
    }
    if (
      !newDataInfo ||
      !newDataInfo.currencyCode ||
      (newDataInfo.currencyCode && newDataInfo.currencyCode.trim() === "")
    ) {
      validation["currencyCode"] = this.props.t(
        "componentData.editVCAView.error.currencyCode"
      );
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
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
          this.props.handleVCAEditMode();
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

  handleChange = (field, event, value, position) => {
    const { newDataInfo } = this.state;
    const newDataDetail = { ...newDataInfo };
    const fieldName = event.target.name;

    switch (field) {
      case "roleId":
        newDataDetail[fieldName] = event.target.value;
        break;
      case "countryIso":
        newDataDetail["countryIso"] = event.target.value;
        newDataDetail["currencyCode"] =
          event.target.value == "US" ? "USD" : newDataDetail["currencyCode"];
        break;
      default:
        newDataDetail[fieldName] = event.target.value;
        break;
    }
    this.setState({ newDataInfo: { ...newDataDetail } });
  };

  render() {
    const {
      alertMessage,
      alertMessageCallbackType,
      newDataInfo,
      validation,
      cardTypes,
    } = this.state;
    const { classes, t, currencyList } = this.props;
    return (
      <>
        <Box width={1}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {" "}
              <TextField
                name={"contactEmail"}
                id={"contactEmail"}
                label={t("componentData.editVCAView.label.contactEmail")}
                type="text"
                variant="outlined"
                value={(newDataInfo && newDataInfo.contactEmail) || ""}
                required
                onChange={(event) => this.handleChange("contactEmail", event)}
                error={validation.contactEmail}
                helperText={validation.contactEmail}
                inputProps={{
                  maxLength: 50,
                }}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name={"commercialCardTypeId"}
                style={{ width: "100%" }}
                id={"commercialCardTypeId"}
                label={t(
                  "componentData.editVCAView.label.commercialCardTypeId"
                )}
                select
                variant="outlined"
                value={(newDataInfo && newDataInfo.commercialCardTypeId) || ""}
                required
                onChange={(event) =>
                  this.handleChange("commercialCardTypeId", event)
                }
                error={validation.commercialCardTypeId}
                helperText={validation.commercialCardTypeId}
              >
                {cardTypes ? (
                  cardTypes.map((option) => (
                    <MenuItem
                      key={option.creditCardTypeId}
                      value={option.creditCardTypeId}
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
              {" "}
              <Country
                required={true}
                label={t("componentData.editVCAView.label.countryIso")}
                name="countryIso"
                disabled={true}
                error={validation && validation.countryIso}
                helperText={validation && validation.countryIso}
                selectedCountry={(newDataInfo && newDataInfo.countryIso) || ""}
                onChange={(event) => this.handleChange("countryIso", event)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label={t("componentData.editVCAView.label.currencyCode")}
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
                        newDataInfo.countryIso &&
                        newDataInfo.countryIso === "US" &&
                        item.isoCode === "CAD"
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
              <TextField
                required
                name={"usedFor"}
                style={{ width: "100%" }}
                id={"usedFor"}
                label={t("componentData.editVCAView.label.usedFor")}
                type="text"
                variant="outlined"
                value={(newDataInfo && newDataInfo.usedFor) || ""}
                onChange={(event) => this.handleChange("usedFor", event)}
                error={validation.usedFor}
                helperText={validation.usedFor}
                inputProps={{
                  maxLength: 50,
                }}
              />
            </Grid>
          </Grid>
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
)(EditvirtualCardView);
