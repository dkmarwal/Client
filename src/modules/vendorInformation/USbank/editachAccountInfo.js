import React, { Component } from "react";
import { Grid, Box, Typography, Paper, Link, } from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { Button } from "~/components/Forms";
import { TextField } from "~/components/Forms";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withTranslation } from "react-i18next";
import { AlertDialog } from "~/components/Dialogs";
import MaskInput from '~/components/MaskInput';
import SearchIcon from '~/assets/icons/search.svg';
import { CustomDialogrouting } from '~/components/Dialogs';
import RoutingCodeSearch from '~/modules/RoutingCodeResults/USbank/routingCodeSearch';
import {
  MenuItem,
} from "@material-ui/core";
import { updatepayeeDetails } from "~/redux/helpers/USbank/payee";

class EditACHView extends Component {
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

    if (
      !contactData ||
      !contactData.description ||
      contactData.description.toString().trim().length === 0
    ) {
      contactValidation["accountType"] = t(
        "componentData.editView.accountType"
      );
      valid = false;
    }
    if (
      !contactData ||
      !contactData.routingNumber||
      contactData.routingNumber.toString().trim().length === 0
    ) {
      contactValidation["routingCode"] =t("componentData.addAccountForm.RoutingCode")
      valid = false;
    }
    if (contactData.routingNumber && contactData.routingNumber.length !== 9) {
      contactValidation['routingCode'] = t(
        'componentData.addAccountForm.RoutingCodeLen'
      );
      valid = false;
    }
    if (
      !contactData ||
      !contactData.accountNumber ||
      contactData.accountNumber.toString().trim() === ""
    ) {
      contactValidation["accountNumber"] = t(
        "componentData.addAccountForm.AccountNumberRequired"
      );
      valid = false;
    }
    if (
      contactData.accountNumber&&
      contactData.accountNumber.length > 17
    ) {
      contactValidation['accountNumber'] = t(
        'componentData.addAccountForm.accountNumLen'
      );
      valid = false;
    }

    if (contactData.accountNumber && contactData.accountNumber.length < 6) {
      contactValidation['accountNumber'] = t(
        'componentData.addAccountForm.accountNumMinLen'
      );
      valid = false;
    }
    if ((!contactData.bankName || !contactData.bankName.trim().length)) {
      contactValidation["bankName"] = t(
        'componentData.addPayee.error.bankName'
      );
     
       valid = false;
    } else if (contactData.bankName.trim().length > 158) {
      contactValidation["bankName"] = t(
        'componentData.addPayee.error.bankNameLength'
      );
      valid = false;
    }
   

    this.setState({ validation: { ...contactValidation } });
    return valid;
  };
  
  selectBankDetails = (bankData) => {
    this.setState({
      contactData: {
        ...this.state.contactData,
        bankName: bankData.bankName||"",
        routingNumber: bankData.routingCode,
      },
    });
  };
  handleDialogClose = () => {
    this.setState({
      openSearchModal: false,
    });
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
        accountNumber: contactData.accountNumber || null,
        accountTypeId: contactData.description&&Number(contactData.description)?contactData.description:contactData.description==="Checking"?1:2 || null,
        routingCode:contactData.routingNumber  || null,
    }
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
                 name="description"
                 label={t("componentData.addPayee.accountType")}
                   error={
                     validation.accountType 
                   }
                   helperText={validation.accountType}
                 variant="outlined"
                 // disabled={!isOnboarding}
                 onChange={(e) =>
                  this.setState({
                    contactData: {
                      ...contactData,
                      [e.target.name]: e.target.value,
                    },
                  })
                }
                 value={contactData.description&&Number(contactData.description)?contactData.description:contactData.description==="Checking"?1:2}
                 required
               >
                   {accountTypeList.map((list)=>(
<MenuItem value={list.accountTypeId}>{list.description}</MenuItem>
                    ))}
                    
              

               </TextField>
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <TextField
                 fullWidth={true}
                 color="secondary"
                 autoComplete="off"
                 name="routingNumber"
                 autoFocus={true}
                 label={t("componentData.routingCodeResults.tabelHeaders.routingCode")}
                 variant="outlined"
                 value={contactData.routingNumber}
                inputProps={{
                    maxLength: 9,
                    minLength: 9,
                  }}
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                    error={
                        validation.routingCode
                      }
                      helperText={validation.routingCode}
                 required
                 //   disabled={disableEdit}
               />
              </Box>
              <Link
                      component='button'
                      variant='body2'
                      onClick={() => {
                        this.setState({
                          openSearchModal: true,
                        });
                      }}
                      className={classes.searchRoutingText}
                    >
                      {t('componentData.routingCodeResult.label.searchBank')}
                      <img
                        style={{ marginLeft: '4px' }}
                        src={SearchIcon}
                        alt='search'
                      />
                    </Link>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
             
                          <MaskInput
             label={t(
              "componentData.addAccountForm.AcNumber"
            )}
            error={
              validation.accountNumber 
            }
            helperText={validation.accountNumber}
            required
            fullWidth={true}
            autoComplete='off'
            variant='outlined'
            color='secondary'
            value={contactData.accountNumber}
            name="accountNumber"
            inputProps={{
              maxLength: 17,
              minLength: 6,
            }}
            getValue={(val) => 
              this.setState({
                contactData: {
                  ...contactData,
                  accountNumber: val,
                },
              })
              }
          />
              </Box>

            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <TextField
                 fullWidth={true}
                 color="secondary"
                 autoComplete="off"
                 name="bankName"
                 autoFocus={true}
                 label={t("componentData.routingCodeResults.tabelHeaders.bankName")}
                 variant="outlined"
                 value={contactData.bankName}
                inputProps={{
                    maxLength: 9,
                    minLength: 9,
                  }}
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  error={validation.bankName}
                  helperText={validation.bankName}
                 required
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
           <CustomDialogrouting
              showBtn={false}
              showCloseIcon={true}
              fullWidth={true}
              open={this.state.openSearchModal}
              onClose={() => this.handleDialogClose()}
              dialogClassName={classes.routingCodeDialog}
            >
              <RoutingCodeSearch
                onClose={this.handleDialogClose}
                onSelectBank={this.selectBankDetails}
              />
            </CustomDialogrouting>
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

export default withTranslation()(withStyles(styles)(EditACHView));
