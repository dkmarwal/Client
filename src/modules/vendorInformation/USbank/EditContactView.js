import React, { Component } from "react";
import { Grid, Box, Typography, Paper,MenuItem } from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import MaskedInput from "~/components/MaskedInput";
import { Button } from "~/components/Forms";
import { TextField } from "~/components/Forms";
import CountryPhoneCode from "~/components/Forms/CountryPhoneCode";
import { updatePayeeDetails,updatesppPayeeDetails } from "~/redux/helpers/B2C/suppliers";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withTranslation } from "react-i18next";
import { AlertDialog } from "~/components/Dialogs";
import StateIso from "~/components/CSC/StateIso";
import CityIso from "~/components/CSC/CityIso";
import CountryIso from "~/components/CSC/CountryIso";
import { PayeeType } from "../../../config/entityTypes";
class EditContactView extends Component {
  state = {
    contactData: this.props.data,
    validation: {},
    alertMessage: null,
    alertMessageCallbackType: null,
    source:this.props.source,
    isCssfClient:this.props.isCssfClient,
    contactTypeList:this.props.contactTypeList,
    sppList:this.props.sppList
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
    const { contactData,isCssfClient,source } = this.state;
    const { t } = this.props;
    let valid = true;
    const contactValidation = {};

    if ((((isCssfClient===1) && (contactData.PayeeTypeId===PayeeType["Business"])) || ((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Business"]))) &&
      (!contactData ||
      !contactData.companyName ||
      contactData.companyName.trim() === "")
    ) {
      contactValidation["companyName"] = t(
        "componentData.editContactView.companyReq"
      );
      valid = false;
    }
    if ((((isCssfClient===1) &&(contactData.PayeeTypeId===PayeeType["Consumer"])) || ((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Consumer"]))) &&
      (!contactData ||
      !contactData.firstName ||
      contactData.firstName.trim() === "")
    ) {
      contactValidation["firstName"] = t(
        "componentData.editContactView.fNameReq"
      );
      valid = false;
    }
    if ((((isCssfClient===1) &&(contactData.PayeeTypeId===PayeeType["Consumer"])) ||((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Consumer"]))) &&
      (!contactData ||
      !contactData.lastName ||
      contactData.lastName.trim() === "")
     ){
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
    
    if (((source ==="WebUi")||(isCssfClient===1)) && (
      !contactData ||
      !contactData.addressLine1 ||
      contactData.addressLine1.toString().trim() === ""))
     {
      contactValidation["payeeaddress_line1"] = t(
        "componentData.editContactView.address1"
      );
      valid = false;
    }
  
    if (((source ==="WebUi")||(isCssfClient===1))  && (
      !contactData ||
      !contactData.country ||
      contactData.country.toString().trim() === "")
    ) {
      contactValidation["payeeCountry"] = t(
        "componentData.editContactView.country"
      );
      valid = false;
    }
    if (((source ==="WebUi")||(isCssfClient===1))  &&(
      !contactData ||
      !contactData.state ||
      contactData.state.toString().trim() === "")
    ) {
      contactValidation["payeeState"] = t(
        "componentData.editContactView.state"
      );
      valid = false;
    }
    if (((source ==="WebUi")||(isCssfClient===1))  &&(
      !contactData ||
      !contactData.city ||
      contactData.city.toString().trim() === "")
    ) {
      contactValidation["payeeCity"] = t(
        "componentData.editContactView.city"
      );
      valid = false;
    }
    if (((source ==="WebUi")||(isCssfClient===1)) && (
      !contactData ||
      !contactData.postalCode ||
      contactData.postalCode.toString().trim() === "")
    ) {
      contactValidation["payeeCity"] = t(
        "componentData.editContactView.city"
      );
      valid = false;
    }

    if ((
      contactData &&
      contactData.phoneNumber &&
      contactData.phoneNumber.toString().trim().length !== 10)
    ) {
      contactValidation["phoneNumber"] = t(
        "componentData.editContactView.phoneLen"
      );
      valid = false;
    }

    if (((source ==="WebUi")||(isCssfClient===1) ) &&
      (!contactData ||
      !contactData.postalCode ||
      contactData.postalCode.trim() === "")
    ) {
      contactValidation["payeeZipcode"] = t(
        "componentData.editContactView.zipCode"
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
    if (
      !contactData ||
      !contactData.emailAddress ||
      contactData.emailAddress.trim() === ""){
        contactValidation["emailAddress"] = t(
          "componentData.editContactView.emailReq");
        valid = false;
      }
    
    if (
      contactData &&
      contactData.remittanceEmail&&contactData.remittanceEmail.trim().length > 0
    ) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(contactData.remittanceEmail.trim().toLowerCase())) {
        contactValidation["rememail"] = t(
          "componentData.addPayee.error.validEmailId"
        );
        valid = false;
      }
    }
    this.setState({ validation: { ...contactValidation } });
    return valid;
  };
  saveSppClientInfo=(consumerId, campaignDetailId, data,sppList,source,isCssfClient,addPayeeData)=>{
    if((source ==="WebUi")||(isCssfClient===1)){
      updatesppPayeeDetails(consumerId, campaignDetailId, addPayeeData)
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
    }
    else{
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
    }

  }

  saveProfileData = () => {
    const { vendorDetail } = this.props;
    const { contactData,sppList,source,isCssfClient } = this.state;
    const campaignDetailId = vendorDetail?.campaignDetailId || null;
    const consumerId = vendorDetail?.consumerId || null;
    let data = {
      firstName: contactData.firstName || null,
      lastName: contactData.lastName || null,
      companyName: contactData.companyName || null,
      phoneCountryCode:
        contactData.phoneCountryCode || contactData.phoneNumber ? "+1" : null,
      phone: contactData.phoneNumber || null,
      email: contactData.emailAddress || null,
      payeeTypeId:contactData.PayeeTypeId || null,
    };
    // if((isCssfClient===1) || ((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Consumer"]))){
    // data['firstName']=contactData.firstName || null;
    // data['lastName']=contactData.lastName || null}
    const addPayeeData = {
      consumerIdentifier: contactData.consumerIdentifier || null,
      payeeTypeId: contactData.payeeType.length?(contactData.payeeType==="Consumer"?1:2 ): null,
      // firstName: contactData.firstName || null,
      // lastName: contactData.lastName || null,
      // companyName: contactData.companyName || null,
      emailId: contactData.emailAddress || null,
      phoneNumber: contactData.phoneNumber || null,
      phoneCountryCode:
      contactData.phoneCountryCode || contactData.phoneNumber ? "+1" : null,
      remittanceEmail:contactData.remittanceEmail || null,
      communicationEmail: contactData.communicationEmail || null,
      contactMethod: contactData.contactMethod && (contactData.contactMethod.toString()||1),
      address1: contactData.addressLine1 || null,
      address2: contactData.addressLine2 || null,
      city: contactData.city || null,
      state: contactData.state || null,
      country: contactData.country || null,
      postalCode: contactData.postalCode || null 
    };
    if(((isCssfClient===1) || ((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Consumer"])))){
      addPayeeData['firstName']=contactData.firstName || null;
      addPayeeData['lastName']=contactData.lastName || null}
      if(((isCssfClient===1) || ((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Business"])))){
        addPayeeData['companyName']=contactData.companyName || null}
   this.saveSppClientInfo(consumerId, campaignDetailId, data,sppList,source,isCssfClient,
    addPayeeData)
  };
  render() {
    const { classes, t } = this.props;
    const { validation, contactData, alertMessage, alertMessageCallbackType,contactTypeList,sppList,source,isCssfClient } =
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
           { (isCssfClient===1) || ((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Business"])) ?    <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
             <TextField
                  error={validation && validation.companyName}
                  helperText={validation && validation.companyName}
                  fullWidth={true}
                  autoComplete="off"
                  label={t("componentData.editContactView.companyName")}
                  variant="outlined"
                  color="secondary"
                  value={(contactData && contactData.companyName) || ""}
                  name="companyName"
                  required={(((isCssfClient===1) && (contactData.PayeeTypeId===PayeeType["Business"])) || ((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Business"])))?true:false}
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
            </Grid>:null}
            {(isCssfClient===1) ||((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Consumer"]))
           ?
            <>
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
                  required={(((isCssfClient===1) &&(contactData.PayeeTypeId===PayeeType["Consumer"])) || ((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Consumer"]))) ?true:false}
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
                  required={(((isCssfClient===1) &&(contactData.PayeeTypeId===PayeeType["Consumer"])) || ((isCssfClient===0) && (contactData.PayeeTypeId===PayeeType["Consumer"]))) ?true:false}
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
            </Grid>  </>
            :null}
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
                        (contactData && contactData.phoneCountryCode != '91' && contactData.phoneCountryCode) || "+1"
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
                  <MaskedInput
                                    fullWidth={true}
                                    color="secondary"
                                    variant="outlined"
                                    value={(contactData && contactData.phoneNumber) || ""}
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    type="text"
                                    label={t("componentData.editContactView.PhoneNumber")}
                                    // onChange={(e) => {
                                    //   this.handleChange("phone", e);
                                    // }}
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
                                  
                                    placeholder={"XXX-XXX-XXXX"}
                                    error={validation.phoneNumber}
                      helperText={validation.phoneNumber}
                                    inputProps={{ maxLength: 10 }}
                                    formatterProps={{
                                      format: "###-###-####",
                                      isNumericString: true,
                                    }}
                                    required={isCssfClient===1 && contactData.contactMethod?false:true}
                                    //   disabled={disableEdit}
                                  />
                    {/* <TextField
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
                    /> */}
                  </Grid>
           
                </Grid>
              </Box>
            </Grid>
          
            {((isCssfClient===1))? (   <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                     error={validation && validation.rememail}
                     helperText={(validation && validation.rememail) || ""}
                     fullWidth={true}
                     autoComplete="off"
                     label={t("componentData.addPayee.rememail")}
                     variant="outlined"
                     color="secondary"
                     value={(contactData && contactData.remittanceEmail)}
                     name="remittanceEmail"
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
            </Grid>):<></>}
            {((source ==="WebUi"))? (   <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                     error={validation && validation.comemail}
                     helperText={(validation && validation.comemail) || ""}
                     fullWidth={true}
                     autoComplete="off"
                     label={t("componentData.addPayee.comEmail")}
                     variant="outlined"
                     color="secondary"
                     value={(contactData && contactData.communicationEmail)}
                     name="communicationEmail"
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
            </Grid>):<></>}
       
            {/* {((source ==="WebUi")||(isCssfClient===1)) ? (  <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <TextField
                     select
                     fullWidth={true}
                     autoComplete="off"
                     label={t("componentData.addPayee.contactMethod")}
                     variant="outlined"
                     color="secondary"
                     value={(contactData && contactData.contactMethod)||1}
                     name="contactMethod"
                     id="contactMethod"
                     onChange={(e) =>
                       this.setState({
                         contactData: {
                           ...contactData,
                           [e.target.name]: e.target.value,
                         },
                       })
                     }
                   
                   >
                    {contactTypeList.map((list) => (
                        <MenuItem value={list.contactMethodId}>
                          {list.description}
                        </MenuItem>
                      ))}
                    </TextField>
              </Box>
            </Grid>):<></>} */}
            {((source ==="WebUi")||(isCssfClient===1))? (   <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                     error={Boolean(
                      validation.payeeaddress_line1
                    )}
                    helperText={validation.payeeaddress_line1}
                     fullWidth={true}
                     autoComplete="off"
                     label={t(
                      "componentData.addPayee.address_line1"
                    )}
                     variant="outlined"
                     color="secondary"
                     value={(contactData && contactData.addressLine1
                      )}
                     name="addressLine1"
                     onChange={(e) =>
                       this.setState({
                         contactData: {
                           ...contactData,
                           [e.target.name]: e.target.value,
                         },
                       })
                     }
                     inputProps={{ minLength: 1, maxLength: 35 }}
                     required
                />
              </Box>
            </Grid>):<></>}
            {((source ==="WebUi")||(isCssfClient===1))? (   <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                      error={Boolean(
                        validation.payeeaddress_line2
                      )}
                      helperText={validation.payeeaddress_line2}
                     fullWidth={true}
                     autoComplete="off"
                     label={t(
                      "componentData.addPayee.address_line2"
                    )}
                     variant="outlined"
                     color="secondary"
                     value={(contactData && contactData.addressLine2) }
                     name="addressLine2"
                     onChange={(e) =>
                       this.setState({
                         contactData: {
                           ...contactData,
                           [e.target.name]: e.target.value,
                         },
                       })
                     }
                     inputProps={{ minLength: 1, maxLength: 35 }}
                />
              </Box>
            </Grid>):<></>}
            {((source ==="WebUi")||(isCssfClient===1))? (   <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
              <CountryIso
                     error={validation && validation.payeeCountry}
                     helperText={(validation && validation.payeeCountry) || ""}
                     fullWidth={true}
                     autoComplete="off"
                     label={t("componentData.addPayee.Country")}
                     variant="outlined"
                     color="secondary"
                     value={(contactData && contactData.country) || ""}
                     selectedCountry={(contactData && contactData.country) || ""}
                     name="country"
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
                     required
                 
                />
              </Box>
            </Grid>):<></>}
            {((source ==="WebUi")||(isCssfClient===1))? (   <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <StateIso
                     error={validation && validation.payeeState}
                     helperText={(validation && validation.payeeState) || ""}
                     fullWidth={true}
                     autoComplete="off"
                     label={t("componentData.addPayee.state")}
                     variant="outlined"
                     color="secondary"
                     selectedState={(contactData && contactData.state) || ""}
                     selectedCountry={(contactData && contactData.country) || ""}
                     value={(contactData && contactData.state) || ""}
                     InputLabelProps={{
                      shrink: true,
                    }}
                     name="state"
                     onChange={(e) =>
                       this.setState({
                         contactData: {
                           ...contactData,
                           [e.target.name]: e.target.value,
                         },
                       })
                     }
                     required
                  
                />
              </Box>
            </Grid>):<></>}
            {((source ==="WebUi")||(isCssfClient===1))? (   <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <CityIso
                     error={validation && validation.payeeCity}
                     helperText={(validation && validation.payeeCity) || ""}
                    
                     label={t("componentData.addPayee.city")}
                     selectedState={(contactData && contactData.state) || ""}
                                    selectedCountry={(contactData && contactData.country) || ""}
                                    selectedCity={(contactData && contactData.city) || ""}
                     value={(contactData && contactData.city) || ""}
                     name="city"
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
                     required
                    
                />
              </Box>
            </Grid>):<></>}

            {((source ==="WebUi")||(isCssfClient===1))? (   <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                     error={validation && validation.payeeZipcode}
                     helperText={(validation && validation.payeeZipcode) || ""}
                     fullWidth={true}
                     autoComplete="off"
                     label={t("componentData.addPayee.zipCode")}
                     variant="outlined"
                     color="secondary"
                     value={(contactData && contactData.postalCode
                      )}
                     name="postalCode"
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
                />
              </Box>
            </Grid>):<></>}
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
