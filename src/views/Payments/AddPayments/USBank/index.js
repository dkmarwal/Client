import React, { Component } from "react";
import {
  Box,
  Paper,
  Typography,
  withStyles,
  Button,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import styles from "./styles";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TextField from "~/components/Forms/TextField";
import { Link } from "react-router-dom";
import config from "~/config";
import PaymentInformation from "~/modules/AddPayment/PaymentInformation/USBank";
import USBankACH from "~/modules/AddPayment/PaymentMethods/USBank/ACH";
import USBankCheck from "~/modules/AddPayment/PaymentMethods/USBank/Check";
import USBankZelle from "~/modules/AddPayment/PaymentMethods/USBank/Zelle";
import FocusRelia from "~/modules/AddPayment/PaymentMethods/USBank/FocusRelia";
import CorporateRewardCard from "~/modules/AddPayment/PaymentMethods/USBank/CorporateRewardCard";
import USBankDDC from "~/modules/AddPayment/PaymentMethods/USBank/DepositToDebitCard";
import Default from "~/modules/AddPayment/PaymentMethods/Default";
import AddPaymentModal from "~/components/AddPayment/AddPaymentModal";
import {
  paymentMethodIds,
  paymentMethodsCode,
  paymentMethods as paymentTypeCodes,
} from "~/config/paymentMethods";
import {
  fetchPayeeInfo,
  createPayment,
  getB2CthresholdLimits,
} from "~/redux/actions/B2C/payments";
import { fetchRoutingCodes } from "~/redux/actions/payments";
import { getB2CPreferredClientPaymentTypes } from "~/redux/actions/B2C/payments"
import { getUSBankClientPaymentTypes } from "~/redux/actions/USbank/payments"
import moment from "moment";
import trim from "deep-trim-node";
import Notification from "~/components/Notification";
import { getUSbankPayeeType } from "~/redux/actions/USbank/payee";
import {
  fetchUSBankPrepaidCardData,
} from "~/redux/actions/USbank/payments";
import { PayeeType } from "~/config/entityTypes";

class USBankAddPayments extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      inputs: {
        payeeId: state ?.payeeId || null,
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
        paymentRef: null,
        businessUnit: null,
        currency: "USD",
        paymentAmount: null,
        notes: null,
        payeeType: null,
        companyName: null,
      },
      defaultInputs: {
        customField1: null,
        customField2: null,
        customField3: null,
        customField4: null,
        customField5: null,
      },
      defaultInputsName: {
        customField1: null,
        customField2: null,
        customField3: null,
        customField4: null,
        customField5: null,
      },
      zelleInputs: {
        zelleTokenType: "email",
        emailZelle: null,
        zellePhoneNumber: null,
      },
      checkInputs: {
        checkAddressLine1: null,
        checkAddressLine2: null,
        checkCountry: null,
        checkState: null,
        checkCity: null,
        checkPostalCode: null,
      },
      corporateRewardInputs: {
        firstName: null,
        lastName: null,
        addressLine1: null,
        addressLine2: null,
        country: null,
        state: null,
        city: null,
        postalCode: null,
      },
      ddcInputs: {
        expiryDate: null,
        debitCardNumber: null,
      },
      achInputs: {
        accountType: 0,
        routingCode: null,
        bankName: null,
        accountNum: null,
        confirmAccountNum: null,
      },
      prepaidCardInputs: {
        firstName: null,
        lastName: null,
        email: null,
        address1: null,
        address2: null,
        country: null,
        postalCode: null,
        state: null,
        city: null,
        dob: null,
        ssn: null,
        phoneNumber: null,
        mobilePhone: null,
        employerState: null,
        govLocation: null,
        govId: null,
        govIdValue: null,
        govExpiryDate: null,
        uniqueId: null,
      },
      hasClickNext: false,
      achDate: null,
      selectedPaymentMethod: 0,
      selectedPayeeType: null,
      isForcedPayment: 0,
      modalOpen: false,
      validationState: {},
      paymentMethods: [],
      fieldsDisabled: false,
      isLoading: false,
      alertMessage: null,
      businessUnits: [],
    };
  }

  componentDidMount() {
    const { inputs } = this.state;
    const clientId = this.props.user.userData.portalProfileId || null;
    this.props.dispatch(getUSbankPayeeType());
    this.props.dispatch(fetchUSBankPrepaidCardData(clientId));
    this.props.dispatch(getUSBankClientPaymentTypes(clientId))
    if (inputs.payeeId) {
      this.fetchB2CthresholdLimits();
      this.getPayeeInfo();
    }
  }

  fetchB2CthresholdLimits = async () => {
    const { dispatch } = this.props;
    const resp = await dispatch(getB2CthresholdLimits());
    if (!resp) return;
    this.setState({
      paymentMethods: this.props ?.thresholdLimit ?.data,
    });
  };

  getPayeeInfo = async () => {
    const { inputs } = this.state;
    this.props
      .dispatch(fetchPayeeInfo(this.state.inputs.payeeId))
      .then((resp) => {
        if (!resp) {
          return resp;
        }
        const { consumerPayeeInfo } = this.props;
        this.setState({
          paymentMethods: this.props ?.thresholdLimit ?.data,
        });
        if (Object.keys(consumerPayeeInfo).length !== 0) {
          const {
            firstName,
            lastName,
            emailAddress,
            phoneNumber,
            primaryPaymentMethodId,
            PayeeTypeId,
            companyName
          } = consumerPayeeInfo;
          this.setState(
            {
              inputs: {
                ...inputs,
                firstName: firstName || null,
                lastName: lastName || null,
                email: emailAddress || null,
                phoneNumber: {
                  ...inputs.phoneNumber,
                  phone: phoneNumber || null,
                },
                companyName: companyName || null
              },
              selectedPaymentMethod: primaryPaymentMethodId || 0,
              fieldsDisabled: true,
              selectedPayeeType: PayeeTypeId,
            },
            () => {
              this.mapPaymentDetails();
            }
          );
        }
      });
    this.setState({
      hasClickNext: true,
      validationState: {},
    });
  };

  mapPaymentDetails = () => {
    const {
      selectedPaymentMethod,
      zelleInputs,
      achInputs,
      checkInputs,
      corporateRewardInputs,
      prepaidCardInputs,
      ddcInputs,
    } = this.state;
    const { consumerPayeeInfo } = this.props;
    if (consumerPayeeInfo) {
      const {
        consumerZelleDetails,
        consumerBankAccountDetails,
        consumerCheckDetails,
        consumerPrepaidCardDetails,
        consumerDebitCardDetails,
      } = consumerPayeeInfo;
      switch (selectedPaymentMethod) {
        case paymentMethodIds["USBankZelle"]:
          if (consumerZelleDetails ?.tokenType === "phone") {
            const phoneNumberLength =
              consumerZelleDetails ?.tokenValue ?.trim() ?.length;
            const prefixLength =
              phoneNumberLength > 10 ? phoneNumberLength - 10 : 0;
            let phone = consumerZelleDetails ?.tokenValue
              ?.trim()
                ?.substring(prefixLength, phoneNumberLength);
            this.setState({
              zelleInputs: {
                ...zelleInputs,
                zelleTokenType: consumerZelleDetails ?.tokenType,
                zellePhoneNumber: {
                  ...zelleInputs.zellePhoneNumber,
                  phone: phone,
                },
              },
            });
          } else {
            this.setState({
              zelleInputs: {
                ...zelleInputs,
                zelleTokenType: consumerZelleDetails ?.tokenType,
                emailZelle: consumerZelleDetails ?.tokenValue,
              },
            });
          }
          break;
        case paymentMethodIds["USBankACH"]:
        case paymentMethodIds["USBankRTP"]:
          this.setState({
            achInputs: {
              ...achInputs,
              accountType: consumerBankAccountDetails ?.accountTypeId,
              routingCode: consumerBankAccountDetails ?.routingNumber,
              bankName: consumerBankAccountDetails ?.bankName,
              accountNum: consumerBankAccountDetails ?.accountNumber,
              confirmAccountNum: consumerBankAccountDetails ?.accountNumber,
            },
            achDate: null,
          });
          break;
        case paymentMethodIds["USBankCHK"]:
          this.setState({
            checkInputs: {
              ...checkInputs,
              checkAddressLine1: consumerCheckDetails ?.addressLine1,
              checkAddressLine2: consumerCheckDetails ?.addressLine2,
              checkCountry: consumerCheckDetails ?.country,
              checkState: consumerCheckDetails ?.state,
              checkCity: consumerCheckDetails ?.city,
              checkPostalCode: consumerCheckDetails ?.postalCode,
            },
          });
          break;
        case paymentMethodIds["PlasticCorporateCard"]:
        case paymentMethodIds["DigitalCorporateCard"]:
          this.setState({
            corporateRewardInputs: {
              ...corporateRewardInputs,
              addressLine1: consumerPrepaidCardDetails ?.address1,
              addressLine2: consumerPrepaidCardDetails ?.address2,
              firstName: consumerPrepaidCardDetails ?.firstName,
              lastName: consumerPrepaidCardDetails ?.lastName,
              state: consumerPrepaidCardDetails ?.state,
              city: consumerPrepaidCardDetails ?.city,
              country: consumerPrepaidCardDetails ?.country,
              postalCode: consumerPrepaidCardDetails ?.postalCode,
            },
          });
          break;
        case paymentMethodIds["PrepaidFocusNonPayroll"]:
        case paymentMethodIds["PrepaidReliaCard"]:
          this.setState({
            prepaidCardInputs: {
              ...prepaidCardInputs,
              firstName: consumerPrepaidCardDetails ?.firstName,
              lastName: consumerPrepaidCardDetails ?.lastName,
              email: consumerPrepaidCardDetails ?.emailId,
              address1: consumerPrepaidCardDetails ?.address1,
              address2: consumerPrepaidCardDetails ?.address2,
              state: consumerPrepaidCardDetails ?.state,
              city: consumerPrepaidCardDetails ?.city,
              country: consumerPrepaidCardDetails ?.country,
              postalCode: consumerPrepaidCardDetails ?.postalCode,
              dob: consumerPrepaidCardDetails ?.dateOfBirth,
              ssn: consumerPrepaidCardDetails ?.ssn,
              homePhone: { phone: consumerPrepaidCardDetails ?.homePhone },
              mobilePhone: consumerPrepaidCardDetails ?.mobilePhone,
              employerState: consumerPrepaidCardDetails ?.employerState,
              govLocation: consumerPrepaidCardDetails ?.govLocation,
              govId: consumerPrepaidCardDetails ?.govIdType,
              govIdValue: consumerPrepaidCardDetails ?.govIdValue,
              govExpiryDate: consumerPrepaidCardDetails ?.govExpiredDate,
              uniqueId: consumerPrepaidCardDetails ?.uniqueId,
            },
          });
          break;
        case paymentMethodIds["USBankDepositToDebitcard"]:
          this.setState({
            ddcInputs: {
              ...ddcInputs,
              debitCardNumber: consumerDebitCardDetails ?.debitCardNumber,
              expiryDate: consumerDebitCardDetails ?.expiryDate,
            },
          });
          break;
        default:
          return null;
      }
    }
  };

  renderPaymentMethod = () => {
    const {
      hasClickNext,
      selectedPaymentMethod,
      defaultInputs,
      achDate,
      achInputs,
      zelleInputs,
      validationState,
      checkInputs,
      fieldsDisabled,
      isForcedPayment,
      prepaidCardInputs,
      inputs,
      corporateRewardInputs,
      ddcInputs,
    } = this.state;
    const { isPayeeChoicePortal } = this.props.user;
    if (hasClickNext) {
      switch (selectedPaymentMethod) {
        case paymentMethodIds["USBankCHK"]:
          return (
            <USBankCheck
              checkInputs={checkInputs}
              handleCheckChange={this.handleCheckChange}
              validationState={validationState}
              fieldsDisabled={fieldsDisabled}
              />
          );
        case paymentMethodIds["USBankACH"]:
        case paymentMethodIds["USBankRTP"]:
          return (
            <USBankACH
              achInputs={achInputs}
              handleAchChange={this.handleAchChange}
              achDate={achDate}
              handleAchDate={this.handleAchDate}
              handleBankDetails={this.handleBankDetails}
              validationState={validationState}
              handleGetValue={this.handleGetValue}
              handleResetValue={this.handleResetValue}
              handleGetValueConfirm={this.handleGetValueConfirm}
              handleResetValueConfirm={this.handleResetValueConfirm}
              fieldsDisabled={fieldsDisabled}
              isForcedPayment={isForcedPayment}
              />
          );
        case paymentMethodIds["USBankZelle"]:
          return (
            <USBankZelle
              zelleInputs={zelleInputs}
              handleZelleChange={this.handleZelleChange}
              validationState={validationState}
              fieldsDisabled={fieldsDisabled}
              />
          );
        case paymentMethodIds["PrepaidFocusNonPayroll"]:
        case paymentMethodIds["PrepaidReliaCard"]:
          return (
            <FocusRelia
              inputs={inputs}
              prepaidCardInputs={prepaidCardInputs}
              fieldsDisabled={fieldsDisabled}
              validationState={validationState}
              handleDOBActivatedAt={this.handleDOBActivatedAt}
              handleGovExpiredDate={this.handleGovExpiredDate}
              handleFocusReliaChange={this.handleFocusReliaChange}
              />
          );
        case paymentMethodIds["PlasticCorporateCard"]:
        case paymentMethodIds["DigitalCorporateCard"]:
          return (
            <CorporateRewardCard
              corporateRewardInputs={corporateRewardInputs}
              handleCorporateRewardChange={this.handleCorporateRewardChange}
              validationState={validationState}
              fieldsDisabled={fieldsDisabled}
              inputs={inputs}
              />
          );
        case paymentMethodIds["USBankDepositToDebitcard"]:
          return <USBankDDC ddcInputs={ddcInputs} />;
        default:
          return (
            isForcedPayment === 0 ? (
              <Default
                defaultInputs={defaultInputs}
                handleDefaultChange={this.handleDefaultChange}
                isPayeeChoicePortal={isPayeeChoicePortal}
                />
            ) : null
          )
      }
    }
  };

  renderSnackbar = () => {
    const { alertMessage } = this.state;
    return (
      <Notification
        variant="error"
        message={alertMessage}
        handleClose={this.hideAlertMessage}
        />
    );
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
    });
  };

  handleCancel = () => {
    this.props.history.push(`${config.baseName}/payments/paymentDetails`);
  };

  handleNext = () => {
    const { inputs } = this.state;
    const isValid = this.handleValidation();
    if (isValid) {
      let tempPayeeId = inputs.payeeId ? inputs.payeeId : "";
      tempPayeeId = tempPayeeId ?.trim();
      this.setState(
        {
          hasClickNext: true,
          validationState: {},
          inputs: { ...inputs, payeeId: tempPayeeId },
        },
        () => {
          this.fetchB2CthresholdLimits();
          this.getPayeeInfo();
          this.props.history.push({
            pathname: `${config.baseName}/payments/paymentDetails/addPayment`,
            state: {
              payeeId: this.state.inputs.payeeId || null,
            },
          });
        }
      );
    }
  };

  makePayload = () => {
    const {
      inputs,
      zelleInputs,
      checkInputs,
      defaultInputs,
      achInputs,
      achDate,
      isForcedPayment,
      selectedPaymentMethod,
      defaultInputsName,
      selectedPayeeType,
      corporateRewardInputs,
      prepaidCardInputs,
      paymentMethods,
    } = this.state;
    const { user, consumerPayeeInfo, Payee, USBankPayment } = this.props;
    const { storedPrepaidCardData } = USBankPayment;
    const cardDetails = storedPrepaidCardData ?.data ?.registrationData ?.[0];
    const isPrepaidCardSelected = [
      paymentMethodIds["PrepaidFocusNonPayroll"],
      paymentMethodIds["PrepaidReliaCard"],
      paymentMethodIds["PlasticCorporateCard"],
      paymentMethodIds["DigitalCorporateCard"],
    ].includes(selectedPaymentMethod);
    let paymentMeth = null;
    if (isPrepaidCardSelected) {
      const prepaidTypeSelected = Object.keys(paymentMethodsCode).find(
        (key) => paymentMethodsCode[key] === selectedPaymentMethod
      );
      paymentMeth = [{ paymentCode: paymentTypeCodes[prepaidTypeSelected] }];
    } else {
      paymentMeth = paymentMethods ?.filter(
        (item) => item.paymentTypeId === selectedPaymentMethod
      );
    }

    let payload = {};
    const selectedPayeeTypeCode = Payee ?.payeeTypeList ?.data ?.filter(
      (item) => item.payeeTypeId === selectedPayeeType
    ) ?.[0] ?.description;
    let commonDetails = {
      clientId: user ?.userData ?.portalProfileId || 0,
      payeeIdentifier: inputs ?.payeeId || null,
      payeeFirstName: inputs ?.firstName || null,
      payeeLastName: inputs ?.lastName || null,
      paymentReference: inputs ?.paymentRef || null,
      currency: inputs ?.currency || null,
      amount: inputs ?.paymentAmount || null,
      emailID: inputs ?.email || null,
      phoneNo: inputs ?.phoneNumber ?.phone ? `${inputs ?.phoneNumber ?.ccode}-${inputs ?.phoneNumber ?.phone}`: null,
      notes: inputs ?.notes || null,
      businessUnit: null,
      consumerID: consumerPayeeInfo ?.consumerId || null,
      paymentTypeCode: paymentMeth ?.[0] ?.paymentCode || null,
      payeeType: selectedPayeeTypeCode,
      debitAccountNumber: "",
      debitRoutingCode: "",
      checkNumber: "",
      checkFormCode: "",
      companyName:
      selectedPayeeType === PayeeType.Business ? inputs ?.companyName : null,
    };
    payload.commonDetails = { ...commonDetails };
    if (Object.keys(consumerPayeeInfo).length === 0 || isForcedPayment === 1) {
      payload.commonDetails.consumerID = 0;
      switch (selectedPaymentMethod) {
        case paymentMethodIds["USBankACH"]:
        case paymentMethodIds["USBankRTP"]:
          let achDetails = {};
          achDetails.accountType =
            achInputs ?.accountType === 1 ? "CHECKING" : "SAVINGS" || 0;
          achDetails.accountClassification = "INDIVIDUAL";
          achDetails.accountNumber = achInputs ?.accountNum || null;
          achDetails.routingNumber = achInputs ?.routingCode || null;
          achDetails.valueDate = achDate
            ? moment(achDate).format("MM/DD/YYYY")
            : null;
          payload.achDetails = { ...achDetails };
          break;
        case paymentMethodIds["USBankZelle"]:
          let zelleDetails = {};
          zelleDetails.zelleTokenType = zelleInputs ?.zelleTokenType || null;
          zelleDetails.zelleTokenValue =
            (zelleInputs ?.zelleTokenType === "email"
              ? zelleInputs ?.emailZelle
                : `${zelleInputs ?.zellePhoneNumber ?.ccode}-${zelleInputs ?.zellePhoneNumber ?.phone}`) ||
            "";
          payload.zelleDetails = { ...zelleDetails };
          break;
        case paymentMethodIds["USBankCHK"]:
          let checkDetails = {};
          checkDetails.country = checkInputs ?.checkCountry || null;
          checkDetails.city = checkInputs ?.checkCity || null;
          checkDetails.state = checkInputs ?.checkState || null;
          checkDetails.postalCode = checkInputs ?.postalCode || null;
          checkDetails.addressLine1 = checkInputs ?.checkAddressLine1 || null;
          checkDetails.addressLine2 = checkInputs ?.checkAddressLine2 || null;
          checkDetails.postalCode = checkInputs ?.checkPostalCode || null;
          payload.checkDetails = { ...checkDetails };
          break;
        case paymentMethodIds["PlasticCorporateCard"]:
        case paymentMethodIds["DigitalCorporateCard"]:
          let prepaidDetails = {};
          prepaidDetails.firstName = inputs ?.firstName || null;
          prepaidDetails.lastName = inputs ?.lastName || null;
          prepaidDetails.addressLine1 =
            corporateRewardInputs ?.addressLine1 || null;
          prepaidDetails.addressLine2 =
            corporateRewardInputs ?.addressLine2 || null;
          prepaidDetails.country = corporateRewardInputs ?.country || null;
          prepaidDetails.city = corporateRewardInputs ?.city || null;
          prepaidDetails.state = corporateRewardInputs ?.state || null;
          prepaidDetails.postalCode = corporateRewardInputs ?.postalCode || null;
          payload.prepaidDetails = { ...prepaidDetails };
          break;
        case paymentMethodIds["PrepaidFocusNonPayroll"]:
        case paymentMethodIds["PrepaidReliaCard"]:
          let focusReliaDetails = {};
          if (cardDetails ?.isName) {
            focusReliaDetails.firstName = inputs ?.firstName || null;
            focusReliaDetails.lastName = inputs ?.lastName || null;
          }
          if (cardDetails ?.isEmail) {
            focusReliaDetails.emailID = inputs ?.email || null;
          }
          if (cardDetails ?.isMobilePhone) {
            const phoneNum =
              inputs ?.phoneNumber ?.phone || prepaidCardInputs ?.mobilePhone;
            focusReliaDetails.phoneNo =
              `${inputs ?.phoneNumber ?.ccode}-${phoneNum}` || null;
          }
          if (cardDetails ?.isAddress) {
            focusReliaDetails.addressLine1 = prepaidCardInputs.address1 || null;
            focusReliaDetails.addressLine2 = prepaidCardInputs.address2 || null;
            focusReliaDetails.country = prepaidCardInputs.country || null;
            focusReliaDetails.city = prepaidCardInputs.city || null;
            focusReliaDetails.state = prepaidCardInputs.state || null;
            focusReliaDetails.postalCode = prepaidCardInputs.postalCode || null;
          }
          if (cardDetails ?.isDateOfBirth) {
            focusReliaDetails.dob = prepaidCardInputs.dob
              ? moment(prepaidCardInputs.dob)
                .format("MM/DD/YYYY")
                ?.split("/")
                  .join("")
                : null;
          }
          if (cardDetails ?.isSsn) {
            focusReliaDetails.ssn = prepaidCardInputs.ssn || null;
          }
          if (cardDetails ?.isHomePhone) {
            focusReliaDetails.homePhone =
              `${prepaidCardInputs ?.homePhone ?.ccode}-${prepaidCardInputs ?.homePhone ?.phone}` ||
              null;
          }
          if (cardDetails ?.isEmployeeState) {
            focusReliaDetails.employerState =
              prepaidCardInputs.employerState || null;
          }
          if (cardDetails ?.govIdTypeId) {
            const govId = prepaidCardInputs.govId || cardDetails ?.govIdValue
            focusReliaDetails.govId = govId || null;
            focusReliaDetails.govIdValue = prepaidCardInputs.govIdValue || null;
            focusReliaDetails.govExpiryDate = prepaidCardInputs.govExpiryDate
              ? moment(prepaidCardInputs.govExpiryDate)
                .format("MM/DD/YYYY")
                ?.split("/")
                  .join("")
                : null;
          }
          if (cardDetails ?.isGovLocation) {
            focusReliaDetails.govLocation =
              prepaidCardInputs.govLocation || null;
          }
          if (cardDetails ?.isUniqueId) {
            focusReliaDetails.uniqueId = prepaidCardInputs.uniqueId || null;
          }
          payload.prepaidDetails = { ...focusReliaDetails };
          break;
        default:
          let customDetailsValue = {};
          payload.commonDetails.paymentTypeCode = "";
          customDetailsValue.customFieldValue1 =
            defaultInputs ?.customField1 || null;
          customDetailsValue.customFieldValue2 =
            defaultInputs ?.customField1 || null;
          customDetailsValue.customFieldValue3 =
            defaultInputs ?.customField3 || null;
          customDetailsValue.customFieldValue4 =
            defaultInputs ?.customField4 || null;
          customDetailsValue.customFieldValue5 =
            defaultInputs ?.customField5 || null;
          payload.customDetailsValue = { ...customDetailsValue };
          payload.customDetails = { ...defaultInputsName };
          break;
      }
    }
    return trim(payload);
  };

  handleSubmit = async () => {
    const { dispatch } = this.props;
    const isValid = this.handleValidation();
    if (isValid) {
      this.setState({ validationState: {}, isLoading: true });
      const payload = this.makePayload();
      const resp = await dispatch(createPayment(payload));
      if (!resp) {
        this.setState(
          {
            alertMessage: this.props.createPaymentInfo ?.error,
            isLoading: false,
          },
          () => this.renderSnackbar()
        );
        return;
      } else {
        this.setState({ isLoading: false });
        this.handleModalOpen();
      }
    }
  };

  handlePayeeTypeChange = (e) => {
    this.resetAllPaymentMethodForm();
    this.setState({
      selectedPayeeType: e.target.value,
      selectedPaymentMethod: 0
    });
  };

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
    this.handleCancel();
  };

  handleInputChange = ({ target }) => {
    const { inputs, selectedPaymentMethod, prepaidCardInputs, fieldsDisabled } =
      this.state;
    const { name, value } = target;
    this.setState({ inputs: { ...inputs, [name]: value } });
    if (
      !fieldsDisabled &&
      [
        paymentMethodIds["PrepaidFocusNonPayroll"],
        paymentMethodIds["PrepaidReliaCard"],
      ].includes(selectedPaymentMethod) &&
      name === "phoneNumber"
    ) {
      this.setState({
        prepaidCardInputs: {
          ...prepaidCardInputs,
          mobilePhone: value ?.phone,
        },
      });
    }
  };

  handleCustomFieldsName = (name) => {
    const { defaultInputsName } = this.state;
    const customFieldsName = { ...defaultInputsName };
    switch (name) {
      case "customField1":
        customFieldsName[name] = "Custom Field1";
        return customFieldsName;
      case "customField2":
        customFieldsName[name] = "Custom Field2";
        return customFieldsName;
      case "customField3":
        customFieldsName[name] = "Custom Field3";
        return customFieldsName;
      case "customField4":
        customFieldsName[name] = "Custom Field4";
        return customFieldsName;
      case "customField5":
        customFieldsName[name] = "Custom Field5";
        return customFieldsName;
      default:
        return customFieldsName;
    }
  };

  handleDefaultChange = ({ target }) => {
    const { defaultInputs } = this.state;
    const { name, value } = target;
    const customFieldsNames = this.handleCustomFieldsName(name);
    this.setState({
      defaultInputs: {
        ...defaultInputs,
        [name]: value,
      },
      defaultInputsName: customFieldsNames,
    });
  };

  handleZelleChange = (e) => {
    const { zelleInputs } = this.state;
    this.setState({
      zelleInputs: {
        ...zelleInputs,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleAchChange = (e) => {
    const { achInputs } = this.state;
    if (e.target.name === "routingCode") {
      let finalValue = e.target.value.replace(/[^0-9]/g, "");
      this.setState(
        {
          achInputs: {
            ...achInputs,
            routingCode: finalValue,
          },
        },
        () => {
          if (this.state.achInputs.routingCode ?.length === 9) {
            this.onBlurRoutingCode(finalValue);
          }
          if (this.state.achInputs.bankName) {
            this.setState({
              achInputs: {
                ...achInputs,
                bankName: null,
                routingCode: finalValue,
              },
            });
          }
        }
      );
    } else {
      this.setState({
        achInputs: {
          ...achInputs,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  onBlurRoutingCode = (finalValue) => {
    this.props
      .dispatch(
      fetchRoutingCodes({
        routingCode: finalValue,
        rowsPerPage: 10,
        page: 0,
      })
      )
      .then((response) => {
        if (!response) {
          return false;
        }
        if (this.props.payment ?.totalCount) {
          this.setState({
            achInputs: {
              ...this.state.achInputs,
              bankName: this.props.payment ?.routingCodes[0] ?.bankName,
            },
          });
        } else {
          this.setState({
            achInputs: {
              ...this.state.achInputs,
              bankName: null,
            },
          });
        }
      });
  };

  handleCheckChange = ({ target }) => {
    const { checkInputs } = this.state;
    const { name, value } = target;
    if (name === "checkCountry") {
      this.setState({
        checkInputs: { ...checkInputs, checkCity: null, checkState: null },
      });
    }
    if (name === "checkState") {
      this.setState({
        checkInputs: { ...checkInputs, checkCity: null },
      });
    }
    if (name === "checkPostalCode") {
      let finalValue = value.replace(/[^0-9-]/g, "");
      this.setState({
        checkInputs: { ...checkInputs, checkPostalCode: finalValue },
      });
    } else {
      this.setState({
        checkInputs: {
          ...checkInputs,
          [name]: value,
        },
      });
    }
  };

  handleCorporateRewardChange = ({ target }) => {
    const { corporateRewardInputs } = this.state;
    const { name, value } = target;
    if (name === "country") {
      this.setState({
        corporateRewardInputs: {
          ...corporateRewardInputs,
          checkCity: null,
          checkState: null,
        },
      });
    }
    if (name === "state") {
      this.setState({
        corporateRewardInputs: { ...corporateRewardInputs, checkCity: null },
      });
    }
    if (name === "postalCode") {
      let finalValue = value.replace(/[^0-9-]/g, "");
      this.setState({
        corporateRewardInputs: {
          ...corporateRewardInputs,
          postalCode: finalValue,
        },
      });
    } else {
      this.setState({
        corporateRewardInputs: {
          ...corporateRewardInputs,
          [name]: value,
        },
      });
    }
  };

  handlePaymentMethodChange = (e) => {
    this.resetAllPaymentMethodForm();
    const { prepaidCardInputs } = this.state;
    const { storedPrepaidCardData } = this.props.USBankPayment;
    const govIdValue =
      storedPrepaidCardData ?.data ?.registrationData ?.[0] ?.govIdValue;
    const prepaidCardType =
      storedPrepaidCardData ?.data ?.prepaidCardData ?.[0] ?.paymentTypeId;
    if (
      govIdValue &&
      (e.target.value === paymentMethodIds["PrepaidFocusNonPayroll"] ||
        e.target.value === paymentMethodIds["PrepaidReliaCard"])
    ) {
      this.setState({
        prepaidCardInputs: {
          ...prepaidCardInputs,
          govId: govIdValue,
        },
      });
    }
    this.setState({
      selectedPaymentMethod: e.target.value,
      validationState: {},
    });
  };

  handleFocusReliaChange = ({ target }) => {
    const { name, value } = target;
    const { prepaidCardInputs } = this.state;
    this.setState({
      prepaidCardInputs: {
        ...prepaidCardInputs,
        [name]: value,
      },
    });
  };

  handleValidation = () => {
    const {
      hasClickNext,
      selectedPaymentMethod,
      inputs,
      zelleInputs,
      achInputs,
      checkInputs,
      isForcedPayment,
      corporateRewardInputs,
      prepaidCardInputs,
      selectedPayeeType,
      fieldsDisabled
    } = this.state;
    const { thresholdLimit, t } = this.props;
    let isValid = true;
    let validation = {};
    const amountReg = /^\d{1,8}(\.\d{0,2})?$/
    const emailReg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      inputs.payeeId === null ||
        inputs.payeeId ?.length === 0 ||
          inputs.payeeId ?.trim() === null ||
            inputs.payeeId ?.trim() ?.length === 0
    ) {
      validation["payeeId"] = t("componentData.addPayment.errors.payeeId");
      isValid = false;
    }
    if (hasClickNext) {
      if (!selectedPayeeType) {
        validation["payeeType"] = t("componentData.addPayment.errors.payeeType");
        isValid = false;
      }
      if (selectedPayeeType !== PayeeType.Business &&
        (inputs.firstName === null ||
          inputs.firstName ?.length === 0 ||
            inputs.firstName ?.trim() === null ||
              inputs.firstName ?.trim() ?.length === 0)
      ) {
        validation["firstName"] = t(
          "componentData.addPayment.errors.firstName"
        );
        isValid = false;
      }
      if (selectedPayeeType !== PayeeType.Business &&
        (inputs.lastName === null ||
          inputs.lastName ?.length === 0 ||
            inputs.lastName ?.trim() === null ||
              inputs.lastName ?.trim() ?.length === 0)
      ) {
        validation["lastName"] = t("componentData.addPayment.errors.lastName");
        isValid = false;
      }
      if (
        inputs.email === null ||
          inputs.email ?.length === 0 ||
            inputs.email ?.trim() === null ||
              inputs.email ?.trim() ?.length === 0
      ) {
        validation["email"] = t("componentData.addPayment.errors.emailAddress");
        isValid = false;
      }
      if (
        inputs.email !== null &&
          inputs.email ?.length !== 0 &&
          !emailReg.test(inputs.email.toLowerCase().trim())
      ) {
        validation["email"] = t(
          "componentData.addPayment.errors.emailAddressInvalid"
        );
        isValid = false;
      }
      if (
        inputs.phoneNumber ?.phone &&
          inputs.phoneNumber ?.phone !== null &&
            inputs.phoneNumber ?.phone ?.length < 10
      ) {
        validation["phoneNumber"] = t(
          "componentData.addPayment.errors.phoneLength"
        );
        isValid = false;
      }
      if (
        selectedPayeeType === PayeeType.Business &&
          !inputs ?.companyName ?.trim()
      ) {
        validation["companyName"] = t(
          "componentData.addPayment.errors.companyName"
        );
        isValid = false;
      }
      if (
        inputs.paymentRef === null ||
          inputs.paymentRef ?.length === 0 ||
            inputs.paymentRef ?.trim() === null ||
              inputs.paymentRef ?.trim() ?.length === 0
      ) {
        validation["paymentRef"] = t(
          "componentData.addPayment.errors.paymentRef"
        );
        isValid = false;
      }
      if (inputs.paymentAmount === null || inputs.paymentAmount ?.length === 0) {
        validation["paymentAmount"] = t(
          "componentData.addPayment.errors.paymentAmount"
        );
        isValid = false;
      } else if (!amountReg.test(inputs.paymentAmount)) {
        validation["paymentAmount"] = t("componentData.addPayment.errors.invalidPaymentAmount")
        isValid = false;
      }
      if (
        inputs.paymentAmount !== null &&
          inputs.paymentAmount ?.length !== 0 &&
            thresholdLimit ?.data ?.length !== 0 &&
              isForcedPayment === 1
      ) {
        let selectedMethodId = selectedPaymentMethod, isCorporate = false
        if (
          [paymentMethodIds["PrepaidCorporateReward"],
          paymentMethodIds["PlasticCorporateCard"],
          paymentMethodIds["DigitalCorporateCard"]
          ].includes(selectedPaymentMethod)) {
          selectedMethodId = paymentMethodIds["USBankPrepaidCard"]
          isCorporate = true
        }
        const selectedPaymentThresholdData = thresholdLimit ?.data ?.filter(
          (item) => item.paymentTypeId === selectedMethodId
        );
        if (selectedPaymentThresholdData ?.length) {
          const selectedPaymentThresholdAmount = parseFloat(
            selectedPaymentThresholdData[0] ?.thresholdAmount
          );
          let minCorporateThreshold = null
          if (isCorporate) {
            minCorporateThreshold = parseFloat(
              selectedPaymentThresholdData[0] ?.corpRewardCardThresholdMin
          );
          }
          if (isCorporate) {
            if ((minCorporateThreshold && (inputs.paymentAmount < minCorporateThreshold)) || (inputs.paymentAmount > selectedPaymentThresholdAmount)) {
              validation["paymentAmountThreshold"] = t(
                "componentData.addPayment.errors.corporateRewardThreshold",
                {
                  method:
                  t("componentData.addPayment.labels.corporateRewardCard"),
                  amount: parseFloat(
                    selectedPaymentThresholdData[0] ?.thresholdAmount
                ).toLocaleString("en-us"),
                  corpRewardCardThresholdMin: parseFloat(
                    selectedPaymentThresholdData[0] ?.corpRewardCardThresholdMin
                ).toLocaleString("en-us"),
                }
              )
              isValid = false;
            }
          } else {
            if (inputs.paymentAmount > selectedPaymentThresholdAmount) {
              validation["paymentAmountThreshold"] = t(
                "componentData.addPayment.errors.threshold",
                {
                  method: selectedPaymentThresholdData[0] ?.b2cDescription,
                  amount: parseFloat(
                    selectedPaymentThresholdData[0] ?.thresholdAmount
                ).toLocaleString("en-us"),
                }
              );
              isValid = false;
            }
          }

        }
      }
      if (isForcedPayment === 1 && selectedPaymentMethod === 0) {
        validation["paymentMethodSelection"] = t(
          "componentData.addPayment.errors.paymentMethod"
        );
        isValid = false;
      }
      if (selectedPaymentMethod === paymentMethodIds["USBankZelle"]) {
        if (
          zelleInputs.zelleTokenType === "phone" &&
          (!zelleInputs.zellePhoneNumber ?.phone ||
            zelleInputs.zellePhoneNumber ?.phone === null ||
              zelleInputs.zellePhoneNumber ?.phone ?.length === 0)
        ) {
          validation["zellePhoneNumber"] = t(
            "componentData.addPayment.errors.phone"
          );
          isValid = false;
        }
        if (
          zelleInputs.zelleTokenType === "phone" &&
            zelleInputs.zellePhoneNumber ?.phone &&
              zelleInputs.zellePhoneNumber ?.phone !== null &&
                zelleInputs.zellePhoneNumber ?.phone ?.length < 10
        ) {
          validation["zellePhoneNumber"] = t(
            "componentData.addPayment.errors.phoneLength"
          );
          isValid = false;
        }
        if (
          zelleInputs.zelleTokenType === "email" &&
          (zelleInputs.emailZelle === null ||
            zelleInputs.emailZelle ?.length === 0 ||
              zelleInputs.emailZelle ?.trim() === null ||
                zelleInputs.emailZelle ?.trim() ?.length === 0)
        ) {
          validation["emailZelle"] = t(
            "componentData.addPayment.errors.emailAddress"
          );
          isValid = false;
        }
        if (
          zelleInputs.zelleTokenType === "email" &&
            zelleInputs.emailZelle !== null &&
            zelleInputs.emailZelle ?.length !== 0 &&
            !emailReg.test(zelleInputs.emailZelle.toLowerCase().trim())
        ) {
          validation["emailValidZelle"] = t(
            "componentData.addPayment.errors.emailAddressInvalid"
          );
          isValid = false;
        }
      } else if (
        selectedPaymentMethod === paymentMethodIds["USBankACH"] ||
        selectedPaymentMethod === paymentMethodIds["USBankRTP"]
      ) {
        if (
          achInputs.accountNum === null ||
            achInputs.accountNum ?.length === 0 ||
              achInputs.accountNum ?.trim() === null ||
                achInputs.accountNum ?.trim() ?.length === 0
        ) {
          validation["accountNum"] = t(
            "componentData.addPayment.errors.accountNum"
          );
          isValid = false;
        }
        if (
          achInputs.confirmAccountNum === null ||
            achInputs.confirmAccountNum ?.length === 0 ||
              achInputs.confirmAccountNum ?.trim() === null ||
                achInputs.confirmAccountNum ?.trim() ?.length === 0
        ) {
          validation["confirmAccountNum"] = t(
            "componentData.addPayment.errors.confirmAccountNum"
          );
          isValid = false;
        }
        if (
          achInputs.confirmAccountNum ?.length !== 0 &&
            achInputs.accountNum ?.length !== 0 &&
            achInputs.confirmAccountNum !== achInputs.accountNum
        ) {
          validation["sameAccountNumber"] = t(
            "componentData.addPayment.errors.sameAs"
          );
          isValid = false;
        }
        if (
          achInputs.routingCode === null ||
            achInputs.routingCode ?.length === 0 ||
              achInputs.routingCode ?.trim() === null ||
                achInputs.routingCode ?.trim() ?.length === 0
        ) {
          validation["routingCode"] = t(
            "componentData.addPayment.errors.routingCode"
          );
          isValid = false;
        }
        if (achInputs.bankName === null || achInputs.bankName ?.length === 0) {
          validation["bankName"] = t("componentData.addPayment.errors.bank");
          isValid = false;
        }
        if (!achInputs.accountType) {
          validation["accountType"] = t(
            "componentData.addPayment.errors.accountType"
          );
          isValid = false;
        }
      } else if (selectedPaymentMethod === paymentMethodIds["USBankCHK"]) {
        if (
          checkInputs.checkAddressLine1 === null ||
            checkInputs.checkAddressLine1 ?.length === 0 ||
              checkInputs.checkAddressLine1 ?.trim() === null ||
                checkInputs.checkAddressLine1 ?.trim() ?.length === 0
        ) {
          validation["checkAddressLine1"] = t(
            "componentData.addPayment.errors.address1"
          );
          isValid = false;
        }
        if (
          checkInputs.checkCountry === null ||
            checkInputs.checkCountry ?.length === 0
        ) {
          validation["checkCountry"] = t(
            "componentData.addPayment.errors.country"
          );
          isValid = false;
        }
        if (
          checkInputs.checkState === null ||
            checkInputs.checkState ?.length === 0
        ) {
          validation["checkState"] = t("componentData.addPayment.errors.state");
          isValid = false;
        }
        if (
          checkInputs.checkCity === null ||
            checkInputs.checkCity ?.length === 0
        ) {
          validation["checkCity"] = t("componentData.addPayment.errors.city");
          isValid = false;
        }
        if (
          checkInputs.checkPostalCode === null ||
            checkInputs.checkPostalCode ?.length === 0
        ) {
          validation["checkPostalCode"] = t(
            "componentData.addPayment.errors.zipCode"
          );
          isValid = false;
        } else if (checkInputs.checkPostalCode ?.length < 5) {
          validation["checkPostalCode"] = t(
            "componentData.addPayment.errors.zipCodeLength"
          );
          isValid = false;
        }
      } else if (
        selectedPaymentMethod === paymentMethodIds["PlasticCorporateCard"] ||
        selectedPaymentMethod === paymentMethodIds["DigitalCorporateCard"]
      ) {
        if (
          corporateRewardInputs.addressLine1 === null ||
            corporateRewardInputs.addressLine1 ?.length === 0 ||
              corporateRewardInputs.addressLine1 ?.trim() === null ||
                corporateRewardInputs.addressLine1 ?.trim() ?.length === 0
        ) {
          validation["addressLine1"] = t(
            "componentData.addPayment.errors.address1"
          );
          isValid = false;
        }
        if (
          corporateRewardInputs.country === null ||
            corporateRewardInputs.country ?.length === 0
        ) {
          validation["country"] = t("componentData.addPayment.errors.country");
          isValid = false;
        }
        if (
          corporateRewardInputs.state === null ||
            corporateRewardInputs.state ?.length === 0
        ) {
          validation["state"] = t("componentData.addPayment.errors.state");
          isValid = false;
        }
        if (
          corporateRewardInputs.city === null ||
            corporateRewardInputs.city ?.length === 0
        ) {
          validation["city"] = t("componentData.addPayment.errors.city");
          isValid = false;
        }
        if (
          corporateRewardInputs.postalCode === null ||
            corporateRewardInputs.postalCode ?.length === 0
        ) {
          validation["postalCode"] = t(
            "componentData.addPayment.errors.zipCode"
          );
          isValid = false;
        } else if (corporateRewardInputs.postalCode ?.length < 5) {
          validation["postalCode"] = t(
            "componentData.addPayment.errors.zipCodeLength"
          );
          isValid = false;
        }
      } else if (
        selectedPaymentMethod === paymentMethodIds["PrepaidReliaCard"] ||
        selectedPaymentMethod === paymentMethodIds["PrepaidFocusNonPayroll"]
      ) {
        const { storedPrepaidCardData } = this.props.USBankPayment;
        const cardDetails = storedPrepaidCardData ?.data ?.registrationData ?.[0];
        if (cardDetails ?.isDateOfBirth && !prepaidCardInputs ?.dob ?.trim()) {
          validation["dob"] = t("componentData.addPayment.errors.dob");
          isValid = false;
        }
        if (cardDetails ?.isMobilePhone) {
          if (!prepaidCardInputs ?.mobilePhone && !(fieldsDisabled || inputs.phoneNumber ?.phone)) {
            validation["mobilePhone"] = t(
              "componentData.addPayment.errors.mobilePhone"
            );
            isValid = false;
          } else if (
            prepaidCardInputs ?.mobilePhone &&
              prepaidCardInputs ?.mobilePhone ?.length < 10
          ) {
            validation["mobilePhone"] = t(
              "componentData.addPayment.errors.mobilePhoneLength"
            );
            isValid = false;
          }
        }
        if (cardDetails ?.isAddress) {
          if (
            prepaidCardInputs.address1 === null ||
              prepaidCardInputs.address1 ?.length === 0 ||
                prepaidCardInputs.address1 ?.trim() === null ||
                  prepaidCardInputs.address1 ?.trim() ?.length === 0
          ) {
            validation["address1"] = t(
              "componentData.addPayment.errors.address1"
            );
            isValid = false;
          }
          if (
            prepaidCardInputs.country === null ||
              prepaidCardInputs.country ?.length === 0
          ) {
            validation["country"] = t(
              "componentData.addPayment.errors.country"
            );
            isValid = false;
          }
          if (
            prepaidCardInputs.state === null ||
              prepaidCardInputs.state ?.length === 0
          ) {
            validation["state"] = t("componentData.addPayment.errors.state");
            isValid = false;
          }
          if (
            prepaidCardInputs.city === null ||
              prepaidCardInputs.city ?.length === 0
          ) {
            validation["city"] = t("componentData.addPayment.errors.city");
            isValid = false;
          }
          if (
            prepaidCardInputs.postalCode === null ||
              prepaidCardInputs.postalCode ?.length === 0
          ) {
            validation["postalCode"] = t(
              "componentData.addPayment.errors.zipCode"
            );
            isValid = false;
          } else if (prepaidCardInputs.postalCode ?.length < 5) {
            validation["postalCode"] = t(
              "componentData.addPayment.errors.zipCodeLength"
            );
            isValid = false;
          }
        }
        if (cardDetails ?.isSsn && !prepaidCardInputs ?.ssn ?.trim()) {
          validation["ssn"] = t("componentData.addPayment.errors.ssn");
          isValid = false;
        }
        if (cardDetails ?.isHomePhone) {
          if (
            !prepaidCardInputs.homePhone ?.phone ||
              prepaidCardInputs.homePhone ?.phone === null ||
                prepaidCardInputs.homePhone ?.phone ?.length === 0
          ) {
            validation["phone"] = t(
              "componentData.addPayment.errors.homePhone"
            );
            isValid = false;
          } else if (
            prepaidCardInputs.homePhone ?.phone &&
              prepaidCardInputs.homePhone ?.phone !== null &&
                prepaidCardInputs.homePhone ?.phone ?.length < 10
          ) {
            validation["phone"] = t(
              "componentData.addPayment.errors.homePhoneLength"
            );
            isValid = false;
          }
        }

        if (!prepaidCardInputs ?.employerState ?.trim()) {
          validation["employerState"] = t(
            "componentData.addPayment.errors.employerState"
          );
          isValid = false;
        }
        if (!prepaidCardInputs ?.employerState ?.trim()) {
          validation["employerState"] = t(
            "componentData.addPayment.errors.employerState"
          );
          isValid = false;
        }
        if (cardDetails ?.govIdTypeId) {
          // if (!prepaidCardInputs?.govId?.trim()) {
          //   validation["govIdType"] = t(
          //     "componentData.addPayment.errors.govIdType"
          //   );
          //   isValid = false;
          // }
          if (!prepaidCardInputs ?.govExpiryDate ?.trim()) {
            validation["govExpiredDate"] = t(
              "componentData.addPayment.errors.govExpiredDate"
            );
            isValid = false;
          }
          if (!prepaidCardInputs ?.govIdValue ?.trim()) {
            validation["govIdValue"] = t(
              "componentData.addPayment.errors.govIdValue"
            );
            isValid = false;
          }
        }

        if (
          cardDetails ?.isGovLocation &&
            !prepaidCardInputs ?.govLocation ?.trim()
        ) {
          validation["govLocation"] = t(
            "componentData.addPayment.errors.govLocation"
          );
          isValid = false;
        }
        if (cardDetails ?.isUniqueId && !prepaidCardInputs ?.uniqueId ?.trim()) {
          validation["uniqueId"] = t(
            "componentData.addPayment.errors.uniqueId"
          );
          isValid = false;
        }
      }
    }

    this.setState({ validationState: validation });
    return isValid;
  };

  resetAllPaymentMethodForm = () => {
    const {
      selectedPaymentMethod,
      zelleInputs,
      checkInputs,
      achInputs,
      corporateRewardInputs,
      prepaidCardInputs,
    } = this.state;
    switch (selectedPaymentMethod) {
      case paymentMethodIds["USBankZelle"]:
        this.setState({
          zelleInputs: {
            ...zelleInputs,
            zelleTokenType: "email",
            zellePhoneNumber: null,
            emailZelle: null,
          },
        });
        break;
      case paymentMethodIds["USBankACH"]:
      case paymentMethodIds["USBankRTP"]:
        this.setState({
          achInputs: {
            ...achInputs,
            accountType: 0,
            routingCode: null,
            bankName: null,
            accountNum: null,
            confirmAccountNum: null,
          },
          achDate: null,
        });
        break;
      case paymentMethodIds["USBankCHK"]:
        this.setState({
          checkInputs: {
            ...checkInputs,
            checkDebtorAccountNum: null,
            checkDebtorRoutingCode: null,
            checkCheckNumber: null,
            checkCheckFormCode: null,
            checkAddressLine1: null,
            checkAddressLine2: null,
            checkCountry: null,
            checkState: null,
            checkCity: null,
            checkPostalCode: null,
          },
        });
        break;
      case paymentMethodIds["PlasticCorporateCard"]:
      case paymentMethodIds["DigitalCorporateCard"]:
        this.setState({
          corporateRewardInputs: {
            ...corporateRewardInputs,
            addressLine1: null,
            addressLine2: null,
            country: null,
            state: null,
            city: null,
            postalCode: null,
          },
        });
        break;
      case paymentMethodIds["PrepaidFocusNonPayroll"]:
      case paymentMethodIds["PrepaidReliaCard"]:
        this.setState({
          prepaidCardInputs: {
            ...prepaidCardInputs,
            dob: null,
            ssn: null,
            homePhone: null,
            mobilePhone: null,
            employerState: null,
            govIdValue: null,
            govExpiryDate: null,
            govLocation: null,
            uniqueId: null,
            address1: null,
            address2: null,
            country: null,
            state: null,
            city: null,
            postalCode: null,
          },
        });
        break;
      default:
        return null;
    }
  };

  handleForcedPayment = (val) => {
    const { consumerPayeeInfo } = this.props;
    this.setState({ isForcedPayment: val, validationState: {} });
    if (val === 0 && Object.keys(consumerPayeeInfo).length !== 0) {
      this.setState(
        {
          fieldsDisabled: true,
          selectedPaymentMethod: consumerPayeeInfo ?.primaryPaymentMethodId || 0,
          paymentMethods: this.props ?.thresholdLimit ?.data,
        },
        () => {
          this.mapPaymentDetails();
        }
      );
    } else {
      const newPaymentMethods = this.props.thresholdLimit ?.data;
      const data = newPaymentMethods ?.filter(
        (item) =>
          item.paymentTypeId !== paymentMethodIds["USBankDepositToDebitcard"]
      );
      this.setState({ paymentMethods: data, fieldsDisabled: false });
      this.resetAllPaymentMethodForm();
      this.setState({ selectedPaymentMethod: 0 });
    }
  };

  handleAchDate = (val) => {
    this.setState({ achDate: val });
  };

  handleBankDetails = (bankData) => {
    const { achInputs } = this.state;
    this.setState({
      achInputs: {
        ...achInputs,
        routingCode: bankData.routingCode,
        bankName: bankData.bankName,
      },
    });
  };

  handleGetValue = (val) => {
    const { achInputs } = this.state;
    this.setState({
      achInputs: { ...achInputs, accountNum: val },
    });
  };

  handleResetValue = () => {
    const { achInputs } = this.state;
    this.setState({
      achInputs: { ...achInputs, accountNum: null },
    });
  };

  handleGetValueConfirm = (val) => {
    const { achInputs } = this.state;
    this.setState({
      achInputs: { ...achInputs, confirmAccountNum: val },
    });
  };

  handleResetValueConfirm = () => {
    const { achInputs } = this.state;
    this.setState({
      achInputs: { ...achInputs, confirmAccountNum: null },
    });
  };

  handleDOBActivatedAt = (date) => {
    const { prepaidCardInputs } = this.state;
    this.setState({
      prepaidCardInputs: {
        ...prepaidCardInputs,
        dob: date.toLocaleDateString(),
      },
    });
  };

  handleGovExpiredDate = (date) => {
    const { prepaidCardInputs } = this.state;
    this.setState({
      prepaidCardInputs: {
        ...prepaidCardInputs,
        govExpiryDate: date.toLocaleDateString(),
      },
    });
  };

  render() {
    const {
      inputs,
      validationState,
      selectedPaymentMethod,
      hasClickNext,
      modalOpen,
      paymentMethods,
      isForcedPayment,
      isLoading,
      alertMessage,
      selectedPayeeType,
      fieldsDisabled
    } = this.state;
    const { classes, t } = this.props;
    const tooltipObj = {
      title: t("componentData.addPayment.tooltip.payeeId"),
      arrow: true,
      placement: "top-end",
    };
    return (
      <>
      <Box className={classes.navigationBox}>
        <Link to={`${config.baseName}/payments/paymentDetails`}>
          <Box className={classes.navigationBoxItem}>
            <ArrowBackIcon />{" "}
            {t("componentData.addPayment.headings.myPayments")} &nbsp;
            </Box>
        </Link>
        / {t("componentData.addPayment.headings.addPayment")}
      </Box>
      <Paper elevation={2} className={classes.container}>
        <Typography style={{ marginBottom: "24px" }}>
          {t("componentData.addPayment.headings.payeeDetails")}
        </Typography>
        {!hasClickNext && (
          <Grid container xs={12} spacing={2}>
            <Grid item xs={6}>
              <TextField
                tooltipProps={tooltipObj}
                variant="outlined"
                name="payeeId"
                label={t("componentData.addPayment.labels.payeeId")}
                value={inputs.payeeId}
                onChange={this.handleInputChange}
                fullWidth={true}
                required
                error={Boolean(validationState["payeeId"])}
                helperText={
                  (validationState && validationState["payeeId"]) || ""
                }
                inputProps={{
                  maxLength: 50,
                }}
                />
            </Grid>
          </Grid>
        )}
        {hasClickNext && (
          <PaymentInformation
            inputs={inputs}
            handleInputChange={this.handleInputChange}
            selectedPaymentMethod={selectedPaymentMethod}
            selectedPayeeType={selectedPayeeType}
            handlePaymentMethodChange={this.handlePaymentMethodChange}
            handlePayeeTypeChange={this.handlePayeeTypeChange}
            paymentMethods={paymentMethods || []}
            isForcedPayment={isForcedPayment}
            handleForcedPayment={this.handleForcedPayment}
            validationState={validationState}
            hasClickNext={hasClickNext}
            fieldsDisabled={fieldsDisabled}
            />
        )}
        {this.renderPaymentMethod()}
      </Paper>
      <Box className={classes.buttonGroup}>
        {hasClickNext ? (
          !isLoading ? (
              <>
            <Button
              color="primary"
              variant="outlined"
              style={{ flexBasis: "140px" }}
              onClick={this.handleCancel}
              >
              {t("componentData.addPayment.buttons.cancel")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              style={{ flexBasis: "140px" }}
              onClick={this.handleSubmit}
              >
              {t("componentData.addPayment.buttons.submit")}
            </Button>
              </>
            ) : (
              <Box>
          <CircularProgress />
        </Box>
        )
          ) : (
            <>
          <Button
            color="primary"
            variant="outlined"
            style={{ flexBasis: "140px" }}
            onClick={this.handleCancel}
            >
            {t("componentData.addPayment.buttons.cancel")}
          </Button>
          <Button
            color="primary"
            variant="contained"
            style={{ flexBasis: "140px" }}
            onClick={this.handleNext}
            >
            {t("componentData.addPayment.buttons.next")}
          </Button>
        </>
        )}
        </Box>
      <AddPaymentModal
        modalOpen={modalOpen}
        handleModalClose={this.handleModalClose}
        desc={t("componentData.addPayment.modalDesc.addedSuccessfully")}
        />
        {alertMessage && this.renderSnackbar() }
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.b2cPayments,
    ...state.payment,
    ...state.USBankPayment,
    ...state.Payee,
  }))(withStyles(styles)(USBankAddPayments))
);
