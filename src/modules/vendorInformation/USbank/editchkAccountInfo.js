import React, { Component } from "react";
import { Grid, Box, Typography, Paper } from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { Button } from "~/components/Forms";
import { TextField } from "~/components/Forms";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import trim from "deep-trim-node";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { AlertDialog } from "~/components/Dialogs";
import StateIso from '~/components/CSC/StateIso';
  import CityIso from '~/components/CSC/CityIso';
  import CountryIso from '~/components/CSC/CountryIso';
  import { updatepayeeDetails } from "~/redux/helpers/USbank/payee";

class EditCHKView extends Component {
  state = {
    contactData: this.props.data,
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

    if (!contactData.addressLine1 || !contactData.addressLine1.trim().length) {
      valid = false;
      contactValidation["addressline1"] = t(
        "componentData.addPayee.error.address_line1"
      );
    }
    if (!contactData.addressLine2 || !contactData.addressLine2.trim().length) {
      valid = false;
      contactValidation["addressline2"] = t(
        "componentData.addPayee.error.address_line2"
      );
    }
  
 
    if (!contactData.country|| !contactData.country.trim().length) {
      valid = false;
      contactValidation["country"] = t(
        "componentData.addPayee.error.country"
      );
    }
    if (!contactData.state|| !contactData.state.trim().length) {
      valid = false;
      contactValidation["state"] = t(
        "componentData.addPayee.error.state"
      );
    }
    if (!contactData.city|| !contactData.city.trim().length) {
      valid = false;
      contactValidation["city"] = t(
        "componentData.addPayee.error.city"
      );
    }
    if (!contactData.postalCode || !contactData.postalCode.trim().length) {
      valid = false;
      contactValidation["zipcode"] = t(
        "componentData.addPayee.error.zipcode"
      );
    }

   

    this.setState({ validation: { ...contactValidation } });
    return valid;
  };

  saveProfileData = () => {
    const { vendorDetail } = this.props;
    const consumerId = vendorDetail?.consumerId || null;
    const paymentID=vendorDetail?.primaryPaymentMethodId|| null;
    const { contactData } = this.state;
    const data = {
      consumerId:consumerId,
      paymentMethodId:paymentID,
      paymentMethodInfo:{
      addressLine1: contactData.addressLine1 || null,
      addressLine2: contactData.addressLine2 || null,
      city:contactData.city  || null,
      country:contactData.country || null,
      postalCode: contactData.postalCode || null,
      state: contactData.state || null}
    };

    // const campaignDetailId = vendorDetail?.campaignDetailId || null;
    // const consumerId = vendorDetail?.consumerId || null;
   
    const clientId = this.props.user.userData.portalProfileId;
      updatepayeeDetails(data).then((response) => {
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
    const { validation, contactData, alertMessage, alertMessageCallbackType,accountTypeList } =
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
                 fullWidth={true}
                 color="secondary"
                 autoComplete="off"
                 name="addressLine1"
                 id="addressLine1"
                 label={t("componentData.addPayee.address_line1")}
                   error={
                     validation.addressline1 
                   }
                   helperText={validation.addressline1}
                 variant="outlined"
                 inputProps={{ minLength: 1, maxLength: 35 }}
                 onChange={(e) =>
                  this.setState({
                    contactData: {
                      ...contactData,
                      [e.target.name]: e.target.value,
                    },
                  })
                }
                 value={contactData.addressLine1}
                 required
               />
       </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <TextField
                 fullWidth={true}
                 color="secondary"
                 autoComplete="off"
                 name="addressLine2"
                 id="addressLine2"
                 label={t("componentData.addPayee.address_line2")}
                   error={
                     validation.addressline2
                   }
                   helperText={validation.addressline2}
                 variant="outlined"
                 onChange={(e) =>
                  this.setState({
                    contactData: {
                      ...contactData,
                      [e.target.name]: e.target.value,
                    },
                  })
                }
                 value={contactData.addressLine2
                 }
                 required
               />
              </Box>
            </Grid>
      
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <CountryIso
             selectedCountry={(contactData.country) || ""}
             label={t("componentData.addPayee.Country")}
             error={validation.country}
             helperText={validation.country}
             value={contactData.country}
             name="country"
             required
             InputLabelProps={{
              shrink: true,
            }}
             onChange={(e) =>
              this.setState({
                contactData: {
                  ...contactData,
                  [e.target.name]: e.target.value,
                },
              })
            }
                
              />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <StateIso

label={t("componentData.addPayee.state")}
error={validation.state}
helperText={validation.state}
selectedState={(contactData.state) || ""}
selectedCountry={(contactData.country) || ""}
value={(contactData.state)}
name="state"
required
InputLabelProps={{
  shrink: true,
}}
onChange={(e) =>
  this.setState({
    contactData: {
      ...contactData,
      [e.target.name]: e.target.value,
    },
  })
}

              />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <CityIso
                 name="city"
                 label={t("componentData.addPayee.city")}
                 error={validation.city}
                 helperText={validation.city}
                 selectedState={(contactData.state) || ""}
                 selectedCountry={(contactData.country) || ""}
                 selectedCity={(contactData.city) || ""}
                 value={(contactData.city) || ""}
                 required={true}
                 InputLabelProps={{
                  shrink: true,
                }}
                 onChange={(e) =>
                  this.setState({
                    contactData: {
                      ...contactData,
                      [e.target.name]: e.target.value,
                    },
                  })
                }
               
              />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <TextField
                label={t("componentData.addPayee.zipCode")}
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                autoFocus={true}
                variant="outlined"
                error={Boolean(validation.zipcode)}
                helperText={validation.zipcode}
                name="postalCode"
                id="postalCode"
                onChange={(e) =>
                  this.setState({
                    contactData: {
                      ...contactData,
                      [e.target.name]: e.target.value,
                    },
                  })
                }
                inputProps={{ minLength: 5, maxLength: 10 }}
              required
                value={contactData.postalCode}
              />
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
export default withTranslation()(
  connect((state) => ({
    ...state.user,
   
  }))(withStyles(styles)(EditCHKView))
);
// export default withTranslation()
// (withStyles(styles)(EditCHKView));
