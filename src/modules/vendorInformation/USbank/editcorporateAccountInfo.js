import React, { Component } from "react";
import { Grid, Box, Typography, Paper } from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { Button } from "~/components/Forms";
import { TextField } from "~/components/Forms";
import CountryPhoneCode from "~/components/Forms/CountryPhoneCode";
import { updatePayeeDetails } from "~/redux/helpers/B2C/suppliers";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withTranslation } from "react-i18next";
import { AlertDialog } from "~/components/Dialogs";
import MaskInput from "~/components/MaskInput";
import DatePicker from "react-datepicker";
import MaskedInput from "../../../components/MaskedInput";
import { fetchUSBankPrepaidCardData } from "~/redux/actions/USbank/payments";
import { MenuItem, InputAdornment } from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import StateIso from "~/components/CSC/StateIso";
import CityIso from "~/components/CSC/CityIso";
import CountryIso from "~/components/CSC/CountryIso";
import { updatepayeeDetails } from "~/redux/helpers/USbank/payee";

class EditcorporateAccountInfo extends Component {
  state = {
    contactData: this.props.data,
    accountTypeList: this.props.accountTypeList,
    validation: {},
    alertMessage: null,
    alertMessageCallbackType: null,
    finalCardDetails: this.props.finalCardDetails,
    startDate: null,
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
  };

  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
    //refresh payee list
    this.props.updateCTAsData();
  };
  handleGovExpiryDate = (date) => {
    const { contactData } = this.state;

    this.setState({
      contactData: {
        ...contactData,
        // [e.target.name]: date.toLocaleDateString(),
        govExpiredDate: date.toLocaleDateString(),
      },
    });
  };
  handleDOBActivatedAt = (date) => {
    const { contactData } = this.state;

    this.setState({
      contactData: {
        ...contactData,
        // [e.target.name]: date.toLocaleDateString(),
        dateOfBirth: date.toLocaleDateString(),
      },
    });
  };

  handleChange = (name, e) => {
    const { contactData } = this.state;
    const { value } = e.target;
    let finalValue = "";

    switch (name) {
      case "homePhone":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
      case "govLocation":
        finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
        break;
      case "employerState":
        finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
        break;
      case "uniqueId":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
      case "ssn":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
      case "govIdValue":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
      case "routingCode":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;

      default:
        finalValue = value;
        break;
    }
    this.setState({
      contactData: {
        ...contactData,
        [name]: finalValue,
      },
    });
  };

  handleSubmit = () => {
    const isValid = this.validateForm();
    if (isValid) {
      this.saveProfileData();
    }
  };

  validateForm = () => {
    const { contactData } = this.state;
    const { t } = this.props;
    let valid = true;
    const contactValidation = {};

    if (!contactData.address1 || !contactData.address1.trim().length) {
      contactValidation["address1"] = t(
        "componentData.addPayee.error.address_line1"
      );
      valid = false;
    }
    if (!contactData.address2 || !contactData.address2.trim().length) {
      contactValidation["address2"] = t(
        "componentData.addPayee.error.address_line2"
      );
      valid = false;
    }

    if (!contactData.country || !contactData.country.trim().length) {
      contactValidation["country"] = t("componentData.addPayee.error.country");
      valid = false;
    }
    if (!contactData.state || !contactData.state.trim().length) {
      contactValidation["state"] = t("componentData.addPayee.error.state");
      valid = false;
    }
    if (!contactData.city || !contactData.city.trim().length) {
      contactValidation["city"] = t("componentData.addPayee.error.city");
      valid = false;
    }
    if (!contactData.postalCode || !contactData.postalCode.trim().length) {
      contactValidation["zipcode"] = t("componentData.addPayee.error.zipcode");
      valid = false;
    }

    this.setState({ validation: { ...contactValidation } });
    return valid;
  };

  saveProfileData = () => {
    const { vendorDetail } = this.props;
    const consumerId = vendorDetail?.consumerId || null;
    const paymentID = vendorDetail?.primaryPaymentMethodId || null;
    const { contactData } = this.state;

    const data = {
      consumerId: consumerId,
      paymentMethodId: paymentID,
      paymentMethodInfo: {
        lastName: contactData.lastName || null,
        firstName: contactData.firstName || null,
        address1: contactData.address1 || null,
        address2: contactData.address2 || null,
        city: contactData.city || null,
        state: contactData.state || null,
        country: contactData.country || null,
        postalCode: contactData.postalCode || null,

        //phoneCountryCode: contactData.phoneCountryCode || contactData.phoneNumber ? "+1" : null,
      },
    };

    updatepayeeDetails(data)
      .then((response) => {
        if (response.error) {
          this.setState({
            alertMessage: response.message,
            alertMessageCallbackType: null,
          });
          return false;
        }

        this.setState({
          alertMessage: response.message,
          alertMessageCallbackType: "REDIRECT",
        });
      })
      .catch((error) => {});
  };
  render() {
    const { classes, t } = this.props;
    const {
      validation,
      contactData,
      alertMessage,
      alertMessageCallbackType,
      accountTypeList,
      finalCardDetails,
    } = this.state;
    return (
      <>
        <Paper>
          <Grid
            container
            className={classes.details}
            style={{ padding: "25px" }}
            direction="row"
          >
            <>
              <Grid item xs={6} md={6} className={classes.gridItem}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="firstName"
                  label={t("componentData.addPayee.FirstName")}
                  variant="outlined"
                  value={contactData.firstName || ""}
                  inputProps={{ maxLength: 50 }}
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  error={Boolean(validation.firstName)}
                  helperText={validation.firstName}
                />
              </Grid>
              <Grid item xs={6} md={6} className={classes.gridItem}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="lastName"
                  label={t("componentData.addPayee.LastName")}
                  variant="outlined"
                  value={contactData.lastName || ""}
                  inputProps={{ maxLength: 50 }}
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  error={Boolean(validation.lastName)}
                  helperText={validation.lastName}
                />
              </Grid>
            </>

            <>
              <Grid item xs={6} md={6} className={classes.gridItem}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  autoFocus={true}
                  variant="outlined"
                  label={t("componentData.addPayee.address_line1")}
                  error={validation.address1}
                  helperText={validation.address1}
                  name="address1"
                  onChange={(e) => {
                    this.handleChange("address1", e);
                  }}
                  inputProps={{ minLength: 1, maxLength: 35 }}
                  //value={address1}
                  value={contactData.address1 || ""}
                  required
                />
              </Grid>
              <Grid item xs={6} md={6} className={classes.gridItem}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  autoFocus={true}
                  variant="outlined"
                  label={t("componentData.addPayee.address_line2")}
                  error={validation.address2}
                  helperText={validation.address2}
                  name="address2"
                  onChange={(e) => {
                    this.handleChange("address2", e);
                  }}
                  inputProps={{ maxLength: 35, minLength: 1 }}
                  value={contactData.address2 || ""}
                  required
                />
              </Grid>
              <Grid item xs={6} md={6} className={classes.gridItem}>
                <Grid item xs={12} md={12} style={{ marginTop: "8px" }}>
                  <CountryIso
                    selectedCountry={contactData.country}
                    label={t("componentData.addPayee.Country")}
                    error={validation.country}
                    helperText={validation.country}
                    //value={country}
                    value={contactData.country || ""}
                    name="country"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => this.handleChange("country", e)}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} md={6} className={classes.gridItem}>
                <Grid item xs={12} md={12} style={{ marginTop: "8px" }}>
                  <StateIso
                    label={t("componentData.addPayee.state")}
                    error={validation.state}
                    helperText={validation.state}
                    selectedState={contactData.state || ""}
                    selectedCountry={contactData.country || ""}
                    //value={state}
                    value={contactData.state || ""}
                    name="state"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => this.handleChange("state", e)}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} md={6} className={classes.gridItem}>
                <Grid item xs={12} md={12} style={{ marginTop: "8px" }}>
                  <CityIso
                    name="city"
                    label={t("componentData.addPayee.city")}
                    error={validation.city}
                    helperText={validation.city}
                    selectedState={contactData.state || ""}
                    selectedCountry={contactData.country || ""}
                    selectedCity={contactData.city || ""}
                    value={contactData.city || ""}
                    required={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => this.handleChange("city", e)}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} md={6} className={classes.gridItem}>
                <TextField
                  label={t("componentData.addPayee.zipCode")}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  autoFocus={true}
                  variant="outlined"
                  error={Boolean(validation.postalCode)}
                  helperText={validation.postalCode}
                  name="postalCode"
                  onChange={(e) => this.handleChange("postalCode", e)}
                  inputProps={{ minLength: 5, maxLength: 10 }}
                  required
                  value={contactData.postalCode || ""}
                />
              </Grid>
            </>

            <Grid item xs={12}>
              <Box my={4} className={`button-container`}>
                <Box mx={2}>
                  <Button
                    type="submit"
                    fullWidth={false}
                    variant="outlined"
                    color="primary"
                    className={classes.btnSave}
                    onClick={this.props.onCancel}
                  >
                    <Typography variant="h4">
                      {" "}
                      {t("componentData.editContactView.cancel")}
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
                      {t("componentData.editContactView.SAVEANDEXIT")}
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </>
    );
  }
  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          callbackType === "REDIRECT" ? this.goBack() : this.hideAlertMessage();
        }}
      />
    );
  };
}

export default withTranslation()(withStyles(styles)(EditcorporateAccountInfo));
