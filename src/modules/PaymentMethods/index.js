import React from "react";
import {
  Grid,
  Paper,
  Box,
  Button,
  IconButton,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { CustomDialog } from "~/components/Dialogs";
import Notification from "~/components/Notification";
import {
  fetchAllBankAccounts,
  deleteBankAccount,
  fetchAllEFT,
  fetchAllACH,
  fetchAllVCA,
  fetchAllCheck,
  fetchTransactionTypes,
  fetchCurrencyCodes,
  fetchSelectedTabs,
} from "~/redux/helpers/settings";
import { getClientPaymentTypes, getMasterCardInfo, getTimeZoneList, updatePreferredPaymentTypes } from "~/redux/actions/payments";
import RemittanceSelector from "~/modules/RemittanceSelector";
import ACH from "~/assets/icons/ACH_main.svg";
import ACHSelected from "~/assets/icons/ACH_selected.svg";
import VCA from "~/assets/icons/VCA_main.svg";
import VCASelected from "~/assets/icons/VCA_selected.svg";
import CHK from "~/assets/icons/CHK_main.svg";
import CHKSelected from "~/assets/icons/CHK_selected.svg";
import EFT from "~/assets/icons/EFT_main.svg";
import EFTSelected from "~/assets/icons/EFT_selected.svg";
import { connect } from "react-redux";
import AddAccountForm from "../AddAccounForm";
import { styles } from "./styles";
import PaymentMethodsTable from "../PaymentMethodsTable";
import { accessRights } from "~/config/accessRights";
import { withTranslation } from "react-i18next";
import { PayerTypes } from '~/config/entityTypes';

class PaymentMethods extends React.Component {
  timer;
  state = {
    selectedChip: "",
    isAddAccount: true,
    fetchingList: false,
    modalMessage: "",
    selectedAccount: null,
    isModalActive: false,
    selectedAccountDetails: null,
    isAccountModalActive: false,
    isCardSelection: false,
    tabs: [],
    paymentModeIcons: {
      ACH: ACH,
      EFT: EFT,
      VCA: VCA,
      CHK: CHK,
      ACHSelected: ACHSelected,
      EFTSelected: EFTSelected,
      VCASelected: VCASelected,
      CHKSelected: CHKSelected,
    },
    check: [],
    eftAccount: [],
    bankAccount: [],
    virtualCard: [],
    masterCard: [],
    transactionTypes: [],
    currencyCodes: [],
    variant: "",
    timeZoneList: [],
    isLoading:false
  };

  componentDidMount() {

    this.getAllACH();
    this.getAllEFT();
    this.getAllCheck();
    this.getAllVCA();
    this.getTransactionTypes();
    this.fetchPaymentTypes();
    this.getCurrencyCodes();
    this.getAllMasterCard();
    this.fetchTimeZoneList();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  getSelectedFlag() { }
  fetchPaymentTypes = () => {
    const { dispatch } = this.props;
    const { paymentModeIcons } = this.state;
    this.setState({
      isLoading:true
    })
    dispatch(getClientPaymentTypes()).then((response) => {
      if (!response) {
        this.setState({
          isLoading:false
        })
        return false;
      }

      const paymentTypes =
        response.rows &&
        response.rows.map(
          ({
            label,
            fileFormatId,
            paymentCode,
            description,
            customPaymentCode,
          }) => {

            let paymentKey = null;
            const { isPayeeChoicePortal } = this.props.user;
            if(isPayeeChoicePortal){
              paymentKey = paymentCode;
            }else {
              paymentKey = paymentCode === "ACH"
              ? "bankAccount"
              : paymentCode === "EFT"
                ? "eftAccount"
                : paymentCode === "VCA"
                  ? "virtualCard"
                  : "check";
            }
            return {
              label: label,
              key: paymentKey,
              icon: paymentModeIcons[paymentCode],
              description: description,
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
    fetchSelectedTabs(clientId).then((response) => {
      if (response.error) {
        this.setState({
          isLoading:false
        })
        return false;
      }
      const array = response.data.rows;
      this.setState(
        {
          tabs: tabs.map((paymentType) => ({
            ...paymentType,
            selected: array && Boolean(array.includes(paymentType.fileFormatId)),
          })),
        },
        () => {
          const filters = this.state.tabs.filter((t) => t["selected"] == true);
          this.setState({
            filterChips: filters.map((tab, i) => ({
              label: tab.label,
              selected: i === 0 ? true : false,
              alias: tab.alias,
              key: tab.key,
            })),
            selectedAccount: filters && filters[0] && filters[0]["key"],
            selectedChip: filters && filters[0] && filters[0]["alias"],
            isLoading:false
          });
        }
      );
    });
  }

  getCurrencyCodes() {
    fetchCurrencyCodes().then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ currencyCodes: response.data.rows });
    });
  }

  getTransactionTypes() {
    fetchTransactionTypes().then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({
        transactionTypes: response.data.rows,
        fetchingList: false,
      });
    });
  }

  getAllEFT() {
    const clientId = this.props.user.userData.portalProfileId;
    fetchAllEFT(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ eftAccount: response.data.rows, fetchingList: false });
    });
  }

  getAllACH() {
    const clientId = this.props.user.userData.portalProfileId;
    fetchAllACH(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ bankAccount: response.data.rows, fetchingList: false });
    });
  }

  getAllCheck() {
    const clientId = this.props.user.userData.portalProfileId;
    fetchAllCheck(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ check: response.data, fetchingList: false });
    });
  }

  getAllVCA() {
    const clientId = this.props.user.userData.portalProfileId;
    fetchAllVCA(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ virtualCard: response.data.rows, fetchingList: false });
    });
  }

  getAllMasterCard() {
    const clientId = this.props.user.userData.portalProfileId;
    getMasterCardInfo(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, "error");
      }
      this.setState({ masterCard: response.data, fetchingList: false });
    });
  }

  fetchTimeZoneList = async () => {
    const options = await getTimeZoneList();
    if (options && options.data) {
      this.setState({ timeZoneList: options.data });
    }
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
        updatePreferredPaymentTypes({
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
      fetchAllBankAccounts().then((response) => {
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
    this.refreshData();
    this.setState({
      isAccountModalActive: false,
      isCardSelection: false,
      selectedAccountDetails: null,
    });
  }

  showAccountModal(accountObj) {
    this.setState({
      isAccountModalActive: true,
      selectedAccountDetails: accountObj || {},
    });
  }

  showCardSelectionModal = (value) => {
    this.setState({ isCardSelection: value })
  }

  editAccount(account) {
    this.setState({ isAddAccount: false }, () => {
      this.showAccountModal(account);
    });
  }

  addAccount(account) {
    this.setState({ isAddAccount: true }, () => {
      this.showAccountModal(account);
    });
  }

  closeModal() {
    this.setState({ isAccountModalActive: false, isCardSelection: false, fetchingList: true }, () => {
      switch (this.state.selectedAccount) {
        case "bankAccount":
          this.getAllACH();
          break;
        case "eftAccount":
          this.getAllEFT();
          break;
        case "virtualCard":
          this.getAllVCA();
          break;
        case "check":
          this.getAllCheck();
          break;
        default:
          break;
      }
    });
  }

  returnAccounts() {
    switch (this.state.selectedAccount) {
      case "bankAccount":
        return this.state.bankAccount;
      case "eftAccount":
        return this.state.eftAccount;
      case "virtualCard":
        return this.props.payerTypeId == PayerTypes.CARDS ? this.state.masterCard : this.state.virtualCard;
      case "check":
        return this.state.check;
      default:
        return null
    }
  }

  refreshData() {
    switch (this.state.selectedAccount) {
      case "bankAccount":
        this.getAllACH();
        break;
      case "eftAccount":
        this.getAllEFT();
        break;
      case "virtualCard":
        this.getAllVCA();
        // Added setTimeOut because of late response of API 
        this.timer = setTimeout(()=>{this.getAllMasterCard()},3000);
        break;
      case "check":
        this.getAllCheck();
        break;
      default:
        break;
    }
  }

  render() {
    const {
      tabs,
      fetchingList,
      isModalActive,
      modalMessage,
      isAddAccount,
      isAccountModalActive,
      isCardSelection,
      selectedAccountDetails,
      selectedAccount,
      transactionTypes,
      currencyCodes,
      filterChips,
      selectedChip,
      variant,
      timeZoneList
    } = this.state;
    const { classes, t, payerTypeId } = this.props;
    const bankParentProfileId = this.props.user.userData.activeBankParentProfileId;
    const clientId = this.props.user.userData.portalProfileId;
    const accounts = this.returnAccounts();
    const { theme } = this.props.clientConfig.layout;
    const { user } = this.props;

    const isSettingPaymentMethodAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_ADD"]
        )) ||
      false;
    const isSettingPaymentMethodEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_EDIT"]
        )) ||
      false;

    const hasSettingPaymentMethodAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_ADD"]
        )) ||
      false;
	  
    const canUpdatePreferncePaymentMethod = bankParentProfileId === 1 && hasSettingPaymentMethodAddEnabled && isSettingPaymentMethodEditEnabled ? true : false
    //const isSettingPaymentMethodAddEnabled = false //forcely disableing add button
    //const isSettingPaymentMethodEditEnabled =false //forcely disableing edit button

    const isSettingPaymentMethodDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_DOWNLOAD"]
        )) ||
      false;

    return (
      <Box mx={6} my={0}>
        <Grid container item xs={12} md={12} justify="flex-end">
          <Box mt={-7}>
            {" "}
            {isSettingPaymentMethodAddEnabled &&
              filterChips &&
              filterChips.length > 0 &&
              selectedAccount &&
              selectedAccount.length > 0 && (
                <>
                  {this.props.i18n.language === "fr" ? (
                    <Tooltip title={t("componentData.paymentMethods.addAcc")}>
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
          {payerTypeId !== PayerTypes.CARDS ?
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
            </Paper> : null}
        </Box>
        { this.state.isLoading ? null : filterChips && filterChips.length > 0 ? (
          <Box my={3}>
            <Paper>
              <Box>
                <PaymentMethodsTable
                  selectedChip={selectedChip}
                  filterChips={filterChips}
                  fetchingList={fetchingList}
                  accounts={selectedAccount !== "check" ? accounts : !Object.keys(accounts).length ? undefined : [accounts]}
                  paymentType={selectedAccount}
                  theme={theme}
                  showCardSelectionModal={this.showCardSelectionModal}
                  addAccount={(item) => this.addAccount(item)}
                  editAccount={(item) => this.editAccount(item)}
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
                  payerTypeId={payerTypeId}
                  timeZoneList={timeZoneList}
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

        {(isAccountModalActive || isCardSelection) && (
          <CustomDialog
            title={
              isAddAccount
                ? t("componentData.paymentMethods.AddNewAccount")
                : t("componentData.paymentMethods.UpdateAccount")
            }
            onClose={this.hideAccountModal.bind(this)}
            onConfirm={this.hideAccountModal.bind(this)}
            width={"840px"}
          >
            <Box display="block">
              <AddAccountForm
                refreshData={() => this.refreshData()}
                onCancel={this.hideAccountModal.bind(this)}
                transactionTypes={transactionTypes}
                currencyCodes={currencyCodes}
                isCardSelection={isCardSelection}
                clientId={clientId}
                setDialogMessage={(flag, message, variant) =>
                  this.setDialogMessage(flag, message, variant)
                }
                closeModal={this.closeModal.bind(this)}
                accountDetails={selectedAccountDetails}
                accountType={selectedAccount}
                isAddAccount={isAddAccount}
                payerTypeId={payerTypeId}
              />
            </Box>
          </CustomDialog>
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
  }))(withStyles(styles)(PaymentMethods))
);
