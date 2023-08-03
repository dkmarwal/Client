import React, { Component } from 'react';

import {
  Paper,
  Box,
  Grid,
  CircularProgress, Tabs,Tab,
} from "@material-ui/core";
import {
  fetchB2CGeneralSettingsPermissions,
  fetchB2CLookUpforPermissions,
  saveB2CPermissionsData,
  getB2CGeneralSettingConfig,
} from "~/redux/helpers/settings";
import { TabPanel } from "~/components/TabPanel/index";

import {
  getB2CPreferredClientPaymentTypes,
} from "~/redux/actions/B2C/payments";
import {getUSBankClientPaymentTypes} from "~/redux/actions/USbank/payments"
import { paymentMethodFileFormatIds } from '~/config/paymentMethods';

import "./styles.scss";
import { connect } from "react-redux";
import Notification from "~/components/Notification";
import { withTranslation } from "react-i18next";
import { accessRights } from "~/config/accessRights";
import PaymentSettings from './PaymentSettings';
import OtherSettings from './OtherSettings';

class GeneralSettings extends Component {
  state = {
    isLoading: true,
    savingData: false,
    dialogMessage: "",
    isDialogActive: false,
    // reconciliationReportTime: "",
    // reportFileFormat: "",
    isPaymentDecisonEngine: false,
    isSupplierPlatformTnC: false,
    isSupplierProfileAutoApprovals: false,
    isSupplierRemitToIDMapping: false,
    isPayeeUpdateAllowed: false,
    canApprovePayeeProfile: false,
    checkedList: [],
    fileTypes: [],
    list: [],
    permissionList: [],
    validation: {},
    isEnableCheckswithCDM: false,
    variant: "",
    zelleSelectedByClient: true,
    defaultPaymentMethod: false,
	  preEnrollmentPaymentHistory: false,
    expiredCampaigns: false,
    stalePayeeProfileDecision: false,
    stalePayeeProfilePaymentDecision: false, dormantProfile: false,
    stalePayeeProfileDefaultPaymentMethod: 0,//default to blank
    zelleUnknownReceipientSupport: false,
    authorizeDebit: false, unknownReceipt: "", pickZelleToken: false,
    citiConnectId: "",
    campaignExpiryDays: "", 
    payeeProfileDays: "",
    emailAlertToProfileDays: "",
    thZelle: "",
    thRtp: "",
    thDepositToDebit: "",
    thCorpRewardCard: "",
    minthCorpRewardCard: "",
    thMaster: "", 
    thPaypal: "",
    paymentAmountTh: "",
    ddDays: "",
    paymentAuthExpDays: "",
    cardExpiryAlertDays: "",
    payeePaymentAuthTh: false,
    paymentAuthSMS: false, 
    paymentAuthEmail: false, 
    paymentAuthExpiry: false,
    paymentAmountThPayer: "",
    alternatePaymentOption: false,
    alternatePaymentOptionACH: false, alternatePaymentOptionCHK: false, oneTimePreference: false,
    isCampaignFileApprovalRequired: false,
    isReportingEnabled: false,
    paymentReconciliationTime: "",
    enrollmentMode: false,
    enrollmentModeEmail: false,
    enrollmentModeSMS: false,
    campaignReminderDays: "",
    payeePaymentAcceptanceExpiryDays: "",
    bessId: "",
    clientBillingBranch: "",
    clientBillingAccount: "",
    isSsnMandatory: false,
    paymentAuthNonCDM: false,
    paymentAuthCDM: false,
    isMFARequired: false,
    isMFARequiredPaymentInfo: false,
    isMFARequiredPassword: false,
    isMFARequiredLogin: false,
    isMFARequiredRegistration: false,
    isMFARequiredPasswordReset: false,
    isMFARequiredPaymentPreference: false,
    isMFAForgotPassword: false,
    isMFAForgotUsername: false,
    defaultPaymentClientReport: false,
    paymentReconciliationReport: false,
    enrollmentReport: false,
    rejectEmailReport: false,
    rejectSMSReport: false,
    defaultPaymentMethodSelected: '0',
    defaultPaymentMethodB2BSelected:'0',
    overwriteIncomingPaymentType: false,
    valueDateAssignment: false,
    selectedTab: 0,
    mfaAttemptsAllowed: "",
    PreferredPaymentMethod: [],
    PreferredPrepaidPaymentMethod:[],
    preferredPaymentMethodCheked: false,
    selectedPreferredPaymentMethod: [],
    ACHPreferredPayment: false,
    CHKPreferredPayment: false,
    PayPalPreferredPayment: false,
    PushToCardPreferredPayment: false,
    ZellePreferredPayment: false,
    USbankPPDPreferredPayment: false,
    USbankDDCPreferredPayment: false,
    USbankCHKPreferredPayment: false,
    USBankZellePreferredPayment: false,
    USbankACHPreferredPayment:false,
    USbankRTPPreferredPayment:false,
    payerPaymentAmountTh: false,
    noOfAttemptsAllowedToResendOtp : "",
    otpExpiryTime: "",
    reconciliationReport: false,
    rejectedDeliveryReport: false,
    dailyStatusReport: false,
    dailyEnrollmentReport: false,
    smsOptOutReport: false,
    payerPaymentAuthTh: false,
    isPayeeAuthenticationUsingOTP: false,
    noOfAttemptsToResendOtpPayeeAuth: "", 
    otpExpiryTimePayeeAuth: "", 
    isAVS: 0,
    isAVSAccountStatus: 0,
    isAVSAccountStatusOwnership: 0,
    //isReportFixedTime: 0,
    //isReportFrequencyBasis: 1,
    transmissionFrequency:0,
  };

  componentDidMount = async () => {
    const { isPayeeChoicePortal } = this.props.user;
    await this.getPermissionList();
    await this.getAssignedPermissions();
    //check for zelle payment method
    this.fetchB2CPreferredClientPaymentTypes();
    if(isPayeeChoicePortal){
    this.fetchPrepaidPreferredClientPaymentTypes();}
    this.getGeneralSettingConfig();
  }

  getGeneralSettingConfig() {
    const clientId = this.props.user.userData.portalProfileId;
    const { isPayeeChoicePortal } = this.props.user;
    getB2CGeneralSettingConfig(clientId).then((res) => {
      if (res.error) {
        this.setDialogMessage(true, res.message, "error");
        return false;
      }
      const {
        isPaymentDecisonEngine,
        noOfDaysBeforeEnrolmentExpire,
        zelleThreshold,
        bankDepositRTPThreshold,
        depositToDebitCardThreshold,
        corpRewardCardThreshold,
        corpRewardCardThresholdMin,
        masterCardThreshold,
        campaignExpiryDays,
        payPalThreshold,
        paymentAuthorizationExpiryDays,
        cardExpiryAlertInDays,
        duplicatePaymentCheckDays,
        paymentAmountThreshold,
        payeeProfileReVerificationDays,
        noOfDaysForPayeeProfileAlert,
        campaignFileApprovalRequired,
        alternatePaymentMethodIsAch,
        alternatePaymentMethodIsChk,
        paymentAuthorizationMethodSms,
        paymentAuthorizationMethodEmail,
        paymentAuthorizationAboveThreshold,
        zelleTokenFromConsumer,
        isAuthorizeDebit,
        processPaymentAfterCampaignExpire,
        markPayeeProfileDormant,
        allowRegisterViaZella,
        staleProfilePaymentDecisionIsDormant,
        staleProfilePaymentDecisionIsDefaultPaymentMethod,
        paymentReconciliationTime,
        isOneTimePayment,
        useDefaultPaymentMethod, 
        isPreEnrollmentPaymentHistoryAllowed, 
        fileFormatId,
        fileFormatIdB2B,
        isEmailCampaign, isSmsCampaign,
        isSsnMandatory,
        bessId,
        clientBillingBranch,
        clientBillingAccount,
        paymentAuthorizationAboveThreshold_NonCdm,
        paymentAuthorizationAboveThreshold_Cdm,
        processPaymentToDefaultMethod_afterAuthExpired,
        campaignReminderDays,
        isPaymentMfaRequired, 
        isPasswordMfaRequired,
        isDefaultPaymentReport, 
        isPaymentReconciliationReport, 
        isEnrollmentReport, 
        isEmailRejectReport, 
        isSmsRejectReport,
        isReconciliationReport,
        isRejectedDeliveryReport,
        isDailyStatusReport,
        isDailyEnrollmentReport,
        isOptOutSMSReport,
        payeePaymentAcceptanceExpiryDays, 
        mfaAttemptsAllowed, 
        isMFALoginRequired, 
        isMFARegistrationRequired, 
        isMFAPasswordResetRequired, 
        isMFAPaymentPreferenceRequired, 
        isMFAForgotPasswordRequired, 
        isMFAForgotUsernameRequired, 
        preferredPaymentMethodIds,
        isPaymentAuthorizationByPayerAboveThreshold,
        paymentAmountThresholdForPayer,
        noOfAttemptsAllowedToResendOtp,
        otpExpiryTime,
        isPayeeAuthenticationUsingOTP,
        noOfAttemptsToResendOtpPayeeAuth,
        otpExpiryTimePayeeAuth,
        isAVS,
        isAVSAccountStatus,
        isAVSAccountStatusOwnership,
        //isReportFixedTime,
        //isReportFrequencyBasis,
        transmissionFrequency,
      } = res.data;

      this.setState({
        defaultPaymentMethod: useDefaultPaymentMethod,
	    	preEnrollmentPaymentHistory: isPreEnrollmentPaymentHistoryAllowed,
        // defaultPaymentMethodSelected: `${fileFormatId}`,
        // defaultPaymentMethodB2BSelected:`${fileFormatIdB2B}`,
        defaultPaymentMethodSelected: !isPayeeChoicePortal?`${fileFormatId}`:!fileFormatId?`${0}`: `${fileFormatId}`,
        defaultPaymentMethodB2BSelected:!fileFormatIdB2B?`${0}`: `${fileFormatIdB2B}`,
        isPaymentDecisonEngine: isPaymentDecisonEngine,
        expiredCampaigns: processPaymentAfterCampaignExpire,
        stalePayeeProfileDecision: markPayeeProfileDormant,
        //stalePayeeProfilePaymentDecision:false, dormantProfile:false,
        authorizeDebit: isAuthorizeDebit, pickZelleToken: zelleTokenFromConsumer,
        unknownReceipt: noOfDaysBeforeEnrolmentExpire || "",
        //citiConnectId:clientCitiConnectId || "",//Removed in ticket FSINPAYB2B-8443, general setting version1.3
        campaignExpiryDays: campaignExpiryDays || "",
        payeeProfileDays: payeeProfileReVerificationDays || "",
        emailAlertToProfileDays: noOfDaysForPayeeProfileAlert || "",
        thZelle: zelleThreshold || "",
        thRtp: bankDepositRTPThreshold || "",
        thDepositToDebit: depositToDebitCardThreshold || "",
        thCorpRewardCard: corpRewardCardThreshold || "",
        minthCorpRewardCard:corpRewardCardThresholdMin || "",
        thMaster: masterCardThreshold || "",
        thPaypal: payPalThreshold || "",
        paymentAmountTh: paymentAmountThreshold || "",
        ddDays: duplicatePaymentCheckDays || "",
        cardExpiryAlertDays: cardExpiryAlertInDays || "",
        paymentAuthExpDays: paymentAuthorizationExpiryDays || "",
        payeePaymentAuthTh: paymentAuthorizationAboveThreshold,
        paymentAuthSMS: paymentAuthorizationMethodSms, paymentAuthEmail: paymentAuthorizationMethodEmail,
        paymentAuthExpiry: processPaymentToDefaultMethod_afterAuthExpired,
        alternatePaymentOption: (alternatePaymentMethodIsAch || alternatePaymentMethodIsChk),
        alternatePaymentOptionACH: alternatePaymentMethodIsAch, alternatePaymentOptionCHK: alternatePaymentMethodIsChk,
        isCampaignFileApprovalRequired: campaignFileApprovalRequired,
        isPayeeAuthenticationUsingOTP: isPayeeAuthenticationUsingOTP,
        stalePayeeProfilePaymentDecision: (staleProfilePaymentDecisionIsDormant || staleProfilePaymentDecisionIsDefaultPaymentMethod),//staleProfilePaymentDecisionIsDormant,
        stalePayeeProfileDefaultPaymentMethod: staleProfilePaymentDecisionIsDormant ? "1" : "2",// staleProfilePaymentDecisionIsDefaultPaymentMethod,
        zelleUnknownReceipientSupport: allowRegisterViaZella,
        oneTimePreference: isOneTimePayment,
        paymentReconciliationTime: paymentReconciliationTime || "",
        isSsnMandatory: isSsnMandatory,
        bessId: bessId,
        clientBillingBranch: clientBillingBranch,
        clientBillingAccount: clientBillingAccount,
        paymentAuthNonCDM: paymentAuthorizationAboveThreshold_NonCdm,
        paymentAuthCDM: paymentAuthorizationAboveThreshold_Cdm,
        enrollmentMode: (isEmailCampaign || isSmsCampaign),
        enrollmentModeEmail: isEmailCampaign,
        enrollmentModeSMS: isSmsCampaign,
        campaignReminderDays: campaignReminderDays || "",
        isMFARequired: (isMFALoginRequired || isMFARegistrationRequired || isMFAPasswordResetRequired || isMFAPaymentPreferenceRequired || isMFAForgotPasswordRequired),
        isMFARequiredPaymentInfo: isPaymentMfaRequired ? 1 : 0,
        isMFARequiredLogin: isMFALoginRequired ? 1 : 0,
        isMFARequiredRegistration: isMFARegistrationRequired ? 1 : 0,
        isMFARequiredPasswordReset: isMFAPasswordResetRequired ? 1 : 0,
        isMFARequiredPaymentPreference: isMFAPaymentPreferenceRequired ? 1 : 0,
        isMFAForgotPassword: isMFAForgotPasswordRequired ? 1 : 0,
        isMFAForgotUsername: isMFAForgotUsernameRequired ? 1 : 0,
        isMFARequiredPassword: isPasswordMfaRequired ? 1 : 0,
        isReportingEnabled: (isDefaultPaymentReport || isPaymentReconciliationReport || isEnrollmentReport || isEmailRejectReport || isSmsRejectReport || isReconciliationReport || isRejectedDeliveryReport || isDailyStatusReport || isDailyEnrollmentReport || isOptOutSMSReport),
        defaultPaymentClientReport: isDefaultPaymentReport ? 1 : 0,
        paymentReconciliationReport: isPaymentReconciliationReport ? 1 : 0,
        enrollmentReport: isEnrollmentReport ? 1 : 0,
        rejectEmailReport: isEmailRejectReport ? 1 : 0,
        rejectSMSReport: isSmsRejectReport ? 1 : 0,
        reconciliationReport: isReconciliationReport ? 1 : 0,
        rejectedDeliveryReport: isRejectedDeliveryReport ? 1 : 0,
        dailyStatusReport: isDailyStatusReport ? 1 : 0,
        dailyEnrollmentReport: isDailyEnrollmentReport ? 1 : 0,
        smsOptOutReport: isOptOutSMSReport ? 1 : 0,
        payeePaymentAcceptanceExpiryDays: payeePaymentAcceptanceExpiryDays || "",
        mfaAttemptsAllowed: mfaAttemptsAllowed,
        selectedPreferredPaymentMethod: Boolean(preferredPaymentMethodIds) && preferredPaymentMethodIds || [],
        payerPaymentAuthTh: isPaymentAuthorizationByPayerAboveThreshold,
        paymentAmountThPayer: paymentAmountThresholdForPayer,
        noOfAttemptsAllowedToResendOtp: noOfAttemptsAllowedToResendOtp,
        otpExpiryTime: otpExpiryTime || "",
        noOfAttemptsToResendOtpPayeeAuth: noOfAttemptsToResendOtpPayeeAuth || "",
        otpExpiryTimePayeeAuth: otpExpiryTimePayeeAuth || "",
        isAVS: isAVS ? 1 : 0,
        isAVSAccountStatus: isAVSAccountStatus ? 1 : 0,
        isAVSAccountStatusOwnership: isAVSAccountStatusOwnership ? 1 : 0,
        //isReportFixedTime: isReportFixedTime ? 1 : 0,
        //isReportFrequencyBasis: isReportFrequencyBasis ? 1 : 0,
        transmissionFrequency: transmissionFrequency || "",
      }, () => {
        const { selectedPreferredPaymentMethod } = this.state;

        const obj = {
          ACH: false,
          CHK: false,
          PayPal: false,
          PushToCard: false,
          Zelle: false,
          USBankPrepaidCard: false,
          USBankDepositToDebitcard: false,
          USBankCHK: false,
          USBankZelle: false,
          USBankACH: false,
          USBankRTP: false,
        }

        selectedPreferredPaymentMethod.map((e) => {
          const { isPayeeChoicePortal } = this.props.user;
          if(!isPayeeChoicePortal) {
            if (Number(e) === paymentMethodFileFormatIds.ACH) {
              obj['ACH'] = true
            }
            else if (Number(e) === paymentMethodFileFormatIds.CHK) {
              obj['CHK'] = true
            }
            else if (Number(e) === paymentMethodFileFormatIds.PayPal) {
              obj['PayPal'] = true
            }
            else if (Number(e) === paymentMethodFileFormatIds.PushToCard) {
              obj['PushToCard'] = true
            }
            else if (Number(e) === paymentMethodFileFormatIds.Zelle) {
              obj['Zelle'] = true
            }
          } else {
            if (Number(e) === paymentMethodFileFormatIds.USBankPrepaidCard) {
              obj['USBankPrepaidCard'] = true
            }
            else if (Number(e) === paymentMethodFileFormatIds.USBankDepositToDebitcard) {
              obj['USBankDepositToDebitcard'] = true
            }
            else if (Number(e) === paymentMethodFileFormatIds.USBankCHK) {
              obj['USBankCHK'] = true
            }
            else if (Number(e) === paymentMethodFileFormatIds.USBankZelle) {
              obj['USBankZelle'] = true
            }
            else if (Number(e) === paymentMethodFileFormatIds.USBankACH) {
              obj['USBankACH'] = true
            }
            else if (Number(e) === paymentMethodFileFormatIds.USBankRTP) {
              obj['USBankRTP'] = true
            }
          }    
        })
        this.setState({
          ACHPreferredPayment: obj.ACH,
          CHKPreferredPayment: obj.CHK,
          PayPalPreferredPayment: obj.PayPal,
          PushToCardPreferredPayment: obj.PushToCard,
          ZellePreferredPayment: obj.Zelle,
          USbankPPDPreferredPayment: obj.USBankPrepaidCard,
          USbankDDCPreferredPayment: obj.USBankDepositToDebitcard,
          USbankCHKPreferredPayment: obj.USBankCHK,
          USBankZellePreferredPayment: obj.USBankZelle,
          USbankACHPreferredPayment: obj.USBankACH,
          USbankRTPPreferredPayment: obj.USBankRTP,
          preferredPaymentMethodCheked: 
            !obj.ACH && 
            !obj.CHK && 
            !obj.PayPal && 
            !obj.PushToCard && 
            !obj.Zelle && 
            !obj.USBankPrepaidCard &&
            !obj.USBankACH &&
            !obj.USBankCHK &&
            !obj.USBankDepositToDebitcard &&
            !obj.USBankRTP &&
            !obj.USBankZelle ? false : true
        })
      });
    });
  }

  handleChangeAccountStatus = ({target}) => {
    const {name,value} = target
    if(name === 'isAVSAccountStatus'){
      this.setState({
        isAVSAccountStatus: 1,
        isAVSAccountStatusOwnership:0
      })
    } else {
      this.setState({
        isAVSAccountStatus: 0,
        isAVSAccountStatusOwnership:1
      })
    }
  }

  // handleChangeReportTime = ({target}) => {
  //   const {name,value} = target
  //   if(name === 'isReportFixedTime'){
  //     this.setState({
  //       isReportFixedTime: 1,
  //       isReportFrequencyBasis:0
  //     })
  //   } else {
  //     this.setState({
  //       isReportFixedTime: 0,
  //       isReportFrequencyBasis:1
  //     })
  //   }
  // }

  handleChangeReportFrequency = (e) => {
    this.setState({
      transmissionFrequency: e.target.value
    })
  }

  getPermissionList = async () => {
    await fetchB2CLookUpforPermissions().then((res) => {
      this.setState({ permissionList: res["data"].rows || [] });
    });
  }

  getAssignedPermissions() {
    const clientId = this.props.user.userData.portalProfileId;
    fetchB2CGeneralSettingsPermissions(clientId).then((response) => {

      this.setState(
        {
          checkedList: response["data"] || [],
        },
        () => {
          this.prepareChecks();
        }
      );
    });
  }

  fetchB2CPreferredClientPaymentTypes() {
    const clientId = this.props.user.userData.portalProfileId;
    this.props.dispatch(getB2CPreferredClientPaymentTypes(clientId)).then((response) => {
      if (!response) {
        return false;
      }
      const { payment } = this.props;
      const paymentMethods = payment && payment.preferredTypes && payment.preferredTypes.rows2 || [];

      const zelleSelectedByClient = (paymentMethods.length > 0 && (paymentMethods.filter((item) => item.fileFormatId === paymentMethodFileFormatIds.Zelle).length > 0)) ? true : false;
      this.setState({
        zelleSelectedByClient: zelleSelectedByClient,
        PreferredPaymentMethod: paymentMethods,
        //preferredPaymentMethodCheked: paymentMethods.length > 0 ? true : false
      });
    });
  }
  fetchPrepaidPreferredClientPaymentTypes() {
    const clientId = this.props.user.userData.portalProfileId;
    this.props.dispatch(getUSBankClientPaymentTypes(clientId)).then((response) => {
      if (!response) {
        return false;
      }
      const paymentprepaidMethods = this.props.USBankPayment && this.props.USBankPayment.preferredTypes || [];
      this.setState({
        PreferredPrepaidPaymentMethod: paymentprepaidMethods,
        //preferredPaymentMethodCheked: paymentMethods.length > 0 ? true : false
      });
    });
  }
  prepareChecks() {
    const {
      permissionList,
      checkedList,
    } = this.state;


    const newPermissionList =
      permissionList &&
      permissionList.map((permission) => {
        if (checkedList && checkedList.indexOf(permission.id) !== -1) {
          permission["isChecked"] = true;
        } else {
          permission["isChecked"] = false;
        }

        return permission;
      });

    const isEnableCheckswithCDM = checkedList && checkedList.indexOf(32768) !== -1 ? true : false;
    this.setState({
      isLoading: false,
      permissionList: [...newPermissionList] || [],
      isEnableCheckswithCDM: isEnableCheckswithCDM,
    });
  }

  validateGeneralSettings() {
    const {  defaultPaymentMethod, campaignExpiryDays,  stalePayeeProfileDecision, payeeProfileDays,
      emailAlertToProfileDays, thZelle, thRtp, thDepositToDebit, thMaster, thPaypal, thCorpRewardCard,
      minthCorpRewardCard,payeePaymentAuthTh,
      paymentAmountTh, paymentAuthSMS, paymentAuthEmail, alternatePaymentOption,
      alternatePaymentOptionACH, alternatePaymentOptionCHK, isReportingEnabled,
      paymentReconciliationTime,
      enrollmentMode, enrollmentModeEmail, enrollmentModeSMS, campaignReminderDays,
      paymentAuthNonCDM,
      paymentAuthCDM,
      isMFARequired,
      defaultPaymentClientReport,
      paymentReconciliationReport,
      enrollmentReport,
      rejectEmailReport,
      rejectSMSReport,
      reconciliationReport,
      rejectedDeliveryReport,
      dailyStatusReport,
      dailyEnrollmentReport,
      smsOptOutReport,
      defaultPaymentMethodSelected, selectedTab, mfaAttemptsAllowed,
      defaultPaymentMethodB2BSelected,
      isMFARequiredLogin,
      isMFARequiredRegistration,
      isMFARequiredPasswordReset,
      isMFARequiredPaymentPreference,
      isMFAForgotPassword, isMFAForgotUsername,
      selectedPreferredPaymentMethod,
      preferredPaymentMethodCheked,
      payerPaymentAuthTh,
      paymentAmountThPayer,
      noOfAttemptsAllowedToResendOtp,
      otpExpiryTime,
      isPayeeAuthenticationUsingOTP,
      noOfAttemptsToResendOtpPayeeAuth,
      otpExpiryTimePayeeAuth,
    } = this.state;

    const { t, user } = this.props;
    const { isPayeeChoicePortal } = user;
    let validation = {};
    let valid = true;

    const testAmt = /^\d{0,8}(?:[.]\d{1,2})?$/;
    const Zel_MSC_Max = 50000.00, Bank_RTP_Max = 100000.00, PCR_Max = 1000.00, PCR_Min = 10.00,CRC_Max = 1000.00, CRC_Min = 25.00, PPL_Max = 10000.00, DDC_Max = 49999.99;
    if (selectedTab === 0) {
      if (preferredPaymentMethodCheked && selectedPreferredPaymentMethod.length === 0) {
        valid = false;
        validation['willPreferredErrShow'] = true
      }
      if (defaultPaymentMethod) {
        if(!isPayeeChoicePortal){
        if (!parseInt(defaultPaymentMethodSelected)) {
          valid = false;
          validation["defaultPaymentMethod"] = t("componentData.generalSettings.errorDefaultPaymentMethodRequired");
        }}
    else{
      if (!parseInt(defaultPaymentMethodSelected)&&!parseInt(defaultPaymentMethodB2BSelected)) {
        valid = false;
        validation["defaultPaymentMethod"] = t("componentData.generalSettings.errorDefaultPaymentMethodRequired");
      }
    }
      }
      if (payeePaymentAuthTh) {
        if (!paymentAmountTh || paymentAmountTh.toString().trim().length === 0) {
          valid = false;
          validation["paymentAmountTh"] = t("componentData.generalSettings.errorPaymentAmountThRequired");
        }
        if (!paymentAuthSMS && !paymentAuthEmail) {
          valid = false;
          validation["payeePaymentAuthTh"] = t("componentData.generalSettings.errorPayeePaymentAuthRequired");
        }
        if (paymentAmountTh !== "" && !testAmt.test(paymentAmountTh?.toString().trim())) {
          valid = false;
          validation["paymentAmountTh"] = t("componentData.generalSettings.errorValidDecimalAmount");
        }
        if (!paymentAuthNonCDM && !paymentAuthCDM) {
          valid = false;
          validation["payeePaymentAuthThCDM"] = t("componentData.generalSettings.errorPayeePaymentAuthThCDMRequired");
        }
      }
      if (payerPaymentAuthTh) {
        if (!paymentAmountThPayer || paymentAmountThPayer.toString().trim().length === 0) {
          valid = false;
          validation["paymentAmountThPayer"] = t("componentData.generalSettings.errorPaymentAmountThRequired");
        }
        else if (paymentAmountThPayer !== "" && !testAmt.test(paymentAmountThPayer?.toString().trim())) {
          valid = false;
          validation["paymentAmountThPayer"] = t("componentData.generalSettings.errorValidDecimalAmount");
        }
        if (noOfAttemptsAllowedToResendOtp.toString().length === 0) {
          valid = false;
          validation["noOfAttemptsAllowedToResendOtp"] = t("componentData.generalSettings.errorIsDFARequired");
        }
        if (!otpExpiryTime || otpExpiryTime.toString().trim().length === 0 ) {
          valid = false;
          validation["otpExpiryTime"] = t("componentData.generalSettings.errorOtpValidityMinutes");
        }
      }
      if (alternatePaymentOption) {
        if (!alternatePaymentOptionACH && !alternatePaymentOptionCHK) {
          valid = false;
          validation["alternatePaymentOption"] = t("componentData.generalSettings.errorAlternatePaymentOption");
        }
      }
      if (thZelle !== "" && parseFloat(thZelle) > Zel_MSC_Max) {
        valid = false;
        validation["thZelle"] = t("componentData.generalSettings.errorValid_ZEL_Amount");
      }
      if (thRtp === "" || thRtp == 0) {
        valid = false;
        validation["thRtp"] = t("componentData.generalSettings.errorValid_RTP_Amount");
      }
      if (parseFloat(thRtp) > Bank_RTP_Max) {
        valid = false;
        validation["thRtp"] = t("componentData.generalSettings.errorMaxValid_RTP_Amount");
      }
      if (thDepositToDebit === "" || thDepositToDebit == 0) {
        valid = false;
        validation["thDepositToDebit"] = t("componentData.generalSettings.errorValid_DDC_Amount");
      }
      if (parseFloat(thDepositToDebit) > DDC_Max) {
        valid = false;
        validation["thDepositToDebit"] = t("componentData.generalSettings.errorMaxValid_DDC_Amount");
      }
      if (thCorpRewardCard === "" || thCorpRewardCard == 0) {
        valid = false;
        validation["thCorpRewardCard"] = t("componentData.generalSettings.errorValid_PCR_Amount");
      }
      if (!isPayeeChoicePortal && parseFloat(thCorpRewardCard) > PCR_Max) {
        valid = false;
        validation["thCorpRewardCard"] = t("componentData.generalSettings.errorMaxValid_PCR_Amount");
      }
      if (parseFloat(thCorpRewardCard) < PCR_Min) {
        valid = false;
        validation["thCorpRewardCard"] = t("componentData.generalSettings.errorMinValid_PCR_Amount");
      }
    
    // if (parseFloat(thCorpRewardCard) > CRC_Max) {
    //   valid = false;
    //   validation["thCorpRewardCard"] = t("componentData.generalSettings.errorMaxValid_PCR_Amount");
    // }
    if (isPayeeChoicePortal && parseFloat(thCorpRewardCard) > PCR_Max) {
      valid = false;
      validation["thCorpRewardCard"] = t("componentData.generalSettings.errorMaxValid_CRC_Amount");
    }
   else if (isPayeeChoicePortal && parseFloat(thCorpRewardCard) <= PCR_Max && parseFloat(thCorpRewardCard) < parseFloat(minthCorpRewardCard)) {
      valid = false;
      validation["thCorpRewardCard"] = t("componentData.generalSettings.errorMaxminValid_PCR_Amount");
    }
     if (isPayeeChoicePortal && parseFloat(minthCorpRewardCard) < CRC_Min) {
      valid = false;
      validation["minthCorpRewardCard"] = t("componentData.generalSettings.errorMinValid_CRC_Amount");
    }
    else if ( isPayeeChoicePortal && parseFloat(minthCorpRewardCard) >= CRC_Min && parseFloat(minthCorpRewardCard) > parseFloat(thCorpRewardCard)) {
      valid = false;
      validation["minthCorpRewardCard"] = t("componentData.generalSettings.errorMinmaxValid_CRC_Amount");
    }
      if (thMaster !== "" && parseFloat(thMaster) > Zel_MSC_Max) {
        valid = false;
        validation["thMaster"] = t("componentData.generalSettings.errorValid_MSC_Amount");
      }
      if (thPaypal !== "" && parseFloat(thPaypal) > PPL_Max) {
        valid = false;
        validation["thPaypal"] = t("componentData.generalSettings.errorValid_PPL_Amount");
      }
      if (isMFARequired) {
        if (!isMFARequiredLogin && !isMFARequiredRegistration && !isMFARequiredPasswordReset && !isMFARequiredPaymentPreference && !isMFAForgotPassword && !isMFAForgotUsername) {
          valid = false;
          validation["isMFARequired"] = t("componentData.generalSettings.errorIsMFARequired");
        }
        if (mfaAttemptsAllowed.toString().length === 0) {
          valid = false;
          validation["mfaAttemptsAllowed"] = t("componentData.generalSettings.errorIsDFARequired");
        }
      }

    } else {
      if (!campaignExpiryDays || campaignExpiryDays.toString().trim().length === 0) {
        valid = false;
        validation["campaignExpiryDays"] = t("componentData.generalSettings.errorCampaignExpiryDays");
      }
      else if (campaignExpiryDays && campaignExpiryDays < 1) {
        valid = false;
        validation["campaignExpiryDays"] = t("componentData.generalSettings.EnrollmentExpiryDays");
      }

      if (isReportingEnabled) {
        if (!paymentReconciliationTime || paymentReconciliationTime.toString().trim().length === 0 || (paymentReconciliationTime && paymentReconciliationTime.toString().trim().match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null)) {
          valid = false;
          validation["paymentReconciliationTime"] = t("componentData.generalSettings.errorPaymentReconciliationTime");
        }
        if(!isPayeeChoicePortal) {
          if (!defaultPaymentClientReport && !paymentReconciliationReport && !enrollmentReport && !rejectEmailReport && !rejectSMSReport && !reconciliationReport) {
            valid = false;
            validation["paymentReportRequired"] = t("componentData.generalSettings.errorPaymentReportRequired");
          }
        } else {
          if (!rejectedDeliveryReport && !dailyStatusReport && !dailyEnrollmentReport && !smsOptOutReport) {
            valid = false;
            validation["paymentReportRequired"] = t("componentData.generalSettings.errorPaymentReportRequired");
          }
        }
        
      }

      //New fields
      if (enrollmentMode) {
        if (!enrollmentModeSMS && !enrollmentModeEmail) {
          valid = false;
          validation["enrollmentMode"] = t("componentData.generalSettings.errorEnrollmentModeRequired");
        }
      }
      if (stalePayeeProfileDecision && payeeProfileDays.length === 0) {
        valid = false;
        validation["payeeProfileDays"] = t("componentData.generalSettings.errorPayeeProfileRequired");
      }

      if (stalePayeeProfileDecision && emailAlertToProfileDays.length === 0) {
        valid = false;
        validation["emailAlertToProfileDays"] = t("componentData.generalSettings.errorPayeeEmailAlertRequired");
      }


      if (campaignReminderDays && campaignReminderDays < 1) {
        valid = false;
        validation["campaignReminderDays"] = t("componentData.generalSettings.EnrollmentReminderDays");
      }
      else if (campaignExpiryDays > 0 && campaignReminderDays > 0 && parseInt(campaignExpiryDays) <= parseInt(campaignReminderDays)) {
        valid = false;
        validation["campaignReminderDays"] = t("componentData.generalSettings.errorCampaignReminderDays");
      }

      if(isPayeeAuthenticationUsingOTP) {
        if (!noOfAttemptsToResendOtpPayeeAuth === "" || noOfAttemptsToResendOtpPayeeAuth.toString().trim().length === 0) {
          valid = false;
          validation["noOfAttemptsToResendOtpPayeeAuth"] = t("componentData.generalSettings.errorNoOfAttemptsToResendOtpPayeeAuth");
        } 
        if (!otpExpiryTimePayeeAuth === "" || otpExpiryTimePayeeAuth.toString().trim().length === 0) {
          valid = false;
          validation["otpExpiryTimePayeeAuth"] = t("componentData.generalSettings.errorOtpExpiryTimePayeeAuth");
        }
      }
    }

    this.setState({ validation: { ...validation } });

    return valid;
  }

  checkItem(event, permission) {
    const { permissionList } = this.state;
    const currentPermission =
      permissionList &&
      permissionList.map((p) => {
        if (p.id === permission.id) {
          p["isChecked"] = event.target.checked;
        }

        return p;
      });

    if (permission.id === 128) {
      this.setState({
        canApprovePayeeProfile: event.target.checked,
      });
    }
    if (permission.id === 64) {
      this.setState({
        isPayeeUpdateAllowed: event.target.checked,
      });
    }
    this.setState({
      permissionList: currentPermission || [],
      checkedList: currentPermission.filter((p) => p["isChecked"] === true && p["id"] !== 32768).map((permission) => permission["id"])
    });
  }

  grantPaymentsAll() {
    const { defaultPaymentMethodSelected,defaultPaymentMethodB2BSelected, permissionList, paymentAuthExpiry, PreferredPaymentMethod, isAVS, 
      isAVSAccountStatus, isAVSAccountStatusOwnership, /*isReportFixedTime, isReportFrequencyBasis*/ transmissionFrequency } = this.state;
    const { isPayeeChoicePortal } = this.props.user;
    let arr = PreferredPaymentMethod.map((e) => e.fileFormatId) || [];
    arr = arr.length > 0 && arr.sort(function (a, b) { return a - b });

    const newPermissionList = permissionList && permissionList.map((permission) => {
      return {
        ...permission,
        isChecked: true
      }
    })
 
    this.setState({
      permissionList: newPermissionList,
      isPaymentDecisonEngine: true,
      defaultPaymentMethod: true,
	    preEnrollmentPaymentHistory: true,
      //zelleUnknownReceipientSupport: zelleSelectedByClient ? true : zelleUnknownReceipientSupport,
      //authorizeDebit: zelleSelectedByClient ? true : authorizeDebit,
      // pickZelleToken: zelleSelectedByClient ? true : pickZelleToken,
      payeePaymentAuthTh: true,
      paymentAuthSMS: true,
      paymentAuthEmail: true,
      paymentAuthExpiry: 
      (!isPayeeChoicePortal?parseInt(defaultPaymentMethodSelected) :(parseInt(defaultPaymentMethodSelected)||parseInt(defaultPaymentMethodB2BSelected)))? true : paymentAuthExpiry,
      // parseInt(defaultPaymentMethodSelected) ? true : paymentAuthExpiry,
      alternatePaymentOption: true,
      alternatePaymentOptionACH: true, alternatePaymentOptionCHK: true, oneTimePreference: true,
      paymentAuthNonCDM: true,
      paymentAuthCDM: true,
      //valueDateAssignment: true,
      preferredPaymentMethodCheked: true,
      selectedPreferredPaymentMethod: arr,
      ACHPreferredPayment: true,
      CHKPreferredPayment: true,
      PayPalPreferredPayment: true,
      PushToCardPreferredPayment: true,
      ZellePreferredPayment: true,
      USbankPPDPreferredPayment: true,
      USbankDDCPreferredPayment: true,
      USbankCHKPreferredPayment: true,
      USBankZellePreferredPayment: true,
      USbankACHPreferredPayment: true,
      USbankRTPPreferredPayment: true,
      isMFARequired: true,
      isMFARequiredPaymentInfo: true,
      isMFARequiredPassword: true,
      isMFARequiredLogin: true,
      isMFARequiredRegistration: true,
      isMFARequiredPasswordReset: true,
      isMFARequiredPaymentPreference: true,
      isMFAForgotPassword: true,
      isMFAForgotUsername: true,
      payerPaymentAuthTh: true,
      isAVS: 1,
      isAVSAccountStatus: isAVSAccountStatusOwnership ? 0 : 1,
      //isReportFrequencyBasis: isReportFrequencyBasis ? 1 : 0,
    });
  }
  grantOthersAll() {
    const { isPayeeChoicePortal } = this.props.user;
    const { stalePayeeProfileDefaultPaymentMethod, defaultPaymentMethodSelected, defaultPaymentMethodB2BSelected, expiredCampaigns } = this.state;
    this.setState({
      // expiredCampaigns: parseInt(defaultPaymentMethodSelected) ? true : expiredCampaigns,

      expiredCampaigns:(!isPayeeChoicePortal?parseInt(defaultPaymentMethodSelected) :(parseInt(defaultPaymentMethodSelected)||parseInt(defaultPaymentMethodB2BSelected)))? true : expiredCampaigns,
      // expiredCampaigns: true,
      stalePayeeProfileDecision: true,
      stalePayeeProfilePaymentDecision: true,
      //dormantProfile:true,// this will come when stle payee profile payment decision have option to select
      stalePayeeProfileDefaultPaymentMethod: parseInt(defaultPaymentMethodSelected) ? stalePayeeProfileDefaultPaymentMethod : "1",
      isCampaignFileApprovalRequired: true, 
      isPayeeAuthenticationUsingOTP: true,
      isReportingEnabled: true,
      enrollmentMode: true,
      enrollmentModeEmail: true,
      enrollmentModeSMS: true,
      isSsnMandatory: true,
      defaultPaymentClientReport: true,
      paymentReconciliationReport: true,
      enrollmentReport: true,
      rejectEmailReport: true,
      rejectSMSReport: true,
      reconciliationReport: true,
      rejectedDeliveryReport: true,
      dailyStatusReport: true,
      dailyEnrollmentReport: true,
      smsOptOutReport: true,
      oneTimePreference : true,
    });
  }
  clearPaymentsAll() {
    const { permissionList, zelleSelectedByClient, authorizeDebit, pickZelleToken, zelleUnknownReceipientSupport } = this.state;
    const newPermissionList = permissionList && permissionList.map((permission) => {
      return {
        ...permission,
        isChecked: false
      }
    })
    this.setState({
      permissionList: newPermissionList,
      checkedList: [],
      isPaymentDecisonEngine: false,
      defaultPaymentMethod: false,
	    preEnrollmentPaymentHistory: false,
      defaultPaymentMethodSelected: '0',
      defaultPaymentMethodB2BSelected:'0',
      //dormantProfile:true,// this will come when stle payee profile payment decision have option to select
      //stalePayeeProfileDefaultPaymentMethod:true, // this will come when stle payee profile payment decision have option to select
      zelleUnknownReceipientSupport: zelleSelectedByClient ? false : zelleUnknownReceipientSupport,
      authorizeDebit: zelleSelectedByClient ? false : authorizeDebit,
      pickZelleToken: zelleSelectedByClient ? false : pickZelleToken,
      payeePaymentAuthTh: false,
      paymentAuthSMS: false,
      paymentAuthEmail: false,
      //paymentAuthExpiry: defaultPaymentMethod?false:paymentAuthExpiry,
      paymentAuthExpiry: false,
      alternatePaymentOption: false,
      alternatePaymentOptionACH: false, alternatePaymentOptionCHK: false, oneTimePreference: false,
      //unknownReceipt: zelleSelectedByClient && zelleUnknownReceipientSupport ? "" : unknownReceipt,
      //citiConnectId: "",
      thZelle: "",
      thRtp: "",
      thDepositToDebit: "",
      thCorpRewardCard: "",
      minthCorpRewardCard:"",
      thMaster: "", 
      thPaypal: "",
      paymentAmountTh: "",
      ddDays: "",
      paymentAuthExpDays: "",
      cardExpiryAlertDays: "",
      payeePaymentAcceptanceExpiryDays: "",
      paymentAuthNonCDM: false,
      paymentAuthCDM: false,
      preferredPaymentMethodCheked: false,
      selectedPreferredPaymentMethod: [],
      ACHPreferredPayment: false,
      CHKPreferredPayment: false,
      PayPalPreferredPayment: false,
      PushToCardPreferredPayment: false,
      ZellePreferredPayment: false,
      USbankPPDPreferredPayment: false,
      USbankDDCPreferredPayment: false,
      USbankCHKPreferredPayment: false,
      USBankZellePreferredPayment: false,
      USbankACHPreferredPayment: false,   
      USbankRTPPreferredPayment: false,
      isMFARequiredLogin: false,
      isMFARequiredRegistration: false,
      isMFARequiredPasswordReset: false,
      isMFARequiredPaymentPreference: false,
      isMFAForgotPassword: false,
      isMFAForgotUsername: false,
      isMFARequired: false,
      isMFARequiredPaymentInfo: false,
      isMFARequiredPassword: false,
      payerPaymentAuthTh: false,
      paymentAmountThPayer: "",
      noOfAttemptsAllowedToResendOtp: "",
      otpExpiryTime: "",
      isAVS: 0,
      isAVSAccountStatus: 0,
      isAVSAccountStatusOwnership: 0,
      //isReportFixedTime: 0, 
      //isReportFrequencyBasis: 0,
      transmissionFrequency: 0,
    });
  }

  clearSettingssAll() {
    this.setState({
      //expiredCampaigns: defaultPaymentMethod?false:expiredCampaigns,
      expiredCampaigns: false,
      stalePayeeProfileDecision: false,
      stalePayeeProfilePaymentDecision: false,
      stalePayeeProfileDefaultPaymentMethod: 0,
      isCampaignFileApprovalRequired: false, 
      isPayeeAuthenticationUsingOTP: false,
      isReportingEnabled: false,
      campaignExpiryDays: "", payeeProfileDays: "",
      //paymentReconciliationTime: "",
      enrollmentMode: false,
      enrollmentModeEmail: false,
      enrollmentModeSMS: false,
      campaignReminderDays: "",
      bessId: "",
      clientBillingBranch: "",
      clientBillingAccount: "",
      isSsnMandatory: false,
      defaultPaymentClientReport: false,
      paymentReconciliationReport: false,
      enrollmentReport: false,
      rejectEmailReport: false,
      rejectSMSReport: false,
      reconciliationReport: false,
      rejectedDeliveryReport: false,
      dailyStatusReport: false,
      dailyEnrollmentReport: false,
      smsOptOutReport: false,
      valueDateAssignment: false,
      otpExpiryTime: "",
      oneTimePreference : false,
      noOfAttemptsToResendOtpPayeeAuth: "",
      otpExpiryTimePayeeAuth: "",
    });
  }

  savePermissions() {
    const { isPayeeChoicePortal } = this.props.user;
    if (this.validateGeneralSettings()) {
      const {
        isPaymentDecisonEngine,
        permissionList,
        defaultPaymentMethod, preEnrollmentPaymentHistory, campaignExpiryDays, expiredCampaigns, stalePayeeProfileDecision, payeeProfileDays, emailAlertToProfileDays,
        stalePayeeProfilePaymentDecision, dormantProfile, stalePayeeProfileDefaultPaymentMethod, zelleUnknownReceipientSupport,
        authorizeDebit, unknownReceipt, pickZelleToken, citiConnectId, thZelle, thRtp, thDepositToDebit, thMaster, thPaypal, thCorpRewardCard,minthCorpRewardCard, payeePaymentAuthTh,
        paymentAmountTh, paymentAuthSMS, paymentAuthEmail, paymentAuthExpDays, cardExpiryAlertDays, paymentAuthExpiry, ddDays, alternatePaymentOption,
        alternatePaymentOptionACH, alternatePaymentOptionCHK, oneTimePreference, isCampaignFileApprovalRequired, isPayeeAuthenticationUsingOTP, isReportingEnabled,
        paymentReconciliationTime,
        paymentAmountThPayer,
        enrollmentModeEmail, enrollmentModeSMS,
        campaignReminderDays, payeePaymentAcceptanceExpiryDays,
        isSsnMandatory,
        paymentAuthNonCDM,
        paymentAuthCDM,
        isMFARequiredPaymentInfo,
        isMFARequiredPassword,
        defaultPaymentClientReport,
        paymentReconciliationReport,
        enrollmentReport,
        rejectEmailReport,
        rejectSMSReport,
        reconciliationReport,
        rejectedDeliveryReport,
        dailyStatusReport,
        dailyEnrollmentReport,
        smsOptOutReport,
        defaultPaymentMethodSelected,
        defaultPaymentMethodB2BSelected,
        mfaAttemptsAllowed,
        isMFARequiredLogin,
        isMFARequiredRegistration,
        isMFARequiredPasswordReset,
        isMFARequiredPaymentPreference,
        isMFAForgotPassword, isMFAForgotUsername,
        selectedPreferredPaymentMethod,
        payerPaymentAuthTh,
        noOfAttemptsAllowedToResendOtp,
        otpExpiryTime,
        noOfAttemptsToResendOtpPayeeAuth,
        otpExpiryTimePayeeAuth,
        isAVS,
        isAVSAccountStatus,
        isAVSAccountStatusOwnership,
        //isReportFixedTime, 
        //isReportFrequencyBasis,
        transmissionFrequency,
      } = this.state;

      const clientId = this.props.user.userData.portalProfileId;
      const payload = {
        isPaymentDecisonEngine: isPaymentDecisonEngine ? 1 : 0,
        useDefaultPaymentMethod: defaultPaymentMethod ? 1 : 0,
		    isPreEnrollmentPaymentHistoryAllowed: preEnrollmentPaymentHistory ? 1 : 0,
        fileFormatId: parseInt(defaultPaymentMethodSelected) || null,
        // fileFormatIdB2B:parseInt(defaultPaymentMethodB2BSelected) || null,
        noOfDaysBeforeEnrolmentExpire: unknownReceipt || null,
        //clientCitiConnectId: citiConnectId || null,//Removed in ticket FSINPAYB2B-8443
        zelleThreshold: thZelle || null,
        bankDepositRTPThreshold: thRtp || null,
        masterCardThreshold: thMaster || null,
        campaignExpiryDays: campaignExpiryDays || null,
        payPalThreshold: thPaypal || null,
        corpRewardCardThreshold: thCorpRewardCard || null,
        // corpRewardCardThresholdMin: minthCorpRewardCard || null,
        depositToDebitCardThreshold: thDepositToDebit || null,
        paymentAuthorizationExpiryDays: paymentAuthExpDays || null,
        cardExpiryAlertInDays: cardExpiryAlertDays || null,
        duplicatePaymentCheckDays: ddDays || null,
        paymentAmountThreshold: paymentAmountTh || null,
        payeeProfileReVerificationDays: payeeProfileDays || null,
        noOfDaysForPayeeProfileAlert: emailAlertToProfileDays || null,
        campaignFileApprovalRequired: isCampaignFileApprovalRequired ? 1 : 0,
        isPayeeAuthenticationUsingOTP: isPayeeAuthenticationUsingOTP ? 1 : 0,
        alternatePaymentMethodIsAch: alternatePaymentOptionACH ? 1 : 0,
        alternatePaymentMethodIsChk: alternatePaymentOptionCHK ? 1 : 0,
        processPaymentToDefaultMethod_afterAuthExpired: paymentAuthExpiry ? 1 : 0,
        paymentAuthorizationMethodSms: paymentAuthSMS ? 1 : 0,
        paymentAuthorizationMethodEmail: paymentAuthEmail ? 1 : 0,
        paymentAuthorizationAboveThreshold: payeePaymentAuthTh ? 1 : 0,
        zelleTokenFromConsumer: pickZelleToken ? 1 : 0,

        isAuthorizeDebit: authorizeDebit ? 1 : 0,
        processPaymentAfterCampaignExpire: expiredCampaigns ? 1 : 0,
        markPayeeProfileDormant: stalePayeeProfileDecision ? 1 : 0,
        allowRegisterViaZella: zelleUnknownReceipientSupport ? 1 : 0,
        staleProfilePaymentDecisionIsDormant: parseInt(stalePayeeProfileDefaultPaymentMethod) == 1 ? 1 : 0,//stalePayeeProfilePaymentDecision? 1:0,
        staleProfilePaymentDecisionIsDefaultPaymentMethod: parseInt(stalePayeeProfileDefaultPaymentMethod) == 2 ? 1 : 0,//stalePayeeProfileDefaultPaymentMethod
        isReportingEnabled: isReportingEnabled ? 1 : 0,
        paymentReconciliationTime: paymentReconciliationTime || null,
        isOneTimePayment: oneTimePreference ? 1 : 0,
        isSsnMandatory: isSsnMandatory ? 1 : 0,
        // bessId: bessId || null,
        // clientBillingBranch: clientBillingBranch || null,
        // clientBillingAccount: clientBillingAccount || null,
        paymentAuthorizationAboveThreshold_NonCdm: paymentAuthNonCDM ? 1 : 0,
        paymentAuthorizationAboveThreshold_Cdm: paymentAuthCDM ? 1 : 0,
        isEmailCampaign: enrollmentModeEmail ? 1 : 0,
        isSmsCampaign: enrollmentModeSMS ? 1 : 0,
        campaignReminderDays: campaignReminderDays || null,
        isPaymentMfaRequired: isMFARequiredPaymentInfo ? 1 : 0,
        isPasswordMfaRequired: isMFARequiredPassword ? 1 : 0,
        mfaAttemptsAllowed: mfaAttemptsAllowed,
        isMFALoginRequired: isMFARequiredLogin ? 1 : 0,
        isMFARegistrationRequired: isMFARequiredRegistration ? 1 : 0,
        isMFAPasswordResetRequired: isMFARequiredPasswordReset ? 1 : 0,
        isMFAPaymentPreferenceRequired: isMFARequiredPaymentPreference ? 1 : 0,
        isMFAForgotPasswordRequired: isMFAForgotPassword ? 1 : 0,
        isMFAForgotUsernameRequired: isMFAForgotUsername ? 1 : 0,
        isDefaultPaymentReport: defaultPaymentClientReport ? 1 : 0,
        isPaymentReconciliationReport: paymentReconciliationReport ? 1 : 0,
        isEnrollmentReport: enrollmentReport ? 1 : 0,
        isEmailRejectReport: rejectEmailReport ? 1 : 0,
        isSmsRejectReport: rejectSMSReport ? 1 : 0,
        isReconciliationReport: reconciliationReport ? 1 : 0,
        isRejectedDeliveryReport: rejectedDeliveryReport ? 1 : 0,
        isDailyStatusReport: dailyStatusReport ? 1 : 0,
        isDailyEnrollmentReport: dailyEnrollmentReport ? 1 : 0,
        isOptOutSMSReport: smsOptOutReport ? 1 : 0,
        payeePaymentAcceptanceExpiryDays: payeePaymentAcceptanceExpiryDays || null,
        isPaymentAuthorizationByPayerAboveThreshold: payerPaymentAuthTh ? 1 : 0,
        paymentAmountThresholdForPayer: paymentAmountThPayer || null,
        noOfAttemptsAllowedToResendOtp: noOfAttemptsAllowedToResendOtp ? noOfAttemptsAllowedToResendOtp : 0,
        otpExpiryTime:otpExpiryTime ? otpExpiryTime : 0,
        isAVS: isAVS ? 1 : 0,
        isAVSAccountStatus: isAVSAccountStatus ? 1 : 0,
        isAVSAccountStatusOwnership: isAVSAccountStatusOwnership ? 1 : 0,
        //isReportFixedTime: isReportFixedTime ? 1 : 0, 
        //isReportFrequencyBasis: isReportFrequencyBasis ? 1 : 0,
        transmissionFrequency: transmissionFrequency ? transmissionFrequency : 0,
        processingFlags: [
          ...permissionList
            .filter((p) => p["isChecked"] === true)
            .map((permission) => permission["id"])
        ],
        preferredPaymentMethodIds: JSON.stringify(selectedPreferredPaymentMethod),
        noOfAttemptsToResendOtpPayeeAuth: noOfAttemptsToResendOtpPayeeAuth || null,
        otpExpiryTimePayeeAuth: otpExpiryTimePayeeAuth || null,
      };
      if(isPayeeChoicePortal){
       //payload["transmissionFrequency"]=(parseInt(transmissionFrequency) || null);
       payload["fileFormatIdB2B"]=(parseInt(defaultPaymentMethodB2BSelected) || null);
       payload["corpRewardCardThresholdMin"]=(minthCorpRewardCard || null);
      }
      this.setState({ btnLoader: true, savingData: true }, () => {
        saveB2CPermissionsData(payload, clientId).then((response) => {
          if (response.error) {
            this.setDialogMessage(true, response.message, "error");
            this.setState({ savingData: false });
          }
          else {
            this.setDialogMessage(true, response.message, "success");
            this.setState({ savingData: false });
          }
        });
      });
    }
  }

  setDialogMessage(flag, message, variant) {
    this.setState({
      dialogMessage: message,
      isDialogActive: flag,
      variant,
    });
  }

  handleInput(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    const details = {};

    switch (fieldName) {
      case "campaignExpiryDays":
      case "campaignReminderDays":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "payeeProfileDays":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "emailAlertToProfileDays":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "unknownReceipt":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "paymentAuthExpDays":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "cardExpiryAlertDays":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "ddDays":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "bessId":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "payeePaymentAcceptanceExpiryDays":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "mfaAttemptsAllowed":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "noOfAttemptsAllowedToResendOtp":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "otpExpiryTime":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "noOfAttemptsToResendOtpPayeeAuth":
      case "otpExpiryTimePayeeAuth":
        details[fieldName] = fieldValue.replace(/[^0-9]/g, "");
        break;
      default:
        details[fieldName] = event.target.value;
        break;
    }

    this.setState({ ...details });
  }

  handleSettings = (event, value) => {
    const { checkedList } = this.state;
    let newCheckedList = [...checkedList];
    if (event.target.checked) {
      newCheckedList = [...newCheckedList, value];
    } else {
      newCheckedList = newCheckedList.filter(item => item !== value);
    }

    this.setState({ checkedList: newCheckedList });
  }

  handleCheckBoxChange = () => {
    const { 
      stalePayeeProfilePaymentDecision, 
      defaultPaymentMethod, 
      expiredCampaigns, 
      paymentAuthExpiry, 
      stalePayeeProfileDefaultPaymentMethod, 
      defaultPaymentMethodSelected,
      defaultPaymentMethodB2BSelected
    } = this.state;
    this.setState({
      defaultPaymentMethod: !defaultPaymentMethod,
      expiredCampaigns: defaultPaymentMethod ? false : expiredCampaigns,
      stalePayeeProfileDefaultPaymentMethod: defaultPaymentMethod && stalePayeeProfilePaymentDecision ? "1" : stalePayeeProfileDefaultPaymentMethod,
      paymentAuthExpiry: defaultPaymentMethod ? false : paymentAuthExpiry,
      defaultPaymentMethodSelected: defaultPaymentMethod ? '0' : defaultPaymentMethodSelected,
      defaultPaymentMethodB2BSelected:defaultPaymentMethod ? '0' : defaultPaymentMethodB2BSelected,
    });
  }

  handlePreferredGroupCheckBoxChange = (item) => {
    this.setState({
      preferredPaymentMethodCheked: item.currentTarget.checked,
      ACHPreferredPayment: false,
      CHKPreferredPayment: false,
      PayPalPreferredPayment: false,
      PushToCardPreferredPayment: false,
      ZellePreferredPayment: false,
      USbankPPDPreferredPayment: false,
      USbankDDCPreferredPayment: false,
      USbankCHKPreferredPayment: false,
      USBankZellePreferredPayment: false,
      USbankACHPreferredPayment: false,
      USbankRTPPreferredPayment: false,
      selectedPreferredPaymentMethod: [],
      validation: {
        ...this.state.validation,
        willPreferredErrShow: false
      }
    })
  }

  handlePreferredCheckBoxChange = (item) => {
    const { isPayeeChoicePortal } = this.props.user;
    if(!isPayeeChoicePortal) {
      if (Number(item.target.value) === paymentMethodFileFormatIds.ACH) {
        this.setState({
          ACHPreferredPayment: item.target.checked,
        })
      }
      else if (Number(item.target.value) === paymentMethodFileFormatIds.CHK) {
        this.setState({
          CHKPreferredPayment: item.target.checked
        })
      }
      else if (Number(item.target.value) === paymentMethodFileFormatIds.PayPal) {
        this.setState({
          PayPalPreferredPayment: item.target.checked
        })
      }
      else if (Number(item.target.value) === paymentMethodFileFormatIds.PushToCard) {
        this.setState({
          PushToCardPreferredPayment: item.target.checked
        })
      }
      else if (Number(item.target.value) === paymentMethodFileFormatIds.Zelle) {
        this.setState({
          ZellePreferredPayment: item.target.checked
        })
      }
    } else {
      if (Number(item.target.value) === paymentMethodFileFormatIds.USBankCHK) {
        this.setState({
          USbankCHKPreferredPayment: item.target.checked
        })
      }
      else if (Number(item.target.value) === paymentMethodFileFormatIds.USBankZelle) {
        this.setState({
          USBankZellePreferredPayment: item.target.checked
        })
      }
      else if (Number(item.target.value) === paymentMethodFileFormatIds.USBankACH) {
        this.setState({
          USbankACHPreferredPayment: item.target.checked
        })
      }
      else if (Number(item.target.value) === paymentMethodFileFormatIds.USBankRTP) {
        this.setState({
          USbankRTPPreferredPayment: item.target.checked
        })
      }
      else if (Number(item.target.value) === paymentMethodFileFormatIds.USBankPrepaidCard) {
        this.setState({
          USbankPPDPreferredPayment: item.target.checked
        })
      }
      else if (Number(item.target.value) === paymentMethodFileFormatIds.USBankDepositToDebitcard) {
        this.setState({
          USbankDDCPreferredPayment: item.target.checked
        })
      }
    }

    const { selectedPreferredPaymentMethod } = this.state;
    let tempArr = [];
    const isCheked = item.target.checked;
    if (isCheked) {
      if (selectedPreferredPaymentMethod.indexOf(Number(item.target.value)) === -1) {
        tempArr.push(...selectedPreferredPaymentMethod, Number(item.target.value));
        tempArr = tempArr.sort(function (a, b) {
          return a - b;
        });
        this.setState({
          selectedPreferredPaymentMethod: tempArr,
          validation: {
            ...this.state.validation,
            willPreferredErrShow: false
          }
        })
      }
    }
    else {
      if (selectedPreferredPaymentMethod.indexOf(Number(item.target.value)) != -1) {
        tempArr.push(...selectedPreferredPaymentMethod);
        tempArr = tempArr.filter(e => e !== Number(item.target.value));
        tempArr = tempArr.sort(function (a, b) {
          return a - b;
        });
        this.setState({
          selectedPreferredPaymentMethod: tempArr,
          validation: {
            ...this.state.validation,
            willPreferredErrShow: false
          }
        })
      }
    }
  }

  handleReportSwitch = () => {
    const {defaultPaymentClientReport, paymentReconciliationReport, enrollmentReport, rejectEmailReport, rejectSMSReport, rejectedDeliveryReport, dailyStatusReport, dailyEnrollmentReport, smsOptOutReport} = this.state
    if (defaultPaymentClientReport || paymentReconciliationReport || enrollmentReport || rejectEmailReport || rejectSMSReport || rejectedDeliveryReport || dailyStatusReport || dailyEnrollmentReport || smsOptOutReport) {
      this.setState({isReportingEnabled: true})
    }
    else {
      this.setState({isReportingEnabled: false})
    }
  }

  handleChange = (e) => {
    const fieldName = e.target.name;
    const { defaultPaymentClientReport, preEnrollmentPaymentHistory, paymentReconciliationReport, enrollmentReport, rejectEmailReport, rejectSMSReport,
      reconciliationReport, rejectedDeliveryReport, dailyStatusReport, dailyEnrollmentReport, smsOptOutReport,
      isMFARequiredPaymentInfo, isMFARequiredPassword, enrollmentModeEmail, enrollmentModeSMS, isSsnMandatory, expiredCampaigns, oneTimePreference,
      isCampaignFileApprovalRequired, isPayeeAuthenticationUsingOTP, paymentAuthNonCDM, paymentAuthCDM, paymentAuthSMS, paymentAuthEmail, paymentAuthExpiry,
      alternatePaymentOptionCHK, alternatePaymentOptionACH, authorizeDebit, isMFARequiredLogin, isMFARequiredRegistration,
      isMFARequiredPasswordReset, isMFARequiredPaymentPreference, isMFAForgotPassword, isMFAForgotUsername, isReportingEnabled } = this.state;

    switch (fieldName) {
      case "defaultPaymentClientReport":
        this.setState({
          defaultPaymentClientReport: !defaultPaymentClientReport,
        }, () => this.handleReportSwitch())
        
        break;
      case "paymentReconciliationReport":
        this.setState({
          paymentReconciliationReport: !paymentReconciliationReport,
        }, () => this.handleReportSwitch())
        
        break;
      case "enrollmentReport":
        this.setState({
          enrollmentReport: !enrollmentReport,
        }, () => this.handleReportSwitch())
        
        break;
      case "rejectEmailReport":
        this.setState({
          rejectEmailReport: !rejectEmailReport,
        }, () => this.handleReportSwitch())
        
        break;
      case "rejectSMSReport":
        this.setState({
          rejectSMSReport: !rejectSMSReport,
        }, () => this.handleReportSwitch())
        break;
      case "reconciliationReport":
        this.setState({
          reconciliationReport: !reconciliationReport,
        }, () => this.handleReportSwitch())
        break;
      case "rejectedDeliveryReport":
        this.setState({
          rejectedDeliveryReport: !rejectedDeliveryReport,
        }, () => this.handleReportSwitch())
        break;
      case "dailyStatusReport":
        this.setState({
          dailyStatusReport: !dailyStatusReport,
        }, () => this.handleReportSwitch())
      break;
      case "dailyEnrollmentReport":
        this.setState({
          dailyEnrollmentReport: !dailyEnrollmentReport,
        }, () => this.handleReportSwitch())
      break;
      case "smsOptOutReport":
        this.setState({
          smsOptOutReport: !smsOptOutReport,
        }, () => this.handleReportSwitch())
      break;
      case "isMFARequiredPaymentInfo":
        this.setState({
          isMFARequiredPaymentInfo:
            !isMFARequiredPaymentInfo,
        })
        break;

      case "isMFARequiredLogin":
        this.setState({
          isMFARequiredLogin:
            !isMFARequiredLogin,
        })
        break;

      case "isMFARequiredRegistration":
        this.setState({
          isMFARequiredRegistration:
            !isMFARequiredRegistration,
        })
        break;

      case "isMFARequiredPasswordReset":
        this.setState({
          isMFARequiredPasswordReset:
            !isMFARequiredPasswordReset,
        })
        break;

      case "isMFARequiredPaymentPreference":
        this.setState({
          isMFARequiredPaymentPreference:
            !isMFARequiredPaymentPreference,
        })
        break;
      case "isMFAForgotPassword":
        this.setState({
          isMFAForgotPassword:
            !isMFAForgotPassword,
        })
        break;
      case "isMFAForgotUsername":
        this.setState({
          isMFAForgotUsername:
            !isMFAForgotUsername,
        })
        break;
      case "isMFARequiredPassword":
        this.setState({
          isMFARequiredPassword:
            !isMFARequiredPassword,
        })
        break;
      case "enrollmentModeEmail":
        this.setState({
          enrollmentModeEmail:
            !enrollmentModeEmail,
        })
        break;
      case "enrollmentModeSMS":
        this.setState({
          enrollmentModeSMS:
            !enrollmentModeSMS,
        })
        break;
      case "isSsnMandatory":
        this.setState({
          isSsnMandatory:
            !isSsnMandatory,
        })
        break;
      case "expiredCampaigns":
        this.setState({
          expiredCampaigns:
            !expiredCampaigns,
        })
        break;
      case "oneTimePreference":
        this.setState({
          oneTimePreference:
            !oneTimePreference,
        })
        break;
      case "isCampaignFileApprovalRequired":
        this.setState({
          isCampaignFileApprovalRequired:
            !isCampaignFileApprovalRequired,
        })
        break;
      case "isPayeeAuthenticationUsingOTP":
        this.setState({
          isPayeeAuthenticationUsingOTP:
            !isPayeeAuthenticationUsingOTP,
        })
        break;
      case "paymentAuthNonCDM":
        this.setState({
          paymentAuthNonCDM:
            !paymentAuthNonCDM,
        })
        break;
      case "paymentAuthCDM":
        this.setState({
          paymentAuthCDM:
            !paymentAuthCDM,
        })
        break;
      case "paymentAuthSMS":
        this.setState({
          paymentAuthSMS:
            !paymentAuthSMS,
        })
        break;
      case "paymentAuthEmail":
        this.setState({
          paymentAuthEmail:
            !paymentAuthEmail,
        })
        break;
      case "paymentAuthExpiry":
        this.setState({
          paymentAuthExpiry:
            !paymentAuthExpiry,
        })
        break;
      case "alternatePaymentOptionACH":
        this.setState({
          alternatePaymentOptionACH:
            !alternatePaymentOptionACH,
        })
        break;
      case "alternatePaymentOptionCHK":
        this.setState({
          alternatePaymentOptionCHK:
            !alternatePaymentOptionCHK,
        })
        break;
      case "authorizeDebit":
        this.setState({
          authorizeDebit:
            !authorizeDebit,
        })
        break;
	   case "preEnrollmentPaymentHistory":
        this.setState({
          preEnrollmentPaymentHistory: !preEnrollmentPaymentHistory,
        })
        break;
      default:
        break;
    }
  }

  onReportingChanged = () => {
    const {isReportingEnabled, paymentReconciliationTime, bessId} = this.state
    this.setState({
      isReportingEnabled: !isReportingEnabled,
      defaultPaymentClientReport: !isReportingEnabled,
      paymentReconciliationReport: !isReportingEnabled,
      enrollmentReport: !isReportingEnabled,
      rejectEmailReport: !isReportingEnabled,
      rejectSMSReport: !isReportingEnabled,
      reconciliationReport: !isReportingEnabled,
      rejectedDeliveryReport: !isReportingEnabled,
      dailyStatusReport: !isReportingEnabled,
      dailyEnrollmentReport: !isReportingEnabled,
      smsOptOutReport: !isReportingEnabled,
      paymentReconciliationTime: paymentReconciliationTime,
      bessId: isReportingEnabled ? "" : bessId,
    })
  }

  handleTabChange = (val) => {
    this.setState({ selectedTab: val }, async () => {
      await this.getPermissionList();
      await this.getAssignedPermissions();
      //check for zelle payment method
      this.fetchB2CPreferredClientPaymentTypes();
      this.getGeneralSettingConfig();
    });
  };
  render() {
    const {
      isLoading,
      permissionList,
      // reconciliationReportTime,
      // reportFileFormat,
      dialogMessage,
      isDialogActive,
      validation,
      savingData,
      variant,
      zelleSelectedByClient,
      defaultPaymentMethod, preEnrollmentPaymentHistory, campaignExpiryDays, expiredCampaigns, stalePayeeProfileDecision, payeeProfileDays,
      emailAlertToProfileDays, stalePayeeProfilePaymentDecision, dormantProfile, stalePayeeProfileDefaultPaymentMethod, zelleUnknownReceipientSupport,
      authorizeDebit, unknownReceipt, pickZelleToken, citiConnectId, thZelle, thRtp, thDepositToDebit, thMaster, thPaypal, thCorpRewardCard, minthCorpRewardCard, payeePaymentAuthTh,
      paymentAmountTh, paymentAuthSMS, paymentAuthEmail, paymentAuthExpDays, cardExpiryAlertDays, paymentAuthExpiry, ddDays, alternatePaymentOption,
      alternatePaymentOptionACH, alternatePaymentOptionCHK, oneTimePreference, isCampaignFileApprovalRequired, isPayeeAuthenticationUsingOTP, isReportingEnabled,
      paymentReconciliationTime,
      enrollmentMode, enrollmentModeEmail, enrollmentModeSMS, campaignReminderDays, bessId, clientBillingBranch, clientBillingAccount,
      isSsnMandatory,
      paymentAuthNonCDM,
      paymentAuthCDM,
      isMFARequired,
      isMFARequiredPaymentInfo,
      isMFARequiredPassword,
      defaultPaymentClientReport,
      paymentReconciliationReport,
      enrollmentReport,
      rejectEmailReport,
      rejectSMSReport,
      reconciliationReport,
      rejectedDeliveryReport,
      dailyStatusReport,
      dailyEnrollmentReport,
      smsOptOutReport,
      defaultPaymentMethodSelected,
      defaultPaymentMethodB2BSelected,
      valueDateAssignment, selectedTab, mfaAttemptsAllowed,
      isMFARequiredLogin, isMFARequiredRegistration, isMFARequiredPasswordReset,
      isMFARequiredPaymentPreference, isMFAForgotPassword, isMFAForgotUsername,
      PreferredPaymentMethod,
      preferredPaymentMethodCheked,
      selectedPreferredPaymentMethod,
      ACHPreferredPayment,
      CHKPreferredPayment,
      PayPalPreferredPayment,
      PushToCardPreferredPayment,
      ZellePreferredPayment,
      USbankPPDPreferredPayment,
      USbankDDCPreferredPayment,
      USbankCHKPreferredPayment,
      USBankZellePreferredPayment,
      USbankACHPreferredPayment,
      USbankRTPPreferredPayment,
      paymentAmountThPayer,
      payerPaymentAuthTh,
      noOfAttemptsAllowedToResendOtp,
      otpExpiryTime,
      noOfAttemptsToResendOtpPayeeAuth,
      otpExpiryTimePayeeAuth,
      isAVS,
      isAVSAccountStatus,
      isAVSAccountStatusOwnership,
      //isReportFixedTime,
      //isReportFrequencyBasis,
      PreferredPrepaidPaymentMethod,
      transmissionFrequency,
    } = this.state;
    const { theme } = this.props.clientConfig.layout;
    const { user, t } = this.props;
    const isSettingGeneralEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_GENERAL_SETTINGS_EDIT"]
        )) ||
      false;
    const disableEdit = !isSettingGeneralEditEnabled;
    const { isPayeeChoicePortal } = this.props.user;
    return (
      <>
        {/* <Paper className={"generalSettingsWrapper"}> */}
        {isLoading ? (
          <Box p={5} display="flex" justifyContent="center">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Box mx={5}>
            <Box mx={2}>
              <Tabs
                orientation="horizontal"
                variant="standard"
                value={selectedTab}
                indicatorColor="secondary"
                textColor="secondary"
              // TabIndicatorProps={{ className: classes.indicator }}
              // style={{ color: "#008CE6" }}
              >
                <Tab
                  onClick={() => this.handleTabChange(0)}
                  label={t('componentData.Settings.PaymentSettings')}
                  disabled={false}
                  textColor="secondary"
                // classes={classes.tabClasses}
                />
                <Tab
                  onClick={() => this.handleTabChange(1)}
                  label={t('componentData.Settings.OtherSettings')}
                  disabled={false}
                  textColor="secondary"
                />
              </Tabs>
            </Box>
            <Grid item xs={12} md={12}>
              <Paper className={"generalSettingsWrapper"}>
                <TabPanel value={selectedTab} index={0}>
                  <PaymentSettings
                    isSettingGeneralEditEnabled={isSettingGeneralEditEnabled}
                    disableEdit={disableEdit}
                    onClearAllClick={this.clearPaymentsAll.bind(this)}
                    onSelectClick={this.grantPaymentsAll.bind(this)}
                    permissionList={permissionList}
                    valueDateAssignment={valueDateAssignment}
                    onPermissionChange={this.checkItem.bind(this)}
                    defaultPaymentMethod={defaultPaymentMethod}
					          preEnrollmentPaymentHistory={preEnrollmentPaymentHistory}
                    handleChangeAccountStatus={this.handleChangeAccountStatus}
                    isAVS={isAVS}
                    isAVSAccountStatus={isAVSAccountStatus}
                    isAVSAccountStatusOwnership={isAVSAccountStatusOwnership}
                    onAVSChange={() => this.setState({
                      isAVS: !isAVS,
                      isAVSAccountStatus: !isAVS ? 1 : 0,
                      isAVSAccountStatusOwnership: 0,
                    })}
                    defaultPaymentMethodSelected={defaultPaymentMethodSelected}
                    defaultPaymentMethodB2BSelected={defaultPaymentMethodB2BSelected}
                    onDefaultMethodChange={(event) =>
                      this.setState({
                        defaultPaymentMethodSelected: event.target.value
                      })}
                      onDefaultMethodB2BChange={(event) =>
                        this.setState({
                          defaultPaymentMethodB2BSelected: event.target.value
                        })}
                    handleDefaultCheckboxChange={this.handleCheckBoxChange.bind(this)}
                    alternatePaymentOption={alternatePaymentOption}
                    alternatePaymentOptionACH={alternatePaymentOptionACH}
                    alternatePaymentOptionCHK={alternatePaymentOptionCHK}
                    alternatePaymentChange={() =>
                      this.setState({
                        alternatePaymentOption: !alternatePaymentOption,
                        alternatePaymentOptionACH: alternatePaymentOption ? false : alternatePaymentOptionACH,
                        alternatePaymentOptionCHK: alternatePaymentOption ? false : alternatePaymentOptionCHK,
                      })}
                    ddDays={ddDays}
                    handleFieldChange={this.handleInput.bind(this)}
                    zelleUnknownReceipientSupport={zelleUnknownReceipientSupport}
                    unknownReceipt={unknownReceipt}
                    onReceipientChange={() =>
                      this.setState({
                        zelleUnknownReceipientSupport: !zelleUnknownReceipientSupport,
                        unknownReceipt: zelleUnknownReceipientSupport ? "" : unknownReceipt
                      })}
                    zelleSelectedByClient={zelleSelectedByClient}
                    thZelle={thZelle} 
                    thRtp={thRtp}
                    thDepositToDebit={thDepositToDebit}
                    thMaster={thMaster} 
                    thPaypal={thPaypal}
                    thCorpRewardCard={thCorpRewardCard}
                    minthCorpRewardCard={minthCorpRewardCard}
                    payeePaymentAuthTh={payeePaymentAuthTh}
                    onPayeeAuthChange={() =>
                      this.setState({
                        payeePaymentAuthTh: !payeePaymentAuthTh,
                        paymentAmountTh: paymentAmountTh,
                        paymentAuthSMS: paymentAuthSMS,
                        paymentAuthEmail: paymentAuthEmail,
                        paymentAuthNonCDM: paymentAuthNonCDM,
                        paymentAuthCDM: paymentAuthCDM,
                      })
                    }
                    payerPaymentAuthTh={payerPaymentAuthTh}
                    paymentAmountThPayer={paymentAmountThPayer}
                    onPayerAuthChange={() =>
                      this.setState({
                        payerPaymentAuthTh: !payerPaymentAuthTh,
                        paymentAmountThPayer: paymentAmountThPayer,
                        noOfAttemptsAllowedToResendOtp: noOfAttemptsAllowedToResendOtp,
                        otpExpiryTime: otpExpiryTime,
                      })
                    }
                    isMFARequired={isMFARequired} isMFARequiredPaymentInfo={isMFARequiredPaymentInfo} mfaAttemptsAllowed={mfaAttemptsAllowed}
                    isMFARequiredPassword={isMFARequiredPassword} isMFARequiredLogin={isMFARequiredLogin} isMFARequiredRegistration={isMFARequiredRegistration}
                    isMFARequiredPasswordReset={isMFARequiredPasswordReset} isMFARequiredPaymentPreference={isMFARequiredPaymentPreference}
                    isMFAForgotPassword={isMFAForgotPassword} isMFAForgotUsername={isMFAForgotUsername}
                    onMFAChanged={() =>
                      this.setState({
                        isMFARequired: !isMFARequired,
                        isMFARequiredPaymentInfo: isMFARequired ? false : isMFARequiredPaymentInfo,
                        isMFARequiredPassword: isMFARequired ? false : isMFARequiredPassword,
                        isMFARequiredLogin: isMFARequired ? false : isMFARequiredLogin,
                        isMFARequiredRegistration: isMFARequired ? false : isMFARequiredRegistration,
                        isMFARequiredPasswordReset: isMFARequired ? false : isMFARequiredPasswordReset,
                        isMFARequiredPaymentPreference: isMFARequired ? false : isMFARequiredPaymentPreference,
                        isMFAForgotPassword: isMFARequired ? false : isMFAForgotPassword,
                        isMFAForgotUsername: isMFARequired ? false : isMFAForgotUsername,
                      })}
                    handleChange={this.handleChange.bind(this)}
                    paymentAuthNonCDM={paymentAuthNonCDM} paymentAuthCDM={paymentAuthCDM}
                    paymentAmountTh={paymentAmountTh} paymentAuthSMS={paymentAuthSMS}
                    paymentAuthEmail={paymentAuthEmail} paymentAuthExpDays={paymentAuthExpDays}
                    cardExpiryAlertDays={cardExpiryAlertDays}
                    paymentAuthExpiry={paymentAuthExpiry}
                    isLoading={isLoading} savingData={savingData} savePermissions={this.savePermissions.bind(this)}
                    validation={validation} theme={theme}
                    PreferredPaymentMethod={PreferredPaymentMethod}
                    PreferredPrepaidPaymentMethod={PreferredPrepaidPaymentMethod}
                    preferredPaymentMethodCheked={preferredPaymentMethodCheked}
                    selectedPreferredPaymentMethod={selectedPreferredPaymentMethod}
                    handlePreferredCheckboxChange={this.handlePreferredGroupCheckBoxChange.bind(this)}
                    preferredPaymentMethodChange={this.handlePreferredCheckBoxChange.bind(this)}
                    ACHPreferredPayment={ACHPreferredPayment}
                    CHKPreferredPayment={CHKPreferredPayment}
                    PayPalPreferredPayment={PayPalPreferredPayment}
                    PushToCardPreferredPayment={PushToCardPreferredPayment}
                    ZellePreferredPayment={ZellePreferredPayment}
                    USbankPPDPreferredPayment={USbankPPDPreferredPayment}
                    USbankDDCPreferredPayment={USbankDDCPreferredPayment}
                    USbankCHKPreferredPayment={USbankCHKPreferredPayment}
                    USBankZellePreferredPayment={USBankZellePreferredPayment}
                    USbankACHPreferredPayment={USbankACHPreferredPayment}
                    USbankRTPPreferredPayment={USbankRTPPreferredPayment}
                    noOfAttemptsAllowedToResendOtp={noOfAttemptsAllowedToResendOtp}
                    otpExpiryTime={otpExpiryTime}
                    {...this.props}
                  />
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                  <OtherSettings
                    isSettingGeneralEditEnabled={isSettingGeneralEditEnabled}
                    disableEdit={disableEdit}
                    onClearAllClick={this.clearSettingssAll.bind(this)}
                    onSelectClick={this.grantOthersAll.bind(this)}
                    enrollmentMode={enrollmentMode} 
                    enrollmentModeEmail={enrollmentModeEmail} 
                    enrollmentModeSMS={enrollmentModeSMS}
                    onEnrollChange={() =>
                      this.setState({
                        enrollmentMode: !enrollmentMode,
                        enrollmentModeEmail: enrollmentMode ? false : enrollmentModeEmail,
                        enrollmentModeSMS: enrollmentMode ? false : enrollmentModeSMS,
                      })}
                    onProfileChange={() =>
                      this.setState({
                        stalePayeeProfileDecision: !stalePayeeProfileDecision,
                        payeeProfileDays: stalePayeeProfileDecision ? "" : payeeProfileDays,
                        emailAlertToProfileDays: stalePayeeProfileDecision ? "" : emailAlertToProfileDays,
                        stalePayeeProfilePaymentDecision: false
                      })}
                    onProfilePaymentChange={() =>
                      this.setState({
                        stalePayeeProfilePaymentDecision: !stalePayeeProfilePaymentDecision,
                        stalePayeeProfileDefaultPaymentMethod: stalePayeeProfilePaymentDecision ? 0 : (!isPayeeChoicePortal?
                          parseInt(defaultPaymentMethodSelected):(parseInt(defaultPaymentMethodSelected)||parseInt(defaultPaymentMethodB2BSelected)) && !stalePayeeProfileDefaultPaymentMethod && parseInt(stalePayeeProfileDefaultPaymentMethod) === 2 ? 0 : "1"),
                      })}
                    onDefaultPaymentChange={(event) =>
                      this.setState({
                        stalePayeeProfileDefaultPaymentMethod: event.target.value
                      })}
                    mfaAttemptsAllowed={mfaAttemptsAllowed}
                    onReportingChanged={() => this.onReportingChanged()}
                    handleChange={this.handleChange.bind(this)}
                    campaignExpiryDays={campaignExpiryDays} campaignReminderDays={campaignReminderDays} isSsnMandatory={isSsnMandatory}
                    noOfAttemptsToResendOtpPayeeAuth={noOfAttemptsToResendOtpPayeeAuth} otpExpiryTimePayeeAuth={otpExpiryTimePayeeAuth}
                    expiredCampaigns={expiredCampaigns} defaultPaymentMethodSelected={defaultPaymentMethodSelected}
                    defaultPaymentMethodB2BSelected={defaultPaymentMethodB2BSelected}
                    handleFieldChange={this.handleInput.bind(this)} oneTimePreference={oneTimePreference} 
                    isCampaignFileApprovalRequired={isCampaignFileApprovalRequired}
                    isPayeeAuthenticationUsingOTP={isPayeeAuthenticationUsingOTP}
                    onPayeeAuthUsingOTPChange={() =>
                      this.setState({
                        isPayeeAuthenticationUsingOTP: !isPayeeAuthenticationUsingOTP,
                      })
                    }
                    stalePayeeProfileDecision={stalePayeeProfileDecision} payeeProfileDays={payeeProfileDays}
                    emailAlertToProfileDays={emailAlertToProfileDays}
                    stalePayeeProfilePaymentDecision={stalePayeeProfilePaymentDecision} defaultPaymentMethod={defaultPaymentMethod}
                    stalePayeeProfileDefaultPaymentMethod={stalePayeeProfileDefaultPaymentMethod}
                    isReportingEnabled={isReportingEnabled}
                    defaultPaymentClientReport={defaultPaymentClientReport} paymentReconciliationReport={paymentReconciliationReport}
                    enrollmentReport={enrollmentReport} rejectEmailReport={rejectEmailReport} rejectSMSReport={rejectSMSReport}
                    reconciliationReport={reconciliationReport} rejectedDeliveryReport={rejectedDeliveryReport} dailyStatusReport={dailyStatusReport}
                    dailyEnrollmentReport={dailyEnrollmentReport} smsOptOutReport={smsOptOutReport}
                    paymentReconciliationTime={paymentReconciliationTime} bessId={bessId}
                    clientBillingBranch={clientBillingBranch} clientBillingAccount={clientBillingAccount}
                    isLoading={isLoading} savingData={savingData} savePermissions={this.savePermissions.bind(this)}
                    validation={validation} theme={theme} {...this.props}
                    //isReportFixedTime={isReportFixedTime}
                    //isReportFrequencyBasis={isReportFrequencyBasis}
                    //handleChangeReportTime={this.handleChangeReportTime}
                    transmissionFrequency={transmissionFrequency}
                    handleChangeReportFrequency={this.handleChangeReportFrequency}
                  />
                </TabPanel></Paper>
            </Grid>
          </Box>)}
        {/* </Paper> */}



        {dialogMessage && isDialogActive && (
          // <AlertDialog
          //   title={dialogMessage}
          //   open={true}
          //   onConfirm={() =>
          //     this.setState({ dialogMessage: "", isDialogActive: false })
          //   }
          // />
          <Notification variant={variant} message={dialogMessage} handleClose={() => {
            this.setState({
              dialogMessage: "",
              isDialogActive: false
            })
          }} />
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.clientConfig, ...state.payment, ...state.USBankPayment,}))(
    GeneralSettings
  )
);
