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

class EditContactView extends Component {
  state = {
    contactData: this.props.data,
    contactTypeList: [],
    validation: {},
    alertMessage: null,
    alertMessageCallbackType: null,
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

    if (
      !contactData ||
      !contactData.firstName ||
      contactData.firstName.trim() === ""
    ) {
      contactValidation["firstName"] = t(
        "componentData.editContactView.fNameReq"
      );
      valid = false;
    }
    if (
      !contactData ||
      !contactData.lastName ||
      contactData.lastName.trim() === ""
    ) {
      contactValidation["lastName"] = t(
        "componentData.editContactView.lNameReq"
      );
      valid = false;
    }
    if (
      !contactData ||
      !contactData.phoneNumber ||
      contactData.phoneNumber.toString().trim() === ""
    ) {
      contactValidation["phoneNumber"] = t(
        "componentData.editContactView.phoneLen"
      );
      valid = false;
    }

    if (
      contactData &&
      contactData.phoneNumber &&
      contactData.phoneNumber.toString().trim().length !== 10
    ) {
      contactValidation["phoneNumber"] = t(
        "componentData.editContactView.phoneLen"
      );
      valid = false;
    }

    if (
      !contactData ||
      !contactData.emailAddress ||
      contactData.emailAddress.trim() === ""
    ) {
      contactValidation["emailAddress"] = t(
        "componentData.editContactView.emailReq"
      );
      valid = false;
    }
    if (
      contactData &&
      contactData.emailAddress &&
      contactData.emailAddress.trim().length > 0
    ) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(contactData.emailAddress.trim().toLowerCase())) {
        contactValidation["emailAddress"] = t(
          "componentData.editContactView.InvalidEmail"
        );
        valid = false;
      }
    }

    this.setState({ validation: { ...contactValidation } });
    return valid;
  };

  saveProfileData = () => {
    const { vendorDetail } = this.props;
    const { contactData } = this.state;
    const data = {
      firstName: contactData.firstName || null,
      lastName: contactData.lastName || null,
      phoneCountryCode:
        contactData.phoneCountryCode || contactData.phoneNumber ? "+1" : null,
      phone: contactData.phoneNumber || null,
      email: contactData.emailAddress || null,
    };

    const campaignDetailId = vendorDetail?.campaignDetailId || null;
    const consumerId = vendorDetail?.consumerId || null;

    updatePayeeDetails(consumerId, campaignDetailId, data)
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
    const { validation, contactData, alertMessage, alertMessageCallbackType } =
      this.state;

    return (
      <>
        <Paper>
          <Grid
            container
            className={classes.details}
            style={{ padding: "25px" }}
            direction="row"
          >
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.firstName}
                  helperText={validation && validation.firstName}
                  fullWidth={true}
                  autoComplete="off"
                  label={t("componentData.editContactView.fName")}
                  variant="outlined"
                  color="secondary"
                  value={(contactData && contactData.firstName) || ""}
                  name="firstName"
                  required
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.lastName}
                  helperText={validation && validation.lastName}
                  label={t("componentData.editContactView.lName")}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  value={(contactData && contactData.lastName) || ""}
                  color="secondary"
                  name="lastName"
                  required
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  required
                  error={validation && validation.emailAddress}
                  helperText={(validation && validation.emailAddress) || ""}
                  fullWidth={true}
                  autoComplete="off"
                  label={t("componentData.editContactView.email")}
                  variant="outlined"
                  color="secondary"
                  value={(contactData && contactData.emailAddress) || ""}
                  name="emailAddress"
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 254,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <Grid container direction="row" spacing={3}>
                  <Grid item xs={4} sm={4}>
                    <CountryPhoneCode
                      select
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      variant="outlined"
                      name="phoneCountryCode"
                      id="phoneCountryCode"
                      label={t("componentData.editContactView.countryCode")}
                      value={
                        (contactData && contactData.phoneCountryCode) || "+1"
                      }
                      error={validation.phoneCountryCode}
                      helperText={validation.phoneCountryCode}
                      onChange={(e) =>
                        this.setState({
                          contactData: {
                            ...contactData,
                            [e.target.name]: e.target.value,
                          },
                        })
                      }
                      inputProps={{ maxLength: 4 }}
                      required
                      excludeCountryCode={["CA", "UM"]}
                    />
                  </Grid>
                  <Grid item xs={8} sm={8}>
                    <TextField
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      variant="outlined"
                      name="phoneNumber"
                      id="phoneNumber"
                      label={t("componentData.editContactView.PhoneNumber")}
                      value={(contactData && contactData.phoneNumber) || ""}
                      error={validation.phoneNumber}
                      helperText={validation.phoneNumber}
                      onChange={(e) =>
                        this.setState({
                          contactData: {
                            ...contactData,
                            [e.target.name]: e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ),
                          },
                        })
                      }
                      inputProps={{ maxLength: 10 }}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
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

export default withTranslation()(withStyles(styles)(EditContactView));
