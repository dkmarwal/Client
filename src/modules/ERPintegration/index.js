import React from "react";
import {
  Grid,
  Paper,
  Box,
  Button,
  Typography,
  withStyles,
} from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { CustomDialog } from "../../components/Dialogs";
import Notification from "~/components/Notification";
import GetAppIcon from "@material-ui/icons/GetApp";
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
import ACH from "~/assets/icons/ACH_grey.svg";
import ACHSelected from "~/assets/icons/ach_white.svg";
import VCA from "~/assets/icons/VCA_grey.svg";
import VCASelected from "~/assets/icons/vc_white.svg";
import CHK from "~/assets/icons/CHK_grey.svg";
import CHKSelected from "~/assets/icons/check_white.svg";
import EFT from "~/assets/icons/eft_grey.svg";
import EFTSelected from "~/assets/icons/eft_white.svg";
import QBonline from "~/assets/images/QuickBooks-Online-logo.png";
import MicrosoftDynamics from "~/assets/images/dynamics.png";
import QBD from "~/assets/images/QBD.png";

import { updatePreferredPaymentTypes } from "~/redux/actions/payments";
import { connect } from "react-redux";
import AddAccountForm from "../AddAccounForm";
import { styles } from "./styles";

import { accessRights } from "~/config/accessRights";

class ERPintegration extends React.Component {
  state = {
    selectedChip: "",
    isAddAccount: true,
    sortColumn: "",
    sortOrder: "",
    fetchingList: false,
    modalMessage: "",
    selectedAccount: null,
    isModalActive: false,
    selectedAccountDetails: null,
    accountModalValue: "",
    isAccountModalActive: false,

    tabs: [
      {
        label: "QuickBooks Online",
        alias: "ACH",
        key: "bankAccount",
        id: 1,
        icon: ACH,
        selected: false,
      },
      {
        label: "QuickBooks Desktop",
        key: "eftAccount",
        id: 32,
        icon: EFT,
        alias: "EFT",
        selected: false,
      },
      {
        label: "Microsoft Dynamics",
        key: "virtualCard",
        icon: VCA,
        id: 16,
        alias: "VCA",
        selected: false,
      },
      {
        label: "Sage",
        alias: "CHK",
        key: "check",
        icon: CHK,
        id: 8,
        selected: false,
      },
    ],
    check: [],
    eftAccount: [],
    bankAccount: [],
    virtualCard: [],
    transactionTypes: [],
    currencyCodes: [],
    variant: "",
    // bankCountryISOs: []
    quickBooksTabs: false,
  };

  componentDidMount() {
    this.getAllACH();
    this.getAllEFT();
    this.getAllCheck();
    this.getAllVCA();
    this.getTransactionTypes();
    this.getCurrencyCodes();
    this.getSelectedTabs();
  }

  getSelectedFlag() {}

  getSelectedTabs() {
    const clientId = this.props.user.userData.portalProfileId;
    fetchSelectedTabs(clientId).then((response) => {
      if (response.error) {
        return false;
      }
      const array = response.data.rows;
      this.setState(
        {
          tabs: [
            {
              label: "QuickBooks Desktop",
              key: "bankAccount",
              id: 1,
              icon: ACH,
              iconTypeSelected: ACHSelected,
              alias: "ACH",
              selected: array && array.includes(1),
            },
            {
              label: "QuickBooks Online",
              key: "eftAccount",
              id: 32,
              icon: EFT,
              iconTypeSelected: EFTSelected,
              alias: "EFT",
              selected: array && array.includes(32),
            },
            {
              label: "Microsoft Dynamics",
              key: "virtualCard",
              icon: VCA,
              iconTypeSelected: VCASelected,
              id: 16,
              alias: "VCA",
              selected: array && array.includes(16),
            },
            {
              label: "Check",
              key: "check",
              icon: CHK,
              iconTypeSelected: CHKSelected,
              id: 2,
              alias: "CHK",
              selected: array && array.includes(2),
            },
          ],
        },
        () => {
          const filters = this.state.tabs.filter((t) => t["selected"] == true);
          this.setState({
            filterChips: filters.map((tab, i) => ({
              label: tab.label,
              selected: i == 0 ? true : false,
              alias: tab.alias,
              key: tab.key,
            })),
            selectedAccount: filters && filters[0] && filters[0]["key"],
            selectedChip: filters && filters[0] && filters[0]["alias"],
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

  selectTab(tab) {
    const { tabs } = this.state;
    let clientId = this.props.user.userData.portalProfileId;
    tab["selected"] = !tab["selected"];
    const filterChips_ = [];
    tabs.forEach((tab, i) => {
      if (tab["selected"]) {
        filterChips_.push({
          label: tab.label,
          selected: i == 0 ? true : false,
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
          return false;
        }
      });
    const selectedChip_ =
      filterChips_ && filterChips_[0] && filterChips_[0]["alias"];
    const  _selectedAccount =
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
    this.setState({
      isAccountModalActive: false,
      selectedAccountDetails: null,
    });
  }

  showAccountModal(accountObj) {
    this.setState({
      isAccountModalActive: true,
      selectedAccountDetails: accountObj || {},
    });
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
    this.setState({ isAccountModalActive: false, fetchingList: true }, () => {
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
        return this.state.virtualCard;
      case "check":
        return this.state.check;
        default:
        return this.state.check;
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
      isModalActive,
      modalMessage,
      isAddAccount,
      isAccountModalActive,
      selectedAccountDetails,
      selectedAccount,
      transactionTypes,
      currencyCodes,
      filterChips,
      variant,
      quickBooksTabs,
    } = this.state;
    const { classes } = this.props;
    let clientId = this.props.user.userData.portalProfileId;
    const { user } = this.props;

    const isSettingPaymentMethodAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_ADD"]
        )) ||
      false;

    const quickBookHanlder = (e) => {
      this.setState({ quickBooksTabs: true });
    };

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
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.largeBtn}
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => this.addAccount()}
                >
                  Add Account(s)
                </Button>
              )}
          </Box>
        </Grid>
        <Box mt={0}>
          <Paper className={"generalSettingsWrapper"}>
            <Box px={4} my={0} py={3}>
              <Box my={1} pb={1}>
                <h3 className={classes.settingHeading}>
                  Select ERP to integrate
                </h3>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Button
                  onClick={(e) => quickBookHanlder()}
                  style={{
                    background: "#e1f2fd",
                    color: "#fff",
                    width: "32.5%",
                    display: "block",
                    boxShadow: "rgb(153 205 239) 0px 1px 5px",
                    padding: 10,
                    fontSize: 14,
                    textTransform: "capitalize",
                    textAlign: "center",
                  }}
                >
                  <Box
                    display="flex"
                    width="100%"
                    textAlign="center"
                    justifyContent="center"
                  >
                    <img src={QBD} alt="QuickBooks Desktop" />
                  </Box>
                </Button>
                <Button
                  disabled
                  style={{
                    background: "#fff",
                    color: "#4C4C4C",
                    width: "32.3%",
                    padding: 10,
                    fontSize: 14,
                    display: "block",
                    boxShadow: "rgb(171 170 170 / 50%) 0px 1px 4px",
                    textTransform: "capitalize",
                  }}
                >
                  <Box
                    display="flex"
                    width="100%"
                    textAlign="center"
                    justifyContent="center"
                  >
                    <img src={QBonline} alt="QuickBooks Online" />
                  </Box>
                </Button>
                <Button
                  disabled
                  style={{
                    background: "#fff",
                    color: "#4C4C4C",
                    width: "32.3%",
                    padding: 10,
                    fontSize: 14,
                    display: "block",
                    boxShadow: "rgb(171 170 170 / 50%) 0px 1px 4px",
                    textTransform: "capitalize",
                  }}
                >
                  <Box
                    display="flex"
                    width="100%"
                    textAlign="center"
                    justifyContent="center"
                  >
                    <img src={MicrosoftDynamics} alt="Microsoft Dynamics" />
                  </Box>
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
        {quickBooksTabs === true ? (
          <Box my={3}>
            <Paper>
              <Box p={4}>
                <Typography variant="h4" gutterBottom align="center">
                  To Integrate with QuickBooks Desktop please Download and
                  install IncedoPay QuickBooks Setup. Once the installation is
                  complete, you will be required to authorize quickbooks access
                  for IncedoPay to read and modify company information.
                </Typography>
                <Box width={330} mx="auto" pt={4}>
                  <a
                    href="https://incedopayb2bdevbucket.s3.ap-south-1.amazonaws.com/SetupIncedoProxyApp.msi"
                    download
                  >
                    <Button
                      variant="contained"
                      className={classes.largeBtn}
                      startIcon={<GetAppIcon />}
                    >
                      IncedoPay proxy
                    </Button>
                  </a>
                </Box>
              </Box>
            </Paper>
          </Box>
        ) : null}

        {isModalActive && modalMessage && (
          // <AlertDialog
          //   title=""
          //   message={modalMessage}
          //   onConfirm={() => this.setDialogMessage(false, "")}
          // />
          <Notification variant={variant} message={modalMessage} />
        )}

        {isAccountModalActive && (
          <CustomDialog
            title={isAddAccount ? "Add New Account" : "Update Account"}
            onClose={this.hideAccountModal.bind(this)}
            onConfirm={this.hideAccountModal.bind(this)}
            width={"720px"}
          >
            <Box display="block">
              <AddAccountForm
                refreshData={() => this.refreshData()}
                onCancel={this.hideAccountModal.bind(this)}
                transactionTypes={transactionTypes}
                currencyCodes={currencyCodes}
                clientId={clientId}
                setDialogMessage={(flag, message, variant) =>
                  this.setDialogMessage(flag, message, variant)
                }
                closeModal={this.closeModal.bind(this)}
                // bankCountryISOs={bankCountryISOs}
                accountDetails={selectedAccountDetails}
                accountType={selectedAccount}
                isAddAccount={isAddAccount}
              />
            </Box>
          </CustomDialog>
        )}
      </Box>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(withStyles(styles)(ERPintegration));
