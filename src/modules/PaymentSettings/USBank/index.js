import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '~/components/Forms';
import Notification from '~/components/Notification';

import ImportParentPaymentDetails from '~/modules/ImportParentPaymentDetails';

import USbankPaymentModeSelector from '~/modules/PaymentModeSelector/USbank';
import USbankPaymentDetails from '~/modules/PaymentDetails/USbank';

import { Box, CircularProgress } from '@material-ui/core';

import {
  getB2CClientPaymentTypes,
  getB2CPreferredClientPaymentTypes,
  getB2CPreferredParentPaymentTypes,
  updateUSbankPreferredPaymentTypes,
  getZelleData,
  getPushToCardData,
} from '~/redux/actions/B2C/payments';
import { fetchUSBankPrepaidCardData } from '~/redux/actions/USbank/payments';
import { fetchB2CClientData } from '~/redux/actions/B2C/client';
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
import config from '~/config';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { AlertDialog } from '~/components/Dialogs';
import { paymentMethods,paymentMethodFileFormatIds } from '~/config/paymentMethods';

const styles = () => ({
  submitBtn: {
    '&.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.12) !important',
    },
  },
});

class USbankPaymentSettings extends Component {
  state = {
    isErrFound: false,
    isLoading: true,
    isHIPAA: false,
    paymentTypes: [],
    selectedPaymentTypes: [],
    selectedPayees: [],
    processing: false,
    clientId: null,
    parentId: null,
    selectedTab: 0,
    currencyList: [],
    bankDetail: null,
    preBankDetail: {},
    eftDetail: null,
    preEFTDetail: {},
    virtualCardDetail: null,
    checkDetail: null,
    error: false,
    validation: {},
    importParentId: null,
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
    showBanner: false,
    showParentData: false,
    rtpDialogFlag: false,
    ACHB2B: false,
    ACHB2C: false,
    CHKB2B: false,
    CHKB2C: false,
    RTPB2B: false,
    RTPB2C: false,
  };

  componentDidMount() {
    const { t } = this.props;
    this.props.changeActiveStep(1);
    const urlParams = new URLSearchParams(window.location.search);
    this.setState({ clientId: parseInt(urlParams.get('id')) });

    if (this.props.client.clientInfo.length > 0) {
      this.setState({
        parentId: this.props.client.clientInfo.rows[0].parentId,
        isHIPAA: this.props.client.clientInfo.rows[0].isHippa
          ? this.props.client.clientInfo.rows[0].isHippa
          : 0,
        showBanner:
          this.props.client.clientInfo.rows[0].parentId === null ||
          typeof this.props.client.clientInfo.rows[0].parentId === 'undefined'
            ? false
            : true,
      });
    } else {
      this.props
        .dispatch(fetchB2CClientData(parseInt(urlParams.get('id'))))
        .then((response) => {
          if (!response) {
            throw this.props.client.error;
          }
          const clientData =
            this.props.client.clientInfo.rows &&
            this.props.client.clientInfo.rows[0];
          this.setState({
            clientId: clientData.clientId,
            parentId: clientData.parentId,
            isHIPAA: clientData.isHippa ? clientData.isHippa : 0,
            showBanner:
              clientData.parentId === null ||
              typeof clientData.parentId === 'undefined'
                ? false
                : true,
            isLoading: false,
          });
          this.loadData(clientData.clientId);
        })
        .catch((error) => {
          // console.log(error);
          this.setState({
            isLoading: false,
            error:
              typeof error === 'string'
                ? error
                : t('componentData.paymentsSettings.unknownErr'),
          });
        });
    }
  }

  loadData = (clientId) => {
    this.fetchPaymentTypes(clientId, false);
    if (!this.props.getZelleData) {
      this.props.dispatch(getZelleData(clientId, false));
    }
    if (!this.props.getB2CPushCardData) {
      this.props.dispatch(getPushToCardData(clientId, false));
    }
    if (!this.props.USBankPayment.storedPrepaidCardData) {
      this.props.dispatch(fetchUSBankPrepaidCardData(clientId));
    }
  };

  fetchPaymentTypes = (id, isParentCall) => {
    const { dispatch } = this.props;
    dispatch(getB2CClientPaymentTypes()).then((response) => {
      if (!response) {
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
            description,
            customPaymentCode,
            b2cDescription,
            parentId,
          }) => {
            if (!parentId) {
              return {
                label: paymentCode,
                key: fileFormatId,
                icon: fileFormatId,
                description: description,
                customPaymentCode: customPaymentCode,
                selected: false,
                alias: label,
                b2cDescription: b2cDescription,
              };
            }
          }
        );
      if (isParentCall) {
        this.fetchParentPaymentTypes(id,isParentCall);
      } else {
        this.fetchPreferredPaymentTypes(id);
      }
      this.setState({
        isLoading: false,
        paymentTypes,
      });
    });
  };

  fetchParentPaymentTypes = (id) => {
    this.props
      .dispatch(getB2CPreferredParentPaymentTypes(id))
      .then((response) => {
        if (!response) {
          //alert("Error in API");
          return false;
        }
        const { rows: selectedTypes } = response;
        const selectedPayTypes =
          typeof selectedTypes !== 'undefined' && selectedTypes !== null
            ? selectedTypes
            : [];
        this.setState({
          selectedPaymentTypes: [...new Set(selectedPayTypes)],
        });
        const { paymentTypes } = this.state;
        this.setState({
          ...this.state,
          isLoading: false,
          paymentTypes: paymentTypes.map((paymentType) => ({
            ...paymentType,
            selected: Boolean(selectedPayTypes.includes(paymentType.key)),
          })),
        });
        let selectedPaymentMethodb2c = response.rows2 ? response.rows2 : [];
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
      
  };

  fetchPreferredPaymentTypes = (clientId) => {
    this.props
      .dispatch(getB2CPreferredClientPaymentTypes(clientId))
      .then((response) => {
        if (!response) {
          //alert("Error in API");
          return false;
        }
        const { rows: selectedTypes } = response;
        const selectedPayTypes =
          typeof selectedTypes !== 'undefined' && selectedTypes !== null
            ? selectedTypes
            : [];
        this.setState({
          selectedPaymentTypes: [...new Set(selectedPayTypes)],
        });
        let selectedPaymentMethodb2c = response.rows2 ? response.rows2 : [];
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
        const { paymentTypes } = this.state;
        this.setState({
          ...this.state,
          isLoading: false,
          paymentTypes: paymentTypes.map((paymentType) => ({
            ...paymentType,
            selected: Boolean(selectedPayTypes.includes(paymentType.key)),
          })),
        });
      });
  };

  handlePaymentModeChange = (e, index, isChecked,fileFormatId) => {
    const { paymentTypes, selectedPaymentTypes } = this.state;
    this.setState({
      paymentTypes: paymentTypes.map((paymentMode, i) =>
        index === i
          ? {
              ...paymentMode,
              selected: isChecked,
            }
          : paymentMode
      ),
    });
    if (isChecked) {
      this.setState({
        selectedPaymentTypes: [
          ...selectedPaymentTypes,
          paymentTypes[index].key,
        ],
      });
    } else {
      const newState = selectedPaymentTypes.filter(
        (id) => id !== paymentTypes[index].key
      );
      this.setState({
        selectedPaymentTypes: newState || [],
      });
    }
    if (!isChecked) {
      switch (fileFormatId) {
        case paymentMethodFileFormatIds.USBankACH:
          this.setState({
            ACHB2B: false,
            ACHB2C: false,
          });
          break;
        case paymentMethodFileFormatIds.USBankCHK:
          this.setState({
            CHKB2B: false,
            CHKB2C: false,
          });
          break;
        case paymentMethodFileFormatIds.USBankRTP:
          this.setState({
            RTPB2B: false,
            RTPB2C: false,
          });
          break;

        default:
          break;
      }
    }
  };
  checkedB2B = (paymentCode) => {
    let val = false;
    switch (paymentCode) {
      case paymentMethods.USBankACH:
        this.state.ACHB2B ? (val = true) : (val = false);

        break;
      case paymentMethods.USBankCHK:
        this.state.CHKB2B ? (val = true) : (val = false);

        break;
      case paymentMethods.USBankRTP:
        this.state.RTPB2B ? (val = true) : (val = false);

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
  payloadger = () => {
    let obj = {};
    const {
      selectedPayees,
      selectedPaymentTypes,
      ACHB2B,
      ACHB2C,
      CHKB2B,
      CHKB2C,
      RTPB2B,
      RTPB2C,
    } = this.state;
    selectedPaymentTypes.map((id) => {
      switch (id) {
        case paymentMethodFileFormatIds.USBankACH:
          obj = { fileFormatId: id, isB2c: ACHB2C?1:0, isB2b: ACHB2B?1:0 };
          selectedPayees.push(obj);
          break;
        case paymentMethodFileFormatIds.USBankZelle:
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
        case paymentMethodFileFormatIds.USBankDepositToDebitcard:
          obj = { fileFormatId: id };
          selectedPayees.push(obj);
          break;
        case paymentMethodFileFormatIds.USBankPrepaidCard:
          obj = { fileFormatId: id };
          selectedPayees.push(obj);
          break;

        default:
          break;
      }
    });
  };
  slectedB2CCheck = () => {
    let flag = false;
    let flagACH = false;
    let flagCHK = false;
    let flagRTP = false;
    const { selectedPaymentTypes } = this.state;

    if (selectedPaymentTypes.includes(paymentMethodFileFormatIds.USBankACH)) {
      flagACH = this.state.ACHB2B || this.state.ACHB2C;
    }
    if (selectedPaymentTypes.includes(paymentMethodFileFormatIds.USBankCHK)) {
      flagCHK = this.state.CHKB2B || this.state.CHKB2C;
    }
    if (selectedPaymentTypes.includes(paymentMethodFileFormatIds.USBankRTP)) {
      flagRTP = this.state.RTPB2B || this.state.RTPB2C;
    }
    flag = (selectedPaymentTypes.includes(paymentMethodFileFormatIds.USBankACH)?flagACH:true) && 
    (selectedPaymentTypes.includes(paymentMethodFileFormatIds.USBankCHK)?flagCHK:true) && 
    (selectedPaymentTypes.includes(paymentMethodFileFormatIds.USBankRTP)?flagRTP:true);
    return flag;
  };

  compareRTPCheck = () => {
    let flagRTP = true;
    const { selectedPaymentTypes } = this.state;
    
    if (selectedPaymentTypes.includes(paymentMethodFileFormatIds.USBankRTP) && this.state.RTPB2B ) {
      flagRTP = this.state.ACHB2B;
    }

    if (selectedPaymentTypes.includes(paymentMethodFileFormatIds.USBankRTP) && this.state.RTPB2C ) {
      flagRTP = flagRTP ? this.state.ACHB2C : flagRTP;
    }

    return flagRTP;
  };

  handleChange = (event) => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
  };
  isPaymentTypeSelected = (paymentTypeCode) => {
    const { paymentTypes, selectedPaymentTypes } = this.state;
    if (paymentTypes.length > 0) {
      const paymentTypeDetail = paymentTypes.filter(
        ({ label }) => label === paymentTypeCode
      );
      const currentPaymentTypeID =
        paymentTypeDetail.length && paymentTypeDetail[0].key;
      return selectedPaymentTypes.includes(currentPaymentTypeID);
    }
    return false;
  };
  importParentInformation = () => {
    const { parentId } = this.state;
    this.fetchPaymentTypes(parentId, true);
    this.setState({ showBanner: false, showParentData: true });
  };

  handlePaymentDetails = (e) => {
    const { selectedPaymentTypes, paymentTypes } = this.state;
    let achID;
    let rtpID;
    paymentTypes.forEach((item) => {
      if (item.label === paymentMethods.USBankACH) {
        achID = item.key;
      } else if (item.label === paymentMethods.USBankRTP) {
        rtpID = item.key;
      }
    });
    if (
      selectedPaymentTypes.includes(rtpID) &&
      !selectedPaymentTypes.includes(achID)
    ) {
      this.setState({
        rtpDialogFlag: true,
      });
      return;
    }
    this.setState(
      {
        processing: true,
      },
      () => {
        const { selectedPaymentTypes, clientId } = this.state;
        const { t } = this.props;
        if (selectedPaymentTypes.length > 0) {
          if (this.slectedB2CCheck()) {
            if(this.compareRTPCheck()) {
                this.payloadger();
              this.props
              
                .dispatch(
                  updateUSbankPreferredPaymentTypes(
                    clientId,
                    this.state.selectedPayees
                  )
                )
                .then((response) => {
                  if (!response) {
                    return false;
                  }
                  this.props.history.push(
                    `${config.baseName}/onboard/files?id=${this.state.clientId}`
                  );
                  this.setState({
                    processing: false,
                  });
                });
              }
              else {
                this.setState({
                  error: t('componentData.paymentMethods.methodSelectionError'),
                  processing: false,
                });
              }
          } else {
            this.setState({
              error: t('componentData.paymentMethods.b2b'),
              processing: false,
            });
          }
        } else {
          this.setState({
            error: t('componentData.paymentsSettings.payMethod'),
            processing: false,
          });
        }
      }
    );
  };

  errFound = (val) => {
    const { isErrFound } = this.state;
    if (isErrFound !== val) {
      this.setState({
        isErrFound: val,
      });
    }
  };

  rtpDialogMessage = () => {
    this.setState({
      rtpDialogFlag: false,
    });
  };

  render() {
    const {
      isLoading,
      error,
      paymentTypes,
      selectedPaymentTypes,
      processing,
      paymentModeIcons,
      showBanner,
      clientId,
      parentId,
      isHIPAA,
      showParentData,
      isErrFound,
      rtpDialogFlag,
      ACHB2B,
      ACHB2C,
      CHKB2B,
      CHKB2C,
      RTPB2B,
      RTPB2C

    } = this.state;
    const { t, classes } = this.props;
    const selectedPaymentModes = paymentTypes.filter(
      (paymentMode) => paymentMode.selected
    );
    if (isLoading) {
      return (
        <Box className='loader-container'>
          <CircularProgress color='primary' />
        </Box>
      );
    }

    return (
      <>
        <Box my={2}>
          {showBanner && (
            <ImportParentPaymentDetails
              onConfirm={this.importParentInformation}
              onCancel={() => {
                this.setState({
                  showBanner: false,
                });
              }}
            />
          )}
          <Box mx={6} my={2}>
            <Box my={1}>
              <USbankPaymentModeSelector
                paymentTypes={paymentTypes}
                selectedPaymentTypes={selectedPaymentTypes}
                onChange={this.handlePaymentModeChange}
                paymentModeIcons={paymentModeIcons}
                checkedB2B={this.checkedB2B}
                checkedB2C={this.checkedB2C}
                payloadger={this.payloadger}
                slectedB2CCheck={this.slectedB2CCheck}
                handleChange={this.handleChange}
                ACHB2B={ ACHB2B}
                ACHB2C={ ACHB2C}
                CHKB2B={ CHKB2B}
                CHKB2C={ CHKB2C}
                RTP2B={ RTPB2B}
                RTPB2B= {RTPB2C}
              />
            </Box>
            <USbankPaymentDetails
              selectedPaymentModes={selectedPaymentModes}
              clientId={clientId}
              parentId={parentId}
              isHIPAA={isHIPAA}
              showParentData={showParentData}
              isErr={this.errFound}
            />
            <Box my={4} className={`button-container`}>
              {processing ? (
                <CircularProgress color='primary' />
              ) : (
                <Box mx={2}>
                  <Button
                    type='submit'
                    fullWidth={false}
                    variant='contained'
                    color='primary'
                    onClick={this.handlePaymentDetails}
                    disabled={isErrFound === 'error' ? true : false}
                    className={classes.submitBtn}
                  >
                    {t('componentData.paymentsSettings.Next')}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {error && (
          <Notification
            variant='error'
            message={error}
            handleClose={() => {
              this.setState({ error: false });
            }}
          />
        )}
        {rtpDialogFlag && (
          <AlertDialog
            title={t('componentData.RTPDetail.rtpACHExist')}
            open={rtpDialogFlag}
            onConfirm={() => this.rtpDialogMessage()}
          />
        )}
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.payment,
    ...state.client,
    ...state.USBankPayment,
  }))(withStyles(styles)(USbankPaymentSettings))
);
