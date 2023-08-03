import React, { Component } from "react";
import { Grid, Box, Typography, Paper,Link, } from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { Button } from "~/components/Forms";
import { TextField } from "~/components/Forms";
import CountryPhoneCode from "~/components/Forms/CountryPhoneCode";
import { updatePayeeDetails } from "~/redux/helpers/B2C/suppliers";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withTranslation } from "react-i18next";
import { AlertDialog } from "~/components/Dialogs";
import MaskInput from '~/components/MaskInput';
import { updatepayeeDetails } from "~/redux/helpers/USbank/payee";
import {
  MenuItem,
} from "@material-ui/core";
import SearchIcon from '~/assets/icons/search.svg';
import { CustomDialogrouting } from '~/components/Dialogs';
import RoutingCodeSearch from '~/modules/RoutingCodeResults/USbank/routingCodeSearch';


class EditZelleView extends Component {
  state = {
    contactData: this.props.data,
    accountTypeList: this.props.accountTypeList,
    validation: {},
    alertMessage: null,
    alertMessageCallbackType: null,
    openSearchModal:false,
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

   
    if (   !contactData ||(contactData.tokenType===2||contactData.tokenType==='phone')&&(!contactData.tokenValue || contactData.tokenValue.toString().trim() === "")) {
      contactValidation["tokenValue"] = t("componentData.addPayee.error.emptyPhoneNumber");
      valid = false;
    }

    if ((contactData.tokenType===2||contactData.tokenType==='phone')&&(contactData.tokenValue && contactData.tokenValue.toString().trim().length !== 10)) {
      contactValidation["tokenValue"] = t("componentData.addPayee.error.validPhoneNumber");
      valid = false;
    }   if (
      (contactData.tokenType===1||contactData.tokenType==="email" )&& (!contactData.tokenValue ||
        contactData.tokenValue.trim() === "")
     ) {
      contactValidation["tokenValue"] = t(
           "componentData.addPayee.error.emailIdRequired"
       );
       valid = false;
     }
	    if (((contactData.tokenType===1 || contactData.tokenType==="email") && contactData.tokenValue && contactData.tokenValue.trim().length > 0)) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(contactData.tokenValue.trim().toLowerCase())) {
        contactValidation["tokenValue"] = t("componentData.addPayee.error.validEmailId");
        valid = false;
      }
    }  if  (contactData.tokenType !== null && contactData.tokenType.toString().trim().length === 0) {
        valid = false;
        contactValidation["tokenType"] = t("componentData.addPayee.error.tokenType");}

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
      tokenType: contactData.tokenType=== 1||contactData.tokenType=== "email"
      ? "email"
      : "phone"
       || null,
      tokenValue: contactData.tokenValue || null,}
    };

    // const campaignDetailId = vendorDetail?.campaignDetailId || null;
    // const consumerId = vendorDetail?.consumerId || null;
   
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
                      select
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      name="tokenType"
                      label={t("componentData.addPayee.tokenType")}
                      error={validation.tokenType}
                      helperText={validation.tokenType}
                      variant="outlined"
                      // disabled={!isOnboarding}
                      onChange={(e) =>
                        this.setState({
                          contactData: {
                            ...contactData,
                            [e.target.name]: e.target.value,
                            tokenValue:"",
                          },
                        })
                      }
                      value={contactData.tokenType&&Number(contactData.tokenType)?contactData.tokenType:contactData.tokenType==="email"?1:2}
                      required
                    >
                      <MenuItem>
                        {t("componentData.companyDetail.Select")}
                      </MenuItem>
                      <MenuItem value={1}>{"Email"}</MenuItem>
                      <MenuItem value={2}>{"Phone"}</MenuItem>
                    </TextField>
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <TextField
                   fullWidth={true}
                   color="secondary"
                   autoComplete="off"
                   name="tokenValue"
                   autoFocus={true}
                   label={t("componentData.addPayee.tokenValue")}
                   variant="outlined"
                   value={contactData.tokenValue}
                   onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                   error={validation.tokenValue}
                   helperText={validation.tokenValue}
                   required
                   inputProps={
                    contactData.tokenType === 2||contactData.tokenType==='phone'
                      ? { maxLength: 10 }
                      : { maxLength: 45 }
                  }
                   //   disabled={disableEdit}
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

export default withTranslation()(withStyles(styles)(EditZelleView));
