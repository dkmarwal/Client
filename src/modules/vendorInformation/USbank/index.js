import React from "react";
import { Tabs, Tab, Grid, Box, Typography } from "@material-ui/core";
import { TabPanel } from "~/components/TabPanel/index";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { fetchUSBankPrepaidCardData } from '~/redux/actions/USbank/payments';
import BankAccountInfo from "./bankAccountInfo";
import RtpAccountInfo from "./rtpAccountInfo";
import PrepaidCardInfo from "./prepaidCard";
import DepositToDebit from "./depositToDebit";
import CheckInfo from "./checkInfo";
import LockIcon from "~/assets/icons/lock.svg";
import UnlockIcon from "~/assets/icons/lock_open.svg";
import UnlockDisabledIcon from "~/assets/icons/unlock_disabled.svg";
import RevokeIcon from "~/assets/icons/icon_undo.svg";
import RevokeDisabledIcon from "~/assets/icons/revoke_disabled.svg";
import DeactivateIcon from "~/assets/icons/deactivate.svg";
import DeactivateDisabledIcon from "~/assets/icons/deactivate_disabled.svg";
import ZelleInfo from "./zelleInfo";
import ProfileInfo from "./profileInfo";
import {
  fetchB2CConsumerProfileInfo,
  B2CConsumerDeactivate,
  B2CConsumerUnlock,
  B2CConsumerLock,
  B2CConsumerRevoke,
  resendEnrollmentLink,
  unlockB2CEnrollment,
  lockB2CEnrollment,
} from "~/redux/actions/B2C/consumers";
import Notification from "~/components/Notification";
import { USbankCSSData } from "~/redux/helpers/USbank/payments";
import {
  CONSUMER_CAMPAIGN_STATUS,
  Consumer_Status,
} from "~/config/entityTypes";
import { paymentMethodIds } from "~/config/paymentMethods";
import NoDataFound from "~/assets/icons/no_data_found.svg";
import ConfirmationDialog from "~/components/Dialogs/confirmationDialog";
import { accessRights } from "~/config/accessRights";
import { AlertDialog } from "~/components/Dialogs";
import {
  getUSbankContactMethod,
  getUSbankAccountMethod
} from "~/redux/actions/USbank/payee";

export class USbankVendorInformation extends React.Component {
  state = {
    selectedTab: 0,
    notificationMessage: "",
    notificationVariant: null,
    openConfirmationDialog: false,
    dialogContent: "",
    isConfirmed: false,
    selectedCTA: null,
    alertMessage: null,
    alertMessageCallbackType: null,
    finalCardDetails:[],
    source:null,
    isCssfClient:null,
    contactTypeList:[],
    accountTypeList:[],
    sppList:[]
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
  getProfileCircleName(name) {
    return (
      name &&
      name
        .match(/(\b\S)?/g)
        .join("")
        .match(/(^\S|\S$)?/g)
        .join("")
        .toUpperCase()
    );
  }

  handleTabChange = (val) => {
    this.setState({ selectedTab: val });
  };

  componentDidMount() {
   
    const { dispatch, vendorDetail } = this.props;
    dispatch(
      fetchB2CConsumerProfileInfo(
        vendorDetail?.consumerId,
        vendorDetail?.campaignDetailId
      )
    ).then(() => {
      if (this.props.consumerDetail.consumerProfileInfo?.data?.isGuest) {
        this.props.history.push({
          state: {
            selectedPayeeRemitToId: null,
          },
        });
        this.setState({
          selectedTab: 1,
          source:this.props.consumerDetail.consumerProfileInfo?.data.source,
          isCssfClient:this.props.consumerDetail.consumerProfileInfo?.data.isCssfClient

        });
      }
    });
    this.getPrepaidCardAPIData()
    this.getContactTypeList();
    this.getSPPList();
    this.getAccountTypeList();
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
          this.props.setVariant('error');
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
    if (
      this.props.USBankPayment.storedPrepaidCardData?.data &&
      !this.props.USBankPayment.storedPrepaidCardData.data.nodata
    ) {
      
        const { registrationData } =
        this.props.USBankPayment.storedPrepaidCardData?.data;
      if (registrationData?.length) {
        this.setState({ finalCardDetails: registrationData[0] });
      }
  };}
  handleCTAsNotification = (ctaType, response) => {
    const { consumerDetail, t } = this.props;
    const { error } = consumerDetail;
    if (!response) {
      this.setState({
        notificationMessage:
          error || t("componentData.reduxData.SomethingWentWrong"),
        notificationVariant: "error",
      });
    } else {
      this.setState({
        notificationMessage:
          consumerDetail[ctaType]?.data?.message ||
          t("componentData.vendorInfo.ctaUpdateSuccess"),
        notificationVariant: "success",
      });
    }
  };

  updateCTAsData = (vendorDetail) => {
    const { dispatch, refreshListData } = this.props;
    dispatch(
      fetchB2CConsumerProfileInfo(
        vendorDetail?.consumerId,
        vendorDetail?.campaignDetailId
      )
    );
    refreshListData();
  };

  handleLockIcon = () => {
    const { dispatch, vendorDetail } = this.props;
    this.setState({
      openConfirmationDialog: false,
    });
    const {
      canLock,
      canUnlock,
      isLockedByClient,
      isLockedByConsumer,
      isLocked,
    } = this.props.consumerDetail.consumerProfileInfo?.data;
    if (
      this.props.consumerDetail.consumerProfileInfo?.data?.type === "enrollment"
    ) {
      if ((isLockedByClient || isLockedByConsumer) && canUnlock) {
        dispatch(unlockB2CEnrollment([vendorDetail?.consumerIdentifier])).then(
          (response) => {
            this.setState({
              selectedCTA: null,
              dialogContent: "",
            });
            this.handleCTAsNotification("enrollmentUnlocked", response);
            if (response) {
              this.updateCTAsData(vendorDetail);
            }
          }
        );
      } else if (canLock) {
        dispatch(lockB2CEnrollment([vendorDetail?.consumerIdentifier])).then(
          (response) => {
            this.setState({
              selectedCTA: null,
              dialogContent: "",
            });
            this.handleCTAsNotification("enrollmentLocked", response);
            if (response) {
              this.updateCTAsData(vendorDetail);
            }
          }
        );
      }
    } else if (isLocked && canUnlock) {
      dispatch(B2CConsumerUnlock([vendorDetail?.consumerIdentifier])).then(
        (response) => {
          this.setState({
            selectedCTA: null,
            dialogContent: "",
          });
          this.handleCTAsNotification("unlock", response);
          if (response) {
            this.updateCTAsData(vendorDetail);
          }
        }
      );
    } else {
      dispatch(B2CConsumerLock([vendorDetail?.consumerIdentifier])).then(
        (response) => {
          this.setState({
            selectedCTA: null,
            dialogContent: "",
          });
          this.handleCTAsNotification("lock", response);
          if (response) {
            this.updateCTAsData(vendorDetail);
          }
        }
      );
    }
  };

  handleDeactivateIcon = () => {
    const { dispatch, vendorDetail } = this.props;
    this.setState({
      openConfirmationDialog: false,
    });

    if (this.state.isConfirmed) {
      dispatch(B2CConsumerDeactivate([vendorDetail?.consumerIdentifier])).then(
        (response) => {
          this.setState({
            selectedCTA: null,
            dialogContent: "",
          });
          this.handleCTAsNotification("deactivate", response);
          if (response) {
            this.updateCTAsData(vendorDetail);
          }
        }
      );
    }
  };

  handleRevokeIcon = () => {
    const { dispatch, vendorDetail } = this.props;
    this.setState({
      openConfirmationDialog: false,
    });
    dispatch(B2CConsumerRevoke([vendorDetail?.consumerIdentifier])).then(
      (response) => {
        this.setState({
          selectedCTA: null,
          dialogContent: "",
        });
        this.handleCTAsNotification("revoke", response);
        if (response) {
          this.updateCTAsData(vendorDetail);
        }
      }
    );
  };

  handleResendEnrollmentNotification = (ctaType, response) => {
    const { consumerDetail, t } = this.props;
    const { error } = consumerDetail;
    if (!response) {
      this.setState({
        alertMessage: error || t("componentData.reduxData.SomethingWentWrong"),
        alertMessageCallbackType: "REDIRECT",
      });
    } else {
      this.setState({
        alertMessage:
          consumerDetail[ctaType]?.data?.message ||
          t("componentData.vendorInfo.ctaUpdateSuccess"),
        alertMessageCallbackType: "REDIRECT",
      });
    }
  };

  handleResendEnrollmentLink = () => {
    const { dispatch, vendorDetail, t } = this.props;
    dispatch(resendEnrollmentLink(vendorDetail?.campaignDetailId)).then(
      (res) => {
        if (res) {
          this.setState({
            alertMessage: t("componentData.vendorInfo.linkResentSuccess"),
            alertMessageCallbackType: "REDIRECT",
          });
        } else {
          this.handleResendEnrollmentNotification("resendLinkInfo", res);
        }
      }
    );
  };

  handleClose = () => {
    this.setState({
      openConfirmationDialog: false,
      dialogContent: "",
      selectedCTA: null,
    });
  };

  handleConfirm = () => {
    this.setState(
      {
        isConfirmed: true,
      },
      () => {
        this.handleCTA();
      }
    );
  };

  handleCTA = () => {
    switch (this.state.selectedCTA) {
      case "Deactivate":
        return this.handleDeactivateIcon();
      case "Lock/Unlock":
        return this.handleLockIcon();
      case "Revoke":
        return this.handleRevokeIcon();
      default:
        return null;
    }
  };

  getPaymentMethodNameById = (primaryPaymentMethodId) => {
    if (primaryPaymentMethodId) {
      return Object.keys(paymentMethodIds).find(
        (key) => paymentMethodIds[key] === primaryPaymentMethodId
      );
    }
    return null;
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
  };
  render() {
  
    const { theme } = this.props.clientConfig.layout;
    const { classes, t, consumerDetail, vendorDetail, user, canEdit } =
      this.props;
    const { consumerProfileInfo } = consumerDetail;
    const { canLock, canDeactivate, canRevoke, canUnlock } =
      consumerProfileInfo?.data ?? {};

    const {
      selectedTab,
      notificationMessage,
      notificationVariant,
      openConfirmationDialog,
      dialogContent,
      alertMessage,
      alertMessageCallbackType,
    } = this.state;

    const {
      consumerBankAccountDetails,
      consumerRtpAccountDetails,
      consumerPrepaidCardDetails,
      consumerDebitCardDetails,
      consumerPaypalDetails,
      consumerCardDetails,
      consumerCheckDetails,
      consumerZelleDetails,
    } = consumerProfileInfo?.data ?? {};
    const payeeName = consumerProfileInfo?.data
      ? `${consumerProfileInfo.data.firstName ?? ""} ${
          consumerProfileInfo.data.lastName ?? ""
        }`
      : "";

    const isCTAShow = canLock || canUnlock || canDeactivate || canRevoke;
    const isGuestUser = consumerProfileInfo?.data?.isGuest;

    let isPayerCanEdit = false;
    if (
      consumerProfileInfo?.data &&
      vendorDetail?.isGuest === 0 &&
      [
        CONSUMER_CAMPAIGN_STATUS.CAMPAIGN_INITIATED,
        CONSUMER_CAMPAIGN_STATUS.CAMPAIGN_PENDING,
        CONSUMER_CAMPAIGN_STATUS.CAMPAIGN_COMPLETED,
      ].includes(vendorDetail?.campaignStatusId) &&
      ![
        Consumer_Status.DELETED,
        Consumer_Status.REVOKED,
        Consumer_Status.DEACTIVATED,
      ].includes(vendorDetail?.consumerStatusId)
    ) {
      isPayerCanEdit = true;
    }

    const isMySupplierRevokeEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_MY_SUPPLIERS_REVOKE"]
        )) ||
      false;

    const isMySupplierDeactivateEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_MY_SUPPLIERS_DEACTIVATE"]
        )) ||
      false;

    const isMySupplierLockEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_LOCK"])) ||
      false;

    const isMySupplierUnlockEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_MY_SUPPLIERS_UNLOCK"]
        )) ||
      false;

    const showLock = isMySupplierUnlockEnabled || isMySupplierLockEnabled;
    return (
      <Box flexGrow={1}>
        <Grid>
          <Grid container>
            <Grid item xs={12} style={{ display: "flex" }}>
              <Box mb={4} style={{ width: "100%", textAlign: "center" }}>
                <span
                  style={{
                    background: theme.palette.background.default,
                    color: theme.palette.primary.main,
                  }}
                  className={classes.b2cProfileCircle}
                >
                  {this.getProfileCircleName(payeeName)}
                </span>
                <div
                  style={{ color: theme.palette.primary.main }}
                  className={classes.vendorName}
                >
                  {payeeName}
                </div>
                <Typography
                  variant="h3"
                  color="inherit"
                  style={{ textAlign: "center" }}
                >
                  {t("componentData.vendorInfo.Status")}{" "}
                  {canUnlock
                    ? t("componentData.vendorInfo.lockedStatus")
                    : consumerProfileInfo?.data &&
                      (consumerProfileInfo?.data.consumerStatusName ??
                        consumerProfileInfo?.data.campaignStatusName)}
                </Typography>
              </Box>
              {!isGuestUser && Boolean(isCTAShow) && (
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    position: "absolute",
                    right: 32,
                  }}
                >
                  {showLock && (
                    <div
                      className={classes.ctaIconsCont}
                      style={{
                        cursor: !canLock && !canUnlock ? "default" : "pointer",
                      }}
                      onClick={() => {
                        if (canLock || canUnlock) {
                          this.setState({
                            selectedCTA: "Lock/Unlock",
                            openConfirmationDialog: true,
                            dialogContent: canLock
                              ? t("componentData.vendorInfo.lockConfirmText")
                              : t("componentData.vendorInfo.unlockConfirmText"),
                          });
                        }
                      }}
                    >
                      <img
                        className={classes.ctaIcons}
                        src={
                          canLock
                            ? LockIcon
                            : canUnlock
                            ? UnlockIcon
                            : UnlockDisabledIcon
                        }
                        alt="Lock/Unlock"
                      />
                      <Typography
                        className={classes.ctaText}
                        style={{
                          color: !canLock && !canUnlock ? "#979797" : "#1c4b6b",
                        }}
                      >
                        {t("componentData.vendorInfo.Lock/Unlock")}
                      </Typography>
                    </div>
                  )}
                  {isMySupplierRevokeEnabled && (
                    <div
                      className={classes.ctaIconsCont}
                      style={{ cursor: !canRevoke ? "default" : "pointer" }}
                      onClick={() => {
                        if (canRevoke) {
                          this.setState({
                            selectedCTA: "Revoke",
                            openConfirmationDialog: true,
                            dialogContent: t(
                              "componentData.vendorInfo.revokeConfirmText"
                            ),
                          });
                        }
                      }}
                    >
                      <img
                        className={classes.ctaIcons}
                        src={canRevoke ? RevokeIcon : RevokeDisabledIcon}
                        alt="Revoke"
                      />
                      <Typography
                        className={classes.ctaText}
                        style={{ color: !canRevoke ? "#979797" : "#1c4b6b" }}
                      >
                        {t("componentData.vendorInfo.Revoke")}
                      </Typography>
                    </div>
                  )}
                  {isMySupplierDeactivateEnabled && (
                    <div
                      className={classes.ctaIconsCont}
                      style={{
                        cursor: !canDeactivate ? "default" : "pointer",
                      }}
                      onClick={() => {
                        if (canDeactivate) {
                          this.setState({
                            openConfirmationDialog: true,
                            selectedCTA: "Deactivate",
                            dialogContent: t(
                              "componentData.vendorInfo.deactivateConfirmText"
                            ),
                          });
                        }
                      }}
                    >
                      <img
                        className={classes.ctaIcons}
                        src={
                          canDeactivate
                            ? DeactivateIcon
                            : DeactivateDisabledIcon
                        }
                        alt="Deactivate"
                      />
                      <Typography
                        className={classes.ctaText}
                        style={{
                          color: !canDeactivate ? "#979797" : "#1c4b6b",
                        }}
                      >
                        {t("componentData.vendorInfo.Deactivate")}
                      </Typography>
                    </div>
                  )}
                </div>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.paymentsTabContainer} id="payeeTab">
              <Grid item xs={12} md={12} lg={12}>
                <Tabs
                  orientation="horizontal"
                  variant="standard"
                  value={selectedTab}
                  aria-label="Payment Type"
                  textColor="#008CE6"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "#008CE6",
                      color: "#008CE6",
                    },
                  }}
                >
                  {!isGuestUser ? (
                    <Tab
                      onClick={() => this.handleTabChange(0)}
                      label={t("componentData.vendorInfo.ProfileInformation")}
                      disabled={false}
                      classes={classes.tabClasses}
                    />
                  ) : null}
                  <Tab
                    onClick={() => this.handleTabChange(1)}
                    label={t("componentData.vendorInfo.PaymentInformation")}
                  />
                </Tabs>
              </Grid>

              <Grid item xs={12} md={12}>
                {!isGuestUser ? (
                  <TabPanel value={selectedTab} index={0}>
                    {consumerProfileInfo && (
                      <ProfileInfo
                        consumerProfileInfo={consumerProfileInfo}
                        onResendLink={this.handleResendEnrollmentLink}
                        resendData={notificationMessage}
                        isPayeeEditable={
                          canEdit && isPayerCanEdit ? true : false
                        }
                        updateCTAsData={() =>
                          this.updateCTAsData(this.props.vendorDetail)
                        }
                        contactTypeList={this.state.contactTypeList}
                        sppList={this.state.sppList}
                        vendorDetail={this.props.vendorDetail}
                        user={user}
                        source={this.props.consumerDetail.consumerProfileInfo?.data.source}
                        isCssfClient={this.props.consumerDetail.consumerProfileInfo?.data.isCssfClient}
                      />
                    )}
                  </TabPanel>
                ) : null}
                <TabPanel value={selectedTab} index={1}>
                  {consumerBankAccountDetails ||
                  consumerRtpAccountDetails ||
                  consumerPrepaidCardDetails ||
                  consumerDebitCardDetails ||
                  consumerZelleDetails ||
                  consumerPaypalDetails ||
                  consumerCardDetails ||
                  consumerCheckDetails ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12} lg={12}>
                        {consumerProfileInfo.data.primaryPaymentMethodId ===
                            paymentMethodIds.ACH ? consumerProfileInfo?.data
                              ?.consumerBankAccountDetails && (
                              <BankAccountInfo
                                consumerBankAccountDetails={
                                  consumerProfileInfo.data.consumerBankAccountDetails
                                }
                                isPreferredPaymentMethod={
                                  consumerProfileInfo.data.primaryPaymentMethodId ===
                                  paymentMethodIds.ACH
                                }
                                source={this.props.consumerDetail.consumerProfileInfo?.data.source}
                                isCssfClient={this.props.consumerDetail.consumerProfileInfo?.data.isCssfClient}
                                sppList={this.state.sppList}
                                isAlternatePaymentMethod={
                                  consumerProfileInfo.data
                                    .secondaryPaymentMethodId === paymentMethodIds.ACH
                                }
                                consumerProfileInfo={consumerProfileInfo}
                                vendorDetail={vendorDetail}
                                accountTypeList={this.state.accountTypeList}
                                updateCTAsData={() => {
                                  this.updateCTAsData(this.props.vendorDetail)}}
                              />
                            ) : consumerProfileInfo?.data
                            ?.consumerBankAccountDetails && (
                            <BankAccountInfo
                            consumerBankAccountDetails={
                                consumerProfileInfo.data.consumerBankAccountDetails
                              }
                              isPreferredPaymentMethod={
                                consumerProfileInfo.data.primaryPaymentMethodId ===
                                paymentMethodIds.USBankRTP
                              }
                              source={this.props.consumerDetail.consumerProfileInfo?.data.source}
                              isCssfClient={this.props.consumerDetail.consumerProfileInfo?.data.isCssfClient}
                              sppList={this.state.sppList}
                              isAlternatePaymentMethod={
                                consumerProfileInfo.data
                                  .secondaryPaymentMethodId === paymentMethodIds.USBankRTP
                              }
                              vendorDetail={vendorDetail}
                              updateCTAsData={() => {
                                this.updateCTAsData(this.props.vendorDetail)}}
                              consumerProfileInfo={consumerProfileInfo}
                              accountTypeList={this.state.accountTypeList}
                              
                            />
                          )
                      } 
                   
                      {consumerProfileInfo?.data?.consumerZelleDetails && (
                        <ZelleInfo
                        updateCTAsData={() => {
                          this.updateCTAsData(this.props.vendorDetail)
      }}
                          consumerZelleDetails={
                            consumerProfileInfo.data.consumerZelleDetails
                          }
                          isPreferredPaymentMethod={
                            consumerProfileInfo.data.primaryPaymentMethodId ===
                            paymentMethodIds.Zelle
                          }
                          source={this.props.consumerDetail.consumerProfileInfo?.data.source}
                          isCssfClient={this.props.consumerDetail.consumerProfileInfo?.data.isCssfClient}
                          isAlternatePaymentMethod={
                            consumerProfileInfo.data
                              .secondaryPaymentMethodId ===
                            paymentMethodIds.Zelle
                          }
                          
                          vendorDetail={vendorDetail}
                        />
                      )}
                      {consumerProfileInfo?.data?.consumerCheckDetails && (
                        <CheckInfo
                          consumerCheckDetails={
                            consumerProfileInfo.data.consumerCheckDetails
                          }
                            updateCTAsData={() => {
                              this.updateCTAsData(this.props.vendorDetail)
          }}
                          vendorDetail={vendorDetail}
                          sppList={this.state.sppList}
                         
                          source={this.props.consumerDetail.consumerProfileInfo?.data.source}
                          isCssfClient={this.props.consumerDetail.consumerProfileInfo?.data.isCssfClient}
                          isPreferredPaymentMethod={
                            consumerProfileInfo.data.primaryPaymentMethodId ===
                            paymentMethodIds.CHK
                          }
                          isAlternatePaymentMethod={
                            consumerProfileInfo.data
                              .secondaryPaymentMethodId === paymentMethodIds.CHK
                          }
                        />
                      )}
                      {consumerProfileInfo?.data
                        ?.consumerPrepaidCardDetails && (
                        <PrepaidCardInfo
                        consumerPrepaidCardDetails={
                            consumerProfileInfo.data.consumerPrepaidCardDetails
                          }
                          isPreferredPaymentMethod={
                            consumerProfileInfo.data.primaryPaymentMethodId ===
                            paymentMethodIds.USBankPrepaidCard
                          }
                          primaryPaymentMethodIdselected={
                            consumerProfileInfo.data.primaryPaymentMethodId}
                          isAlternatePaymentMethod={
                            consumerProfileInfo.data
                              .secondaryPaymentMethodId === paymentMethodIds.USBankPrepaidCard
                          }
                          source={this.props.consumerDetail.consumerProfileInfo?.data.source}
                          isCssfClient={this.props.consumerDetail.consumerProfileInfo?.data.isCssfClient}

                          finalCardDetails={this.state.finalCardDetails}
                          vendorDetail={vendorDetail}
                          updateCTAsData={() => {
                            this.updateCTAsData(this.props.vendorDetail)
                          }}
                        />
                      )}
                      {consumerProfileInfo?.data?.consumerDebitCardDetails && (
                        <DepositToDebit
                        consumerDebitCardDetails={
                            consumerProfileInfo.data.consumerDebitCardDetails
                          }
                          isPreferredPaymentMethod={
                            consumerProfileInfo.data.primaryPaymentMethodId ===
                            paymentMethodIds.USBankDepositToDebitcard
                          }
                          isAlternatePaymentMethod={
                            consumerProfileInfo.data
                              .secondaryPaymentMethodId ===
                            paymentMethodIds.USBankDepositToDebitcard
                          }
                        />
                      )}                   
                    </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      direction="column"
                      spacing={2}
                      style={{ margin: "auto", justifyContent: "center" }}
                    >
                      <img
                        src={NoDataFound}
                        alt="No Data Found!"
                        width="auto"
                        height="160px"
                      />
                      <Typography
                        style={{
                          textAlign: "center",
                          marginTop: "8px",
                          marginLeft: "28px",
                          color: "#A1A1A1",
                        }}
                      >
                        {t("componentData.vendorInfo.noDataToShow")}
                      </Typography>
                    </Grid>
                  )}
                </TabPanel>
              </Grid>
            </div>
          </Grid>
        </Grid>
        {notificationMessage && (
          <Notification
            variant={notificationVariant}
            message={notificationMessage}
            handleClose={() => this.setState({ notificationMessage: "" })}
          />
        )}
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
        {openConfirmationDialog ? (
          <ConfirmationDialog
            open={openConfirmationDialog}
            dialogContent={dialogContent}
            handleClose={this.handleClose}
            handleConfirm={this.handleConfirm}
            cancelButtonLabel={t("componentData.vendorInfo.CANCEL")}
            saveButtonLabel={t("componentData.vendorInfo.SUBMIT")}
          />
        ) : null}
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
          this.hideAlertMessage();
        }}
      />
    );
  };
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
    ...state.b2cConsumers,
    ...state.USBankPayment
  }))(withStyles(styles)(USbankVendorInformation))
);
