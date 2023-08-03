import React from 'react';
import {
  Grid,
  Paper,
  Box,
  Button,
  withStyles,
  Tooltip,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { CustomDialog, AlertDialog } from '~/components/Dialogs';
import Notification from '~/components/Notification';
import {
  B2CfetchSelectedTabs,
} from '~/redux/helpers/settings';
import {
  USBankGetRTPData,
  getUSbankDeposittodebitData,
} from '~/redux/helpers/USbank/payments';
import {
  getUSbankZelleData,
  fetchUSBankCheckData,
  fetchUSBankPrepaidCardData,
  fetchAllUSbankAchList,
  B2CupdatePreferredUSbankPaymentTypes
} from '~/redux/actions/USbank/payments';
import { B2CgetClientPaymentTypes } from '~/redux/actions/payments';
import RemittanceSelector from '~/modules/RemittanceSelector/USbank';
import ACHIcon from '~/assets/icons/USbank/ACH_main.svg';
import DepositToDebitIcon from '~/assets/icons/USbank/Deposit_to_Card_main.svg';
import DepositToDebit_selected from '~/assets/icons/USbank/DepositToCard_selected.svg';
import ZelleIcon from '~/assets/icons/USbank/Zelle_main.svg';
import Zelle_selected from '~/assets/icons/USbank/Zelle_selected.svg';
import ACH_selected from '~/assets/icons/USbank/ACH_selected.svg';
import CheckIcon from '~/assets/icons/USbank/CHK_main.svg';
import Check_selected from '~/assets/icons/USbank/check_icon_selected.svg';
import RTPIcon from '~/assets/icons/USbank/RTP.svg';
import RTP_selected from '~/assets/icons/USbank/RTPselected.svg';
import prepaidIcon from '~/assets/icons/USbank/Prepaidcard.svg';
import Prepaid_selected from '~/assets/icons/USbank/Prepaidcardselected.svg';
import { connect } from 'react-redux';
import USbankAddAccountForm from '~/modules/AddAccounForm/USbank';
import { styles } from './styles';
import USbankPaymentMethodsTable from '~/modules/PaymentMethodsTable/USbank';
import { accessRights } from '~/config/accessRights';
import { withTranslation } from 'react-i18next';
import { paymentMethods,paymentMethodFileFormatIds } from '~/config/paymentMethods';

class USbankPaymentMethods extends React.Component {
  state = {
    isRowClick: false,
    popupTitle: null,
    alertMsg: null,
    alertType: null,
    selectedChip: '',
    isAddAccount: true,
    fetchingList: false,
    modalMessage: '',
    selectedPayees:[],
    Isclient: false,
    selectedAccount: null,
    isModalActive: false,
    selectedAccountDetails: null,
    isAccountModalActive: false,
    tabs: [],
    paymentModeIcons: {
      ACH: ACHIcon,
      ACH_selected: ACH_selected,
      ZEL: ZelleIcon,
      ZEL_selected: Zelle_selected,
      RTP: RTPIcon,
      RTP_selected: RTP_selected,
      CHK: CheckIcon,
      CHK_selected: Check_selected,
      DDC: DepositToDebitIcon,
      DDC_selected: DepositToDebit_selected,
      PPD: prepaidIcon,
      PPD_selected: Prepaid_selected,
    },
    Zelle: [],
    rtpAccountList: [],
    debitList: [],
    check: [],
    DDC: [],
    variant: '',
    isLoading: false,
    rtpDialogFlag: false,
    ACHB2B: false,
    ACHB2C: false,
    CHKB2B: false,
    CHKB2C: false,
    RTPB2B: false,
    RTPB2C: false,
    ACHflag:false,
    CHKflag:false,
    RTPflag:false
  };

  componentDidMount() {
   this.IsBankclient()
    this.getAllACH();
    this.getAllZelle();
    this.getAllRTP();
    this.getAllDebit();
    this.getAllCheck();
    this.getAllPrepaidCardData();
    this.fetchPaymentTypes();
  }
IsBankclient=()=>{

  const { user } = this.props;
  this.setState({
    Isclient: user.userData.activeBankParentProfileId?true:false,
  });
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
      const nonParentpaymentTypes =
        response.rows &&
        response.rows.filter((item) => {
          if (!item.parentId) {
            return item;
          }
        });
      const paymentTypes =
        nonParentpaymentTypes &&
        nonParentpaymentTypes.map(
          ({
            label,
            fileFormatId,
            paymentCode,
            b2cDescription,
            customPaymentCode,
            parentId,
          }) => {
            if (!parentId) {
              return {
                label: b2cDescription,
                key: paymentCode,
                icon: paymentModeIcons[paymentCode],
                description: b2cDescription,
                iconTypeSelected: paymentModeIcons[`${paymentCode}_selected`],
                alias: paymentCode,
                fileFormatId: fileFormatId,
                id: fileFormatId,
                selected: false,
              };
            }
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
          const filters = this.state.tabs.filter((t) => t['selected'] === true);
          this.setState({
            filterChips: filters.map((tab, i) => ({
              label: tab.label,
              selected: i === 0 ? true : false,
              alias: tab.alias,
              key: tab.key,
            })),
            selectedAccount: filters && filters[0] && filters[0]['key'],
            selectedChip: filters && filters[0] && filters[0]['alias'],
            isLoading: false,
          });
        }
      );
      let selectedPaymentMethodb2c = response.data.rows2 ? response.data.rows2 : [];
      selectedPaymentMethodb2c.map((item)=>{
        switch (item.fileFormatId) {
          case paymentMethodFileFormatIds.USBankACH:
            this.setState({
              ACHB2C: item.isB2c,
              ACHB2B: item.isB2b,
            });
            break;
            case paymentMethodFileFormatIds.USBankCHK:
              this.setState({
                CHKB2C: item.isB2c,
                CHKB2B: item.isB2b,
              });
              break;
              case paymentMethodFileFormatIds.USBankRTP:
                this.setState({
                  RTPB2C: item.isB2c,
                  RTPB2B: item.isB2b,
                });
                break;
        
          default:
            break;
        }

      });
    });
  }
  payloadger = (selectedPaymentTypess) => {
    let obj = {};
    const {
      selectedPayees,
      ACHB2B,
      ACHB2C,
      CHKB2B,
      CHKB2C,
      RTPB2B,
      RTPB2C,
    } = this.state;
    
    selectedPaymentTypess.map((id) => {
      switch (id) {
        case paymentMethodFileFormatIds.USBankACH:
          obj = { fileFormatId: id, isB2c: ACHB2C?1:0, isB2b: ACHB2B?1:0 };
          selectedPayees.push(obj);
          break;
        case paymentMethodFileFormatIds.USBankZelle:
        case paymentMethodFileFormatIds.USBankPrepaidCard:
        case paymentMethodFileFormatIds.USBankDepositToDebitcard:
          obj = { fileFormatId: id };
          selectedPayees.push(obj);
          break;
        case paymentMethodFileFormatIds.USBankCHK:
          obj = { fileFormatId: id, isB2c: CHKB2C?1:0, isB2b: CHKB2B?1:0 };
          selectedPayees.push(obj);
          break;
        case paymentMethodFileFormatIds.USBankRTP:
          obj = { fileFormatId: id, isB2c: RTPB2C?1:0, isB2b: RTPB2B?1:0 };
          selectedPayees.push(obj);
          break;
        default:
          break;
      }
    });
    this.setState({
      selectedPayees: selectedPayees,
    });
  };
B2BB2CDisable=(tab)=>{
  const {ACHflag,CHKflag,RTPflag}=this.state;
  switch (tab.fileFormatId) {
    case paymentMethodFileFormatIds.USBankACH:
      this.setState({ACHflag:!ACHflag})
   this.setState({ACHB2C:0,ACHB2B:0})
      break;
   
      case paymentMethodFileFormatIds.USBankCHK:
      this.setState({CHKB2C:0,CHKB2B:0})
      this.setState({CHKflag:!CHKflag})
      break;
      case paymentMethodFileFormatIds.USBankRTP:
      this.setState({RTPB2C:0,RTPB2B:0})
      this.setState({RTPflag:!RTPflag})
      break;
    default:
      break;
  }
}
  selectedChipcheckandzelle(selectedchip) {
    if (selectedchip === paymentMethods['USBankZelle']) {
      this.getAllZelle();
    }
    if (selectedchip === paymentMethods['USBankCHK']) {
      this.getAllCheck();
    }
  }

  getAllRTP() {
    const clientId = this.props.user.userData.portalProfileId;
    USBankGetRTPData(clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, 'error');
      }
      this.setState({ rtpAccountList: response.data, fetchingList: false });
    });
  }
  getAllCheck() {
    const clientId = this.props.user.userData.portalProfileId;
    this.props.dispatch(fetchUSBankCheckData(clientId)).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, 'error');
      }
      this.setState({
        check: this.props.USBankPayment?.checkDetail,
        fetchingList: false,
      });
    });
  }
  getAllPrepaidCardData = () => {
    const clientId = this.props.user.userData.portalProfileId;
    this.props
      .dispatch(fetchUSBankPrepaidCardData(clientId))
      .then((response) => {
        if (response && response.error) {
          const errorMsg =
            this.props.USBankPayment.storedPrepaidCardData &&
            this.props.USBankPayment.storedPrepaidCardData.error
              ? this.props.USBankPayment.storedPrepaidCardData.error
              : null;
          this.setDialogMessage(true, errorMsg, 'error');
          return false;
        } else {
          this.setState({
            fetchingList: false,
          });
        }
      });
  };
  getAllZelle() {
    const clientId = this.props.user.userData.portalProfileId;
    this.props.dispatch(getUSbankZelleData(clientId)).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, this.props.USBankPayment.error, 'error');
      }
      this.setState({
        Zelle: this.props.USBankPayment.zelleDetail,
        fetchingList: false,
      });
    });
  }
  getAllDebit() {
    const clientId = this.props.user.userData.portalProfileId;
    this.props
      .dispatch(getUSbankDeposittodebitData(clientId))
      .then((response) => {
        if (!response) {
          this.setDialogMessage(true, response.message, 'error');
        }
        this.setState({ debitList: response.data, fetchingList: false });
      });
  }
  getAllACH() {
    const clientId = this.props.user.userData.portalProfileId;
    this.props
      .dispatch(fetchAllUSbankAchList(clientId, paymentMethods['USBankACH']))
      .then((response) => {
        if (!response) {
          this.setDialogMessage(true, this.props.achAccountList.error, 'error');
        }
        this.setState({ fetchingList: false });
      });
  }
  slectedB2CCheck = (selectedPayments) => {
    let flag = false;
    let flagACH = false;
    let flagCHK = false;
    let flagRTP = false;

    if (selectedPayments.includes(paymentMethodFileFormatIds.USBankACH)) {
      flagACH = this.state.ACHB2B || this.state.ACHB2C;
    }
    if (selectedPayments.includes(paymentMethodFileFormatIds.USBankCHK)) {
      flagCHK = this.state.CHKB2B || this.state.CHKB2C;
    }
    if (selectedPayments.includes(paymentMethodFileFormatIds.USBankRTP)) {
      flagRTP = this.state.RTPB2B || this.state.RTPB2C;
    }

    flag =
      (selectedPayments.includes(paymentMethodFileFormatIds.USBankACH)
        ? flagACH
        : true) &&
      (selectedPayments.includes(paymentMethodFileFormatIds.USBankCHK)
        ? flagCHK
        : true) &&
      (selectedPayments.includes(paymentMethodFileFormatIds.USBankRTP)
        ? flagRTP
        : true);
    return flag;
  };
  compareRTPCheck = (selectedPayments) => {
    let flagRTP = true;
    
    if (selectedPayments.includes(paymentMethodFileFormatIds.USBankRTP) && this.state.RTPB2B ) {
      flagRTP = this.state.ACHB2B;
    }

    if (selectedPayments.includes(paymentMethodFileFormatIds.USBankRTP) && this.state.RTPB2C ) {
      flagRTP = flagRTP ? this.state.ACHB2C : flagRTP;
    }

    return flagRTP;
  };
  checkedDisable = (paymentCode) => {
    let val = false;
    switch (paymentCode) {
      case paymentMethods.USBankACH:
        this.state.ACHflag && (val = true);
        break;
      case paymentMethods.USBankCHK:
        this.state.CHKflag && (val = true);
        break;
      case paymentMethods.USBankRTP:
        this.state.RTPflag && (val = true);
        break;
      default:
        break;
    }

    return val;
  };
  
  checkedB2B = (paymentCode) => {
    let val = false;
    switch (paymentCode) {
      case paymentMethods.USBankACH:
        this.state.ACHB2B && (val = true);
        break;
      case paymentMethods.USBankCHK:
        this.state.CHKB2B && (val = true);
        break;
      case paymentMethods.USBankRTP:
        this.state.RTPB2B && (val = true);
        break;
      default:
        break;
    }

    return val;
  };
  checkedB2C = (paymentCode) => {
    let val = false;
    switch (paymentCode) {
      case paymentMethods.USBankACH:
        this.state.ACHB2C ? (val = true) : (val = false);

        break;
      case paymentMethods.USBankCHK:
        this.state.CHKB2C ? (val = true) : (val = false);

        break;
      case paymentMethods.USBankRTP:
        this.state.RTPB2C ? (val = true) : (val = false);

        break;

      default:
        break;
    }

    return val;
  };
  selectTab=async(tab) => {
   await this.B2BB2CDisable(tab)
    const { tabs } = this.state;
    const clientId = this.props.user.userData.portalProfileId;
    tab['selected'] = !tab['selected'];
    const filterChips_ = [];
    tabs.forEach((tab, i) => {
      if (tab['selected']) {
        filterChips_.push({
          label: tab.label,
          selected: i === 0 ? true : false,
          alias: tab.alias,
          key: tab.key,
        });
      }
    });
    const { selectedPayees } = this.state;
    const selectedPaymentTypes = tabs
      .filter((tab) => tab && tab['selected'])
      .map((t) => t['id']);
      this.payloadger(selectedPaymentTypes);
    this.props
      .dispatch(
        B2CupdatePreferredUSbankPaymentTypes(
          clientId,
          selectedPayees,
        )
      )
      .then((response) => {
        if (!response) {
          return false;
        }
      });
    const selectedChip_ =
      filterChips_ && filterChips_[0] && filterChips_[0]['alias'];
    const _selectedAccount =
      filterChips_ && filterChips_[0] && filterChips_[0]['key'];
    this.setState({
      ...this.state,
      selectedAccount: _selectedAccount,
      filterChips: filterChips_,
      selectedChip: selectedChip_,
    });

    let popupTitle = null;
    const { t } = this.props;
    switch (this.state.selectedChip) {
      case paymentMethods['USBankACH']:
        popupTitle = t('componentData.paymentMethods.BankAccount');
        break;
      case paymentMethods['USBankRTP']:
        popupTitle = t('componentData.paymentMethods.RTP');
        break;
      case paymentMethods['USBankDepositToDebitcard']:
        popupTitle = t('componentData.paymentMethods.DDC');
        break;
      case paymentMethods['USBankZelle']:
        popupTitle = t('componentData.paymentMethods.Zelle');
        break;
      case paymentMethods['USBankCHK']:
        popupTitle = t('componentData.paymentMethods.check');
        break;
      case paymentMethods['USBankPrepaidCard']:
        popupTitle = t('componentData.paymentMethods.prepaidCard');
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
        const achAccountListCount = this.props.achAccountList?.data?.rows?.length??0;
        if(achAccountListCount < 1 && this.state.selectedChip === "RTP") {
          this.setState({rtpDialogFlag: true});
        }   
      }
    );
   
  }

  setDialogMessage(flag, message, variant) {
    this.setState({
      isModalActive: flag,
      modalMessage: message,
      variant,
    });
  }
  hideAccountModal() {
    this.setState({
      isAccountModalActive: false,
      selectedAccountDetails: null,
    });
  }

  showAccountModal(accountObj) {
    const { isAddAccount, selectedChip } = this.state;
    const { t } = this.props;
    const accountData = this.returnAccounts();
    let popupTitle = null;
    switch (selectedChip) {
      case paymentMethods['USBankACH']:
        popupTitle = t('componentData.paymentMethods.BankAccount');
        break;
      case paymentMethods['USBankRTP']:
        popupTitle = t('componentData.paymentMethods.RTP');
        break;
      case paymentMethods['USBankDepositToDebitcard']:
        popupTitle = t('componentData.paymentMethods.DDC');
        break;
      case paymentMethods['USBankZelle']:
        popupTitle = t('componentData.paymentMethods.Zelle');
        break;
      case paymentMethods['USBankCHK']:
        popupTitle = t('componentData.paymentMethods.check');
        break;
      case paymentMethods['USBankPrepaidCard']:
        popupTitle = t('componentData.paymentMethods.prepaidCard');
        break;
      default:
        break;
    }
    if (Object.keys(accountData || {}).length > 0 && isAddAccount) {
      this.setState({
        alertType: 'error',
        alertMsg: `${t(
          'componentData.paymentMethods.oneAcc'
        )} ${popupTitle} ${t('componentData.paymentMethods.configured')}`,
      });
    } else {
      this.setState({
        isAccountModalActive: true,
        selectedAccountDetails: accountObj || {},
      });
    }
  }

  editAccount(account, isRowClick) {
    let popupTitle = null;
    const { t } = this.props;
    switch (this.state.selectedChip) {
      case paymentMethods['USBankACH']:
        popupTitle = t('componentData.paymentMethods.BankAccount');
        break;
      case paymentMethods['USBankRTP']:
        popupTitle = t('componentData.paymentMethods.RTP');
        break;
      case paymentMethods['USBankDepositToDebitcard']:
        popupTitle = t('componentData.paymentMethods.DDC');
        break;
      case paymentMethods['USBankZelle']:
        popupTitle = t('componentData.paymentMethods.Zelle');
        break;
      case paymentMethods['USBankCHK']:
        popupTitle = t('componentData.paymentMethods.check');
        break;
      case paymentMethods['USBankPrepaidCard']:
        popupTitle = t('componentData.paymentMethods.prepaidCard');
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
      case paymentMethods['USBankACH']:
        popupTitle = t('componentData.paymentMethods.BankAccount');
        break;
      case paymentMethods['USBankRTP']:
        popupTitle = t('componentData.paymentMethods.RTP');
        break;
      case paymentMethods['USBankDepositToDebitcard']:
        popupTitle = t('componentData.paymentMethods.DDC');
        break;
      case paymentMethods['USBankZelle']:
        popupTitle = t('componentData.paymentMethods.Zelle');
        break;
      case paymentMethods['USBankCHK']:
        popupTitle = t('componentData.paymentMethods.check');
        break;
      case paymentMethods['USBankPrepaidCard']:
        popupTitle = t('componentData.paymentMethods.prepaidCard');
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
        const achAccountListCount = this.props.achAccountList?.data?.rows?.length??0;
        if(achAccountListCount < 1 && this.state.selectedChip === "RTP") {
          this.setState({rtpDialogFlag: true});
        } else {
          this.showAccountModal(account);
        }   
      }
    );
  }

  closeModal() {
    this.setState({ isAccountModalActive: false, fetchingList: true }, () => {
      switch (this.state.selectedAccount) {
        case paymentMethods['USBankACH']:
          this.getAllACH();
          break;
        case paymentMethods['USBankRTP']:
          this.getAllRTP();
          break;
        case paymentMethods['USBankDepositToDebitcard']:
          this.getAllDebit();
          break;
        case paymentMethods['USBankZelle']:
          this.getAllZelle();
          break;
        case paymentMethods['USBankCHK']:
          this.getAllCheck();
          break;
        case paymentMethods['USBankPrepaidCard']:
          this.getAllPrepaidCardData();
          break;
        default:
          break;
      }
    });
  }

  returnAccounts() {
    switch (this.state.selectedAccount) {
      case paymentMethods['USBankACH']:
        return this.props.achAccountList?.data?.rows ?? [];
      case paymentMethods['USBankRTP']:
        return this.state.rtpAccountList;
      case paymentMethods['USBankDepositToDebitcard']:
        return this.state.debitList;
      case paymentMethods['USBankZelle']:
        return this.state.Zelle;
      case paymentMethods['USBankCHK']:
        return this.state.check;
      case paymentMethods['USBankPrepaidCard']:
        return this.props.USBankPayment?.storedPrepaidCardData?.data
          ?.prepaidCardData?.[0];
      default:
        break;
    }
  }

  refreshData() {
    switch (this.state.selectedAccount) {
      case paymentMethods['USBankACH']:
        this.getAllACH();
        break;
      case paymentMethods['USBankRTP']:
        this.getAllRTP();
        break;
      case paymentMethods['USBankDepositToDebitcard']:
        this.getAllDebit();
        break;
      case paymentMethods['USBankZelle']:
        this.getAllZelle();
        break;
      case paymentMethods['USBankCHK']:
        this.getAllCheck();
        break;
      case paymentMethods['USBankPrepaidCard']:
        this.getAllPrepaidCardData();
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

  rtpDialogMessage = () => {
    this.setState({rtpDialogFlag: false});
  }

 
   callBack=()=>{
    const { tabs } = this.state;
    
    const { t } = this.props;
    const clientId = this.props.user.userData.portalProfileId;
    const selectedPaymentTypes = tabs
      .filter((tab) => tab && tab['selected'])
      .map((t) => t['id']);
      if (this.slectedB2CCheck(selectedPaymentTypes)) {
        if(this.compareRTPCheck(selectedPaymentTypes)) {
          this.payloadger(selectedPaymentTypes);
            const { selectedPayees } = this.state;
          this.props
            .dispatch(
              B2CupdatePreferredUSbankPaymentTypes(
                clientId,
                selectedPayees,
              )
            )
            .then((response) => {
              if (!response) {
                return false;
              }
            });
        }
        else {
          this.setDialogMessage(true, t('componentData.paymentMethods.methodSelectionError'), 'error');
        }
      }
      else {
        this.setDialogMessage(true, t('componentData.paymentMethods.b2b'), 'error');
      }
  }
   handleChange = async (event) => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked },()=>{
      this.callBack()
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
      rtpDialogFlag,
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
      user.userRoles.includes(accessRights['SETTINGS_PAYMENT_METHODS_ADD'])
        ? true
        : bankParentProfileId === 1
        ? true
        : false;

    const isSettingPaymentMethodEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_PAYMENT_METHODS_EDIT']
        )) ||
      false;

    const isSettingPaymentMethodDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_PAYMENT_METHODS_DOWNLOAD']
        )) ||
      false;

    const hasSettingPaymentMethodAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_PAYMENT_METHODS_ADD']
        )) ||
      false;

    const canUpdatePreferncePaymentMethod =
      bankParentProfileId === 1 &&
      hasSettingPaymentMethodAddEnabled &&
      isSettingPaymentMethodEditEnabled
        ? true
        : false;

    return (
      <Box mx={6} my={0}>
        {tabs.length === 0 ? (
          <CircularProgress
            color='primary'
            style={{ display: 'block', margin: '50px auto' }}
          />
        ) : (
          <>
            <Grid container item xs={12} md={12} justifyContent='flex-end'>
              <Box mt={-7}>
                {isSettingPaymentMethodAddEnabled &&
                  filterChips &&
                  filterChips.length > 0 &&
                  selectedAccount &&
                  selectedAccount.length > 0 && (
                    <>
                      {this.props.i18n.language === 'fr' ? (
                        <Tooltip
                          title={t("componentData.paymentMethods.addAccUsbank")}
                        >
                          <IconButton
                            variant='contained'
                            color='secondary'
                            className={classes.smallBtn}
                            onClick={() => this.addAccount()}
                          >
                            <AddOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Button
                          variant='contained'
                          color='primary'
                          className={classes.largeBtn}
                          startIcon={<AddOutlinedIcon />}
                          onClick={() => this.addAccount()}
                        >
                          {t("componentData.paymentMethods.addAccUsbank")}
                        </Button>
                      )}
                    </>
                  )}
              </Box>
            </Grid>
            <Box mt={0}>
              <Paper className={'generalSettingsWrapper'}>
                <Box px={4} my={0} py={3}>
                  {/* <Grid sm={3} xs={3}> */}
                  <Box my={1} pb={1}>
                    <h3 className={classes.settingHeading}>
                      {t('componentData.paymentMethods.PaymentInformation')}
                    </h3>
                  </Box>
                  <Box pb={1}>
                    <h5>
                      {bankParentProfileId === 1
                        ? t('componentData.paymentMethods.Select')
                        : t('componentData.paymentMethods.Selected')}{' '}
                      {t('componentData.paymentMethods.modeOfPay')}
                    </h5>
                  </Box>

                  <RemittanceSelector
                    title=''
                    options={tabs}
                    pt={-4}
                    onChange={
                      (a, b, c, tab) =>
                      canUpdatePreferncePaymentMethod
                        ?(this.selectTab(tab))
                        
                        
                        : null
                    }
                    checkedB2B={this.checkedB2B}
                    checkedB2C={this.checkedB2C}
                    checkedDisable={this.checkedDisable}
                    handleChange={this.handleChange} 
                    Isclient={this.state.Isclient}
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
                    <USbankPaymentMethodsTable
                      selectedChip={selectedChip}
                      filterChips={filterChips}
                      fetchingList={fetchingList}
                      accounts={accounts}
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
                          filterChips.filter((chip) => chip['key'] === key);
                        const selectedChip_ =
                          element && element[0] && element[0]['alias'];
                        this.setState({
                          selectedAccount: key,
                          selectedChip: selectedChip_,
                        });
                        this.selectedChipcheckandzelle(selectedChip_);
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            ) : (
              <Box my={10}>
                <Paper>
                  <Box p={5}>
                    {t('componentData.paymentMethods.paymentMethodAssign')}
                  </Box>
                </Paper>
              </Box>
            )}
            {isModalActive && modalMessage && (
              <Notification
                variant={variant}
                message={modalMessage}
                handleClose={() => {
                  this.setState({ isModalActive: false, modalMessage: '' });
                }}
              />
            )}
            {isAccountModalActive && (
              <CustomDialog
                title={
                  isAddAccount
                    ? `${t(
                        'componentData.paymentMethods.AddNew'
                      )} ${popupTitle}`
                    : isRowClick
                    ? popupTitle
                    : `${t('componentData.paymentMethods.Edit')} ${popupTitle}`
                }
                onClose={this.hideAccountModal.bind(this)}
                onConfirm={this.hideAccountModal.bind(this)}
                width={'840px'}
                dialogClassName={classes.paymentPopup}
              >
                <Box display='block'>
                  <USbankAddAccountForm
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
                    accounts={accounts}
                    isRowClick={isRowClick}
                  />
                </Box>
              </CustomDialog>
            )}
            {alertMsg && this.renderSnackbar(alertType, alertMsg)}
            {rtpDialogFlag && (
              <AlertDialog
                title={t('componentData.RTPDetail.rtpACHExist')}
                open={rtpDialogFlag}
                onConfirm={() => this.rtpDialogMessage()}
              />
            )}
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
    ...state.USBankPayment,
  }))(withStyles(styles)(USbankPaymentMethods))
);
