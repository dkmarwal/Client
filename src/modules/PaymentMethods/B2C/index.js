import React from "react";
import {
  Grid,
  Paper,
  Box,
  Button,
  withStyles,
  Tooltip,
  CircularProgress,
  IconButton
} from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { CustomDialog } from "~/components/Dialogs";
import Notification from "~/components/Notification";
import {
  B2CfetchAllBankAccounts,
  deleteBankAccount,
  B2CfetchAllZelle,
  B2CfetchAllCheck,
  B2CfetchAllPayPal,
  B2CfetchAllPushToCard,
  fetchTransactionTypes,
  B2CfetchSelectedTabs,
} from "~/redux/helpers/settings";
import { B2CgetClientPaymentTypes, B2CupdatePreferredPaymentTypes } from "~/redux/actions/payments";
import RemittanceSelector from "~/modules/RemittanceSelector/B2C";
import ACH from "~/assets/icons/ACH_grey.svg";
import ACHSelected from "~/assets/icons/ach_white.svg";
import Zelle from "~/assets/icons/Zelle.svg";
import ZelleSelected from "~/assets/icons/Zelle_selected.svg";
import CHK from "~/assets/icons/check_icon.svg";
import CHKSelected from "~/assets/icons/check_icon_selected.svg";
import PayPal from "~/assets/icons/PayPal.svg";
import PayPalSelected from "~/assets/icons/Paypal_selected.svg";
import PushToCard from "~/assets/icons/Push_to_Card.svg";
import PushToCardSelected from "~/assets/icons/PushToCard_selected.svg";
import { connect } from "react-redux";
import B2CAddAccountForm from "~/modules/AddAccounForm/B2C";
import { styles } from "./styles";
import PaymentMethodsTable from "~/modules/PaymentMethodsTable/B2C";

import { accessRights } from "~/config/accessRights";
import { withTranslation } from "react-i18next";
import { paymentMethods } from "~/config/paymentMethods";
import { fetchAllB2CAchList } from "~/redux/actions/B2C/payments";

class B2CPaymentMethods extends React.Component {
  state = {
    isRowClick: false,
    popupTitle: null,
    alertMsg: null,
    alertType: null,
    selectedChip: "",
    isAddAccount: true,
    fetchingList: false,
    modalMessage: "",
    selectedAccount: null,
    isModalActive: false,
    selectedAccountDetails: null,
    isAccountModalActive: false,
    tabs: [],
    paymentModeIcons: {
      ACH: ACH,
      CXC: Zelle,
      PPL: PayPal,
      CHK: CHK,
      MSC: PushToCard,
      ACHSelected: ACHSelected,
      CXCSelected: ZelleSelected,
      PPLSelected: PayPalSelected,
      CHKSelected: CHKSelected,
      MSCSelected: PushToCardSelected,
    },
    Zelle: [],
    check: [],
    PayPal: [],
    PushToCard: [],
    variant: "",
    isLoading: false,
  };

  componentDidMount() {
    this.getAllACH();
    this.getAllZelle();
    this.getAllCheck();
    this.getAllPayPal();
    this.getAllPushToCard();
    this.getTransactionTypes();
    this.fetchPaymentTypes();
  }

  fetchPaymentTypes = () => {
    const { dispatch } = this.props;
    const { paymentModeIcons } = this.state;
    this.setState({
      isLoading: true,
    });
    dispatch(B2CgetClientPaymentTypes()).then((response) => {
      if (!response) {
        this.setState({
          isLoading: false,
        });
        return false;
      }

      const paymentTypes =
        response.rows &&
        response.rows.map(
          ({
            label,
            fileFormatId,
            paymentCode,
            b2cDescription,
            customPaymentCode,
          }) => {
            return {
              label: b2cDescription,
              key:
                paymentCode === "ACH"
                  ? "bankAccount"
                  : paymentCode === paymentMethods["Zelle"]
                  ? paymentMethods["Zelle"]
                  : paymentCode === paymentMethods["PayPal"]
                  ? paymentMethods["PayPal"]
                  : paymentCode === paymentMethods["PushToCard"]
                  ? paymentMethods["PushToCard"]
                  : "check",
              icon: paymentModeIcons[paymentCode],
              description: b2cDescription,
              iconTypeSelected: paymentModeIcons[`${paymentCode}Selected`],
              alias: paymentCode,
              fileFormatId: fileFormatId,
              id: fileFormatId,
              selected: false,
            };
          }
        );

      this.setState(
        {
          tabs: paymentTypes,
        },
        () => {
          this.getSelectedTabs();
        }
      );
    });
  };
  getSelectedTabs() {
    const clientId = this.props.user.userData.portalProfileId;
    const { tabs } = this.state;
    B2CfetchSelectedTabs(clientId).then((response) => {
      if (response.error) {
        this.setState({
          isLoading: false,
        });
        return false;
      }
      const array = response.data.rows;
      this.setState(
        {
          tabs: tabs.map((paymentType) => ({
            ...paymentType,
            selected:
              array && Boolean(array.includes(paymentType.fileFormatId)),
          })),
        },
        () => {
          const filters = this.state.tabs.filter((t) => t["selected"] === true);
          this.setState({
            filterChips: filters.map((tab, i) => ({
              label: tab.label,
              selected: i === 0 ? true : false,
              alias: tab.alias,
              key: tab.key,
            })),
            selectedAccount: filters && filters[0] && filters[0]["key"],
            selectedChip: filters && filters[0] && filters[0]["alias"],
            isLoading: false,
          });
        }
      );
    });
  }

  getTransactionTypes() {
    fetchTransactionTypes().then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({
        fetchingList: false,
      });
    });
  }

  getAllZelle() {
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchAllZelle(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ Zelle: response.data, fetchingList: false });
    });
  }

  getAllACH() {
    const clientId = this.props.user.userData.portalProfileId;
    this.props.dispatch(fetchAllB2CAchList(clientId)).then((response) => {
      if (!response) {
        this.setDialogMessage(true, this.props.achAccountList.error, "error");
      }
      this.setState({ fetchingList: false });
    });
  }

  getAllCheck() {
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchAllCheck(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ check: response.data, fetchingList: false });
    });
  }

  getAllPayPal() {
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchAllPayPal(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ PayPal: response.data, fetchingList: false });
    });
  }

  getAllPushToCard() {
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchAllPushToCard(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ PushToCard: response.data, fetchingList: false });
    });
  }

  selectTab(tab) {
    const { tabs } = this.state;
    const clientId = this.props.user.userData.portalProfileId;
    tab["selected"] = !tab["selected"];

    const filterChips_ = [];
    tabs.forEach((tab, i) => {
      if (tab["selected"]) {
        filterChips_.push({
          label: tab.label,
          selected: i === 0 ? true : false,
          alias: tab.alias,
          key: tab.key,
        });
      }
    });

    const selectedPaymentTypes = tabs
      .filter((tab) => tab && tab["selected"])
      .map((t) => t["id"]);

    this.props
      .dispatch(
        B2CupdatePreferredPaymentTypes({
          clientId: clientId,
          selectedPaymentTypes,
        })
      )
      .then((response) => {
        if (!response) {
          //alert("Error in API");
          //this.setState({updateProgress: false});
          return false;
        }
      });

    const selectedChip_ =
      filterChips_ && filterChips_[0] && filterChips_[0]["alias"];
    const _selectedAccount =
      filterChips_ && filterChips_[0] && filterChips_[0]["key"];
    this.setState({
      ...this.state,
      selectedAccount: _selectedAccount,
      filterChips: filterChips_,
      selectedChip: selectedChip_,
    });
  }

  setDialogMessage(flag, message, variant) {
    this.setState({
      isModalActive: flag,
      modalMessage: message,
      variant,
    });
  }

  getAllBankAccounts() {
    this.setState({ fetchingList: true }, () => {
      B2CfetchAllBankAccounts().then((response) => {
        if (response.error) {
          this.setDialogMessage(true, response.message, "error");
        }
        this.setState({ accounts: response.data.rows, fetchingList: false });
      });
    });
  }

  deleteAccount() {
    deleteBankAccount().then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.getAllBankAccounts();
    });
  }

  hideAccountModal() {
    this.setState({
      isAccountModalActive: false,
      selectedAccountDetails: null,
    });
  }

  showAccountModal(accountObj) {
    const { selectedAccount, isAddAccount, selectedChip } = this.state;
    const { t } = this.props;
    const accountData = this.returnAccounts();
    let popupTitle = null;
    switch (selectedChip) {
      case "ACH":
        popupTitle = t("componentData.paymentMethods.BankAccount");
        break;
      case paymentMethods["Zelle"]:
        popupTitle = t("componentData.paymentMethods.Zelle");
        break;
      case paymentMethods["PayPal"]:
        popupTitle = t("componentData.paymentMethods.PayPal");
        break;
      case "CHK":
        popupTitle = t("componentData.paymentMethods.Check");
        break;
      case paymentMethods["PushToCard"]:
        popupTitle = t("componentData.paymentMethods.PushtoCard");
        break;
      default:
        break;
    }

    if (selectedAccount === "bankAccount") {
      this.setState({
        isAccountModalActive: true,
        selectedAccountDetails: accountObj || {},
      });
    } else {
      if (Object.keys(accountData).length > 0 && isAddAccount) {
        this.setState({
          alertType: "error",
          alertMsg: `${t(
            "componentData.paymentMethods.oneAcc"
          )} ${popupTitle} ${t("componentData.paymentMethods.configured")}`,
        });
      } else {
        this.setState({
          isAccountModalActive: true,
          selectedAccountDetails: accountObj || {},
        });
      }
    }
  }

  editAccount(account, isRowClick) {
    let popupTitle = null;
    const { t } = this.props;
    switch (this.state.selectedChip) {
      case "ACH":
        popupTitle = t("componentData.paymentMethods.BankAccount");
        break;
      case paymentMethods["Zelle"]:
        popupTitle = t("componentData.paymentMethods.Zelle");
        break;
      case paymentMethods["PayPal"]:
        popupTitle = t("componentData.paymentMethods.PayPal");
        break;
      case "CHK":
        popupTitle = t("componentData.paymentMethods.Check");
        break;
      case paymentMethods["PushToCard"]:
        popupTitle = t("componentData.paymentMethods.PushtoCard");
        break;
      default:
        break;
    }
    this.setState(
      {
        ...this.state,
        isAddAccount: false,
        popupTitle: popupTitle,
        isRowClick: isRowClick,
      },
      () => {
        this.showAccountModal(account);
      }
    );
  }

  addAccount(account) {
    let popupTitle = null;
    const { t } = this.props;
    switch (this.state.selectedChip) {
      case "ACH":
        popupTitle = t("componentData.paymentMethods.BankAccount");
        break;
      case paymentMethods["Zelle"]:
        popupTitle = t("componentData.paymentMethods.Zelle");
        break;
      case paymentMethods["PayPal"]:
        popupTitle = t("componentData.paymentMethods.PayPal");
        break;
      case "CHK":
        popupTitle = t("componentData.paymentMethods.Check");
        break;
      case paymentMethods["PushToCard"]:
        popupTitle = t("componentData.paymentMethods.PushtoCard");
        break;
      default:
        break;
    }
    this.setState(
      {
        ...this.state,
        isAddAccount: true,
        popupTitle: popupTitle,
      },
      () => {
        this.showAccountModal(account);
      }
    );
  }

  closeModal() {
    this.setState({ isAccountModalActive: false, fetchingList: true }, () => {
      switch (this.state.selectedAccount) {
        case "bankAccount":
          this.getAllACH();
          break;
        case paymentMethods["Zelle"]:
          this.getAllZelle();
          break;
        case paymentMethods["PayPal"]:
          this.getAllPayPal();
          break;
        case "check":
          this.getAllCheck();
          break;
        case paymentMethods["PushToCard"]:
          this.getAllPushToCard();
          break;
        default:
          break;
      }
    });
  }

  returnAccounts() {
    switch (this.state.selectedAccount) {
      case "bankAccount":
        return this.props.achAccountList?.data?.rows ?? [];
      case paymentMethods["Zelle"]:
        return this.state.Zelle;
      case paymentMethods["PayPal"]:
        return this.state.PayPal;
      case "check":
        return this.state.check;
      case paymentMethods["PushToCard"]:
        return this.state.PushToCard;
      default:
        break;
    }
  }

  refreshData() {
    switch (this.state.selectedAccount) {
      case "bankAccount":
        this.getAllACH();
        break;
      case paymentMethods["Zelle"]:
        this.getAllZelle();
        break;
      case paymentMethods["PayPal"]:
        this.getAllPayPal();
        break;
      case "check":
        this.getAllCheck();
        break;
      case paymentMethods["PushToCard"]:
        this.getAllPushToCard();
        break;
      default:
        break;
    }
  }

  notification = (type, msg) => {
    if (type && msg) {
      this.setState({
        alertType: type,
        alertMsg: msg,
      });
    }
  };

  renderSnackbar = (type, msg) => {
    return (
      <Notification
        variant={type}
        message={msg}
        handleClose={this.hideAlertMessage}
      />
    );
  };

  hideAlertMessage = () => {
    this.setState({
      alertType: null,
      alertMsg: null,
    });
  };

  render() {
    const {
      tabs,
      fetchingList,
      isModalActive,
      modalMessage,
      isAddAccount,
      isAccountModalActive,
      selectedAccountDetails,
      selectedAccount,
      filterChips,
      selectedChip,
      variant,
      alertMsg,
      alertType,
      popupTitle,
      isRowClick,
    } = this.state;
    const { classes, t } = this.props;
    const bankParentProfileId =
      this.props.user.userData.activeBankParentProfileId;
    const clientId = this.props.user.userData.portalProfileId;
    const accounts = this.returnAccounts();
    const { theme } = this.props.clientConfig.layout;
    const { user } = this.props;

    const isSettingPaymentMethodAddEnabled =
      user.userRoles &&
      user.userRoles.includes(accessRights["SETTINGS_PAYMENT_METHODS_ADD"])
        ? true
        : bankParentProfileId === 1
        ? true
        : false;

    const isSettingPaymentMethodEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_EDIT"]
        )) ||
      false;

    const isSettingPaymentMethodDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_DOWNLOAD"]
        )) ||
      false;

    const hasSettingPaymentMethodAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_ADD"]
        )) ||
      false;
	  
    const canUpdatePreferncePaymentMethod = bankParentProfileId === 1 && hasSettingPaymentMethodAddEnabled && isSettingPaymentMethodEditEnabled ? true : false

    return (
      <Box mx={6} my={0}>
        {tabs.length === 0 ? (
          <CircularProgress
            color="primary"
            style={{ display: "block", margin: "50px auto" }}
          />
        ) : (
          <>
            <Grid container item xs={12} md={12} justify="flex-end">
              <Box mt={-7}>
                {isSettingPaymentMethodAddEnabled &&
                  filterChips &&
                  filterChips.length > 0 &&
                  selectedAccount &&
                  selectedAccount.length > 0 && (
                    <>
                      {this.props.i18n.language === "fr" ? (
                        <Tooltip
                          title={t("componentData.paymentMethods.addAcc")}
                        >
                          <IconButton
                            variant="contained"
                            color="secondary"
                            className={classes.smallBtn}
                            onClick={() => this.addAccount()}
                          >
                            <AddOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.largeBtn}
                          startIcon={<AddOutlinedIcon />}
                          onClick={() => this.addAccount()}
                        >
                          {t("componentData.paymentMethods.addAcc")}
                        </Button>
                      )}
                    </>
                  )}
              </Box>
            </Grid>
            <Box mt={0}>
              <Paper className={"generalSettingsWrapper"}>
                <Box px={4} my={0} py={3}>
                  {/* <Grid sm={3} xs={3}> */}
                  <Box my={1} pb={1}>
                    <h3 className={classes.settingHeading}>
                      {t("componentData.paymentMethods.PaymentInformation")}
                    </h3>
                  </Box>
                  <Box pb={1}>
                    <h5>
                      {bankParentProfileId === 1
                        ? t("componentData.paymentMethods.Select")
                        : t("componentData.paymentMethods.Selected")}{" "}
                      {t("componentData.paymentMethods.modeOfPay")}
                    </h5>
                  </Box>

                  <RemittanceSelector
                    title=""
                    options={tabs}
                    pt={-4}
                    onChange={(a, b, c, tab) =>
                      canUpdatePreferncePaymentMethod ? this.selectTab(tab) : null
                    }
                  />
                  {/* </Grid> */}
                </Box>
              </Paper>
            </Box>
            {this.state.isLoading ? null : filterChips &&
              filterChips.length > 0 ? (
              <Box my={3}>
                <Paper>
                  <Box>
                    <PaymentMethodsTable
                      selectedChip={selectedChip}
                      filterChips={filterChips}
                      fetchingList={fetchingList}
                      accounts={
                        selectedAccount === "check"
                          ? [accounts]
                          : selectedAccount === paymentMethods["PayPal"] &&
                            accounts &&
                            Object.keys(accounts).length > 0
                          ? [accounts]
                          : selectedAccount === paymentMethods["PayPal"] &&
                            accounts &&
                            Object.keys(accounts).length === 0
                          ? accounts
                          : selectedAccount === paymentMethods["Zelle"] &&
                            accounts &&
                            Object.keys(accounts).length > 0
                          ? [accounts]
                          : accounts
                      }
                      paymentType={selectedAccount}
                      theme={theme}
                      addAccount={(item) => this.addAccount(item)}
                      editAccount={(item, isRowClick) =>
                        this.editAccount(item, isRowClick)
                      }
                      canEdit={isSettingPaymentMethodEditEnabled}
                      canAdd={isSettingPaymentMethodAddEnabled}
                      canDownload={isSettingPaymentMethodDownloadEnabled}
                      hanldeFilterChips={(key) => {
                        const element =
                          filterChips &&
                          filterChips.filter((chip) => chip["key"] === key);
                        const selectedChip_ =
                          element && element[0] && element[0]["alias"];
                        this.setState({
                          selectedAccount: key,
                          selectedChip: selectedChip_,
                        });
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            ) : (
              <Box my={10}>
                <Paper>
                  <Box p={5}>
                    {t("componentData.paymentMethods.paymentMethodAssign")}
                  </Box>
                </Paper>
              </Box>
            )}
            {isModalActive && modalMessage && (
              <Notification
                variant={variant}
                message={modalMessage}
                handleClose={() => {
                  this.setState({ isModalActive: false, modalMessage: "" });
                }}
              />
            )}
            {isAccountModalActive && (
              <CustomDialog
                title={
                  isAddAccount
                    ? `${t(
                        "componentData.paymentMethods.AddNew"
                      )} ${popupTitle}`
                    : isRowClick
                    ? popupTitle
                    : `${t("componentData.paymentMethods.Edit")} ${popupTitle}`
                }
                onClose={this.hideAccountModal.bind(this)}
                onConfirm={this.hideAccountModal.bind(this)}
                width={"840px"}
                dialogClassName={classes.paymentPopup}
              >
                <Box display="block">
                  <B2CAddAccountForm
                    refreshData={() => this.refreshData()}
                    onCancel={this.hideAccountModal.bind(this)}
                    clientId={clientId}
                    closeModal={this.closeModal.bind(this)}
                    accountDetails={selectedAccountDetails}
                    accountType={selectedAccount}
                    isAddAccount={isAddAccount}
                    notification={this.notification}
                    canEdit={isSettingPaymentMethodEditEnabled}
                    canAdd={isSettingPaymentMethodAddEnabled}
                    canDownload={isSettingPaymentMethodDownloadEnabled}
                    accounts={
                      selectedAccount === "check"
                        ? [accounts]
                        : selectedAccount === paymentMethods["PayPal"] &&
                          accounts &&
                          Object.keys(accounts).length > 0
                        ? [accounts]
                        : selectedAccount === paymentMethods["PayPal"] &&
                          accounts &&
                          Object.keys(accounts).length === 0
                        ? accounts
                        : selectedAccount === paymentMethods["Zelle"] &&
                          accounts &&
                          Object.keys(accounts).length > 0
                        ? [accounts]
                        : accounts
                    }
                    isRowClick={isRowClick}
                  />
                </Box>
              </CustomDialog>
            )}
            {alertMsg && this.renderSnackbar(alertType, alertMsg)}
          </>
        )}
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.payment,
    ...state.clientConfig,
    ...state.b2cPayments,
  }))(withStyles(styles)(B2CPaymentMethods))
);
