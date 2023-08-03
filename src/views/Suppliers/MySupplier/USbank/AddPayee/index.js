import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {getUSBankClientPaymentTypes} from "~/redux/actions/USbank/payments"
import {
  Box,
  Grid,
  MenuItem,
  Typography,
  Button,
  InputAdornment,
  CircularProgress,
  Link,
  Paper,
} from "@material-ui/core";
import { AlertDialog } from "~/components/Dialogs";
import DatePicker from "react-datepicker";
import { TextField } from "~/components/Forms";
import CountryPhoneCode from "~/components/Forms/CountryPhoneCode";
import { paymentMethodIds,paymentMethods } from "~/config/paymentMethods";
import { fetchUSBankPrepaidCardData } from "~/redux/actions/USbank/payments";
import {
  createachPayee,
  createzellePayee,
  createcheckPayee,
  createppdPayee,
  createppdcrporatePayee
} from "~/redux/actions/USbank/payee";
import { USbankCSSData } from "~/redux/helpers/USbank/payments";
import { styles } from "./styles";
import MaskedInput from "~/components/MaskedInput";
import MaskInput from "~/components/MaskInput";
import trim from "deep-trim-node";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { CustomDialogrouting } from "~/components/Dialogs";
import StateIso from "~/components/CSC/StateIso";
import CityIso from "~/components/CSC/CityIso";
import CountryIso from "~/components/CSC/CountryIso";
import config from "~/config";
import EventIcon from "@material-ui/icons/Event";
import {
  getUSbankPayeeType,
  getUSbankContactMethod,
  getUSbankAccountMethod,
} from "~/redux/actions/USbank/payee";
import SearchIcon from "~/assets/icons/search.svg";
import RoutingCodeSearch from "~/modules/RoutingCodeResults/USbank/routingCodeSearch";

class addpayeeDetails extends Component {
  state = {
    payee: {
      payeeID: null,
      payeeType: 1,
      payeeaddress_line1: "",
      payeeaddress_Line2: "",
      startDate: null,
      expiryDate: null,
      country: "",
      newUserDetail: null,
      payeeFirstName: null,
      payeeLastName: null,
      countryCode: "",
      contactMethod: "1",
      locationID: null,
      BusinessUnit:null,
      payeecity: "",
      phone: "",
      ext: "",
      payeeCompanyName: "",
      email: "",
      rememail: "",
      comEmail:"",
      paymentMethodId: null,
      CardHolderName: "",
      cardNo: "",
      accountType: null,
      routingCode: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
      tokenType: "",
      tokenValue: "",
      pyeezipcode: "",
      address_line1: "",
      address_Line2: "",
      zipcode: "",
      state: "",
      city: "",
      country: "",
      dateOfBirth: "",
      govLocation: null,
      govExpiredDate: null,
      govIdType: null,
      govIdValue: null,
      employerState: "",
      uniqueId: "",
      SSN: "",
      homePhone: "",
      firstName: null,
      lastName: null,
      prepemail: null,
      mobilePhone: null,
      prepprepaddress_line1: "",
      prepaddress_Line2: "",
      prepzipcode: "",
      prepstate: "",
      prepcity: "",
      prepcountry: "",
      flag: false,
      flagfirst: false,
      flaglasr: false,
      flagmpbile: false,
      flagemail: false,
      reliafocusid: null,
    },
    payeeTypeList: [],
    finalCardDetails: {},
    contactTypeList: [],
    sppList: null,
    paymentTypes: [],
    filteredPaymentMethods:[],
    validation: {},
    error: "",
    variant: "",
    alertMessage: null,
    alertType: null,
    alertMessageCallbackType: null,
    isLoading: false,
    updateProgress: false,
    openSearchModal: false,
  };

  componentDidMount() {
    this.fetchPaymentTypes();
    this.getPayeeTypeList();
    this.getContactTypeList();
    this.getSPPList();
    this.getAccountTypeList();
    this.getPrepaidCardAPIData();
  }
  getSPPList = async () => {
    this.setState({ isLoading: true });
    const clientId = this.props.user.userData.portalProfileId;
    const dataspp = await USbankCSSData(clientId);

    this.setState({
      sppList: dataspp.data.isSppClient,
      isLoading: false,
    });
  };
  getPrepaidCardAPIData = () => {
    const clientId = this.props.user.userData.portalProfileId || null;
    this.setState({
      isLoading: true,
    });
    this.props
      .dispatch(fetchUSBankPrepaidCardData(clientId))
      .then((response) => {
        if (response && response.error) {
          const errorMsg =
            this.props.USBankPayment.storedPrepaidCardData &&
            this.props.USBankPayment.storedPrepaidCardData.error
              ? this.props.USBankPayment.storedPrepaidCardData.error
              : null;
          this.props.setVariant("error");
          this.props.setErrorText(errorMsg);
          this.setState({
            isLoading: false,
          });
          return false;
        } else {
          this.setAPIDataInState();
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
      });
  };
  setAPIDataInState = () => {
    const { payee } = this.state;
    if (
      this.props.USBankPayment.storedPrepaidCardData?.data &&
      !this.props.USBankPayment.storedPrepaidCardData.data.nodata
    ) {
      const { registrationData } =
        this.props.USBankPayment.storedPrepaidCardData?.data;
      if (registrationData?.length) {
        this.setState({
          finalCardDetails: registrationData[0],
        });
        this.setState({
          payee: {
            ...payee,
            reliafocusid: registrationData[0].paymentTypeId,
            govIdType:registrationData[0].govIdValue,
          },
        });
      }
    }
  };
  getPayeeTypeList = () => {
    this.setState({ isLoading: true });
    this.props.dispatch(getUSbankPayeeType()).then((response) => {
      if (!response) {
        this.setState({
          error: response.message,
          variant: "error",
        });
        return false;
      }
      this.setState({
        payeeTypeList: response || [],
        isLoading: false,
      });
    });
  };
  getAccountTypeList = () => {
    this.setState({ isLoading: true });
    this.props.dispatch(getUSbankAccountMethod()).then((response) => {
      if (!response) {
        this.setState({
          error: response.message,
          variant: "error",
        });
        return false;
      }
      this.setState({
        accountTypeList: response || [],
        isLoading: false,
      });
    });
  };
  getContactTypeList = () => {
    this.setState({ isLoading: true });
    this.props.dispatch(getUSbankContactMethod()).then((response) => {
      if (!response) {
        this.setState({
          error: response.message,
          variant: "error",
        });
        return false;
      }
      this.setState({
        contactTypeList: response || [],
        isLoading: false,
      });
    });
  };
  fetchPaymentTypes = () => {
    this.setState({ isLoading: true });
    const { dispatch } = this.props;
    
    const clientId = this.props?.userInfo?.portalProfileId;
    dispatch(getUSBankClientPaymentTypes(clientId)).then((response) => {
      if (!response) {
        return false;
      }
      const paymentTypes =
      // response.rows2.length &&
      response.map(
          ({ paymentTypeId, paymentCode, b2cDescription, isB2b, isB2c }) => {
            return {
              label: paymentCode,
              key: paymentTypeId,
              icon: paymentTypeId,
              description: b2cDescription,
              selected: false,
              isB2b: isB2b,
              isB2c: isB2c,
            };
          }
        );
      
     let indexDDC = paymentTypes.findIndex(item => item.label===paymentMethods["USBankDepositToDebitcard"]);
     if (indexDDC > -1) {
     paymentTypes.splice(indexDDC,1);}
   
      this.setState({
        paymentTypes,
        filteredPaymentMethods:paymentTypes,
        isLoading: false,
      });
    });
  };

  handleChange = (name, e) => {
    const { payee } = this.state;
    const { value } = e.target;
    let finalValue = "";

    switch (name) {
      // case "payeeID":
      //   finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
      //   break;
      case "zipcode":
      case "pyeezipcode":
      case "ppdzipcode":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;

      case "homePhone":
      case "mobliePhone":
      case "phone":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;

      case "ext":
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
      case "SSN":
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
      payee: {
        ...payee,
        [name]: finalValue,
      },
    });
  };
  handletokenChange = (name, e) => {
    const { payee } = this.state;
    const { value } = e.target;
    let finalValue = "";

    if (payee.tokenType === 2) {
      finalValue = value.replace(/[^0-9-]/g, "");
    } else {
      finalValue = value;
    }

    this.setState({
      payee: {
        ...payee,
        [name]: finalValue,
      },
    });
  };
  handletokentypeChange = (name, e) => {
    const { payee } = this.state;
    const { value } = e.target;
    this.setState({
      payee: {
        ...payee,
        tokenType: value,
        tokenValue:
        !payee.tokenValue? value === 1 ? payee.email : value === 2 ? payee.phone : null:payee.tokenValue,
      },
    });
  };
  handlePayeetypeChange=(e)=>{
    const { payee } = this.state;
    const { value } = e.target;
    this.setState({
      payee: {
        ...payee,
        payeeType: value,
        paymentMethodId: null,
      },
    });  
  }
  handleDOBActivatedAt = (date) => {
    const { payee } = this.state;
    this.setState({
      payee: {
        ...payee,
        startDate: date,
      },
    });
  };
  handleexpiryActivatedAt = (date) => {
    const { payee } = this.state;
    this.setState({
      payee: {
        ...payee,
        govExpiredDate: date,
      },
    });
  };

  selectBankDetails = (bankData) => {
    this.setState({
      payee: {
        ...this.state.payee,
        bankName: bankData.bankName || "",
        routingCode: bankData.routingCode,
      },
    });
  };

  handleDialogClose = () => {
    this.setState({
      openSearchModal: false,
    });
  };
  validateForm = () => {
    let valid = true;
    let errorText = {};
    const { payee, sppList, finalCardDetails } = this.state;
    const {
      payeeType,
      reliafocusid,
      payeeCompanyName,
      payeeLastName,
      payeeFirstName,
      firstName,
      lastName,
      payeeID,
      routingCode,
      accountNumber,
      confirmAccountNumber,
      accountType,
      govLocation,
      tokenType,
      tokenValue,
      address_line1,
      payeeaddress_line1,
      paymentMethodId,
      payeeaddress_line2,
      uniqueId,
      state,
      payeestate,
      city,
      payeecity,
      zipcode,
      ppdzipcode,
      pyeezipcode,
      phone,
      bankName,
      email,
      remEmail,
      comEmail,
      prepemail,
      SSN,
      startDate,
      govExpiredDate,
      contactMethod,
      govIdValue,
      homePhone,
      mobilePhone,
      employerState,
      ppdaddress_line1,
      ppdaddress_line2,
      ppdcountry,
      ppdstate,
      ppdcity,
      country,
      payeecountry,
      locationID,
    } = payee;
    const { t } = this.props;
    if (
      payeeType === null ||
      (payeeType !== null && payeeType.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["payeeType"] = t("componentData.addPayee.error.PayeeType");
    }
    if (
      (paymentMethodId === paymentMethodIds["ACH"] ||
        paymentMethodId === paymentMethodIds["USBankRTP"]) &&
      (accountType === null ||
        (accountType !== null && accountType.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["accountType"] = t("componentData.addPayee.error.accountType");
    }
    if ((sppList === 1||payeeType === 2) &&
      (payeeCompanyName === null ||
        (payeeCompanyName !== null &&
          payeeCompanyName.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["payeeCompanyName"] = t(
        "componentData.addPayee.error.PayeeCompanyName"
      );
    }
    if (
      paymentMethodId === null ||
      (paymentMethodId !== null &&
        paymentMethodId.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["PaymentMethod"] = t(
        "componentData.addPayee.error.PaymentMethod"
      );
    }
    if (
      payeeType === 1 &&
      (payeeLastName === null ||
        (payeeLastName !== null &&
          payeeLastName.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["payeeLastName"] = t(
        "componentData.addPayee.error.PayeeLastName"
      );
    }
    if (
     (paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
        paymentMethodId === paymentMethodIds["PrepaidReliaCard"] || paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
        paymentMethodId === paymentMethodIds["DigitalCorporateCard"])
 &&
 (finalCardDetails.isName||
  paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
     paymentMethodId === paymentMethodIds["DigitalCorporateCard"])
     &&
      (lastName === null ||
        (lastName !== null && lastName.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["lastName"] = t("componentData.addPayee.error.LastName");
    }
    if (
      payeeType === 1 &&
      (payeeFirstName === null ||
        (payeeFirstName !== null &&
          payeeFirstName.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["payeeFirstName"] = t(
        "componentData.addPayee.error.PayeeFirstName"
      );
    }
    if (
      (paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
        paymentMethodId === paymentMethodIds["PrepaidReliaCard"] || paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
        paymentMethodId === paymentMethodIds["DigitalCorporateCard"]||
          null) &&
          (finalCardDetails.isAddress||
            paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
               paymentMethodId === paymentMethodIds["DigitalCorporateCard"])&&
      (firstName === null ||
        (firstName !== null && firstName.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["firstName"] = t("componentData.addPayee.error.FirstName");
    }
    if (
      payeeID === null ||
      (payeeID !== null && payeeID.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["payeeID"] = t("componentData.addPayee.error.PayeeID");
    }
    if (!(sppList===1 && (Number(contactMethod)===1||Number(contactMethod)===3)) && (!phone || phone.toString().trim() === "")) {
      errorText["phone"] = t("componentData.addPayee.error.emptyPhoneNumber");
      valid = false;
    }

    if (!(sppList===1 && (Number(contactMethod)===1||Number(contactMethod)===3)) && (phone && phone.toString().trim().length !== 10)) {
      errorText["phone"] = t("componentData.addPayee.error.validPhoneNumber");
      valid = false;
    }
    if (
      tokenType === 2 &&
      (!tokenValue || tokenValue.toString().trim() === "")
    ) {
      errorText["tokenValue"] = t(
        "componentData.addPayee.error.emptyPhoneNumber"
      );
      valid = false;
    }

    if (
      tokenType === 2 &&
      tokenValue &&
      tokenValue.toString().trim().length !== 10
    ) {
      errorText["tokenValue"] = t(
        "componentData.addPayee.error.validPhoneNumber"
      );
      valid = false;
    }
    // if (paymentMethodId === paymentMethodFileFormatIds["USBankZelle"]&&!email || email.trim() === "") {
    //   errorText["email"] = t("componentData.addPayee.error.emailIdRequired");
    //   valid = false;
    // }

    if (!email || email.trim() === "") {
      errorText["email"] = t("componentData.addPayee.error.emailIdRequired");
      valid = false;
    }
    if (tokenType === 1 && (!tokenValue || tokenValue.trim() === "")) {
      errorText["tokenValue"] = t(
        "componentData.addPayee.error.emailIdRequired"
      );
      valid = false;
    }

    
    if (sppList === 1 && remEmail && remEmail.trim().length > 0) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(remEmail.trim().toLowerCase())) {
        errorText["rememail"] = t("componentData.addPayee.error.validEmailId");
        valid = false;
      }
    }
    if ( comEmail && comEmail.trim().length > 0) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(comEmail.trim().toLowerCase())) {
        errorText["comEmail"] = t("componentData.addPayee.error.validEmailId");
        valid = false;
      }
    }
    if (
     
        (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
        paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
        paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
        paymentMethodId === paymentMethodIds["DigitalCorporateCard"]||
          null) &&
      (!prepemail || prepemail.trim() === "")
    ) {
      errorText["prepemail"] = t(
        "componentData.addPayee.error.emailIdRequired"
      );
      valid = false;
    }
    if (
      (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
      paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]||
        null)
        &&
      prepemail &&
      prepemail.trim().length > 0
    ) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (
        (paymentMethodIds["USBankPrepaidCard"] ||
          paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
          paymentMethodId === paymentMethodIds["PrepaidReliaCard"] ||
          paymentMethodId === paymentMethodIds["PlasticCorporateCard"] ||
          paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
          (finalCardDetails.isEmail||
            paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
               paymentMethodId === paymentMethodIds["DigitalCorporateCard"])	&&
        !re.test(prepemail.trim().toLowerCase())
      ) {
        errorText["prepemail"] = t("componentData.addPayee.error.validEmailId");
        valid = false;
      }
    }
    if (email && email.trim().length > 0) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email.trim().toLowerCase())) {
        errorText["email"] = t("componentData.addPayee.error.validEmailId");
        valid = false;
      }
    }
    if (tokenType === 1 && tokenValue && tokenValue.trim().length > 0) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(tokenValue.trim().toLowerCase())) {
        errorText["tokenValue"] = t(
          "componentData.addPayee.error.validEmailId"
        );
        valid = false;
      }
    }
    if (
      (paymentMethodId === paymentMethodIds["ACH"] ||
        paymentMethodId === paymentMethodIds["USBankRTP"]) &&
      (routingCode === null ||
        (routingCode !== null && routingCode.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["routingCode"] = t("componentData.addAccountForm.RoutingCode");
    }
    if (
      (paymentMethodId === paymentMethodIds["ACH"] ||
        paymentMethodId === paymentMethodIds["USBankRTP"]) &&
      routingCode &&
      routingCode.length !== 9
    ) {
      errorText["routingCode"] = t(
        "componentData.addAccountForm.RoutingCodeLen"
      );
      valid = false;
    }
    if (
      (paymentMethodId === paymentMethodIds["ACH"] ||
        paymentMethodId === paymentMethodIds["USBankRTP"]) &&
      (!accountNumber || accountNumber.length === 0)
    ) {
     
      valid = false;
      errorText["accountNumber"] = t(
        "componentData.addAccountForm.AccountNumberRequired"
      );
    }
    if (
      (paymentMethodId === paymentMethodIds["ACH"] ||
        paymentMethodId === paymentMethodIds["USBankRTP"]) &&
      (!confirmAccountNumber || confirmAccountNumber.length === 0)
    ) {
     
      valid = false;
      errorText["confirmAccountNumber"] = t(
        "componentData.addPayee.error.confirmAccountNumberReq"
      );
    }
    if (
      confirmAccountNumber &&
      accountNumber &&
      confirmAccountNumber !== accountNumber
    ) {
      errorText["confirmAccountNumber"] = t(
        'componentData.addPayee.error.confirmAccountNumber'
      );
      valid = false;
    }
    if (
      (paymentMethodId === paymentMethodIds["ACH"] ||
        paymentMethodId === paymentMethodIds["USBankRTP"]) &&
      accountNumber &&
      accountNumber.length > 17
    ) {
      errorText["accountNumber"] = t(
        "componentData.addAccountForm.accountNumLen"
      );
      valid = false;
    }

    if (
      (paymentMethodId === paymentMethodIds["ACH"] ||
        paymentMethodId === paymentMethodIds["USBankRTP"]) &&
      accountNumber &&
      accountNumber.length < 6
    ) {
      errorText["accountNumber"] = t(
        "componentData.addAccountForm.accountNumMinLen"
      );
      valid = false;
    }
    if (
      (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
      paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
      finalCardDetails.isEmployeeState &&
      (employerState === null ||
        (employerState !== null &&
          employerState.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["employerState"] = t(
        "componentData.addPayee.error.employerState"
      );
    }else if (finalCardDetails.isEmployeeState &&employerState.toString().trim().length < 2) {
      valid = false;
      errorText["employerState"] = t(
        "componentData.addPayee.error.employerStatemin"
      );
    }

    if (
      (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
      paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
      finalCardDetails.isGovLocation &&
      (govLocation === null ||
        (govLocation !== null && govLocation.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["govLocation"] = t("componentData.addPayee.error.govLocation");
    }
    if (
      (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
      paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
      finalCardDetails.isUniqueId &&
      (uniqueId === null ||
        (uniqueId !== null && uniqueId.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["uniqueId"] = t("componentData.addPayee.error.uniqueId");
    }
    if (
      (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
      paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"])&&
      finalCardDetails.isSsn &&
      (SSN === null || (SSN !== null && SSN.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["SSN"] = t("componentData.addPayee.error.SSN");
    }
    if (
      (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
      paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
      finalCardDetails.isDateOfBirth &&
      startDate === null
    ) {
      valid = false;
      errorText["dateOfBirth"] = t("componentData.addPayee.error.dateOfBirth");
    }
    if (
      (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
      paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
      finalCardDetails.govIdTypeId &&
      govExpiredDate === null
    ) {
      valid = false;
      errorText["govExpiredDate"] = t(
        "componentData.addPayee.error.govExpiredDate"
      );
    }
    if (
      (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
      paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
        (finalCardDetails.isAddress||paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"])  &&
      (!ppdaddress_line1 || !ppdaddress_line1.trim().length)
    ) {
      valid = false;
      errorText["ppdaddress_line1"] = t(
        "componentData.addPayee.error.address_line1"
      );
    }
    // if (
    //   (paymentMethodId===paymentMethodIds["PrepaidFocusNonPayroll"] ||
    //   paymentMethodId===paymentMethodIds["PrepaidReliaCard"] ||
    //   paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
    //   paymentMethodId === paymentMethodIds["DigitalCorporateCard"]||
    //     null) &&
    //   (finalCardDetails.isAddress||paymentMethodId === paymentMethodIds["PlasticCorporateCard"]||
    //   paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
    //   (!ppdaddress_line2 || !ppdaddress_line2.trim().length)
    // ) {
    //   valid = false;
    //   errorText["ppdaddress_line2"] = t(
    //     "componentData.addPayee.error.address_line2"
    //   );
    // }
    if (
      paymentMethodId === paymentMethodIds["USBankCHK"] &&
      (!address_line1 || !address_line1.trim().length)
    ) {
      valid = false;
      errorText["address_line1"] = t(
        "componentData.addPayee.error.address_line1"
      );
    }
    if (
      sppList === 1 &&
      (!payeeaddress_line1 || !payeeaddress_line1.trim().length)
    ) {
      valid = false;
      errorText["payeeaddress_line1"] = t(
        "componentData.addPayee.error.address_line1"
      );
    }
    // if (
    //   sppList === 1 &&
    //   (!payeeaddress_line2 || !payeeaddress_line2.trim().length)
    // ) {
    //   valid = false;
    //   errorText["payeeaddress_line2"] = t(
    //     "componentData.addPayee.error.address_line2"
    //   );
    // }
    // if (
    //   paymentMethodId === paymentMethodIds["USBankCHK"] &&
    //   (!address_line2 || !address_line2.trim().length)
    // ) {
    //   valid = false;
    //   errorText["address_line2"] = t(
    //     "componentData.addPayee.error.address_line2"
    //   );
    // }
   
    if (
      paymentMethodId === paymentMethodIds["USBankCHK"] &&
      (!country || !country.trim().length)
    ) {
      valid = false;
      errorText["country"] = t("componentData.addPayee.error.country");
    }
    if (
      paymentMethodId === paymentMethodIds["USBankCHK"] &&
      (!state || !state.trim().length)
    ) {
      valid = false;
      errorText["state"] = t("componentData.addPayee.error.state");
    }
    if (
      sppList === 1 &&
      (!payeecountry || !payeecountry.trim().length)
    ) {
      valid = false;
      errorText["payeecountry"] = t("componentData.addPayee.error.country");
    }
    // if (
    //  sppList===0 &&
    //   (!locationID )
    // ) {
    //   valid = false;
    //   errorText["locationID"] = t("componentData.addPayee.error.locationID");
    // }
    if (
      sppList === 1 &&
      (!payeestate || !payeestate.trim().length)
    ) {
      valid = false;
      errorText["payeestate"] = t("componentData.addPayee.error.state");
    }
    if (
      (paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId === paymentMethodIds["PrepaidReliaCard"] || paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]||
        null) &&
        (finalCardDetails.isAddress||
          paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
             paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
      (!ppdcountry || !ppdcountry.trim().length)
    ) {
      valid = false;
      errorText["ppdcountry"] = t("componentData.addPayee.error.country");
    }
    if (
      (paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId === paymentMethodIds["PrepaidReliaCard"] || paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]||
        null) &&
        (finalCardDetails.isAddress||
          paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
             paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
      (!ppdstate || !ppdstate.trim().length)
    ) {
      valid = false;
      errorText["ppdstate"] = t("componentData.addPayee.error.state");
    }
  
    if (
      paymentMethodId === paymentMethodIds["USBankCHK"] &&
      (!city || !city.trim().length)
    ) {
      valid = false;
      errorText["city"] = t("componentData.addPayee.error.city");
    }
    if (
      sppList === 1&&
      (!payeecity || !payeecity.trim().length)
    ) {
      valid = false;
      errorText["payeecity"] = t("componentData.addPayee.error.city");
    }
    if (
      (paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId === paymentMethodIds["PrepaidReliaCard"] || paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
      paymentMethodId === paymentMethodIds["DigitalCorporateCard"]||
        null)
      &&
      (finalCardDetails.isAddress||
        paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
           paymentMethodId === paymentMethodIds["DigitalCorporateCard"]) &&
      (!ppdcity || !ppdcity.trim().length)
    ) {
      valid = false;
      errorText["ppdcity"] = t("componentData.addPayee.error.city");
    }
    if (
      (sppList === 1 && (!pyeezipcode || !pyeezipcode.trim().length))
    ) {
      valid = false;
      errorText["pyeezipcode"] = t("componentData.addPayee.error.zipcode");
    }
    if (
      paymentMethodId === paymentMethodIds["USBankCHK"] &&
      (!zipcode || !zipcode.trim().length)
    ) {
      valid = false;
      errorText["zipcode"] = t("componentData.addPayee.error.zipcode");
    }
    if (
     
        (paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
        paymentMethodId === paymentMethodIds["PrepaidReliaCard"] || paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
        paymentMethodId === paymentMethodIds["DigitalCorporateCard"]||
          null) &&
      (finalCardDetails.isAddress||
     paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
        paymentMethodId === paymentMethodIds["DigitalCorporateCard"])
      &&
      (!ppdzipcode || !ppdzipcode.trim().length)
    ) {
      valid = false;
      errorText["ppdzipcode"] = t("componentData.addPayee.error.zipcode");
    }
  
    if (
      (paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
      paymentMethodId === paymentMethodIds["PrepaidReliaCard"] ) &&
      finalCardDetails.govIdTypeId &&
      govIdValue === null
    ) {
      valid = false;
      errorText["govIdValue"] = t("componentData.addPayee.error.govIdValue");
    }
    if (
      paymentMethodId === paymentMethodIds["USBankZelle"] &&
      (SSN === null ||
        (tokenType !== null && tokenType.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["tokenType"] = t("componentData.addPayee.error.tokenType");
    }
    if (
      paymentMethodId === paymentMethodIds["USBankZelle"] &&
      (!tokenValue || !tokenValue.trim().length)
    ) {
      valid = false;
      errorText["tokenValue"] = t("componentData.addPayee.error.tokenValue");
    }
    if (
     
        (paymentMethodId ===paymentMethodIds["PrepaidFocusNonPayroll"] ||
        paymentMethodId === paymentMethodIds["PrepaidReliaCard"] ||
          null) &&
      finalCardDetails.isHomePhone &&
      (!homePhone || !homePhone?.trim()?.length)
    ) {
      valid = false;
      errorText["homePhone"] = t("componentData.addPayee.error.homePhone");
    } else if (
        (paymentMethodId ===paymentMethodIds["PrepaidFocusNonPayroll"] ||
        paymentMethodId ===paymentMethodIds["PrepaidReliaCard"] ||
          null) &&
      finalCardDetails.isHomePhone &&
      homePhone.toString().trim().length !== 10
    ) {
      valid = false;
      errorText["homePhone"] = t("componentData.addPayee.error.phoneLength");
    }
    if (
        ( paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
        paymentMethodId ===paymentMethodIds["PrepaidReliaCard"] ||
          null) &&
      finalCardDetails.isMobilePhone &&
      (!mobilePhone || !mobilePhone?.trim()?.length)
    ) {
      valid = false;
      errorText["mobilePhone"] = t("componentData.addPayee.error.mobilePhone");
    } else if (
      (paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
        paymentMethodId === paymentMethodIds["PrepaidReliaCard"] )&&
      finalCardDetails.isMobilePhone &&
      mobilePhone.toString().trim().length !== 10
    ) {
      valid = false;
      errorText["mobilePhone"] = t(
        "componentData.addPayee.error.validmobilePhoneNumber"
      );
    }
    // if (expiryDate === null) {
    //   alert('46')
    //   valid = false;
    //   errorText["expiryDate"] = t(
    //     "componentData.addPayee.error.expiryDateRequired"
    //   );
    // }
    // if (expiryDate !== null && expiryDate._d.toString() === "Invalid Date") {
    //   alert('47')
    //   valid = false;
    //   errorText["expiryDate"] = t(
    //     "componentData.addPayee.error.invalidCardExpiry"
    //   );
    // }
    // if (
    //   CardHolderName === null ||
    //   (CardHolderName !== null && CardHolderName.toString().trim().length === 0)
    // ) {
    //   valid = false;
    //   errorText["name"] = t("componentData.addPayee.error.CardHolderName");
    // }
    // if (
    //   cardNo === null ||
    //   (cardNo !== null && cardNo.toString().trim().length < 11)
    // ) {
    //   valid = false;
    //   errorText["cardNo"] = t("componentData.addPayee.error.cardNo");
    // } else if (
    //   cardNo &&
    //   !cardNo.toString().startsWith(4) &&
    //   !cardNo.toString().startsWith(5)
    // ) {
    //   valid = false;
    //   errorText["cardNo"] = t("componentData.addPayee.error.cardNumber");
    // }
    // if (expiryDate === null) {
    //   alert('48')
    //   valid = false;
    //   errorText["expiryDate"] = t(
    //     "componentData.addPayee.error.cardExpiryDate"
    //   );
    // }
    // if (expiryDate !== null && expiryDate._d.toString() === "Invalid Date") {
    //   alert('49')
    //   valid = false;
    //   errorText["expiryDate"] = t(
    //     "componentData.addPayee.error.invalidCardExpiry"
    //   );
    // }
    if (
      (paymentMethodId === paymentMethodIds["ACH"] ||
        paymentMethodId === paymentMethodIds["USBankRTP"]) &&
      (!bankName || !bankName.trim().length)
    ) {
      errorText["bankName"] = t("componentData.addPayee.error.bankName");
      valid = false;
    } else if (bankName.trim().length > 158) {
      errorText["bankName"] = t("componentData.addPayee.error.bankNameLength");
      valid = false;
    }
    this.setState({
      validation: { ...errorText },
    });

    return valid;
  };

  handleDateChange = (date) => {
    const { t } = this.props;
    const { payee } = this.state;
    this.setState({
      payee: {
        ...payee,
        expiryDate: date,
      },
    });
  };

  onChangeMethod = (e) => {
    const { payee } = this.state;
    this.setState({
      payee: {
        ...payee,
        paymentMethodId: e.target.value,
        bankName: "",
        routingCode: "",
        startDate: null,
        expiryDate: null,
        country: "",
        rememail: "",
        CardHolderName: "",
        cardNo: "",
        accountType: null,
        accountNumber: "",
        confirmAccountNumber: "",
        tokenType: "",
        tokenValue: null,

        address_line1: "",
        address_Line2: "",
        zipcode: "",
        state: "",
        city: "",
        dateOfBirth: "",
        govLocation: null,
        govExpiredDate: null,
        govIdType: null,
        govIdValue: null,
        employerState: "",
        uniqueId: "",
        SSN: "",
        homePhone: "",
        firstName:
          (e.target.value === paymentMethodIds["PrepaidFocusNonPayroll"]
          ||e.target.value === paymentMethodIds["PrepaidReliaCard"]
          ||e.target.value === paymentMethodIds["PlasticCorporateCard"]
          ||e.target.value === paymentMethodIds["DigitalCorporateCard"])
            ? payee.payeeFirstName
            : null,
        lastName:
        (e.target.value === paymentMethodIds["PrepaidFocusNonPayroll"]
        ||e.target.value === paymentMethodIds["PrepaidReliaCard"]
        ||e.target.value === paymentMethodIds["PlasticCorporateCard"]
        ||e.target.value === paymentMethodIds["DigitalCorporateCard"])
            ? payee.payeeLastName
            : null,
        prepemail:
        (e.target.value === paymentMethodIds["PrepaidFocusNonPayroll"]
        ||e.target.value === paymentMethodIds["PrepaidReliaCard"]
        ||e.target.value === paymentMethodIds["PlasticCorporateCard"]
        ||e.target.value === paymentMethodIds["DigitalCorporateCard"])
            ? payee.email
            : null,
        mobilePhone:
        (e.target.value === paymentMethodIds["PrepaidFocusNonPayroll"]
        ||e.target.value === paymentMethodIds["PrepaidReliaCard"]
        ||e.target.value === paymentMethodIds["PlasticCorporateCard"]
        ||e.target.value === paymentMethodIds["DigitalCorporateCard"])
            ? payee.phone
            : null,
        prepprepaddress_line1: "",
        prepaddress_Line2: "",
        prepzipcode: "",
        prepstate: "",
        prepcity: "",
        prepcountry: "",
      },
    });
    this.setState({
      validation: {},
    });
    // this.setState({
    //   user: {
    //     ...this.state.user,
    //     bankName: "",
    //     routingCode: "",
    //   },
    // });
  };
  onAccountMethod = (e) => {
    const { payee } = this.state;
    this.setState({
      payee: {
        ...payee,
        accountType: e.target.value,
      },
    });
  };
  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };
  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
    this.props.history.push(`${config.baseName}/suppliers/mySupplier`);
  };
  payeeAdded = (res) => {
    const { t } = this.props;
    if (!res) {
      this.setState({
        alertMessage: this.props.Payee.error,
        alertMessageCallbackType: null,
        alertType: "error",
        updateProgress: false,
      });
      return false;
    }
    this.setState({
      updateProgress: false,
      alertMessage: t("componentData.addPayee.PayeeAdded"),
      alertMessageCallbackType: "REDIRECT",
      alertType: "success",
    });
  };
  createPayeemethod = (paymentMethodId, clientId, payee,finalCardDetails) => {
    switch (paymentMethodId) {
      case paymentMethodIds["ACH"]:
      case paymentMethodIds["USBankRTP"]:
        this.props
          .dispatch(
            createachPayee({
              clientId: clientId,
              payee: trim(payee),
            })
          )
          .then((response) => {
            this.payeeAdded(response);
          });
        break;
      case paymentMethodIds["USBankZelle"]:
        this.props
          .dispatch(
            createzellePayee({
              clientId: clientId,
              payee: trim(payee),
            })
          )
          .then((response) => {
            this.payeeAdded(response);
          });
        break;

      case paymentMethodIds["USBankCHK"]:
        this.props
          .dispatch(
            createcheckPayee({
              clientId: clientId,
              payee: trim(payee),
            })
          )
          .then((response) => {
            this.payeeAdded(response);
          });
        break;
      case paymentMethodIds["PrepaidFocusNonPayroll"]:
      case paymentMethodIds["PrepaidReliaCard"]:
        this.props
          .dispatch(
            createppdPayee({
              clientId: clientId,
              payee: trim(payee),
              finalCardDetails: finalCardDetails
            })
          )
          .then((response) => {
            this.payeeAdded(response);
          });
        break;
        case paymentMethodIds["PlasticCorporateCard"]:
          case paymentMethodIds["DigitalCorporateCard"]:
            this.props
              .dispatch(
                createppdcrporatePayee({
                  clientId: clientId,
                  payee: trim(payee),
                })
              )
              .then((response) => {
                this.payeeAdded(response);
              });
            break;

      default:
        break;
    }
  };

  onSubmit = async () => {
    const { t } = this.props;
    let { payee ,finalCardDetails} = this.state;
    const clientId = this.props?.userInfo?.portalProfileId;
    const valid = this.validateForm();
    if (!valid) {
      return false;
    }
    this.setState(
      {
        updateProgress: true,
      },
      () => {
        this.createPayeemethod(payee.paymentMethodId, clientId, payee,finalCardDetails);
      }
    );
  };

  render() {
    const { classes, t } = this.props;
    const {
      payee,
      validation,
      payeeTypeList,
      contactTypeList,
      paymentTypes,
      filteredPaymentMethods,
      alertMessage,
      alertMessageCallbackType,
      finalCardDetails,
      isLoading,
      updateProgress,
      sppList,
      accountTypeList,
    } = this.state;
    const {
      payeeID,
      payeeFirstName,
      payeeType,
      payeeLastName,
      paymentMethodId,
      accountNumber,
      confirmAccountNumber,
      contactMethod,
      locationID,
      BusinessUnit,
      routingCode,
      bankName,
      uniqueId,
      employerState,
      govLocation,
      countryCode,
      phone,
      email,
      remEmail,
      comEmail,
      payeeCompanyName,
      startDate,
      ext,
      SSN,
      address_line1,
      address_line2,
      ppdaddress_line1,
      ppdaddress_line2,
      payeeaddress_line1,
      payeeaddress_line2,
      tokenType,
      tokenValue,
      country,
      ppdcountry,
      payeecountry,
      govExpiredDate,
      state,
      city,
      ppdstate,
      ppdcity,
      payeestate,
      payeecity,
      homePhone,
      govIdValue,
      zipcode,
      ppdzipcode,
      Pyeezipcode,
      accountType,
      firstName,
      lastName,
      prepemail,
      mobilePhone,
    } = payee;
    if (isLoading) {
      return (
        <Box justifyContent="center" display="flex" pt={3} alignSelf="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return (
      <Box px={6} my={4}>
        <>
          <Grid container md={12} xs={12} className={classes.root}>
            <Paper className={classes.paper}>
              <Grid container item xs={12} md={12} className={classes.gridItem}>
                <Box className={classes.contentBackground}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={12}>
                      <Box color="primary.text.main">
                        <h3 className={classes.settingHeading}>
                          {t("componentData.addPayee.PayeeDetails")}
                        </h3>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={12}>
                      <Grid container spacing={4}>
                        <Grid item xs={6} sm={6}>
                          <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                              <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="payeeID"
                                autoFocus={true}
                                label={t("componentData.addPayee.payeeID")}
                                variant="outlined"
                                value={payeeID}
                                inputProps={{ maxLength: 35 }}
                                onChange={(e) =>
                                  this.handleChange("payeeID", e)
                                }
                                error={validation.payeeID}
                                helperText={validation.payeeID}
                                required
                                //   disabled={disableEdit}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                              <TextField
                                select
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="payeeType"
                                label={t("componentData.addPayee.payeeType")}
                                error={validation.payeeType}
                                helperText={validation.payeeType}
                                variant="outlined"
                                onChange={(e) =>
                                  this.handlePayeetypeChange(e)
                                }
                                value={payeeType}
                                required
                              >
                                {payeeTypeList.map((list) => (
                                  <MenuItem value={list.payeeTypeId}>
                                    {list.description}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={4}>
                        <Grid item xs={6} sm={6}>
                          <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                              <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="PayeeFirstName"
                                autoFocus={true}
                                label={t(
                                  "componentData.addPayee.payeeFirstName"
                                )}
                                variant="outlined"
                                value={payeeFirstName}
                                inputProps={{
                                  maxLength: 35,
                                }}
                                onChange={(e) =>
                                  this.handleChange("payeeFirstName", e)
                                }
                                onBlur={(e) => {
                                  if (
                                    payee.flagfirst === false &&
                                    e.target.value
                                  ) {
                                    this.setState({
                                      payee: {
                                        ...payee,
                                        firstName: e.target.value,
                                        flagfirst: true,
                                      },
                                    });
                                  }
                                }}
                                error={validation.payeeFirstName}
                                helperText={validation.payeeFirstName}
                                required={payeeType === 1 ? true : false}
                                //   disabled={disableEdit}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                              <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="PayeeLastName"
                                autoFocus={true}
                                label={t(
                                  "componentData.addPayee.payeeLastName"
                                )}
                                variant="outlined"
                                value={payeeLastName}
                                inputProps={{
                                  maxLength: 35,
                                }}
                                onChange={(e) =>
                                  this.handleChange("payeeLastName", e)
                                }
                                onBlur={(e) => {
                                  if (
                                    payee.flaglasr === false &&
                                    e.target.value
                                  ) {
                                    this.setState({
                                      payee: {
                                        ...payee,
                                        lastName: e.target.value,
                                        flaglasr: true,
                                      },
                                    });
                                  }
                                }}
                                error={validation.payeeLastName}
                                helperText={validation.payeeLastName}
                                required={payeeType === 1 ? true : false}
                                //   disabled={disableEdit}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={4}>
                        <Grid item xs={6} sm={6}>
                          <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                              <TextField
                                error={validation.email}
                                helperText={validation.email}
                                fullWidth={true}
                                autoComplete="off"
                                autoFocus={true}
                                value={email || ""}
                                name="Email"
                                onBlur={(e) => {
                                  if (
                                    payee.flagemail === false &&
                                    e.target.value
                                  ) {
                                    this.setState({
                                      payee: {
                                        ...payee,
                                        prepemail: e.target.value,
                                        // tokenValue:tokenType===1?e.target.value:tokenValue,
                                        flagemail: true,
                                      },
                                    });
                                  }
                                }}
                                onChange={(e) => {
                                  this.setState({
                                    payee: {
                                      ...payee,
                                      email: e.target.value,
                                    },
                                  });
                                  //  if (!tokenValue || !tokenValue.trim().length){
                                  //   this.setState({
                                  //     payee: {
                                  //       ...payee,
                                  //       "tokenValue": e.target.value,
                                  //     },
                                  //   })
                                  //  }
                                }}
                                // onChange={(e) => this.handleChange("email", e)}
                                // onKeyUp={()=>resetRecaptcha()}

                                variant="outlined"
                                inputProps={{
                                  maxLength: 48,
                                }}
                                label={t("componentData.addPayee.email")}
                                required
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                              <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="PayeeCompanyName"
                                autoFocus={true}
                                label={t(
                                  "componentData.addPayee.payeeCompanyName"
                                )}
                                variant="outlined"
                                value={payeeCompanyName}
                                inputProps={{ maxLength: 50 }}
                                onChange={(e) =>
                                  this.handleChange("payeeCompanyName", e)
                                }
                                error={validation.payeeCompanyName}
                                helperText={validation.payeeCompanyName}
                                required={sppList === 1?true:payeeType === 2?true:false}
                                //   disabled={disableEdit}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      {sppList === 1 ? (
                        <>
                          <Grid container spacing={4}>
                            <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12}>
                                  <TextField
                                    fullWidth={true}
                                    autoComplete="off"
                                    autoFocus={true}
                                    value={remEmail || ""}
                                    name="remEmail"
                                    onChange={(e) =>
                                      this.handleChange("remEmail", e)
                                    }
                                    // onKeyUp={()=>resetRecaptcha()}

                                    variant="outlined"
                                    inputProps={{
                                      maxLength: 50,
                                    }}
                                    label={t("componentData.addPayee.rememail")}
                                    error={Boolean(validation.rememail)}
                                    helperText={validation.rememail}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12}>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="locationID"
                                    autoFocus={true}
                                    label={t(
                                      "componentData.addPayee.locationID"
                                    )}
                                    variant="outlined"
                                    value={locationID}
                                    inputProps={{ maxLength: 8 }}
                                    onChange={(e) =>
                                      this.handleChange("locationID", e)
                                    }
                                    error={Boolean(validation.locationID)}
                                    helperText={validation.locationID}
                                    required={sppList===1?false:true}
                                    //   disabled={disableEdit}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={4}>
                            <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12}>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    autoFocus={true}
                                    variant="outlined"
                                    label={t(
                                      "componentData.addPayee.address_line1"
                                    )}
                                    error={Boolean(
                                      validation.payeeaddress_line1
                                    )}
                                    helperText={validation.payeeaddress_line1}
                                    name="payeeaddress_line1"
                                    onChange={(e) =>
                                      this.handleChange("payeeaddress_line1", e)
                                    }
                                    inputProps={{ minLength: 1, maxLength: 35 }}
                                    value={payeeaddress_line1}
                                    required={sppList === 1?true:false}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12}>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    autoFocus={true}
                                    variant="outlined"
                                    label={t(
                                      "componentData.addPayee.address_line2"
                                    )}
                                    error={Boolean(
                                      validation.payeeaddress_line2
                                    )}
                                    helperText={validation.payeeaddress_line2}
                                    name="payeeaddress_line2"
                                    onChange={(e) =>
                                      this.handleChange("payeeaddress_line2", e)
                                    }
                                    inputProps={{ maxLength: 35, minLength: 1 }}
                                    value={payeeaddress_line2}
                                    // required={sppList === 1?true:false}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : null}

                      <Grid container spacing={4}>
                        <Grid item xs={6} sm={6}>
                          <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                              <Grid container spacing={4}>
                                <Grid item xs={3} sm={3}>
                                  <CountryPhoneCode
                                    select
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="countryCode"
                                    label={t(
                                      "componentData.addPayee.CountryCode"
                                    )}
                                    variant="outlined"
                                    value={countryCode || "+1"}
                                    excludeCountryCode={["CA", "UM"]}
                                    onChange={(e) =>
                                      this.handleChange("countryCode", e)
                                    }
                                    inputProps={{ maxLength: 2 }}
                                    //   disabled={disableEdit}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                  <MaskedInput
                                    fullWidth={true}
                                    color="secondary"
                                    variant="outlined"
                                    value={`${phone}`}
                                    name="phone"
                                    type="text"
                                    label={t("componentData.addPayee.phoneNo")}
                                    // onChange={(e) => {
                                    //   this.handleChange("phone", e);
                                    // }}
                                    onChange={(e) => {
                                      this.setState({
                                        payee: {
                                          ...payee,
                                          phone: e.target.value.replace(
                                            /[^0-9-]/g,
                                            ""
                                          ),
                                        },
                                      });
                                    }}
                                    onBlur={(e) => {
                                      if (
                                        payee.flagmpbile === false &&
                                        e.target.value
                                      ) {
                                        this.setState({
                                          payee: {
                                            ...payee,
                                            mobilePhone: e.target.value,
                                            // tokenValue:tokenType===2?e.target.value:tokenValue,
                                            flagmpbile: true,
                                          },
                                        });
                                      }
                                    }}
                                    placeholder={"XXX-XXX-XXXX"}
                                    error={Boolean(validation.phone)}
                                    helperText={validation.phone}
                                    inputProps={{ maxLength: 10 }}
                                    formatterProps={{
                                      format: "###-###-####",
                                      isNumericString: true,
                                    }}
                                    required={sppList===1 && (Number(contactMethod)===1||Number(contactMethod)===3) ? false : true}
                                    //   disabled={disableEdit}
                                  />
                                </Grid>
                                <Grid item xs={3} sm={3}>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="ext"
                                    label={t(
                                      "componentData.onboardCompanyDetail.Extension"
                                    )}
                                    variant="outlined"
                                    value={ext}
                                    onChange={(e) =>
                                      this.handleChange("ext", e)
                                    }
                                    inputProps={{ maxLength: 10 }}
                                    error={validation.ext}
                                    helperText={validation.ext}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                              {sppList === 1 ? (
                                <TextField
                                  select
                                  fullWidth={true}
                                  color="secondary"
                                  autoComplete="off"
                                  name="Contact Method"
                                  label={t(
                                    "componentData.addPayee.contactMethod"
                                  )}
                                  variant="outlined"
                                  // disabled={!isOnboarding}
                                  onChange={(e) =>
                                    this.handleChange("contactMethod", e)
                                  }
                                  value={contactMethod}
                                >
                                  {contactTypeList.map((list) => (
                                    <MenuItem value={list.contactMethodId}>
                                      {list.description}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              ) : null}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      {sppList === 1 ? (
                        <>
                          <Grid container spacing={4}>
                            <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12}>
                                  <CountryIso
                                    selectedCountry={payeecountry}
                                    error={validation.payeecountry}
                                    helperText={validation.payeecountry}
                                    onChange={(e) =>
                                      this.handleChange("payeecountry", e)
                                    }
                                    name="payeecountry"
                                    label={t("componentData.addPayee.Country")}
                                    value={payeecountry}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    required={sppList === 1?true:false}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12}>
                                  <StateIso
                                    name="payeestate"
                                    label={t("componentData.addPayee.state")}
                                    error={validation.payeestate}
                                    helperText={validation.payeestate}
                                    selectedState={payeestate || ""}
                                    selectedCountry={payeecountry || ""}
                                    onChange={(e) =>
                                      this.handleChange("payeestate", e)
                                    }
                                    value={payeestate}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    required={sppList === 1?true:false}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid container spacing={4}>
                            <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  style={{
                                    marginTop: "8px",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <CityIso
                                    name="payeecity"
                                    label={t("componentData.addPayee.city")}
                                    error={validation.payeecity}
                                    helperText={validation.payeecity}
                                    selectedState={payeestate || ""}
                                    selectedCountry={payeecountry || ""}
                                    selectedCity={payeecity || ""}
                                    onChange={(e) =>
                                      this.handleChange("payeecity", e)
                                    }
                                    value={payeecity || ""}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    required={sppList === 1?true:false}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12}>
                                  <TextField
                                    label={t("componentData.addPayee.zipCode")}
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    autoFocus={true}
                                    variant="outlined"
                                    error={Boolean(validation.pyeezipcode)}
                                    helperText={validation.pyeezipcode}
                                    name="pyeezipcode"
                                    onChange={(e) =>
                                      this.handleChange("pyeezipcode", e)
                                    }
                                    inputProps={{ minLength: 5, maxLength: 10 }}
                                    value={Pyeezipcode}
                                    required={sppList === 1?true:false}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : null}
                    <Grid container spacing={4}>
                            <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12}>
                                  <TextField
                                    fullWidth={true}
                                    autoComplete="off"
                                    autoFocus={true}
                                    value={comEmail || ""}
                                    name="comEmail"
                                    onChange={(e) =>
                                      this.handleChange("comEmail", e)
                                    }
                                    // onKeyUp={()=>resetRecaptcha()}

                                    variant="outlined"
                                    inputProps={{
                                      maxLength: 50,
                                    }}
                                    label={t("componentData.addPayee.comEmail")}
                                    error={Boolean(validation.comEmail)}
                                    helperText={validation.comEmail}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                           {/* { sppList === 1 ? (     <Grid item xs={6} sm={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12}>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="BusinessUnit"
                                    autoFocus={true}
                                    label={t(
                                      "componentData.addPayee.BusinessUnit"
                                    )}
                                    variant="outlined"
                                    value={BusinessUnit}
                                    inputProps={{ maxLength: 8 }}
                                    onChange={(e) =>
                                      this.handleChange("BusinessUnit", e)
                                    }

                                    //   disabled={disableEdit}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>):null} */}
                          </Grid>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} style={{ paddingBottom: "0px" }}>
                      <Box color="primary.text.main">
                        <h3 className={classes.settingHeading}>
                          {t("componentData.addPayee.PaymentInformation")}
                        </h3>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                    <Grid container spacing={4}>
                      <Grid item xs={6} sm={6}>
                        {true && (
                          <TextField
                            select
                            fullWidth={true}
                            color="secondary"
                            autoComplete="off"
                            name="PaymentMethod"
                            label={t("componentData.addPayee.PaymentMethod")}
                            variant="outlined"
                            onChange={(e) => this.onChangeMethod(e)}
                            value={paymentMethodId||""}
                            error={validation.PaymentMethod}
                            helperText={validation.PaymentMethod}
                            required
                          >
                            <MenuItem>
                              {t("componentData.companyDetail.Select")}
                            </MenuItem>
                            {filteredPaymentMethods &&
                              Object.keys(filteredPaymentMethods).map((option) =>
                                sppList === 1
                                  ? filteredPaymentMethods[option].key ===
                                      paymentMethodIds["ACH"] && (
                                      <MenuItem
                                        id={`locationType_${
                                          filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].key
                                        }`}
                                        key={`locationType_${
                                          filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].key
                                        }`}
                                        value={
                                          filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].key
                                        }
                                      >
                                        {filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].description}
                                      </MenuItem>
                                    )
                                  : payeeType === 2
                                  ? filteredPaymentMethods[option].isB2b === 1 && (
                                      <MenuItem
                                        id={`locationType_${
                                          filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].key
                                        }`}
                                        key={`locationType_${
                                          filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].key
                                        }`}
                                        value={
                                          filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].key
                                        }
                                      >
                                        {filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].description}
                                      </MenuItem>
                                    )
                                  : filteredPaymentMethods[option].isB2c === 1 && (
                                      <MenuItem
                                        id={`locationType_${
                                          filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].key
                                        }`}
                                        key={`locationType_${
                                          filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].key
                                        }`}
                                        value={
                                          filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].key
                                        }
                                      >
                                        {filteredPaymentMethods[option] &&
                                          filteredPaymentMethods[option].description}
                                      </MenuItem>
                                    )
                              )}
                          </TextField>
                        )}
                      </Grid>
                      {/* For ACH Field*/}
                      {paymentMethodId === paymentMethodIds["ACH"] ||
                  paymentMethodId === paymentMethodIds["USBankRTP"] ? (
                      <Grid item xs={6} sm={6}>
                        <Grid container spacing={4}>
                              <Grid item xs={12} sm={12}>
                                <TextField
                                  select
                                  fullWidth={true}
                                  color="secondary"
                                  autoComplete="off"
                                  name="accountType"
                                  label={t(
                                    "componentData.addPayee.accountType"
                                  )}
                                  error={validation.accountType}
                                  helperText={validation.accountType}
                                  variant="outlined"
                                  // disabled={!isOnboarding}
                                  onChange={(e) => this.onAccountMethod(e)}
                                  value={accountType}
                                  required
                                >
                                  {accountTypeList.map((list) => (
                                    <MenuItem value={list.accountTypeId}>
                                      {list.description}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                            </Grid>
                      </Grid>
                  ) : null }
                  {/* For ACH Field End*/}
                    </Grid>
                    </Grid>
                  </Grid>

                  {/* ACH Start */}
                  {paymentMethodId === paymentMethodIds["ACH"] ||
                  paymentMethodId === paymentMethodIds["USBankRTP"] ? (
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={6} sm={6}>
                          <Grid item xs={12} sm={12}>
                              <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="routingCode"
                                autoFocus={true}
                                label={t(
                                  "componentData.routingCodeResults.tabelHeaders.routingCode"
                                )}
                                variant="outlined"
                                value={routingCode}
                                inputProps={{
                                  maxLength: 9,
                                  minLength: 9,
                                }}
                                onChange={(e) => {
                                  this.handleChange("routingCode", e);
                                }}
                                error={validation.routingCode}
                                helperText={validation.routingCode}
                                required
                                //   disabled={disableEdit}
                              />
                              <Link
                                component="button"
                                variant="body2"
                                onClick={() => {
                                  this.setState({
                                    openSearchModal: true,
                                  });
                                }}
                                className={classes.searchRoutingText}
                              >
                                {t(
                                  "componentData.routingCodeResult.label.searchBank"
                                )}
                                <img
                                  style={{ marginLeft: "4px" }}
                                  src={SearchIcon}
                                  alt="search"
                                />
                              </Link>
                            </Grid>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                          <Grid item xs={12} sm={12}>
                              <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="bankName"
                                autoFocus={true}
                                label={t(
                                  "componentData.routingCodeResults.tabelHeaders.bankName"
                                )}
                                variant="outlined"
                                value={bankName}
                                inputProps={{
                                  maxLength: 158,
                                }}
                                onChange={(e) => {
                                  this.handleChange("bankName", e);
                                }}
                                error={validation.bankName}
                                helperText={validation.bankName}
                                required
                                  disabled={true}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid container spacing={4}>
                          <Grid item xs={6} sm={6}>
                            <Grid item xs={12} sm={12}>
                              <MaskInput
                                color="secondary"
                                autoFocus={true}
                                variant="outlined"
                                fullWidth={true}
                                autoComplete="off"
                                value={accountNumber}
                                name="accountNumber"
                                label={t(
                                  "componentData.addAccountForm.AcNumber"
                                )}
                                getValue={(val) => {
                                  const { payee } = this.state;
                                  this.setState({
                                    payee: {
                                      ...payee,
                                      accountNumber: val,
                                    },
                                  });
                                }}
                                //onBlur={() => this.validateData()}
                                inputProps={{
                                  maxLength: 17,
                                  minLength: 6,
                                }}
                                error={validation.accountNumber}
                                required
                                helperText={validation.accountNumber}
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Grid item xs={12} sm={12}>
                            <MaskInput
                                color="secondary"
                                autoFocus={true}
                                variant="outlined"
                                fullWidth={true}
                                autoComplete="off"
                                value={confirmAccountNumber}
                                name="confirmAccountNumber"
                                label={t(
                                  "componentData.addPayee.confirmAccountNumber"
                                )}
                                getValue={(val) => {
                                  const { payee } = this.state;
                                  this.setState({
                                    payee: {
                                      ...payee,
                                      confirmAccountNumber: val,
                                    },
                                  });
                                }}
                                //onBlur={() => this.validateData()}
                                inputProps={{
                                  maxLength: 17,
                                  minLength: 6,
                                }}
                                error={validation.confirmAccountNumber}
                                required
                                helperText={validation.confirmAccountNumber}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                  {/* ACH End */}

                  {/* Zelle Start */}
                  {paymentMethodId === paymentMethodIds["USBankZelle"] ? (
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={6} sm={6}>
                            <Grid item xs={12} sm={12}>
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
                                  this.handletokentypeChange("tokenType", e)
                                }
                                value={tokenType}
                                required
                              >
                                <MenuItem>
                                  {t("componentData.companyDetail.Select")}
                                </MenuItem>
                                <MenuItem value={1}>{"Email"}</MenuItem>
                                <MenuItem value={2}>{"Phone"}</MenuItem>
                              </TextField>
                            </Grid>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Grid item xs={12} sm={12}>
                              <TextField
                                fullWidth={true}
                                error={validation.tokenValue}
                                helperText={validation.tokenValue}
                                color="secondary"
                                autoComplete="off"
                                name="tokenValue"
                                label={t("componentData.addPayee.tokenValue")}
                                variant="outlined"
                                value={tokenValue || ""}
                                onChange={(e) =>
                                  this.handletokenChange("tokenValue", e)
                                }
                                required
                                inputProps={
                                  tokenType === 2
                                    ? { maxLength: 10 }
                                    : { maxLength: 45 }
                                }
                                //   disabled={disableEdit}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                  {/* Zelle End */}

                  {/* Check Start */}
                  {paymentMethodId === paymentMethodIds["USBankCHK"] ? (
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={6} sm={6}>
                            <Grid container spacing={4}>
                              <Grid item xs={12} sm={12}>
                                <TextField
                                  fullWidth={true}
                                  color="secondary"
                                  autoComplete="off"
                                  autoFocus={true}
                                  variant="outlined"
                                  label={t(
                                    "componentData.addPayee.address_line1"
                                  )}
                                  error={Boolean(validation.address_line1)}
                                  helperText={validation.address_line1}
                                  name="address_line1"
                                  onChange={(e) => {
                                    this.handleChange("address_line1", e);
                                  }}
                                  inputProps={{ minLength: 1, maxLength: 35 }}
                                  value={address_line1}
                                  required
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Grid container spacing={4}>
                              <Grid item xs={12} sm={12}>
                                <TextField
                                  fullWidth={true}
                                  color="secondary"
                                  autoComplete="off"
                                  autoFocus={true}
                                  variant="outlined"
                                  label={t(
                                    "componentData.addPayee.address_line2"
                                  )}
                                  error={Boolean(validation.address_line2)}
                                  helperText={validation.address_line2}
                                  name="address_line2"
                                  onChange={(e) => {
                                    this.handleChange("address_line2", e);
                                  }}
                                  inputProps={{ maxLength: 35, minLength: 1 }}
                                  value={address_line2}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid container spacing={4}>
                          <Grid item xs={6} sm={6}>
                            <Grid container spacing={4}>
                              <Grid item xs={12} sm={12}>
                                <CountryIso
                                  selectedCountry={country}
                                  error={validation.country}
                                  helperText={validation.country}
                                  onChange={(e) =>
                                    this.handleChange("country", e)
                                  }
                                  name="country"
                                  label={t("componentData.addPayee.Country")}
                                  value={country}
                                  required
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Grid container spacing={4}>
                              <Grid item xs={12} sm={12}>
                                <StateIso
                                  name="state"
                                  label={t("componentData.addPayee.state")}
                                  error={validation.state}
                                  helperText={validation.state}
                                  selectedState={state || ""}
                                  selectedCountry={country || ""}
                                  onChange={(e) =>
                                    this.handleChange("state", e)
                                  }
                                  value={state}
                                  required
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid container spacing={4}>
                          <Grid item xs={6} sm={6}>
                            <Grid container spacing={4}>
                              <Grid item xs={12} sm={12} style={{ marginTop: "8px" }}>
                                <CityIso
                                  name="city"
                                  label={t("componentData.addPayee.city")}
                                  error={validation.city}
                                  helperText={validation.city}
                                  selectedState={state || ""}
                                  selectedCountry={country || ""}
                                  selectedCity={city || ""}
                                  onChange={(e) => this.handleChange("city", e)}
                                  value={city || ""}
                                  required={true}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Grid container spacing={4}>
                              <Grid item xs={12} sm={12}>
                                <TextField
                                  label={t("componentData.addPayee.zipCode")}
                                  fullWidth={true}
                                  color="secondary"
                                  autoComplete="off"
                                  autoFocus={true}
                                  variant="outlined"
                                  error={Boolean(validation.zipcode)}
                                  helperText={validation.zipcode}
                                  name="zipcode"
                                  onChange={(e) =>
                                    this.handleChange("zipcode", e)
                                  }
                                  inputProps={{ minLength: 5, maxLength: 10 }}
                                  required
                                  value={zipcode}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                  {/* Check End */}

                  {/* Prepaid Card Start */}
                  {/* {paymentMethodId === paymentMethodIds["USBankPrepaidCard"] && */}
                {  (paymentMethodId === paymentMethodIds["PrepaidFocusNonPayroll"] ||
                  paymentMethodId === paymentMethodIds["PrepaidReliaCard"] ) ? (
                    <Grid container spacing={4}>
                      { (
                      
                      finalCardDetails.isEmployeeState) ? (
                        <Grid spacing={4} item xs={6} sm={6}>
                          
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t(
                                "componentData.addPayee.isEmployeeState"
                              )}
                              error={validation.employerState}
                              helperText={validation.employerState}
                              value={employerState || ""}
                              name="employerState"
                              inputProps={{
                                // maxLength: 9,
                                minLength:2,
                                maxLength: 4,
                              }}
                              onChange={(e) =>
                                this.handleChange("employerState", e)
                              }
                              required
                            />
                          </Grid>
                        
                      ) : null}

                      {finalCardDetails.isUniqueId ? (
                        <Grid item xs={6} sm={6}>
                          
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.uniqueId")}
                              error={validation.uniqueId}
                              helperText={validation.uniqueId}
                              value={uniqueId || ""}
                              name="uniqueId"
                              inputProps={{
                                // minLength: 10,
                                maxLength: 50,
                              }}
                              onChange={(e) => this.handleChange("uniqueId", e)}
                              required
                            />
                          </Grid>
                        
                      ) : null}

                      {finalCardDetails.isDateOfBirth ? (
                        <Grid item xs={6} sm={6} style={{ marginTop: "8px" }}>

                            <DatePicker
                              customInput={
                                <TextField
                                  fullWidth={true}
                                  color="secondary"
                                  autoComplete="off"
                                  autoFocus={true}
                                  variant="outlined"
                                  label={t("componentData.addPayee.DOB")}
                                  error={validation.dateOfBirth}
                                  helperText={validation.dateOfBirth}
                                  // selected={this.state.startDate}
                                  name="dateOfBirth"
                                  className="fullWidth"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <EventIcon
                                          fontSize="small"
                                          style={{ cursor: "pointer" }}
                                        />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              }
                              name="startDate"
                              placeholderText={"Date of Birth"}
                              dateFormat="MM/dd/yyyy"
                              className={classes.datePicker}
                              selected={startDate}
                              // selected={this.state.startDate}
                              maxDate={new Date()}
                              onChange={this.handleDOBActivatedAt}
                              showYearDropdown
                              yearDropdownItemNumber={115}
                              dropdownMode="select"
                              required
                            />
                          </Grid>

                      ) : null}

                      {finalCardDetails.isSsn ? (
                        <Grid item xs={6} sm={6}>

                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.SSN")}
                              error={validation.SSN}
                              helperText={validation.SSN}
                              value={SSN || ""}
                              name="SSN"
                              inputProps={{
                                // minLength: 10,
                                maxLength: 9,
                              }}
                              onChange={(e) => this.handleChange("SSN", e)}
                              required
                            />
                          </Grid>

                      ) : null}

                      {finalCardDetails.isGovLocation ? (
                        <Grid item xs={6} sm={6}>

                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.govLocation")}
                              error={validation.govLocation}
                              helperText={validation.govLocation}
                              value={govLocation || ""}
                              name="govLocation"
                              inputProps={{
                                maxLength: 20,
                              }}
                              onChange={(e) =>
                                this.handleChange("govLocation", e)
                              }
                              required
                            />
                          </Grid>

                      ) : null}

                      {finalCardDetails.govIdTypeId ? (
                        <Grid item xs={6} sm={6}>

                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.govID")}
                              error={validation.govIdValue}
                              helperText={validation.govIdValue}
                              value={govIdValue || ""}
                              name="govIdValue"
                              inputProps={{
                                // minLength: 10,
                                maxLength: 50,
                              }}
                              onChange={(e) =>
                                this.handleChange("govIdValue", e)
                              }
                              required
                            />
                          </Grid>

                      ) : null}

                      {finalCardDetails.govIdTypeId ? (
                        <Grid item xs={6} sm={6} style={{ marginTop: "8px" }}>

                            <DatePicker
                              customInput={
                                <TextField
                                  fullWidth={true}
                                  color="secondary"
                                  autoComplete="off"
                                  autoFocus={true}
                                  variant="outlined"
                                  label={t(
                                    "componentData.addPayee.govExpiredDate"
                                  )}
                                  error={validation.govExpiredDate}
                                  helperText={validation.govExpiredDate}
                                  name="govExpiredDate"
                                  className="fullWidth"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <EventIcon
                                          fontSize="small"
                                          style={{ cursor: "pointer" }}
                                        />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              }
                              placeholderText={t(
                                "componentData.addPayee.govExpiredDate"
                              )}
                              dateFormat="MM/dd/yyyy"
                              className={classes.datePicker}
                              selected={govExpiredDate}
                              minDate={new Date()}
                              // selected={this.state.startDate}
                              onChange={this.handleexpiryActivatedAt}
                              required
                            />
                          </Grid>

                      ) : null}

                      {finalCardDetails.isHomePhone ? (
                        <Grid item xs={6} sm={6}>
                          
                            <MaskedInput
                              fullWidth={true}
                              color="secondary"
                              variant="outlined"
                              value={homePhone}
                              name="homePhone"
                              type="text"
                              label={t("componentData.addPayee.homePhone")}
                              onChange={(e) => {
                                this.handleChange("homePhone", e);
                              }}
                              placeholder={"XXX-XXX-XXXX"}
                              error={Boolean(validation.homePhone)}
                              helperText={validation.homePhone}
                              inputProps={{ maxLength: 10 }}
                              formatterProps={{
                                format: "###-###-####",
                                isNumericString: true,
                              }}
                              required
                              //   disabled={disableEdit}
                            />
                          </Grid>
                        
                      ) : null}

                      {((paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
                      paymentMethodId === paymentMethodIds["DigitalCorporateCard"])||
                      
                      
                      finalCardDetails.isName) ? (
                        <Grid item xs={6} sm={6}>
                          
                            <TextField
                              label={t("componentData.addPayee.FirstName")}
                              fullWidth={true}
                              color="secondary"
                              variant="outlined"
                              error={validation.firstName}
                              helperText={validation.firstName}
                              value={firstName || ""}
                              name="firstName"
                              inputProps={{
                                maxLength: 35,
                              }}
                              onChange={(e) =>
                                this.handleChange("firstName", e)
                              }
                              required
                            />
                          </Grid>
                        
                      ) : null}

                      {((paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
                      paymentMethodId === paymentMethodIds["DigitalCorporateCard"])||
                      
                      
                      finalCardDetails.isName) ? (
                        <Grid item xs={6} sm={6}>
                          
                            <TextField
                              label={t("componentData.addPayee.LastName")}
                              fullWidth={true}
                              color="secondary"
                              variant="outlined"
                              error={validation.lastName}
                              helperText={validation.lastName}
                              value={lastName || ""}
                              name="lastName"
                              inputProps={{
                                maxLength: 35,
                              }}
                              onChange={(e) => this.handleChange("lastName", e)}
                              required
                            />
                          </Grid>
                        
                      ) : null}

                      {((paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
                      paymentMethodId === paymentMethodIds["DigitalCorporateCard"])||
                      
                      
                      finalCardDetails.isEmail)
                      
                       ? (
                        <Grid item xs={6} sm={6}>
                          
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              variant="outlined"
                              label={t("componentData.addPayee.email")}
                              error={validation.prepemail}
                              helperText={validation.prepemail}
                              defaultValue={email}
                              value={prepemail || ""}
                              // defaultValue={email}
                              name="prepemail"
                              inputProps={{
                                maxLength: 48,
                              }}
                              onChange={(e) =>
                                this.handleChange("prepemail", e)
                              }
                              required
                            />
                          </Grid>
                        
                      ) : null}

                      {finalCardDetails.isMobilePhone ? (
                        <Grid item xs={6} sm={6}>
                          
                            <TextField
                              label={t("componentData.addPayee.mobilePhone")}
                              fullWidth={true}
                              color="secondary"
                              variant="outlined"
                              error={validation.mobilePhone}
                              helperText={validation.mobilePhone}
                              defaultValue={phone}
                              value={mobilePhone || ""}
                              name="mobilePhone"
                              inputProps={{
                                minLength: 10,
                                maxLength: 10,
                              }}
                              onChange={(e) =>
                                this.handleChange("mobilePhone", e)
                              }
                              required
                            />
                          </Grid>
                       
                      ) : null}

                      {((paymentMethodId === paymentMethodIds["PlasticCorporateCard"]|| 
                      paymentMethodId === paymentMethodIds["DigitalCorporateCard"])||
                      
                      
                      finalCardDetails.isAddress)
                       ? (
                        <Grid item xs={6} sm={6}>

                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.address_line1")}
                              error={Boolean(validation.ppdaddress_line1)}
                              helperText={validation.ppdaddress_line1}
                              name="ppdaddress_line1"
                              onChange={(e) => {
                                this.handleChange("ppdaddress_line1", e);
                              }}
                              inputProps={{ minLength: 1, maxLength: 35 }}
                              value={ppdaddress_line1}
                              required
                            />
                          </Grid>

                      ) : null}

                      {finalCardDetails.isAddress ? (
                        <Grid item xs={6} sm={6}>

                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.address_line2")}
                              error={Boolean(validation.ppdaddress_line2)}
                              helperText={validation.ppdaddress_line2}
                              name="ppdaddress_line2"
                              onChange={(e) => {
                                this.handleChange("ppdaddress_line2", e);
                              }}
                              inputProps={{ maxLength: 35, minLength: 1 }}
                              value={ppdaddress_line2}
                              // required
                            />
                          </Grid>

                      ) : null}

                      {finalCardDetails.isAddress ? (
                        <Grid item xs={6} sm={6}>
                          <Grid item xs={12} sm={12}>
                            <CountryIso
                              selectedCountry={ppdcountry}
                              label={t("componentData.addPayee.Country")}
                              error={validation.ppdcountry}
                              helperText={validation.ppdcountry}
                              value={ppdcountry}
                              name="country"
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) =>
                                this.handleChange("ppdcountry", e)
                              }
                            />
                          </Grid>
                        </Grid>
                      ) : null}

                      {finalCardDetails.isAddress ? (
                        <Grid item xs={6} sm={6}>
                          <Grid item xs={12} sm={12}>
                            <StateIso
                              label={t("componentData.addPayee.state")}
                              error={validation.ppdstate}
                              helperText={validation.ppdstate}
                              selectedState={ppdstate || ""}
                              selectedCountry={ppdcountry || ""}
                              value={ppdstate}
                              name="state"
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) => this.handleChange("ppdstate", e)}
                            />
                          </Grid>
                        </Grid>
                      ) : null}

                      {finalCardDetails.isAddress ? (
                        <Grid item xs={6} sm={6}>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            style={{ marginTop: "8px" }}
                          >
                            <CityIso
                              name="city"
                              label={t("componentData.addPayee.city")}
                              error={validation.ppdcity}
                              helperText={validation.ppdcity}
                              selectedState={ppdstate || ""}
                              selectedCountry={ppdcountry || ""}
                              selectedCity={ppdcity || ""}
                              value={ppdcity || ""}
                              required={true}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) => this.handleChange("ppdcity", e)}
                            />
                          </Grid>
                        </Grid>
                      ) : null}

                      {finalCardDetails.isAddress ? (
                        <Grid item xs={6} sm={6}>
                          <Grid item xs={12} sm={12}>
                            <TextField
                              label={t("componentData.addPayee.zipCode")}
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              error={Boolean(validation.ppdzipcode)}
                              helperText={validation.ppdzipcode}
                              name="zipcode"
                              onChange={(e) =>
                                this.handleChange("ppdzipcode", e)
                              }
                              inputProps={{ minLength: 5, maxLength: 10 }}
                              required
                              value={ppdzipcode}
                            />
                          </Grid>
                        </Grid>
                      ) : null}
                    </Grid>
                  ) : null}
                  {/* Prepaid Card End */}
                  {/* Start Plastic card/Digital card */}
                  {  (paymentMethodId === paymentMethodIds["PlasticCorporateCard"] ||
                  paymentMethodId === paymentMethodIds["DigitalCorporateCard"] ) ? (
                    <Grid container spacing={4}>
                      <Grid item xs={6} sm={6}>
                          
                            <TextField
                              label={t("componentData.addPayee.FirstName")}
                              fullWidth={true}
                              color="secondary"
                              variant="outlined"
                              error={validation.firstName}
                              helperText={validation.firstName}
                              value={firstName || ""}
                              name="firstName"
                              inputProps={{
                                maxLength: 35,
                              }}
                              onChange={(e) =>
                                this.handleChange("firstName", e)
                              }
                              required
                            />
                          </Grid>
                       <Grid item xs={6} sm={6}>
                          
                            <TextField
                              label={t("componentData.addPayee.LastName")}
                              fullWidth={true}
                              color="secondary"
                              variant="outlined"
                              error={validation.lastName}
                              helperText={validation.lastName}
                              value={lastName || ""}
                              name="lastName"
                              inputProps={{
                                maxLength: 35,
                              }}
                              onChange={(e) => this.handleChange("lastName", e)}
                              required
                            />
                          </Grid>
                
                        <Grid item xs={6} sm={6}>
                          
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              variant="outlined"
                              label={t("componentData.addPayee.email")}
                              error={validation.prepemail}
                              helperText={validation.prepemail}
                              defaultValue={email}
                              value={prepemail || ""}
                              // defaultValue={email}
                              name="prepemail"
                              inputProps={{
                                maxLength: 48,
                              }}
                              onChange={(e) =>
                                this.handleChange("prepemail", e)
                              }
                              required
                            />
                          </Grid>
                        <Grid item xs={6} sm={6}>

                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.address_line1")}
                              error={Boolean(validation.ppdaddress_line1)}
                              helperText={validation.ppdaddress_line1}
                              name="ppdaddress_line1"
                              onChange={(e) => {
                                this.handleChange("ppdaddress_line1", e);
                              }}
                              inputProps={{ minLength: 1, maxLength: 35 }}
                              value={ppdaddress_line1}
                              required
                            />
                          </Grid>  
                        <Grid item xs={6} sm={6}>
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.address_line2")}
                              error={Boolean(validation.ppdaddress_line2)}
                              helperText={validation.ppdaddress_line2}
                              name="ppdaddress_line2"
                              onChange={(e) => {
                                this.handleChange("ppdaddress_line2", e);
                              }}
                              inputProps={{ maxLength: 35, minLength: 1 }}
                              value={ppdaddress_line2}
                              // required
                            />
                          </Grid>              
                        <Grid item xs={6} sm={6}>
                          <Grid item xs={12} sm={12}>
                            <CountryIso
                              selectedCountry={ppdcountry}
                              label={t("componentData.addPayee.Country")}
                              error={validation.ppdcountry}
                              helperText={validation.ppdcountry}
                              value={ppdcountry}
                              name="country"
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) =>
                                this.handleChange("ppdcountry", e)
                              }
                            />
                          </Grid>
                        </Grid>                 
                        <Grid item xs={6} sm={6}>
                          <Grid item xs={12} sm={12}>
                            <StateIso
                              label={t("componentData.addPayee.state")}
                              error={validation.ppdstate}
                              helperText={validation.ppdstate}
                              selectedState={ppdstate || ""}
                              selectedCountry={ppdcountry || ""}
                              value={ppdstate}
                              name="state"
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) => this.handleChange("ppdstate", e)}
                            />
                          </Grid>
                        </Grid>                 
                        <Grid item xs={6} sm={6}>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            style={{ marginTop: "8px" }}
                          >
                            <CityIso
                              name="city"
                              label={t("componentData.addPayee.city")}
                              error={validation.ppdcity}
                              helperText={validation.ppdcity}
                              selectedState={ppdstate || ""}
                              selectedCountry={ppdcountry || ""}
                              selectedCity={ppdcity || ""}
                              value={ppdcity || ""}
                              required={true}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) => this.handleChange("ppdcity", e)}
                            />
                          </Grid>
                        </Grid>
                       <Grid item xs={6} sm={6}>
                          <Grid item xs={12} sm={12}>
                            <TextField
                              label={t("componentData.addPayee.zipCode")}
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              error={Boolean(validation.ppdzipcode)}
                              helperText={validation.ppdzipcode}
                              name="zipcode"
                              onChange={(e) =>
                                this.handleChange("ppdzipcode", e)
                              }
                              inputProps={{ minLength: 5, maxLength: 10 }}
                              required
                              value={ppdzipcode}
                            />
                          </Grid>
                        </Grid>                    
                    </Grid>
                  ) : null}
                  {/* end Plastic card/Digital card */}
                  {/* DDC Start */}
                  {/* { paymentMethodId === paymentMethodFileFormatIds["USBankDepositToDebitcard"] ? (
          <Grid container spacing={4}>
          <Grid item xs={12} sm={12}>
          <Grid container spacing={4}>

          <Grid item xs={6} sm={6}>
          <Grid item xs={12} sm={12}>
               <TextField
                 fullWidth={true}
                 color="secondary"
                 autoComplete="off"
                 name="CardHolderName"
                 autoFocus={true}
                 label={t("componentData.addPayee.CardHolderName")}
                 variant="outlined"
                   value={CardHolderName}
                   inputProps={{
                       maxLength: 35,
                     }}
                     onChange={(e) => this.handleChange("CardHolderName", e)}
                   error={
                     validation.CardHolderName 
                   }
                   helperText={validation.CardHolderName}
                 required
                 //   disabled={disableEdit}
               />
            </Grid>
          </Grid>

          <Grid item xs={6} sm={6}>
             <Grid item xs={12} sm={12}>
             <CardNumber
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                variant="outlined"
                    label={t(
                      'componentData.addPayee.cardNumber'
                    )}
                    error={validation.cardNo}
                    helperText={validation.cardNo}
                    value={cardNo}
                    name='cardNo'
                    inputProps={{
                      minLength: 11,
                      maxLength: 19,
                    }}
                    getvalue={(val) => this.handleChange("cardNo", val)}
                    required
                  />
             </Grid>
          </Grid>

          </Grid>

          <Grid container spacing={4}>
          <Grid item xs={6} sm={6}>
             <Grid container spacing={4}>
             <Grid item xs={12} sm={12}>
             <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      className={classes.calenderField}
                      color='secondary'
                      disablePast
                      minDate={new Date()}
                      inputVariant='outlined'
                      placeholder='MM/YYYY'
                      format={'MM/YYYY'}
                      name='expiryDate'
                      label={t(
                        'componentData.addPayee.expiryDate'
                      )}
                      value={expiryDate}
                      error={validation && validation.expiryDate}
                      helperText={validation && validation.expiryDate}
                      onChange={this.handleDateChange}
                      autoOk={true}
                      views={['month', 'year']}
                      openTo='month'
                      fullWidth={true}
                      required
                    />
                  </MuiPickersUtilsProvider>
             </Grid>
           </Grid>
          </Grid>
              <Grid item xs={6} sm={6}></Grid>
            </Grid>

          </Grid>
        </Grid>
        ) : null } */}
                  {/* DDC End */}

                  <Grid container spacing={4}>
                    <Grid container item xs={12} justify="center">
                      {updateProgress ? (
                        <CircularProgress color="primary" />
                      ) : (
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            this.onSubmit();
                          }}
                          style={{ display: "block", margin: "15px auto 0" }}
                        >
                          {t("componentData.RTPDetail.save")}
                        </Button>
                      )}
                    </Grid>
                  </Grid>

                  {alertMessage &&
                    this.renderAlertMessage(
                      "",
                      alertMessage,
                      alertMessageCallbackType
                    )}

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
                </Box>
              </Grid>
            </Paper>
          </Grid>
        </>
      </Box>
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
    ...state.Payee,
    ...state.USBankPayment,
  }))(withStyles(styles)(addpayeeDetails))
);
